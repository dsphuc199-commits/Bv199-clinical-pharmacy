import Link from "next/link";

export type ToolItem = {
  title: string;
  description: string;
  href?: string;
  status?: "active" | "development";
  icon?: string;
  badge?: string;
};

export default function ToolCard({
  title,
  description,
  href,
  status = "development",
  icon = "💊",
  badge,
}: ToolItem) {
  const isActive = status === "active" && href;

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
          {icon}
        </div>

        {badge && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {badge}
          </span>
        )}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900 group-hover:text-blue-700">
        {title}
      </h3>

      <p className="mt-3 flex-1 leading-7 text-slate-600">
        {description}
      </p>

      <div className="mt-6">
        {isActive ? (
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Mở chức năng
            <span>→</span>
          </Link>
        ) : (
          <span className="inline-flex rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500">
            Đang phát triển
          </span>
        )}
      </div>
    </div>
  );
}