import { redirect } from "next/navigation";

/* "An toàn thuốc" chưa có trang tổng: chuyển tới module có dữ liệu (LASA). */
export default function SafetyPage() {
  redirect("/safety/lasa");
}
