/*
  UI11 – Quy tac hien thi toan cuc (Master Prompt V4.0).
  Render MOI benh canh cua MOI mat benh qua renderer dung chung, bo cac khoi <details>
  (mac dinh dong: tieu chi, nguon) va <style>, roi kiem tra lop noi dung chinh.
  Chay: node tests/empiric/ui11-global-rules-test.cjs  (them --report de in bang do phu)
*/
const load=require('./tsrun.cjs');
const React=require('react');
const {renderToStaticMarkup:render}=require('react-dom/server');
const C=load('data/antibiotics/empiric/catalog.ts');
const R=load('data/antibiotics/empiric/regimens/index.ts');
const V=load('components/antibiotics/empiric/BytRegimenView.tsx');
const Panel=load('components/antibiotics/treatment/TreatmentPanel.tsx').default;
const S=load('lib/antibiotics/regimen-structure.ts');
const {EMPIRIC_TREATMENT_UI_RULES:RULES}=load('lib/antibiotics/empiric-ui-rules.ts');
const {getRationale}=load('data/antibiotics/empiric/rationale.ts');
const report=process.argv.includes('--report');
let pass=0,fail=0;function check(n,ok,d){if(ok)pass++;else fail++;console.log(`${ok?'PASS':'FAIL'} ${n}${!ok&&d?`  — ${typeof d==='string'?d:JSON.stringify(d).slice(0,400)}`:''}`);}

function mainLayer(html){
  let h=html.replace(/<style[\s\S]*?<\/style>/g,'');
  let prev;do{prev=h;h=h.replace(/<details[^>]*>(?:(?!<details)[\s\S])*?<\/details>/g,'');}while(h!==prev);
  return h.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ');
}
const PAGE=/\btr\.\s*\d|\bChương\s+\d|\bPhụ lục\s+\d/;
const ADJUST=/Cockcroft|Child-Pugh|eGFR\s*[<>≤≥]|CrCl\s*[<>≤≥]\s*\d/;

const rows=[];const pageHits=[],dailyHits=[],adjustHits=[],orHits=[],noRationale=[],missingSource=[];
let branches=0;
for(const d of C.DISEASES){
  const items=R.getRegimensForDisease(d.id);
  const scen=new Map();for(const r of items){if(!scen.has(r.scenario))scen.set(r.scenario,[]);scen.get(r.scenario).push(r);}
  let ok=true;
  for(const [name,list] of scen){
    branches++;
    const {sections}=V.sectionsFor(list);
    const html=render(React.createElement(Panel,{sections,sources:list.map(r=>r.source.page),rationale:getRationale(d.id,name),scenarios:[{value:name,label:name,criteria:[name]}],scenario:name}));
    const text=mainLayer(html);
    if(PAGE.test(text)){pageHits.push(`${d.id}: ${text.match(new RegExp(`.{0,40}${PAGE.source}.{0,20}`))?.[0]}`);ok=false;}
    if(/class="tx-sub">= /.test(html)){dailyHits.push(d.id);ok=false;}
    if(ADJUST.test(text)){adjustHits.push(d.id);ok=false;}
    if(!html.includes('tp-rationale'))noRationale.push(`${d.id}: ${name}`);
    if(list.some(r=>!r.source||!r.source.doc||!r.source.page))missingSource.push(d.id);
    /* "Hoac" giua the chi khi cac the khong mang dieu kien khac nhau */
    for(const s of sections){s.cards.forEach((c,i)=>{if(i>0&&c.condition&&s.cards[i-1].condition&&c.condition!==s.cards[i-1].condition){const seg=html.split(`data-regimen="${c.id}"`)[0];const tail=seg.slice(seg.lastIndexOf('data-regimen='));if(/class="tp-or"/.test(tail))orHits.push(c.id);}});}
  }
  rows.push({id:d.id,title:d.title,specialty:d.specialty,branches:scen.size,ok});
}

