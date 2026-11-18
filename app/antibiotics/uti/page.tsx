/* Module Kháng sinh điều trị nhiễm khuẩn tiết niệu. Trang máy chủ: chỉ gửi dữ liệu hiển thị xuống trình duyệt. */
import UtiTool from "@/components/uti/UtiTool";
import { CONDITIONS, UTI_CONFIG, publicRegimens } from "@/data/uti-antibiotics";

export const metadata = { title: "Kháng sinh điều trị nhiễm khuẩn tiết niệu – BV199" };

export default function Page() {
  return <UtiTool conditions={CONDITIONS} regimens={publicRegimens()} config={UTI_CONFIG} />;
}
