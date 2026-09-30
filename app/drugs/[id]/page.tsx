import Link from "next/link";
import { notFound } from "next/navigation";
import drugData from "../../../data/drug-products.json";
import { clinicalMonographs } from "../../../data/clinical-monographs";

type DrugProduct = {
  id: string;
  drugCode: string;
  brandName: string;
  ingredientName: string;
  ingredientId: string;
  strength: string;
  route: string;
  dosageForm: string;
  packageSize: string;
  registrationNumber: string;
  manufacturer: string;
  country: string;
  unit: string;
  sourceSheet: string;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DrugDetailPage({ params }: Props) {
  const { id } = await params;

  const drugs = drugData as DrugProduct[];

  const drug = drugs.find(
    (item) => String(item.id) === decodeURIComponent(id)
  );

  if (!drug) {
    notFound();
  }
  const monograph = clinicalMonographs[drug.ingredientId?.toLowerCase()] ?? null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">

        <Link
          href="/drugs"
          className="mb-6 inline-block font-semibold text-blue-700 hover:underline"
        >
          ← Quay lại danh mục thuốc
        </Link>

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold text-blue-700">
            BỆNH VIỆN 199 - BỘ CÔNG AN
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {drug.brandName}
          </h1>

          <p className="mt-2 text-lg text-slate-600">
            {drug.ingredientName}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <div>
              <strong>Mã thuốc:</strong>
              <p>{drug.drugCode || "Chưa có dữ liệu"}</p>
            </div>

            <div>
              <strong>Hàm lượng:</strong>
              <p>{drug.strength || "Chưa có dữ liệu"}</p>
            </div>

            <div>
              <strong>Đường dùng:</strong>
              <p>{drug.route || "Chưa có dữ liệu"}</p>
            </div>

            <div>
              <strong>Dạng bào chế:</strong>
              <p>{drug.dosageForm || "Chưa có dữ liệu"}</p>
            </div>

            <div>
              <strong>Quy cách đóng gói:</strong>
              <p>{drug.packageSize || "Chưa có dữ liệu"}</p>
            </div>

            <div>
              <strong>Số đăng ký / GPNK:</strong>
              <p>{drug.registrationNumber || "Chưa có dữ liệu"}</p>
            </div>

            <div>
              <strong>Nhà sản xuất:</strong>
              <p>{drug.manufacturer || "Chưa có dữ liệu"}</p>
            </div>

            <div>
              <strong>Nước sản xuất:</strong>
              <p>{drug.country || "Chưa có dữ liệu"}</p>
            </div>

          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900">
            Thông tin Dược lâm sàng
          </h2>

          <p className="mt-2 text-slate-600">
            Các nội dung chuyên môn sẽ được bổ sung và thẩm định theo
            hoạt chất.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">

            {[
              "Chỉ định",
              "Liều dùng",
              "Hiệu chỉnh liều suy thận",
              "Cách dùng / Pha truyền",
              "Chống chỉ định",
              "Cảnh báo",
              "Tác dụng không mong muốn",
              "Tương tác thuốc",
              "Thai kỳ / Cho con bú",
              "Theo dõi",
              "PK/PD",
              "Tài liệu tham khảo",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="font-semibold">
                  {item}
                </div>

                <div className="mt-1 text-sm text-slate-500">
  {item === "Chỉ định"
    ? monograph?.indications ?? "Chưa có dữ liệu đã thẩm định"
    : "Chưa có dữ liệu đã thẩm định"}
</div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </main>
  );
}