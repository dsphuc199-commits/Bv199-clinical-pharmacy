const load=require('./tsrun.cjs');
const React=require('react');
const {renderToStaticMarkup:render}=require('react-dom/server');
const {IntlTab}=load('components/antibiotics/empiric/GuidelineTabs.tsx');
let pass=0,fail=0;function check(n,ok){if(ok)pass++;else fail++;console.log(`${ok?'PASS':'FAIL'} ${n}`);}
const h=render(React.createElement(IntlTab,{diseaseId:'v8-9'}));
const doseRows=[...h.matchAll(/<tr class="tx-row">([\s\S]*?)<\/tr>/g)].map(m=>m[1]);
const metronidazoleIndex=doseRows.findIndex(row=>row.includes('<strong>Metronidazol</strong>'));
check('Lung abscess international tab renders supplied source instead of no-source placeholder',h.includes('Ampicillin–sulbactam')&&h.includes('UpToDate')&&!h.includes('chưa có hướng dẫn quốc tế đã được đọc'));
check('Only concise source label is shown without provenance disclosure',h.includes('class="la-origin">UpToDate 2026</p>')&&!h.includes('Nguồn và giới hạn đối chiếu')&&!h.includes('hai ảnh người dùng gửi'));
check('Alternative and combination branches stay explicit in shared dose rows',h.includes('lựa chọn 1: moxifloxacin đơn trị')&&h.includes('lựa chọn 2: levofloxacin phối hợp metronidazol')&&doseRows.length===6&&metronidazoleIndex>0&&doseRows[metronidazoleIndex-1].includes('<strong>Levofloxacin</strong>')&&doseRows[metronidazoleIndex].includes('>+</td>')&&doseRows[5].includes('>Hoặc</td>')&&!h.includes('ở dòng kế tiếp'));
check('Metronidazole dose route and interval remain bound in order within the same usage cell',metronidazoleIndex>=0&&/<td data-label="Cách dùng"><div><span data-dose="">500 mg<\/span>[\s\S]*?<span data-route="">Uống hoặc truyền tĩnh mạch<\/span>[\s\S]*?<span data-interval="">Mỗi 8 giờ<\/span>/.test(doseRows[metronidazoleIndex])&&h.includes('không sử dụng đơn trị'));
check('Supplementary source paragraph is removed and notes have nested levels',!h.includes('Nguồn bổ sung:')&&!h.includes('class="la-supplement"')&&h.includes('class="la-notes"')&&h.includes('<strong>Theo dõi đáp ứng</strong><ul>'));
check('Clindamycin is a conditional alternative with dose, spectrum limits and safety context',h.includes('Clindamycin đơn trị: lựa chọn thay thế có điều kiện')&&h.includes('600 mg truyền tĩnh mạch mỗi 8 giờ')&&h.includes('Clostridioides difficile')&&h.includes('Không sử dụng đơn trị khi nghi ngờ nhiễm phối hợp trực khuẩn Gram âm hiếu khí'));
check('Treatment duration is conditional and reassessment is retained',h.includes('3–4 tuần')&&h.includes('không áp dụng một thời gian cố định')&&h.includes('sau 3–4 ngày'));
check('Clinical prose omits screenshot transcription language',!h.includes('chép từ ảnh')&&!h.includes('Ảnh ghi nhận')&&!h.includes('ảnh ghi thường')&&h.includes('thẩm định y lệnh'));
check('Source content stays scoped to lung abscess',!render(React.createElement(IntlTab,{diseaseId:'v8-33'})).includes('la-intl'));
console.log(`${pass} passed, ${fail} failed`);process.exitCode=fail?1:0;
