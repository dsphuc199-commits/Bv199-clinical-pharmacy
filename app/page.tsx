import Link from "next/link";

type ToolCardProps = {
  title: string;
  description: string;
  href?: string;
};

function ToolCard({ title, description, href }: ToolCardProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <h3 className="text-lg font-bold text-blue-700">{title}</h3>

      <p className="mt-3 flex-1 leading-6 text-slate-600">
        {description}
      </p>

      {href ? (
        <Link
          href={href}
          className="mt-5 w-fit rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
        >
          Mở chức năng
        </Link>
      ) : (
        <button
          disabled
          className="mt-5 w-fit cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-500"
        >
          Đang phát triển
        </button>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-3xl font-bold md:text-4xl">
            HỆ THỐNG HỖ TRỢ DƯỢC LÂM SÀNG
          </h1>

          <p className="mt-2 text-lg">
            Bệnh viện 199 - Bộ Công an
          </p>

          <p className="mt-1 text-sm text-blue-100">
            DS. Phan Phúc
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-10">

        {/* 1. HỖ TRỢ ĐIỀU TRỊ */}
        <section>
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
              01
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Hỗ trợ điều trị
            </h2>
            <p className="mt-2 text-slate-600">
              Các công cụ hỗ trợ bác sĩ và dược sĩ trong thực hành lâm sàng.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ToolCard
              title="Hiệu chỉnh liều theo chức năng thận"
              description="Tính CrCl và hỗ trợ hiệu chỉnh liều thuốc theo chức năng thận."
              href="/renal-dose"
            />

            <ToolCard
              title="PK/PD kháng sinh"
              description="Hỗ trợ đánh giá các chỉ số PK/PD và tối ưu hóa sử dụng kháng sinh."
              href="/PKPD"
            />

            <ToolCard
              title="Kháng sinh dự phòng phẫu thuật"
              description="Tra cứu lựa chọn kháng sinh, liều dùng và thời điểm sử dụng."
            />

            <ToolCard
              title="TDM"
              description="Theo dõi nồng độ thuốc trong điều trị và hỗ trợ hiệu chỉnh liều."
            />

            <ToolCard
              title="Tương tác thuốc"
              description="Hỗ trợ rà soát các tương tác thuốc có ý nghĩa lâm sàng."
            />

            <ToolCard
              title="Công cụ tính liều"
              description="Các công cụ hỗ trợ tính liều theo cân nặng, tuổi và chức năng cơ quan."
            />
          </div>
        </section>

        {/* 2. THÔNG TIN THUỐC */}
        <section>
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
              02
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Thông tin thuốc
            </h2>
            <p className="mt-2 text-slate-600">
              Tra cứu danh mục thuốc và thông tin sử dụng thuốc phục vụ thực hành
              Dược lâm sàng tại Bệnh viện 199.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ToolCard
              title="Danh mục thuốc BV199"
              description="Tra cứu danh mục thuốc hiện có tại Bệnh viện 199 theo tên thuốc, hoạt chất, hàm lượng và nhà sản xuất."
              href="/drugs"
            />

            <ToolCard
              title="Thông tin thuốc"
              description="Tra cứu chỉ định, liều dùng, hiệu chỉnh liều, cách dùng, cảnh báo và thông tin Dược lâm sàng theo hoạt chất."
              href="/drugs"
            />

            <ToolCard
              title="Thuốc LASA"
              description="Tra cứu các thuốc có tên hoặc hình thức tương tự, hỗ trợ phòng ngừa nhầm lẫn thuốc."
            />

            <ToolCard
              title="Cảnh báo thuốc"
              description="Thông tin cảnh báo an toàn, thuốc nguy cơ cao và các lưu ý quan trọng trong sử dụng thuốc."
            />
          </div>
        </section>

        {/* 3. CẢNH GIÁC DƯỢC */}
        <section>
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
              03
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Cảnh giác Dược
            </h2>
            <p className="mt-2 text-slate-600">
              Hỗ trợ phát hiện, đánh giá, báo cáo và theo dõi phản ứng có hại của thuốc.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ToolCard
              title="Báo cáo ADR"
              description="Hỗ trợ ghi nhận và chuẩn hóa thông tin báo cáo phản ứng có hại của thuốc."
            />

            <ToolCard
              title="Đánh giá ADR"
              description="Hỗ trợ đánh giá phản ứng có hại và các yếu tố liên quan."
            />

            <ToolCard
              title="Thang Naranjo"
              description="Hỗ trợ đánh giá mối liên quan giữa thuốc và biến cố bất lợi theo thang Naranjo."
            />

            <ToolCard
              title="Thống kê ADR"
              description="Tổng hợp và theo dõi dữ liệu Cảnh giác Dược phục vụ quản lý và báo cáo."
            />
          </div>
        </section>

        {/* NGUỒN THÔNG TIN */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Nguồn thông tin chuyên môn
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Nội dung Dược lâm sàng được xây dựng và thẩm định dựa trên thông tin
            sản phẩm/HDSD, Dược thư Quốc gia Việt Nam, UpToDate, Lexidrug,
            Micromedex, DailyMed, FDA, các hướng dẫn điều trị trong nước và quốc tế,
            tài liệu PK/PD, nghiên cứu khoa học và các nguồn chuyên ngành có độ tin
            cậy phù hợp.
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Nội dung được sử dụng nhằm hỗ trợ chuyên môn; quyết định điều trị cần
            dựa trên tình trạng người bệnh, hướng dẫn hiện hành và đánh giá của
            nhân viên y tế.
          </p>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-slate-500">
          Hệ thống Hỗ trợ Dược lâm sàng - Bệnh viện 199 - Bộ Công an
          <br />
          DS. Phan Phúc
        </div>
      </footer>
    </main>
  );
}