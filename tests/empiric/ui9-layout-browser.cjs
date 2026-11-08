const fs=require('fs'),path=require('path');
const load=require('./tsrun.cjs');
const {DISEASES}=load('data/antibiotics/empiric/catalog.ts');
const R=load('data/antibiotics/empiric/regimens/index.ts');
const C=load('components/antibiotics/CapByt2026.tsx').CAP_SCENARIOS;
const H=load('components/antibiotics/HapVap2023.tsx').HAPVAP_SCENARIOS;
const D=load('data/antibiotics/copd-2131.ts');
const S=load('lib/antibiotics/regimen-structure.ts');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const out=path.resolve(__dirname,'../../audit-69-2026/codex-review/UI9_LAYOUT');
const base=process.env.STANDARDIZE_BASE_URL||'http://localhost:3000';
function expected(id,value){if(id==='v8-6')return D.COPD_REGIMENS.filter(r=>r.groupId===value&&value!=='in-mdr').map(r=>r.id);if(id==='v8-1')return C.find(s=>s.id===value)?.regimens.map(r=>r.id)??[];if(id==='v8-4'||id==='v8-5')return H[id==='v8-4'?'hap':'vap'].find(s=>s.id===value)?.regimens.map(r=>r.id)??[];return R.getRegimensForDisease(id).filter(r=>r.scenario===value).map(r=>r.id);}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});const results=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const noGroup=DISEASES.find(d=>!['v8-1','v8-4','v8-5','v8-6'].includes(d.id)&&new Set(R.getRegimensForDisease(d.id).map(r=>r.scenario)).size===1)?.id;
  const uncertain=DISEASES.find(d=>R.getRegimensForDisease(d.id).some(r=>S.structureOf(r).status==='NO_DOSE'))?.id;
  for(const d of DISEASES){
   const record={id:d.id,checks:[],groups:[],runtimeErrors:[]};const check=(name,pass)=>{record.checks.push({name,pass:!!pass});if(!pass)throw Error(name);};
   try{
    await page.setViewportSize({width:1440,height:1000});await page.goto(base+`/antibiotics/empiric/guideline-v9?disease=${d.id}`,{waitUntil:'domcontentloaded'});await page.locator('#bv199-tabpanel .tp,#bv199-tabpanel .copd26').first().waitFor();
    const panel=page.locator('#bv199-tabpanel');
    check('Disease heading and ICD area retained',await page.locator('.bv199-disease-heading h2').isVisible());
    check('Selected disease remains highlighted',await page.locator('.bv199-disease.selected').count()===1);
    const select=panel.locator('.patient-group-control > select').first();
    if(await select.count())check('Group starts blank and no previous regimen is shown',await select.inputValue()===''&&await panel.locator('article[data-regimen]').count()===0);
    else check('Source without multiple groups shows guidance directly',await panel.locator('.tp-regimens').count()>0);
    const contexts=panel.locator('.treatment-context-tabs > button');const count=await contexts.count();
    for(let k=0;k<Math.max(count,1);k++){
     if(count){await contexts.nth(k).click();check(`Context ${k} has one active tab`,(await contexts.evaluateAll(nodes=>nodes.filter(n=>n.getAttribute('aria-selected')==='true').length))===1);}
     const picker=panel.locator('.patient-group-control > select').first();if(!await picker.count())continue;
     const choices=await picker.locator('option').evaluateAll(nodes=>nodes.filter(n=>n.value).map(n=>({value:n.value,label:n.textContent})));
     const reveal=panel.locator('.patient-group-criteria > summary').first();await reveal.focus();await reveal.press('Enter');
     check(`Criteria accessible before choice in context ${k}`,await panel.locator('[data-group-criteria]').count()===choices.length);
     if(d.id==='v8-1'&&k===0)check('CAP age 65 uncertainty visible before group choice',(await panel.locator('.patient-group-criteria').innerText()).includes('tuổi đúng 65'));
     if(d.id==='v8-4'||d.id==='v8-5'){const definitions=panel.getByText('Định nghĩa yếu tố nguy cơ',{exact:true}).first();await definitions.focus();await definitions.press('Enter');check('Resistance definitions accessible before group choice',(await panel.locator('.patient-group-criteria').innerText()).includes('90 ngày'));}
     await reveal.press('Space');
     for(const choice of choices){
      await picker.selectOption(choice.value);
      const actual=await panel.locator('article[data-regimen]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-regimen')).sort());const wanted=expected(d.id,choice.value).sort();
      check(`Only linked regimens for ${choice.value}`,JSON.stringify(actual)===JSON.stringify(wanted));
      check(`Selected criteria match ${choice.value}`,await panel.locator('[data-selected-group]').getAttribute('data-selected-group')===choice.value);
      record.groups.push({value:choice.value,regimenIds:actual});
     }
     await picker.selectOption('');check(`Clearing context ${k} removes old drugs time notes and source`,await panel.locator('article[data-regimen]').count()===0&&await panel.locator('[data-selected-group]').count()===0&&await panel.locator('.tp-regimens,.c26-followup').count()===0);
    }
    if(d.id==='v8-6'){
     await contexts.first().click();await panel.locator('.c26-symptoms > summary').click();const boxes=panel.locator('.c26-symptoms input');await boxes.nth(0).check();check('Purulence alone does not indicate antibiotics',(await panel.locator('.c26-symptoms [role=status]').innerText()).includes('Chưa đạt'));
     await boxes.nth(1).check();check('Purulence and increased dyspnea meet symptom criteria',(await panel.locator('.c26-symptoms [role=status]').innerText()).includes('Đạt tiêu chí'));
     check('Ventilation absent in outpatient setting',await panel.locator('.c26-inpatient-indication').count()===0);
     await contexts.nth(1).focus();await contexts.nth(1).press('Enter');check('Ventilation indication belongs to inpatient setting',await panel.locator('.c26-inpatient-indication').isVisible());await panel.locator('.c26-inpatient-indication input').check();check('Ventilation indication is independently acknowledged',(await panel.locator('.c26-inpatient-indication [role=status]').innerText()).includes('Có chỉ định'));
     await contexts.nth(1).press('ArrowLeft');check('Arrow navigation resets context group and regimen',await contexts.first().getAttribute('aria-selected')==='true'&&await panel.locator('article[data-regimen]').count()===0&&await panel.locator('.patient-group-control > select').inputValue()==='');
    }
    const firstSelect=panel.locator('.patient-group-control > select').first();if(await firstSelect.count()){const first=await firstSelect.locator('option').evaluateAll(nodes=>nodes.find(n=>n.value)?.value);if(first)await firstSelect.selectOption(first);}
    for(const width of [375,320]){await page.setViewportSize({width,height:950});await page.waitForFunction(()=>{const el=document.querySelector('.bv-fixed-sidebar');return !el||el.getBoundingClientRect().right<=0;});check(`Single column without overflow ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));check(`Catalog hidden until requested ${width}`,!await page.locator('#bv199-catalog').isVisible());}
    if(['v8-1','v8-6',noGroup,uncertain].includes(d.id)){
     if(count){await contexts.first().click();const p=panel.locator('.patient-group-control > select').first();const first=await p.locator('option').evaluateAll(nodes=>nodes.find(n=>n.value)?.value);if(first)await p.selectOption(first);}
     await page.evaluate(()=>{document.activeElement?.blur?.();document.querySelectorAll('*').forEach(el=>{if(el.scrollTop)el.scrollTop=0;});});await page.screenshot({path:path.join(out,`mobile-${d.id}.png`)});await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>document.querySelectorAll('*').forEach(el=>{if(el.scrollTop)el.scrollTop=0;}));await page.screenshot({path:path.join(out,`desktop-${d.id}.png`)});
    }
    await page.setViewportSize({width:320,height:950});
    await page.locator('#bv199-tab-intl').click();check('International source remains accessible',(await panel.innerText()).trim().length>0);check('International view fits 320 px',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('#bv199-tab-compare').click();check('Comparison remains accessible',(await panel.innerText()).trim().length>0);check('Comparison view fits 320 px',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('#bv199-tab-vn').click();const reset=panel.locator('.patient-group-control > select').first();if(await reset.count())check('Changing source discards old selected group and regimen',await reset.inputValue()===''&&await panel.locator('article[data-regimen]').count()===0);
    if(d.id==='v8-1'){
     await page.setViewportSize({width:375,height:950});const toggle=page.getByRole('button',{name:'Danh mục bệnh',exact:true});await toggle.focus();await toggle.press('Enter');check('Mobile catalog opens with keyboard',await page.locator('#bv199-catalog').isVisible());await page.getByRole('searchbox',{name:'Tìm mặt bệnh'}).fill('COPD');await page.locator('.bv199-disease').filter({hasText:'COPD'}).click();check('Search selects new disease and closes mobile catalog',page.url().includes('disease=v8-6')&&!await page.locator('#bv199-catalog').isVisible()&&await page.locator('#bv199-tabpanel article[data-regimen]').count()===0);
    }
   }catch(error){record.error=error.message;}
   record.runtimeErrors=errors.splice(0);record.pass=!record.error&&record.runtimeErrors.length===0;results.push(record);fs.writeFileSync(path.join(out,'browser-catalog.json'),JSON.stringify({base,results},null,2));console.log(`${record.pass?'PASS':'FAIL'} ${d.id} ${record.error??record.runtimeErrors.join('; ')}`);
  }
  const summary={total:results.length,passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,checks:results.reduce((n,r)=>n+r.checks.length,0),groups:results.reduce((n,r)=>n+r.groups.length,0),noGroupExample:noGroup,unverifiedDoseExample:uncertain};fs.writeFileSync(path.join(out,'browser-summary.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));process.exitCode=summary.failed?1:0;
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
