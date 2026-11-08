const fs=require('fs'),path=require('path');const load=require('./tsrun.cjs');
const R=load('data/antibiotics/empiric/regimens/index.ts'),S=load('lib/antibiotics/regimen-structure.ts');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const out=path.resolve(__dirname,'../../audit-69-2026/codex-review/UI9_LAYOUT');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});const results=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  for(const id of ['v8-1','v8-6','v8-27','v8-33']){
   const checks=[];const check=(name,pass)=>{checks.push({name,pass:!!pass});if(!pass)throw Error(name);};const result={id,checks};
   try{
    await page.goto((process.env.STANDARDIZE_BASE_URL||'http://localhost:3000')+`/antibiotics/empiric/guideline-v9?disease=${id}`);await page.locator('#bv199-tabpanel .tp,#bv199-tabpanel .copd26').first().waitFor();const panel=page.locator('#bv199-tabpanel');
    const picker=panel.locator('.patient-group-control > select').first();
    if(await picker.count()){const missing=id==='v8-33'?R.getRegimensForDisease(id).find(r=>S.structureOf(r).status==='NO_DOSE'):undefined;const value=missing?.scenario??await picker.locator('option').evaluateAll(nodes=>nodes.find(n=>n.value)?.value);if(value)await picker.selectOption(value);}
    if(id==='v8-33')check('Source-only dose is marked without borrowing another group dose',(await panel.innerText()).includes('Hoạt chất được nguồn liệt kê')&&!await panel.locator('span[data-dose]').count());
    const tools=panel.locator('.regimen-drug-tools > details,.c26-tools > details');check('Dose and interaction controls are at the current drug',await tools.count()>=2);
    const dose=tools.first();const ancestors=await dose.locator('xpath=ancestor::details').all();for(const ancestor of ancestors.reverse())if(await ancestor.getAttribute('open')===null)await ancestor.locator('summary').first().click();
    const summary=dose.locator('summary').first();await summary.focus();await summary.press('Enter');check('Dose reference opens with keyboard',await dose.getAttribute('open')!==null);check('Dose reference names the current drug or explicitly lacks a profile',(await dose.innerText()).includes('người lớn')||(await dose.innerText()).includes('chọn đúng chỉ định')||(await dose.innerText()).includes('Chưa tìm thấy'));
    await page.setViewportSize({width:320,height:950});await page.waitForFunction(()=>{const el=document.querySelector('.bv-fixed-sidebar');return !el||el.getBoundingClientRect().right<=0;});check('Expanded dose reference fits 320 px',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await summary.press('Space');check('Dose reference closes with Space',await dose.getAttribute('open')===null);
    const interaction=tools.nth(1);await interaction.locator('summary').first().click();
    if(id!=='v8-6')await interaction.getByText(/Các cặp chứa tên hoạt chất/).waitFor({timeout:15000});
    check('Interaction content is available for the current drug',(await interaction.innerText()).length>80);check('Expanded interaction fits 320 px',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:path.join(out,`mobile-tools-${id}.png`)});await page.setViewportSize({width:1440,height:1000});
   }catch(error){result.error=error.message;}
   result.pass=!result.error;results.push(result);
  }
  const summary={pages:results.length,passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,checks:results.reduce((n,r)=>n+r.checks.length,0)};fs.writeFileSync(path.join(out,'tools-browser.json'),JSON.stringify({summary,results},null,2));console.log(JSON.stringify({summary,failures:results.filter(r=>!r.pass)}));process.exitCode=summary.failed?1:0;
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