check('Lớp nội dung chính không hiển thị số trang/chương/phụ lục (chuyển vào Nguồn và căn cứ)',pageHits.length===0,pageHits.slice(0,8));
check('Không hiển thị tổng liều/ngày tính toán dư thừa (= x g/ngày)',!RULES.showCalculatedDailyDose&&dailyHits.length===0,dailyHits.slice(0,8));
check('Không hiển thị bảng/công thức hiệu chỉnh liều trùng module',adjustHits.length===0,adjustHits);
check('"Hoặc" không đặt giữa các phác đồ cho điều kiện/tác nhân khác nhau',orHits.length===0,orHits);
check('Mọi nhánh có khối "Vì sao chọn phác đồ này?" (mặc định đóng)',noRationale.length===0,noRationale.slice(0,5));
check('Mọi phác đồ còn liên kết nguồn (văn bản + vị trí)',missingSource.length===0,missingSource);
const ra=render(React.createElement(Panel,{sections:V.sectionsFor(R.getRegimensForDisease('v8-33').slice(0,2)).sections,sources:[],rationale:getRationale('v8-33',R.getRegimensForDisease('v8-33')[0].scenario)}));
check('Khối tiêu chí mặc định đóng và có cấu trúc Tiêu chí → Ý nghĩa → Ảnh hưởng',/<details class="tp-rationale"(?![^>]*open)/.test(ra)&&ra.includes('Ý nghĩa lâm sàng')&&ra.includes('Ảnh hưởng đến lựa chọn'));
/* Liều có ý nghĩa kê đơn theo ngày (mg/kg/ngày, g/ngày) vẫn hiển thị */
const perDay=R.ALL_REGIMENS.find(r=>r.id==='r-sa-empiric-2');
const pd=render(React.createElement(Panel,{sections:V.sectionsFor([perDay]).sections,sources:[]}));
check('Liều nguồn ghi theo ngày (clindamycin 2,4 g/ngày chia 4 lần) vẫn giữ nguyên',/2,4/.test(mainLayer(pd))&&/ngày/.test(mainLayer(pd)));
const raw=R.ALL_REGIMENS.find(r=>r.id==='r-sa-empiric-1');
check('Dữ liệu nguồn không bị sửa: chuỗi liều gốc vẫn có (8 g/ngày)',raw.drugs[0].dose==='2 g TM mỗi 6 giờ (8 g/ngày)'&&S.structureOf(raw).groups[0].options[0].dailyDose==='8 g/ngày');
const DO=load('components/antibiotics/empiric/DiseaseOverview.tsx');
const OV=load('data/antibiotics/empiric/overviews.ts');
const ovIds=C.DISEASES.map(d=>d.id).filter(id=>OV.getDiseaseOverview(id));const ovBad=[],ovShape=[];
for(const id of ovIds){const t=mainLayer(render(React.createElement(DO.DiseaseOverviewSummary,{diseaseId:id}))+render(React.createElement(DO.DiseaseMonitoring,{diseaseId:id})));
  if(PAGE.test(t)||/AUC\/MIC|Cpeak/.test(t))ovBad.push(`${id}: ${t.match(/.{0,30}(tr\.\s*\d|AUC\/MIC|Cpeak).{0,20}/)?.[0]}`);
  const o=OV.getDiseaseOverview(id);if(o.cards.length<3||o.cards.length>4||[o.cards.flatMap(c=>c.points),o.sourceControl,o.monitoring.efficacy,o.monitoring.reassessment,o.monitoring.safety].flat().some(p=>!p.ref))ovShape.push(id);}
check(`Tổng quan (${ovIds.length} mặt bệnh): không có số trang inline, không có công thức PK/PD chi tiết`,ovIds.length>=2&&ovBad.length===0,ovBad.slice(0,5));
check('Tổng quan có 3–4 thẻ và mọi ý đều có vị trí nguồn',ovShape.length===0,ovShape);
/* Tieu chi da soan: moi tieu chi co nguon; khoa nhanh phai khop scenario that (khong de khoa "mo coi") */
const RA=load('data/antibiotics/empiric/rationale-708.ts');const orphan=[],noSrc=[];
const RO=load("data/antibiotics/empiric/rationale-other.ts");for(const [id,d] of [...Object.entries(RA.RATIONALE_708),...Object.entries(RO.RATIONALE_OTHER)]){const sc=new Set(R.getRegimensForDisease(id).map(r=>r.scenario));for(const [k,items] of Object.entries(d.branches)){if(!sc.has(k))orphan.push(`${id}: ${k}`);if(items.some(c=>!c.sources?.length))noSrc.push(`${id}: ${k}`);}}
check('Tiêu chí đã soạn (QĐ 708 và văn bản khác): mọi khóa nhánh khớp bệnh cảnh có thật, mọi tiêu chí có căn cứ',orphan.length===0&&noSrc.length===0,[...orphan,...noSrc].slice(0,5));

