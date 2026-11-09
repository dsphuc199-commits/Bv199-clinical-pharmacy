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
    const text=mainLayer(html);const textNoSource=mainLayer(html.split('<span class="tx-sub tx-source-line">').map((x,i)=>i?x.slice(x.indexOf('</span>')+7):x).join(''));
    if(PAGE.test(text)){pageHits.push(`${d.id}: ${text.match(new RegExp(`.{0,40}${PAGE.source}.{0,20}`))?.[0]}`);ok=false;}
    if(/class="tx-sub">= /.test(html)){dailyHits.push(d.id);ok=false;}
    if(ADJUST.test(textNoSource)){adjustHits.push(d.id);ok=false;}
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
/* Khong nhung cong cu hieu chinh lieu/tuong tac trong the; nhan tre em trung tinh; khong nhan "Khac biet lieu" */
const toolHits=[],badgeHits=[];
for(const d of C.DISEASES){const scen=new Map();for(const r of R.getRegimensForDisease(d.id)){if(!scen.has(r.scenario))scen.set(r.scenario,[]);scen.get(r.scenario).push(r);}
  for(const [name,list] of scen){const h=render(React.createElement(Panel,{sections:V.sectionsFor(list).sections,sources:[],scenarios:[{value:name,label:name,criteria:[name]}],scenario:name}));
    if(/data-drug-tools=|<summary>Hiệu chỉnh liều|<summary>Tương tác thuốc/.test(h))toolHits.push(d.id);
    if(/Không dùng cho trẻ em|Khác biệt liều BYT/.test(h))badgeHits.push(d.id);
    if(!h.includes('class="tp-module-links"'))toolHits.push(d.id+' (thiếu liên kết module)');}}
check('Thẻ phác đồ không nhúng "Hiệu chỉnh liều"/"Tương tác thuốc"; có liên kết sang module chuyên biệt',toolHits.length===0,[...new Set(toolHits)].slice(0,5));
check('Không còn nhãn "Không dùng cho trẻ em" và "Khác biệt liều BYT – quốc tế"',badgeHits.length===0,[...new Set(badgeHits)]);
const sa=render(React.createElement(Panel,{sections:V.sectionsFor(R.getRegimensForDisease('v8-33').filter(r=>r.id==='r-sa-empiric-1')).sections,sources:[]}));
check('v8-33: nhãn trung tính "Liều người lớn"',sa.includes('Liều người lớn')&&sa.includes('tp-flag-info'));
/* Tieu chi khong giup chon thuoc bi an; cach goi chong chi dinh theo van phong duoc lam sang */
const BV=V.default;const single=(id)=>render(React.createElement(BV,{diseaseId:id,diseaseTitle:C.DISEASES.find(d=>d.id===id).title}));
check('Bệnh một bệnh cảnh: ẩn "Tiêu chí áp dụng" khi nhãn chỉ nhắc tên bệnh (v8-27, v8-25), giữ khi có điều kiện (v8-54 > 3 tuổi, v8-129 mức độ)',
  !single('v8-27').includes('<strong class="tp-scn-label"')&&!single('v8-25').includes('<strong class="tp-scn-label"')&&single('v8-54').includes('<strong class="tp-scn-label"')&&single('v8-129').includes('<strong class="tp-scn-label"'));
