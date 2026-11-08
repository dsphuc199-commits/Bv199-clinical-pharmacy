import { clinicalText } from "@/lib/antibiotics/presentation-text";

/** Only an explicit neutral topic heading creates subpoints. A clinical
 * condition must stay attached to its complete original statement. */
export default function ClinicalNotes({items}:{items:string[]}) {
  return <div className="clinical-notes-block"><ul className="clinical-notes">
    {items.map((original,index)=>{
      const text=clinicalText(original);
      const heading=text.match(/^([^:;\n]{2,80}):\s+([\s\S]+)$/u);
      const topic=heading&&/^(?:Lưu ý(?: an toàn| lâm sàng)?|Theo dõi(?: đáp ứng| hiệu quả| an toàn| điều trị)?|Đánh giá(?: ban đầu| đáp ứng| lại)?|Hiệu chỉnh liều|Liều dùng|Thời gian(?: điều trị)?|Đường dùng|Tương tác(?: thuốc)?|Chống chỉ định|Điều kiện(?: lựa chọn| áp dụng)?|Trước khi kê đơn|Chuyển đường dùng|Vi sinh|Xuống thang)$/iu.test(heading[1]);
      if(!heading||!topic)return <li key={index}>{text}</li>;
      const children=heading[2].split(/(?<=;)\s+|\r?\n+/u).filter(part=>part.trim());
      return <li key={index}><strong>{heading[1]}:</strong><ul>{children.map((child,i)=><li key={i}>{child}</li>)}</ul></li>;
    })}
  </ul><ClinicalNotesStyle/></div>;
}

export function ClinicalNotesStyle() {
  return <style>{`
    .clinical-notes-block { min-width:0; }
    .clinical-notes-block .clinical-notes,.clinical-notes-block .clinical-notes ul { list-style:none; padding-left:0; margin:6px 0; line-height:1.65; }
    .clinical-notes-block .clinical-notes li { position:relative; padding-left:18px; margin:7px 0; overflow-wrap:anywhere; }
    .clinical-notes-block .clinical-notes > li::before { content:"–"; position:absolute; left:0; }
    .clinical-notes-block .clinical-notes ul { margin:5px 0 0; }
    .clinical-notes-block .clinical-notes ul > li::before { content:"•"; position:absolute; left:0; }
    .clinical-notes-block .clinical-notes strong { font-weight:700; }
  `}</style>;
}
