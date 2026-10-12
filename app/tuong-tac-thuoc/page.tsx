
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Pill,
  Search,
  ListChecks,
  Layers3,
  Info,
  FileSearch,
  X,
  Plus,
  Trash2,
  ArrowRight,
  BookOpen,
  FileText,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

type Interaction = {
  id: string;
  stt: number;
  type: "substance" | "group";
  drug1: string;
  drug2: string;
  mechanism: string;
  consequence: string;
  management: string;
  page: number;
  reviewStatus?: string;
};

type Tab = "search" | "check";
type Category = "all" | "substance" | "group";

const PDF_URL = "/docs/qd5948.pdf";

function normalize(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function drugKey(value: string): string {
  const key = normalize(value).replace(/[^a-z0-9]/g, "");

  const aliases: Record<string, string> = {
    cyclosporin: "ciclosporin",
    glyburide: "glibenclamid",
    iodipamid: "adipiodon",
    methotrimeprazin: "levomepromazin",
    norethindron: "norethisteron",
  };

  return aliases[key] ?? key;
}

function isValidData(value: unknown): value is Interaction[] {
  return (
    Array.isArray(value) &&
    value.every(
      (row) =>
        row !== null &&
        typeof row === "object" &&
        typeof row.drug1 === "string" &&
        typeof row.drug2 === "string" &&
        typeof row.mechanism === "string" &&
        typeof row.consequence === "string" &&
        typeof row.management === "string" &&
        (row.type === "substance" || row.type === "group")
    )
  );
}

export default function TuongTacThuocPage() {
  const [data, setData] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tab, setTab] = useState<Tab>("search");
  const [category, setCategory] = useState<Category>("all");

  const [keyword, setKeyword] = useState("");
  const [activeKeyword, setActiveKeyword] = useState("");
  const [browse, setBrowse] = useState(false);

  const [drugInput, setDrugInput] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [drugError, setDrugError] = useState("");

  const [selected, setSelected] = useState<Interaction | null>(null);
  const [limit, setLimit] = useState(20);
  const [pdfReady, setPdfReady] = useState(false);

  // NẠP 701 BẢN GHI TỪ JSON
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const res = await fetch("/data/qd5948.json", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(
            "Không tìm thấy public/data/qd5948.json."
          );
        }

        const json: unknown = await res.json();

        if (!isValidData(json)) {
          throw new Error("Cấu trúc dữ liệu JSON chưa hợp lệ.");
        }

        if (mounted) {
          setData(json);
          setError("");
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Không tải được danh mục tương tác."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    fetch(PDF_URL, { method: "HEAD" })
      .then((res) => {
        if (mounted) {
          setPdfReady(
            res.ok &&
              (res.headers.get("content-type") || "")
                .includes("pdf")
          );
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  // ĐẾM BẢN GHI
  const substanceCount = useMemo(
    () => data.filter((r) => r.type === "substance").length,
    [data]
  );

  const groupCount = useMemo(
    () => data.filter((r) => r.type === "group").length,
    [data]
  );

  // TẬP TÊN HOẠT CHẤT ĐỂ GỢI Ý
  const substances = useMemo(() => {
    const names = new Set<string>();

    for (const row of data) {
      if (row.type === "substance") {
        names.add(row.drug1);
        names.add(row.drug2);
      }
    }

    return [...names].sort((a, b) => a.localeCompare(b));
  }, [data]);

  const suggestions = useMemo(() => {
    const q = normalize(drugInput);

    if (q.length < 2) return [];

    return substances
      .filter((name) => normalize(name).includes(q))
      .slice(0, 8);
  }, [drugInput, substances]);

  // THAO TÁC TÌM KIẾM
  function handleSearch() {
    const text = keyword.trim();

    setActiveKeyword(text);
    setBrowse(true);
    setLimit(20);
  }

  function handleCategoryChange(value: Category) {
    setCategory(value);
    setBrowse(true);
    setKeyword("");
    setActiveKeyword("");
    setLimit(20);
  }

  function handleShowAll() {
    setCategory("all");
    setKeyword("");
    setActiveKeyword("");
    setBrowse(true);
    setLimit(20);
  }

  function resetSearch() {
    setCategory("all");
    setKeyword("");
    setActiveKeyword("");
    setBrowse(false);
    setLimit(20);
  }

  // THÊM THUỐC ĐỂ KIỂM TRA
  function addDrug(value = drugInput) {
    const entered = value.trim();

    if (!entered) return;

    const found = substances.find(
      (name) => drugKey(name) === drugKey(entered)
    );

    if (!found) {
      setDrugError(
        `Chưa nhận diện được "${entered}". Hãy chọn hoạt chất từ gợi ý.`
      );
      return;
    }

    setSelectedDrugs((previous) =>
      previous.some((x) => drugKey(x) === drugKey(found))
        ? previous
        : [...previous, found]
    );

    setDrugInput("");
    setDrugError("");
    setLimit(20);
  }

  // TÌM KIẾM VÀ LỌC DANH MỤC
  const results = useMemo(() => {
    if (tab === "check") {
      if (selectedDrugs.length < 2) return [];

      const keys = new Set(selectedDrugs.map(drugKey));

      return data.filter(
        (row) =>
          row.type === "substance" &&
          keys.has(drugKey(row.drug1)) &&
          keys.has(drugKey(row.drug2))
      );
    }

    if (!browse && !activeKeyword) return [];

    const query = normalize(activeKeyword);

    const pair = activeKeyword
      .split(/\s+\+\s+|\s*,\s*|\s*;\s*/)
      .map(normalize)
      .filter(Boolean);

    return data.filter((row) => {
      if (category !== "all" && row.type !== category) {
        return false;
      }

      if (!query) return true;

      // Tra cứu cặp A + B, không phụ thuộc thứ tự
      if (pair.length === 2) {
        const a = normalize(row.drug1);
        const b = normalize(row.drug2);

        return (
          (a.includes(pair[0]) && b.includes(pair[1])) ||
          (a.includes(pair[1]) && b.includes(pair[0]))
        );
      }

      const text = [
        row.drug1,
        row.drug2,
        row.mechanism,
        row.consequence,
        row.management,
        row.stt,
      ].join(" ");

      return normalize(text).includes(query);
    });
  }, [
    data,
    tab,
    selectedDrugs,
    category,
    activeKeyword,
    browse,
  ]);

  const isInitialSearch =
    tab === "search" && !browse && !activeKeyword;

  const isInitialCheck =
    tab === "check" && selectedDrugs.length < 2;

  return (
    <main className="ddi-page">
      <div className="ddi-container">
        {/* BREADCRUMB */}
        <nav className="ddi-breadcrumb" aria-label="Điều hướng">
          <Link href="/" title="Trang chủ">
            <Home size={16} />
          </Link>

          <ChevronRight size={15} />

          <span>Điều trị & Dược lâm sàng</span>

          <ChevronRight size={15} />

          <strong>Tương tác thuốc</strong>
        </nav>

        {/* TIÊU ĐỀ */}
        <section className="ddi-heading">
          <div className="ddi-heading-icon">
            <Pill size={25} strokeWidth={1.9} />
          </div>

          <div className="ddi-heading-text">
            <h1>Tương tác thuốc</h1>

            <p>
              Danh mục tương tác thuốc chống chỉ định
              trong thực hành lâm sàng theo
              Quyết định số 5948/QĐ-BYT
              ngày 30/12/2021 của Bộ Y tế.
            </p>
          </div>
        </section>

        {/* HAI CHỨC NĂNG CHÍNH */}
        <div className="ddi-tabs">
          <button
            type="button"
            className={tab === "search" ? "active" : ""}
            onClick={() => {
              setTab("search");
              setLimit(20);
            }}
          >
            <Search size={18} />
            Tra cứu tương tác
          </button>

          <button
            type="button"
            className={tab === "check" ? "active" : ""}
            onClick={() => {
              setTab("check");
              setLimit(20);
            }}
          >
            <ListChecks size={18} />
            Kiểm tra nhiều thuốc
          </button>
        </div>

        {/* KHUNG NỘI DUNG */}
        <section className="ddi-workspace">
          {tab === "search" ? (
            <>
              <form
                className="ddi-search-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <div className="ddi-input-wrap">
                  <Search size={19} />

                  <input
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                    }}
                    placeholder="Nhập tên hoạt chất, cặp thuốc, cơ chế, hậu quả..."
                    aria-label="Từ khóa tìm kiếm"
                  />
                </div>

                <div className="ddi-select-wrap">
                  <Layers3 size={18} />

                  <select
                    value={category}
                    onChange={(e) =>
                      handleCategoryChange(
                        e.target.value as Category
                      )
                    }
                    aria-label="Chọn danh mục"
                  >
                    <option value="all">
                      Toàn bộ danh mục ({data.length || 701})
                    </option>

                    <option value="substance">
                      Theo hoạt chất ({substanceCount || 633})
                    </option>

                    <option value="group">
                      Theo nhóm dược lý ({groupCount || 68})
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="ddi-submit"
                >
                  <Search size={19} />
                  Tìm kiếm
                </button>
              </form>

              <div className="ddi-search-actions">
                <p>
                  Tìm theo hoạt chất, cặp thuốc, cơ chế,
                  hậu quả lâm sàng hoặc hướng xử trí.
                </p>

                <div>
                  <button
                    type="button"
                    onClick={handleShowAll}
                    className="ddi-text-button"
                  >
                    Xem toàn bộ
                  </button>

                  {(browse || keyword) && (
                    <button
                      type="button"
                      onClick={resetSearch}
                      className="ddi-text-button"
                    >
                      <RotateCcw size={14} />
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="ddi-check-heading">
                <strong>Kiểm tra phối hợp nhiều hoạt chất</strong>
                <span>
                  Chọn tối thiểu 2 hoạt chất
                </span>
              </div>

              <div className="ddi-add-row">
                <div className="ddi-input-wrap">
                  <Search size={19} />

                  <input
                    value={drugInput}
                    onChange={(e) => {
                      setDrugInput(e.target.value);
                      setDrugError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addDrug();
                      }
                    }}
                    placeholder="Tìm và chọn hoạt chất..."
                  />
                </div>

                <button
                  type="button"
                  className="ddi-submit"
                  onClick={() => addDrug()}
                >
                  <Plus size={17} />
                  Thêm
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className="ddi-suggestions">
                  {suggestions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => addDrug(name)}
                    >
                      <Pill size={15} />
                      {name}
                    </button>
                  ))}
                </div>
              )}

              {drugError && (
                <p className="ddi-drug-error">
                  {drugError}
                </p>
              )}

              {selectedDrugs.length > 0 && (
                <div className="ddi-chips">
                  {selectedDrugs.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        setSelectedDrugs((old) =>
                          old.filter((x) => x !== name)
                        )
                      }
                    >
                      {name}
                      <X size={14} />
                    </button>
                  ))}

                  <button
                    type="button"
                    className="ddi-clear"
                    onClick={() => {
                      setSelectedDrugs([]);
                      setDrugError("");
                    }}
                  >
                    <Trash2 size={14} />
                    Xóa danh sách
                  </button>
                </div>
              )}

              <p className="ddi-help-text">
                Kết quả dựa trên các cặp hoạt chất có
                tên khớp trong QĐ 5948. Chưa bao phủ
                tự động toàn bộ tương tác theo nhóm,
                biệt dược, thuốc phối hợp và điều kiện
                lâm sàng.
              </p>
            </>
          )}

          {/* THÔNG TIN DANH MỤC */}
          <div className="ddi-source">
            <Info size={20} />

            <span>
              Danh mục gồm{" "}
              <strong>{data.length || 701} bản ghi</strong>
              {" "}({substanceCount || 633} theo hoạt chất,
              {" "}{groupCount || 68} theo nhóm dược lý)
              theo Quyết định 5948/QĐ-BYT ngày 30/12/2021.
            </span>
          </div>

          {/* KẾT QUẢ */}
          {loading ? (
            <div className="ddi-empty">
              <FileSearch size={49} />

              <h3>Đang tải dữ liệu...</h3>
            </div>
          ) : error ? (
            <div className="ddi-error">
              <AlertTriangle size={19} />
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="ddi-empty">
              <div className="ddi-empty-icon">
                <FileSearch size={51} strokeWidth={1.5} />
              </div>

              <h3>
                {isInitialSearch
                  ? "Nhập từ khóa để bắt đầu tra cứu"
                  : isInitialCheck
                  ? "Chọn ít nhất hai hoạt chất"
                  : "Không tìm thấy kết quả phù hợp"}
              </h3>

              <p>
                {isInitialSearch
                  ? 'Ví dụ: "warfarin", "ciprofloxacin", "amiodaron"...'
                  : isInitialCheck
                  ? "Thêm các hoạt chất cần kiểm tra."
                  : "Không có kết quả không đồng nghĩa phối hợp thuốc an toàn."}
              </p>
            </div>
          ) : (
            <div className="ddi-results">
              <div className="ddi-results-title">
                <strong>
                  Danh sách tương tác
                </strong>

                <span>
                  {results.length} bản ghi
                  {" · "}Hiển thị{" "}
                  {Math.min(limit, results.length)}
                </span>
              </div>

              {results.slice(0, limit).map((row) => (
                <article
                  className="ddi-result-card"
                  key={row.id || `${row.type}-${row.stt}`}
                >
                  <div className="ddi-result-content">
                    <div className="ddi-result-meta">
                      {row.type === "substance"
                        ? "Theo hoạt chất"
                        : "Theo nhóm dược lý"}
                      {" · STT "}
                      {row.stt}
                    </div>

                    <h3>
                      {row.drug1}
                      <span> + </span>
                      {row.drug2}
                    </h3>

                    <p>
                      <strong>Hậu quả lâm sàng: </strong>
                      {row.consequence}
                    </p>

                    <p>
                      <strong>Hướng xử trí: </strong>
                      {row.management.length > 220
                        ? row.management.slice(0, 220) + "..."
                        : row.management}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="ddi-detail"
                    onClick={() => setSelected(row)}
                  >
                    Xem chi tiết
                    <ArrowRight size={16} />
                  </button>
                </article>
              ))}

              {results.length > limit && (
                <button
                  type="button"
                  className="ddi-more"
                  onClick={() =>
                    setLimit((old) => old + 20)
                  }
                >
                  Xem thêm 20 kết quả
                </button>
              )}
            </div>
          )}
        </section>

        <div className="ddi-bottom">
          <span>
            Nguồn: Bộ Y tế – QĐ 5948/QĐ-BYT
            ngày 30/12/2021
          </span>

          <span>
            Nội dung hỗ trợ chuyên môn, không
            thay thế đánh giá lâm sàng.
          </span>
        </div>
      </div>

      {/* CỬA SỔ CHI TIẾT TƯƠNG TÁC */}
      {selected && (
        <div
          className="ddi-overlay"
          onClick={() => setSelected(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Chi tiết tương tác thuốc"
            className="ddi-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ddi-modal-header">
              <div>
                <span>
                  QĐ 5948/QĐ-BYT · STT {selected.stt}
                </span>

                <h2>
                  {selected.drug1} + {selected.drug2}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Đóng"
              >
                <X size={21} />
              </button>
            </div>

            <div className="ddi-modal-section">
              <h3>Cơ chế tương tác</h3>
              <p>{selected.mechanism}</p>
            </div>

            <div className="ddi-modal-section">
              <h3>Hậu quả lâm sàng</h3>
              <p>{selected.consequence}</p>
            </div>

            <div className="ddi-modal-section">
              <h3>Hướng xử trí theo Quyết định 5948</h3>
              <p>{selected.management}</p>
            </div>

            <div className="ddi-modal-source">
              <BookOpen size={18} />

              <span>
                Nguồn: Quyết định 5948/QĐ-BYT
                ngày 30/12/2021 của Bộ Y tế.
                Cần xác minh điều kiện chống chỉ định
                trước khi áp dụng cho người bệnh.
              </span>
            </div>

            {pdfReady ? (
              <a
                className="ddi-pdf"
                href={`${PDF_URL}#page=${selected.page}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={17} />
                Xem tài liệu gốc · Trang {selected.page}
              </a>
            ) : (
              <p className="ddi-pdf-missing">
                Để mở tài liệu gốc, đặt PDF tại
                public/docs/qd5948.pdf.
              </p>
            )}
          </section>
        </div>
      )}

      {/* CSS TRỌN BỘ – KHÔNG CẦN FILE RIÊNG */}
      <style>{`
        .ddi-page {
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          background: #f8fbfe;
          color: #10213b;
          padding: 24px 28px 34px;
          font-family: Arial, Helvetica, sans-serif;
        }

        .ddi-container {
          max-width: 1460px;
          margin: 0 auto;
        }

        .ddi-breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 11px;
          color: #607796;
          font-size: 13px;
          margin-bottom: 22px;
        }

        .ddi-breadcrumb a {
          display: flex;
          color: #075985;
          text-decoration: none;
        }

        .ddi-breadcrumb strong {
          color: #10213b;
          font-weight: 700;
        }

        /* BIỂU TƯỢNG ĐÃ THU NHỎ */
        .ddi-heading {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .ddi-heading-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dfefff;
          border-radius: 12px;
          color: #075985;
        }

        .ddi-heading-icon svg {
          width: 25px;
          height: 25px;
        }

        .ddi-heading-text h1 {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #071b3b;
          margin: 0 0 7px;
          line-height: 1.3;
        }

        .ddi-heading-text p {
          margin: 0;
          color: #607796;
          font-size: 13px;
          line-height: 1.6;
        }

        /* TABS */
        .ddi-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 15px;
        }

        .ddi-tabs button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 46px;
          padding: 0 22px;
          background: #ffffff;
          border: 1px solid #dce6f0;
          border-radius: 9px;
          color: #10213b;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
        }

        .ddi-tabs button.active {
          background: #07558e;
          border-color: #07558e;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(7,85,142,.12);
        }

        /* KHUNG TRA CỨU */
        .ddi-workspace {
          background: #fff;
          border: 1px solid #e0e8f1;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(20,58,90,.035);
        }

        .ddi-search-row {
          display: grid;
          grid-template-columns:
            minmax(0,1fr) 260px 145px;
          gap: 13px;
          align-items: stretch;
        }

        .ddi-input-wrap,
        .ddi-select-wrap {
          min-height: 49px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 15px;
          background: #fff;
          border: 1px solid #d2dfef;
          border-radius: 10px;
          box-sizing: border-box;
          color: #6481a4;
        }

        .ddi-input-wrap:focus-within,
        .ddi-select-wrap:focus-within {
          border-color: #2886bc;
          box-shadow: 0 0 0 3px rgba(40,134,188,.1);
        }

        .ddi-input-wrap input {
          border: 0;
          outline: 0;
          width: 100%;
          min-width: 0;
          background: transparent;
          color: #10213b;
          font-size: 14px;
        }

        .ddi-input-wrap input::placeholder {
          color: #7d94b3;
        }

        .ddi-select-wrap select {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #123154;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .ddi-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 49px;
          padding: 0 15px;
          color: #fff;
          background: #07558e;
          border: 1px solid #07558e;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 700;
          font-size: 13px;
        }

        .ddi-submit:hover {
          background: #03456f;
        }

        .ddi-search-actions {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-top: 12px;
        }

        .ddi-search-actions p {
          color: #65809e;
          margin: 0;
          line-height: 1.6;
          font-size: 12px;
        }

        .ddi-search-actions > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ddi-text-button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: 0;
          color: #07558e;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .ddi-text-button:hover {
          text-decoration: underline;
        }

        /* THÔNG TIN NGUỒN */
        .ddi-source {
          min-height: 47px;
          display: flex;
          align-items: center;
          gap: 13px;
          box-sizing: border-box;
          margin: 18px 0 15px;
          padding: 12px 16px;
          background: #eaf5ff;
          border: 1px solid #c8e4ff;
          border-radius: 9px;
          color: #416b98;
          font-size: 12px;
          line-height: 1.7;
        }

        .ddi-source svg {
          color: #1684e0;
          flex-shrink: 0;
        }

        .ddi-source strong {
          color: #07558e;
        }

        /* TRẠNG THÁI CHƯA TRA CỨU */
        .ddi-empty {
          min-height: 290px;
          padding: 30px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          color: #07558e;
          border: 1px solid #dae7f3;
          border-radius: 10px;
          background:
            linear-gradient(160deg,#f8fcff,#f3f9ff);
        }

        .ddi-empty-icon {
          width: 84px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e6f4ff;
          border-radius: 18px;
          color: #07558e;
          margin-bottom: 6px;
        }

        .ddi-empty h3 {
          margin: 0;
          color: #071b3b;
          font-size: 19px;
          font-weight: 800;
        }

        .ddi-empty p {
          margin: 0;
          color: #7189a9;
          font-size: 13px;
          line-height: 1.7;
        }

        /* KIỂM TRA NHIỀU THUỐC */
        .ddi-check-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 14px;
          margin-bottom: 13px;
        }

        .ddi-check-heading span {
          color: #7389a4;
          font-size: 12px;
        }

        .ddi-add-row {
          display: grid;
          grid-template-columns: minmax(0,1fr) 120px;
          gap: 12px;
        }

        .ddi-suggestions {
          margin-top: 7px;
          max-height: 210px;
          overflow-y: auto;
          border: 1px solid #e1e9f2;
          border-radius: 9px;
        }

        .ddi-suggestions button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 14px;
          border: 0;
          border-bottom: 1px solid #edf2f7;
          background: white;
          text-align: left;
          cursor: pointer;
          color: #123154;
          font-size: 13px;
        }

        .ddi-suggestions button:hover {
          background: #f0f8ff;
        }

        .ddi-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 13px;
        }

        .ddi-chips button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          color: #07558e;
          background: #e5f4ff;
          border: 1px solid #b8dcf7;
          border-radius: 9px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        .ddi-chips button.ddi-clear {
          color: #52647d;
          background: #fff;
          border-color: #d9e4ed;
        }

        .ddi-help-text {
          margin: 13px 0 0;
          color: #65809e;
          font-size: 12px;
          line-height: 1.7;
        }

        .ddi-drug-error {
          color: #9a3412;
          background: #fff7ed;
          border-radius: 8px;
          padding: 10px;
          font-size: 12px;
        }

        .ddi-error {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 22px;
          background: #fff7ed;
          border-radius: 10px;
          color: #9a3412;
          font-size: 13px;
        }

        /* DANH SÁCH KẾT QUẢ */
        .ddi-results {
          display: grid;
          gap: 11px;
        }

        .ddi-results-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          padding: 5px 0;
        }

        .ddi-results-title strong {
          color: #10213b;
          font-size: 15px;
        }

        .ddi-results-title span {
          color: #7087a3;
          font-size: 12px;
        }

        .ddi-result-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 15px;
          padding: 17px;
          background: #fff;
          border: 1px solid #dce7f2;
          border-radius: 11px;
        }

        .ddi-result-content {
          flex: 1 1 350px;
          min-width: 0;
        }

        .ddi-result-meta {
          color: #7489a4;
          font-size: 11px;
          font-weight: 600;
        }

        .ddi-result-card h3 {
          color: #0b2c51;
          font-size: 17px;
          margin: 9px 0 12px;
          line-height: 1.5;
        }

        .ddi-result-card h3 span {
          color: #8da5bf;
        }

        .ddi-result-card p {
          color: #526a84;
          font-size: 13px;
          margin: 8px 0 0;
          line-height: 1.75;
        }

        .ddi-result-card p strong {
          color: #123154;
        }

        .ddi-detail {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 13px;
          background: #fff;
          border: 1px solid #cbdceb;
          border-radius: 9px;
          color: #07558e;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .ddi-more {
          padding: 13px;
          border: 1px solid #d8e5f1;
          border-radius: 10px;
          background: #fff;
          color: #07558e;
          font-weight: 700;
          cursor: pointer;
        }

        /* CHI TIẾT */
        .ddi-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(8,23,43,.6);
        }

        .ddi-modal {
          width: min(760px,100%);
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          box-sizing: border-box;
          background: #fff;
          border-radius: 16px;
          color: #10213b;
        }

        .ddi-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .ddi-modal-header span {
          color: #7087a3;
          font-size: 12px;
        }

        .ddi-modal-header h2 {
          margin: 10px 0 0;
          font-size: 21px;
          line-height: 1.5;
        }

        .ddi-modal-header button {
          padding: 9px;
          border: 1px solid #d8e5f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
        }

        .ddi-modal-section {
          padding: 17px 0;
          border-bottom: 1px solid #e5edf3;
        }

        .ddi-modal-section h3 {
          margin: 0 0 8px;
          color: #07558e;
          font-size: 14px;
        }

        .ddi-modal-section p {
          margin: 0;
          color: #334155;
          font-size: 14px;
          line-height: 1.85;
          white-space: pre-wrap;
        }

        .ddi-modal-source {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px;
          margin-top: 16px;
          background: #f2f7fc;
          border-radius: 9px;
          color: #526a84;
          font-size: 12px;
          line-height: 1.8;
        }

        .ddi-pdf {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-top: 15px;
          padding: 12px 16px;
          color: #fff;
          background: #07558e;
          border-radius: 9px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
        }

        .ddi-pdf-missing {
          color: #9a3412;
          font-size: 12px;
          margin-top: 15px;
        }

        /* NGUỒN Ở CUỐI TRANG */
        .ddi-bottom {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
          padding-top: 14px;
          border-top: 1px solid #e3eaf2;
          color: #7083a1;
          font-size: 11px;
          line-height: 1.7;
        }

        /* RESPONSIVE */
        @media(max-width: 1050px) {
          .ddi-search-row {
            grid-template-columns: minmax(0,1fr) 210px;
          }

          .ddi-search-row .ddi-submit {
            grid-column: 1 / -1;
          }
        }

        @media(max-width: 650px) {
          .ddi-page {
            padding: 16px 12px 28px;
          }

          .ddi-heading {
            gap: 12px;
            align-items: flex-start;
          }

          .ddi-heading-icon {
            width: 44px;
            height: 44px;
            min-width: 44px;
          }

          .ddi-heading-icon svg {
            width: 23px;
            height: 23px;
          }

          .ddi-heading-text h1 {
            font-size: 23px;
          }

          .ddi-heading-text p {
            font-size: 12px;
          }

          .ddi-tabs button {
            flex: 1 1 auto;
            padding: 0 12px;
            font-size: 12px;
          }

          .ddi-workspace {
            padding: 12px;
          }

          .ddi-search-row,
          .ddi-add-row {
            grid-template-columns: 1fr;
          }

          .ddi-search-row .ddi-submit {
            grid-column: auto;
          }

          .ddi-empty {
            min-height: 240px;
          }

          .ddi-empty h3 {
            font-size: 16px;
          }

          .ddi-empty p {
            font-size: 12px;
          }

          .ddi-modal {
            padding: 16px;
          }
        }
      `}</style>
    </main>
  );
}
