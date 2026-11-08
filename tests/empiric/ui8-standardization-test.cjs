const fs=require('fs'),path=require('path'),ts=require('typescript');
const load=require('./tsrun.cjs');const React=require('react');const {renderToStaticMarkup:render}=require('react-dom/server');
const C=load('data/antibiotics/empiric/catalog.ts');const R=load('data/antibiotics/empiric/regimens/index.ts');
const S=load('lib/antibiotics/regimen-structure.ts');
const Table=load('components/antibiotics/treatment/DoseTable.tsx').default;
const Tools=load('components/antibiotics/treatment/RegimenDrugTools.tsx').default;
const Picker=load('components/antibiotics/treatment/ClinicalScenarioPicker.tsx');
const Panel=load('components/antibiotics/treatment/TreatmentPanel.tsx').default;
const {AbxLinkProvider}=load('components/antibiotics/links/AbxLinkContext.tsx');
const audit=path.resolve(__dirname,'../../audit-69-2026/codex-review/UI8_ALL');
let pass=0,fail=0;function check(name,ok){if(ok)pass++;else fail++;console.log(`${ok?'PASS':'FAIL'} ${name}`);}
const baseline=JSON.parse(fs.readFileSync(path.join(audit,'baseline.json'),'utf8'));
check('Actual catalog IDs are unique and unchanged',new Set(C.DISEASES.map(d=>d.id)).size===C.DISEASES.length&&JSON.stringify(C.DISEASES)===JSON.stringify(baseline.catalog));
check('All original regimen source dose notes and duration values preserved',JSON.stringify(R.ALL_REGIMENS)===JSON.stringify(baseline.regimens));
check('Structured clinical AND OR phase and population records unchanged',JSON.stringify(R.ALL_REGIMENS.map(r=>S.structureOf(r)))===JSON.stringify(baseline.structures));
const declarationBaseline=JSON.parse(fs.readFileSync(path.join(audit,'module-declarations-baseline.json'),'utf8'));
for(const [file,expected]of Object.entries(declarationBaseline)){const text=fs.readFileSync(path.resolve(__dirname,'../..',file),'utf8');const source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const actual=source.statements.filter(ts.isVariableStatement).flatMap(s=>s.declarationList.declarations.filter(d=>d.initializer&&/^[A-Z][A-Z0-9_]*$/.test(d.name.getText(source))).map(d=>[d.name.getText(source),d.initializer.getText(source)]));check(`Original clinical declarations unchanged: ${path.basename(file)}`,JSON.stringify(actual)===JSON.stringify(expected));}
check('Severity alone does not invent an inpatient branch',Picker.settingInSourceLabel('Bệnh cảnh nặng')===undefined&&Picker.settingInSourceLabel('Điều trị ngoại trú')==='outpatient'&&Picker.settingInSourceLabel('Điều trị nội trú')==='inpatient');
const picker=render(React.createElement(Picker.default,{scenarios:[{value:'out',label:'Ngoại trú'},{value:'in',label:'Nội trú'}],onChange:()=>{}}));
check('Setting tabs expose one context without assigning a patient group', (picker.match(/role="tab"/g)||[]).length===2&&(picker.match(/aria-selected="true"/g)||[]).length===1&&picker.includes('Ngoại trú')&&picker.includes('Nội trú')&&picker.includes('Chọn nhóm người bệnh')&&!picker.includes('data-selected-group='));
const routeText=fs.readFileSync(path.resolve(__dirname,'../../app/antibiotics/empiric/guideline-v9/page.tsx'),'utf8');
check('ABRS wrapper uses source-scoped horizontal context tabs',routeText.includes('<SettingTabs items=')&&routeText.includes('value={abrsSetting}')&&!routeText.includes('<DecisionDisclosure'));
check('ABRS inpatient scope and warnings remain unchanged',routeText.includes(fs.readFileSync(path.join(audit,'abrs-inpatient-baseline.txt'),'utf8')));
function drug(name){return{name,dose:'100',doseUnit:'mg',route:'Uống',interval:'Mỗi 12 giờ',population:'adult',doseBasis:'per-dose',ingredientIds:[],flags:[],raw:`${name} 100 mg uống mỗi 12 giờ`,complete:true};}
const group={rule:'one-of',optional:false,ambiguous:false,options:[drug('A'),drug('B')],raw:[{name:'A hoặc B',dose:'100 mg uống mỗi 12 giờ'}]};
const alternatives=render(React.createElement(Table,{groups:[group],status:'STRUCTURED'}));
const combination=render(React.createElement(Table,{groups:[{...group,rule:'all'}],status:'STRUCTURED'}));
check('Alternative row uses OR and no combination marker',alternatives.includes('>Hoặc</td>')&&!alternatives.includes('>+</td>'));
check('Fixed combination row uses plus and no OR marker',combination.includes('>+</td>')&&!combination.includes('>Hoặc</td>'));
check('Every structured drug has dose and interaction tools',(alternatives.match(/data-drug-tools=/g)||[]).length===2&&alternatives.includes('Hiệu chỉnh liều')&&alternatives.includes('Tương tác thuốc'));
const dailyRaw='2,4 g TM/ngày chia 4 lần';
const daily=render(React.createElement(Table,{groups:[{...group,options:[{...drug('Clindamycin'),dose:'2,4',doseUnit:'g',raw:dailyRaw}]}],status:'STRUCTURED'}));
check('Explicit daily total stays visible in usage cell despite incomplete legacy parsing',daily.includes(`data-label="Cách dùng"><div><span data-dose="">${dailyRaw}</span>`));
const unresolved=render(React.createElement(Table,{groups:[{...group,ambiguous:true}],status:'NEEDS_STRUCTURED_REVIEW'}));
check('Unresolved source remains raw and marked for review, not fabricated table',unresolved.includes('A hoặc B')&&unresolved.includes('thẩm định')&&!unresolved.includes('class="tx-table"'));
const blockedCombo=render(React.createElement(Tools,{name:'Imipenem-cilastatin-relebactam'}));
check('New combination does not silently link to single-drug renal dose',blockedCombo.includes('Chưa tìm thấy chuyên luận khớp chính xác')&&!blockedCombo.includes('<details class="rdt-profile"'));
for(const [id,label]of [['v8-3','Điều trị kháng nấm'],['v8-142','Phác đồ điều trị lao'],['v8-46','Điều trị theo tác nhân']]){const html=render(React.createElement(AbxLinkProvider,{value:{diseaseId:id}},React.createElement(Panel,{sections:[],sources:[]})));check(`Stream heading respects source scope ${id}`,html.includes(label)&&!html.includes('Phác đồ kháng sinh kinh nghiệm'));}
check('All active IDs have a source-backed record or dedicated source-only module',C.DISEASES.every(d=>R.getRegimensForDisease(d.id).length>0||d.id==='v8-6'));
console.log(`${pass} passed, ${fail} failed`);process.exitCode=fail?1:0;
