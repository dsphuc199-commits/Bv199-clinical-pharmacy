
export default function GlobalFooter() {
  return (
    <footer
      aria-label="Thông tin đơn vị và tác giả"
      className="relative w-full min-w-0 border-t border-slate-200 bg-white"
    >
      {/* MOBILE: Footer nhỏ gọn */}
      <div className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 text-center md:hidden">
        <p className="m-0 text-[9px] font-bold leading-3 text-slate-700">
          Khoa Dược · Bệnh viện 199 · Bộ Công an
        </p>

        <p className="m-0 text-[8px] leading-3 text-slate-500">
          Phát triển bởi:{" "}
          <strong>DSCKII Nguyễn Đức Cường</strong>
          {" · "}
          <strong>DS. Phan Văn Phúc</strong>
        </p>
      </div>

      {/* DESKTOP: Footer đầy đủ */}
      <div className="hidden items-center justify-between gap-4 px-6 py-2 md:flex">
        <div className="min-w-0">
          <p className="m-0 text-[10px] font-bold text-slate-700">
            Khoa Dược · Bệnh viện 199 · Bộ Công an
          </p>

          <p className="mt-1 text-[9px] text-slate-500">
            Nội dung hỗ trợ chuyên môn không thay thế đánh giá lâm sàng của nhân viên y tế.
          </p>
        </div>

        <p className="m-0 text-right text-[10px] text-slate-600">
          Phát triển bởi:{" "}
          <strong>DSCKII Nguyễn Đức Cường</strong>
          {" · "}
          <strong>DS. Phan Văn Phúc</strong>
        </p>
      </div>
    </footer>
  );
}
