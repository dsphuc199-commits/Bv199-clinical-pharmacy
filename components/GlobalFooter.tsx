export default function GlobalFooter() {
  return (
    <footer
      className="
        fixed
        bottom-0
        left-[244px]
        right-0
        z-40
        border-t
        border-slate-200
        bg-white/95
        backdrop-blur
      "
    >
      <div
        className="
          flex
          min-h-[46px]
          items-center
          justify-between
          gap-6
          px-6
          py-2
        "
      >
        {/* =================================================
            BÊN TRÁI
        ================================================= */}

        <div className="min-w-0">
          <p className="text-[9px] font-bold text-slate-700">
            Khoa Dược · Bệnh viện 199 · Bộ Công an
          </p>

          <p className="mt-0.5 truncate text-[8px] text-slate-400">
            Nội dung hỗ trợ chuyên môn không thay thế đánh giá lâm sàng của nhân viên y tế.
          </p>
        </div>

        {/* =================================================
            BÊN PHẢI
            CHỈ DUY NHẤT 1 CREDIT
        ================================================= */}

        <div className="shrink-0 text-right">
          <p className="whitespace-nowrap text-[9px] leading-4 text-slate-500">
            <span className="font-medium text-slate-400">
              Phát triển bởi:
            </span>

            {" "}

            <span className="font-bold text-slate-700">
              Dược sĩ CKII Nguyễn Đức Cường
            </span>

            <span className="mx-1.5 text-slate-300">
              ·
            </span>

            <span className="font-bold text-slate-700">
              DS. Phan Văn Phúc
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}