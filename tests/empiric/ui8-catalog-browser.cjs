const fs=require('fs'),path=require('path');
const load=require('./tsrun.cjs');
const {DISEASES}=load('data/antibiotics/empiric/catalog.ts');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const OUT=path.resolve(__dirname,'../../audit-69-2026/codex-review/UI8_ALL');
const base=process.env.STANDARDIZE_BASE_URL||'http://localhost:3000';
fs.mkdirSync(OUT,{recursive:true});
async function selectFirst(page) {
  const panel=page.locator('#bv199-tabpanel');
  const branch=panel.locator('.clinical-disclosure > button').first();
  if(await branch.count() && await branch.getAttribute('aria-expanded')==='false') await branch.click();
  const group=panel.locator('.c26-group-picker button').first();if(await group.count())await group.click();
  const select=panel.locator('.clinical-scenario-select select').first();
  if(await select.count()) { const opts=await select.locator('option').evaluateAll(items=>items.map(o=>o.value).filter(Boolean)); if(opts[0])await select.selectOption(opts[0]); }
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results=[];let interactionsChecked=false;
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});const runtime=[];page.on('pageerror',e=>runtime.push(e.message));
  const shotSpecialties=new Set();
  for(const d of DISEASES) {
   const result={id:d.id,route:`/antibiotics/empiric/guideline-v9?disease=${d.id}`,checks:[],errors:[],scenarios:[],tabs:[],widths:[]};const assert=(name,ok)=>{result.checks.push({name,pass:!!ok});if(!ok)result.errors.push(name);};
   try {
    await page.setViewportSize({width:1440,height:1000});await page.goto(base+result.route,{waitUntil:'domcontentloaded'});
    await page.locator('#bv199-tabpanel').waitFor();await page.locator('.tp,.copd26').first().waitFor();
    assert('route resolves to requested disease',page.url().includes(`disease=${d.id}`));
    assert('shared treatment renderer mounted',await page.locator('#bv199-tabpanel .tp,#bv199-tabpanel .copd26').count()>0);
    await selectFirst(page);
    const select=page.locator('#bv199-tabpanel .clinical-scenario-select select').first();
    if(await select.count()) {
      const options=await select.locator('option').evaluateAll(items=>items.map(o=>({value:o.value,label:o.textContent})).filter(o=>o.value));
      for(const option of options) { await select.selectOption(option.value);await page.locator('#bv199-tabpanel .tp-regimens').waitFor();result.scenarios.push({value:option.value,cards:await page.locator('#bv199-tabpanel article[data-regimen]').count()}); }
      if(options[0])await select.selectOption(options[0].value);
    }
    const settingButtons=page.locator('#bv199-tabpanel .tp .clinical-disclosure > button');
    if(await settingButtons.count()) {
      for(let i=0;i<await settingButtons.count();i++) {
        const button=settingButtons.nth(i);if(await button.getAttribute('aria-expanded')==='false')await button.click();
        const branchSelect=page.locator('#bv199-tabpanel .clinical-scenario-select select').first();
        const values=await branchSelect.locator('option').evaluateAll(items=>items.map(o=>o.value).filter(Boolean));
        for(const value of values){await branchSelect.selectOption(value);result.scenarios.push({value,cards:await page.locator('#bv199-tabpanel article[data-regimen]').count(),branch:await button.innerText()});}
      }
      const first=settingButtons.first();if(await first.getAttribute('aria-expanded')==='false')await first.click();await selectFirst(page);
    }
    assert('source disclosure accessible',await page.locator('#bv199-tabpanel summary').filter({hasText:'Nguồn và đối chiếu'}).count()>0);
    const tools=page.locator('#bv199-tabpanel .regimen-drug-tools > details,#bv199-tabpanel .c26-tools > details');
    assert('dose and interaction tools available or explicitly no dosing data',await tools.count()>0 || (await page.locator('#bv199-tabpanel').innerText()).includes('không nêu liều'));
    if(await tools.count()) {
      const first=tools.first();const parents=await first.locator('xpath=ancestor::details').all();
      for(const ancestor of parents.reverse())if(await ancestor.getAttribute('open')===null)await ancestor.locator('summary').first().click();
      const summary=first.locator('summary').first();if(await first.getAttribute('open')!==null)await summary.click();
      await summary.focus();await summary.press('Enter');
      await page.waitForFunction(()=>document.querySelector('#bv199-tabpanel .regimen-drug-tools > details,#bv199-tabpanel .c26-tools > details')?.open);
      assert('keyboard opens dose reference',await first.getAttribute('open')!==null);await summary.press('Space');
    }
    if(!interactionsChecked && await tools.count()>1) {
      const tool=tools.nth(1);await tool.locator('summary').first().click();await tool.getByText(/Các cặp chứa tên hoạt chất/).waitFor({timeout:15000});assert('interaction data loaded',await tool.getByText(/Các cặp chứa tên hoạt chất/).isVisible());interactionsChecked=true;await tool.locator('summary').first().click();
    }
    for(const width of [375,320]) {
      await page.setViewportSize({width,height:900});
      await page.waitForFunction(()=>{const sidebar=document.querySelector('.bv-fixed-sidebar');return !sidebar||sidebar.getBoundingClientRect().right<=0;});
      assert(`mobile sidebar does not cover treatment ${width}`,await page.locator('.bv-fixed-sidebar').evaluate(el=>el.getBoundingClientRect().right<=0));
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);result.widths.push({width,overflow});assert(`no horizontal overflow ${width}`,!overflow);
    }
    if(!shotSpecialties.has(d.specialty)) {shotSpecialties.add(d.specialty);const target=page.locator('#bv199-tabpanel');await target.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(OUT,`mobile-${d.id}.png`)});}
    for(const tab of ['intl','compare']) { await page.locator(`#bv199-tab-${tab}`).click();await page.locator('#bv199-tabpanel').waitFor();result.tabs.push(tab);assert(`${tab} tab not empty`,(await page.locator('#bv199-tabpanel').innerText()).trim().length>0);assert(`${tab} does not overflow 320`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)); }
    result.runtimeErrors=runtime.splice(0);assert('no runtime errors',result.runtimeErrors.length===0);
   } catch(error) {result.errors.push(error.message);}
   result.pass=result.errors.length===0;results.push(result);fs.writeFileSync(path.join(OUT,'browser-catalog.json'),JSON.stringify({base,results},null,2));console.log(`${result.pass?'PASS':'FAIL'} ${d.id} ${result.errors.join('; ').slice(0,260)}`);
  }
  const summary={total:results.length,passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,checks:results.reduce((n,r)=>n+r.checks.length,0)};fs.writeFileSync(path.join(OUT,'browser-summary.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));process.exitCode=summary.failed?1:0;
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
