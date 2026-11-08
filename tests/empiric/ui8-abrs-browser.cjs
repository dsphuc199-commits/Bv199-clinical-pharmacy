const fs=require('fs'),path=require('path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const out=path.resolve(__dirname,'../../audit-69-2026/codex-review/UI8_ALL');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results=[];
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  for(const id of ['v8-7','v8-58']) {
   const checks=[];const check=(name,pass)=>{checks.push({name,pass:!!pass});};
   await page.goto((process.env.STANDARDIZE_BASE_URL||'http://localhost:3000')+`/antibiotics/empiric/guideline-v9?disease=${id}`);
   await page.locator('#bv199-tab-intl').click();
   const buttons=page.locator('#bv199-tabpanel .clinical-disclosure > button');
   await buttons.first().waitFor();
   check('Two setting disclosures available',await buttons.count()===2);
   check('No initial setting assignment',(await buttons.evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-expanded')))).every(x=>x==='false'));
   await buttons.first().focus();await buttons.first().press('Enter');
   check('Keyboard opens outpatient branch',await buttons.first().getAttribute('aria-expanded')==='true');
   check('Outpatient reference module rendered',await page.locator('#bv199-tabpanel .abrs-module').count()>0);
   await buttons.nth(1).click();
   check('Opening inpatient closes outpatient',await buttons.nth(1).getAttribute('aria-expanded')==='true'&&await buttons.first().getAttribute('aria-expanded')==='false');
   check('Inpatient scope warning preserved',(await page.locator('#bv199-tabpanel').innerText()).includes('Chưa tích hợp phác đồ nội trú'));
   check('No outpatient regimen shown in inpatient branch',await page.locator('#bv199-tabpanel .abrs-module').count()===0);
   const positions=await buttons.evaluateAll(nodes=>nodes.map(n=>n.lastElementChild.getBoundingClientRect().right));
   check('Setting arrows align',Math.abs(positions[0]-positions[1])<1);
   for(const width of [375,320]){await page.setViewportSize({width,height:900});await page.waitForFunction(()=>{const el=document.querySelector('.bv-fixed-sidebar');return !el||el.getBoundingClientRect().right<=0;});check(`No overflow at ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
   await buttons.nth(1).focus();await buttons.nth(1).press('Space');
   check('Space closes active branch',await buttons.nth(1).getAttribute('aria-expanded')==='false');
   await page.setViewportSize({width:1440,height:1000});results.push({id,checks,pass:checks.every(c=>c.pass)});
  }
  const summary={pages:results.length,checks:results.reduce((n,r)=>n+r.checks.length,0),passed:results.every(r=>r.pass)};
  fs.writeFileSync(path.join(out,'abrs-browser.json'),JSON.stringify({summary,results},null,2));console.log(JSON.stringify({summary,failures:results.flatMap(r=>r.checks.filter(c=>!c.pass).map(c=>({id:r.id,...c})))}));process.exitCode=summary.passed?0:1;
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