const raHidden=render(React.createElement(Panel,{sections:V.sectionsFor(R.getRegimensForDisease('v8-117').slice(0,1)).sections,sources:[],rationale:{status:'authored',items:[{condition:'Mô tả không dẫn tới lựa chọn'},{condition:'Có lựa chọn',treatmentImplication:'Thuốc X'},{condition:'CẦN THẨM ĐỊNH – mâu thuẫn',clinicalMeaning:'Chi tiết'}]}}));
check('"Vì sao chọn phác đồ này?" chỉ giữ tiêu chí dẫn tới lựa chọn thuốc và mục CẦN THẨM ĐỊNH',!raHidden.includes('Mô tả không dẫn tới lựa chọn')&&raHidden.includes('Có lựa chọn')&&raHidden.includes('CẦN THẨM ĐỊNH – mâu thuẫn'));
const authoredText=JSON.stringify([load('data/antibiotics/empiric/rationale-708.ts').RATIONALE_708,load('data/antibiotics/empiric/rationale-other.ts').RATIONALE_OTHER,load('data/antibiotics/empiric/overviews.ts').DISEASE_OVERVIEWS]);
check('Nội dung soạn mới không dùng cách nói "Không dùng cho…" (thay bằng "Chống chỉ định"/"Không chỉ định")',!/Không dùng cho|không dùng cho trẻ/.test(authoredText));
/* Gop nguon: moi khung toi da mot "Nguồn và đối chiếu"; khong hien "Phụ lục" (ke ca khoi dong) – moi mat benh, tab Quoc te, module */
const appendixHits=[],multiSrc=[];
const scanAll=(name,html)=>{const h=html.replace(/<style[\s\S]*?<\/style>/g,'');if(/Phụ lục\s*\d/.test(h))appendixHits.push(name);if(h.split('<summary>Nguồn và đối chiếu</summary>').length>2)multiSrc.push(name);};
for(const d of C.DISEASES){const sc=new Map();for(const r of R.getRegimensForDisease(d.id)){if(!sc.has(r.scenario))sc.set(r.scenario,[]);sc.get(r.scenario).push(r);}
  for(const [nm,l] of sc)scanAll(`${d.id} ${nm.slice(0,30)}`,render(React.createElement(Panel,{sections:V.sectionsFor(l).sections,sources:l.map(r=>`QĐ x — ${r.source.section}`),rationale:getRationale(d.id,nm,l),scenarios:[{value:nm,label:nm,criteria:[nm]}],scenario:nm})));
  scanAll(`${d.id} Quốc tế`,render(React.createElement(GT.IntlTab,{diseaseId:d.id})));scanAll(`${d.id} So sánh`,render(React.createElement(GT.CompareTab,{diseaseId:d.id})));}
