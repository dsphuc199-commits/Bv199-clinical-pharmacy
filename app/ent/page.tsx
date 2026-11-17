/* Module Nhiễm khuẩn tai mũi họng – mục lục 9 bệnh. */
import Link from "next/link";
import { DISEASES } from "@/data/ent";
import { EntStyle } from "@/components/ent/EntStyle";

export const metadata = { title: "Nhiễm khuẩn tai mũi họng – BV199" };

export default function EntIndex() {
  return (
    <main className="ent-page">
      <h1>Nhiễm khuẩn tai mũi họng</h1>
      <p className="ent-muted">Chọn kháng sinh theo nguồn có trích dẫn. Bệnh không có nguồn chính chỉ hiển thị khoảng trống bằng chứng và nội dung tham khảo.</p>
      <ul className="ent-index">
        {DISEASES.map((d) => (
          <li key={d.id}>
            <Link href={`/ent/${d.id}`}>{d.title}</Link> <span className="ent-muted">({d.titleEn}) · {d.primarySources.length ? "có nguồn chính" : "không có nguồn chính"}</span>
          </li>
        ))}
      </ul>
      <footer className="ent-foot">
        <p className="ent-warn">Công cụ thử nghiệm, chưa thẩm định lâm sàng – cần dược sĩ/bác sĩ xác nhận.</p>
        <p>Chưa đối chiếu hướng dẫn Bộ Y tế/antibiogram bệnh viện.</p>
      </footer>
      <EntStyle />
    </main>
  );
}