/* Tab Quoc te va tab So sanh dung chung quy tac: khong so trang/chuong inline, khong tong lieu/ngay tinh toan, nguon trong khoi dong */
const GT=load('components/antibiotics/empiric/GuidelineTabs.tsx');const tabBad=[],cmpSrc=[];
for(const d of C.DISEASES){for(const [k,El] of [['Quốc tế',GT.IntlTab],['So sánh',GT.CompareTab]]){const html=render(React.createElement(El,{diseaseId:d.id}));const t=mainLayer(html);
  if(PAGE.test(t))tabBad.push(`${d.id} ${k}: ${t.match(new RegExp(`.{0,40}${PAGE.source}.{0,20}`))?.[0]}`);if(/class="tx-sub">= /.test(html))tabBad.push(`${d.id} ${k}: tổng liều/ngày`);
  if(k==='So sánh'&&/Điểm giống/.test(html)&&!/<details class="gt199-cite"><summary>Nguồn và căn cứ<\/summary>/.test(html))cmpSrc.push(d.id);}}
check('Tab Quốc tế và So sánh: không số trang/chương inline, không tổng liều/ngày tính toán',tabBad.length===0,tabBad.slice(0,5));
check('Tab So sánh: nguồn đối chiếu nằm trong "Nguồn và căn cứ" (mặc định đóng)',cmpSrc.length===0,cmpSrc);
/* Module rieng (CAP QĐ 2147, HAP/VAP 2023): moi kich ban co khoi tieu chi dong, co can cu */
const MR=load('data/antibiotics/empiric/rationale-modules.ts');const CAPM=load('components/antibiotics/CapByt2026.tsx');const HVM=load('components/antibiotics/HapVap2023.tsx');const modBad=[];
for(const s of CAPM.CAP_SCENARIOS){const r=MR.getModuleRationale('cap',s.id);const h=render(React.createElement(CAPM.default,{initialScenarioId:s.id}));if(!r||r.items.some(c=>!c.sources?.length)||!/<details class="tp-rationale"(?![^>]*open)/.test(h)||PAGE.test(mainLayer(h)))modBad.push('cap '+s.id);}
for(const k of ['hap','vap'])for(const s of HVM.HAPVAP_SCENARIOS[k]){const r=MR.getModuleRationale(k,s.id);const h=render(React.createElement(HVM.default,{kind:k,initialScenarioId:s.id}));if(!r||r.items.some(c=>!c.sources?.length)||!/<details class="tp-rationale"(?![^>]*open)/.test(h)||PAGE.test(mainLayer(h)))modBad.push(k+' '+s.id);}
check('Module CAP/HAP/VAP: mọi kịch bản có "Vì sao chọn phác đồ này?" (đóng, có căn cứ), không số trang inline',modBad.length===0,modBad);
if(report){
  const bySp=new Map();for(const r of rows){const s=bySp.get(r.specialty)??{n:0,b:0,ok:0};s.n++;s.b+=r.branches;if(r.ok)s.ok++;bySp.set(r.specialty,s);}
  console.log(`\nĐỘ PHỦ: ${rows.length} mặt bệnh · ${bySp.size} chuyên khoa · ${branches} nhánh BYT · ${rows.filter(r=>r.branches===0).length} mặt bệnh không có nhánh BYT (module riêng/quốc tế)`);
  for(const [s,v] of bySp)console.log(`  ${s}: ${v.n} bệnh, ${v.b} nhánh, đạt ${v.ok}/${v.n}`);
  const withR=[...new Set(rows.map(r=>r.id))].filter(id=>R.getRegimensForDisease(id).some(x=>getRationale(id,x.scenario).status==='authored'));
  console.log(`  Có giải thích tiêu chí đã soạn: ${withR.join(', ')||'0'}`);
}
console.log(`${pass} passed, ${fail} failed`);process.exitCode=fail?1:0;