for(const s of CAPM.CAP_SCENARIOS)scanAll(`CAP ${s.id}`,render(React.createElement(CAPM.default,{initialScenarioId:s.id})));
for(const k of ['hap','vap'])for(const s of HVM.HAPVAP_SCENARIOS[k])scanAll(`${k} ${s.id}`,render(React.createElement(HVM.default,{kind:k,initialScenarioId:s.id})));
check('Không hiển thị "Phụ lục" ở bất kỳ mặt bệnh, tab hay module nào (kể cả khối đóng)',appendixHits.length===0,appendixHits.slice(0,5));
check('Mỗi khung phác đồ chỉ có tối đa một khối "Nguồn và đối chiếu" (đã gộp)',multiSrc.length===0,multiSrc.slice(0,5));
/* Trinh bay: khong lap duong dung/cach chia da co trong cau lieu goc; khong cat chu giua tu */
const clinda=render(React.createElement(Panel,{sections:V.sectionsFor([R.ALL_REGIMENS.find(r=>r.id==='r-sa-empiric-2')]).sections,sources:[]}));
check('Câu liều đã ghi đường dùng và cách chia thì không gắn lặp lại (clindamycin 2,4 g TM/ngày chia 4 lần)',clinda.includes('2,4 g TM/ngày chia 4 lần')&&!clinda.includes('data-route="">Tĩnh mạch'));
const cssFiles=['components/antibiotics/treatment/DoseTable.tsx','components/antibiotics/treatment/TreatmentPanel.tsx','components/antibiotics/empiric/GuidelineTabs.tsx','components/antibiotics/empiric/BytRegimenView.tsx'].map(f=>require('fs').readFileSync(require('path').resolve(__dirname,'../..',f),'utf8')).join('\n');
check('Không dùng overflow-wrap:anywhere (gây tách chữ giữa từ, ví dụ "Hoặ c"); cột "Hoặc" không xuống dòng',!/overflow-?[wW]rap:\s*"?anywhere/.test(cssFiles)&&/td\.tx-marker \{[^}]*white-space: nowrap/.test(cssFiles));
/* Dong deu toan danh muc: 69/69 co tong quan + kiem soat o nhiem + theo doi; module rieng duoc boc cung bo cuc; COPD co "Vì sao" theo nhom */
const OVA=load('data/antibiotics/empiric/overviews.ts');
check('69/69 mặt bệnh có tổng quan và phần theo dõi/an toàn (kể cả CAP, HAP, VAP, COPD)',C.DISEASES.every(d=>!!OVA.getDiseaseOverview(d.id)));
const DOV=load('components/antibiotics/empiric/DiseaseOverview.tsx');const uniformBad=[];
for(const d of C.DISEASES){const h=render(React.createElement(DOV.DiseaseOverviewSummary,{diseaseId:d.id}))+render(React.createElement(DOV.DiseaseMonitoring,{diseaseId:d.id}));
  if(!h.includes('class="do-cards"')||!h.includes('Kiểm soát ổ nhiễm và can thiệp')||!h.includes('Theo dõi hiệu quả')||!h.includes('Đánh giá lại điều trị')||!h.includes('Cảnh báo an toàn thiết yếu'))uniformBad.push(d.id);}
check('Mọi mặt bệnh hiển thị đủ các mục tổng quan/theo dõi (mục nguồn không nêu ghi rõ, không ẩn)',uniformBad.length===0,uniformBad);
const pageSrc=require('fs').readFileSync(require('path').resolve(__dirname,'../../app/antibiotics/empiric/guideline-v9/page.tsx'),'utf8');
check('Trang hướng dẫn bọc module COPD/CAP/HAP/VAP bằng tổng quan + theo dõi như khung chung',/selected\.id === "v8-6" && <><DiseaseOverviewSummary diseaseId="v8-6" \/><CopdByt2026 \/><DiseaseMonitoring diseaseId="v8-6" \/><\/>/.test(pageSrc)&&pageSrc.includes('<DiseaseOverviewSummary diseaseId={selected.id} />')&&pageSrc.includes('<DiseaseMonitoring diseaseId={selected.id} />'));
const COPDD=load('data/antibiotics/copd-2131.ts');
check('COPD: mọi nhóm có "Vì sao chọn phác đồ này?" với lựa chọn lấy từ chính danh sách phác đồ',COPDD.COPD_GROUPS.every(g=>{const r=MR.getModuleRationale('copd',g.id);return r&&r.items[0].treatmentImplication&&r.items.every(c=>c.sources?.length);}));
/* Khong lap "Chi tiết cách dùng theo văn bản"; phoi hop trong mot lua chon khong bi tach thanh lua chon don le */
let detailHits=0;for(const r of R.ALL_REGIMENS){if(render(React.createElement(Panel,{sections:V.sectionsFor([r]).sections,sources:[]})).includes('Chi tiết cách dùng theo văn bản'))detailHits++;}
check('Không còn khối "Chi tiết cách dùng theo văn bản" ở mọi phác đồ',detailHits===0,detailHits);
const neoHtml=render(React.createElement(Panel,{sections:V.sectionsFor([R.ALL_REGIMENS.find(r=>r.id==='r-neo-pneu-1')]).sections,sources:[]}));
check('Viêm phổi sơ sinh: "benzyl penicilin hoặc ampicilin kết hợp gentamycin" hiển thị đúng nguyên văn, không thành "Chọn 1 trong 3"',neoHtml.includes('ampicilin kết hợp gentamycin')&&!neoHtml.includes('Chọn 1 trong 3'));
const cryptoHtml=render(React.createElement(Panel,{sections:V.sectionsFor([R.ALL_REGIMENS.find(r=>r.id==='r-fung-crypto-hiv-alt')]).sections,sources:[]}));
check('Phối hợp "ABLC + flucytosin" giữ nguyên trong một lựa chọn',cryptoHtml.includes('ABLC + flucytosin'));
if(report){
  const bySp=new Map();for(const r of rows){const s=bySp.get(r.specialty)??{n:0,b:0,ok:0};s.n++;s.b+=r.branches;if(r.ok)s.ok++;bySp.set(r.specialty,s);}
  console.log(`\nĐỘ PHỦ: ${rows.length} mặt bệnh · ${bySp.size} chuyên khoa · ${branches} nhánh BYT · ${rows.filter(r=>r.branches===0).length} mặt bệnh không có nhánh BYT (module riêng/quốc tế)`);
  for(const [s,v] of bySp)console.log(`  ${s}: ${v.n} bệnh, ${v.b} nhánh, đạt ${v.ok}/${v.n}`);
  const withR=[...new Set(rows.map(r=>r.id))].filter(id=>R.getRegimensForDisease(id).some(x=>getRationale(id,x.scenario).status==='authored'));
  console.log(`  Có giải thích tiêu chí đã soạn: ${withR.join(', ')||'0'}`);
}
console.log(`${pass} passed, ${fail} failed`);process.exitCode=fail?1:0;
