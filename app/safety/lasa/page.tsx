"use client";

import { useMemo, useState } from "react";
import { lasaPairs } from "@/data/safety/lasa";

type FilterType =
  | "all"
  | "look-alike"
  | "sound-alike"
  | "look-and-sound-alike"
  | "same-name-strength"
  | "same-name-form";

const filterOptions: {
  id: FilterType;
  label: string;
}[] = [
  {
    id: "all",
    label: "Tất cả",
  },
  {
    id: "look-alike",
    label: "Look Alike",
  },
  {
    id: "sound-alike",
    label: "Sound Alike",
  },
  {
    id: "look-and-sound-alike",
    label: "LASA",
  },
  {
    id: "same-name-strength",
    label: "Khác hàm lượng",
  },
  {
    id: "same-name-form",
    label: "Khác dạng bào chế",
  },
];

function formatDrugId(id: string) {
  return id
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function formatLASAType(type: string) {
  switch (type) {
    case "look-alike":
      return "LOOK ALIKE";

    case "sound-alike":
      return "SOUND ALIKE";

    case "look-and-sound-alike":
      return "LASA";

    case "same-name-strength":
      return "KHÁC HÀM LƯỢNG";

    case "same-name-form":
      return "KHÁC DẠNG BÀO CHẾ";

    default:
      return type;
  }
}

export default function LASAPage() {
  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<FilterType>("all");

  const filteredPairs =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return lasaPairs.filter(
        (pair) => {
          const matchesType =
            filter === "all" ||
            pair.type === filter;

          const searchableText =
            [
              pair.drugAId,
              pair.drugBId,
              pair.type,
              ...pair.reasons,
            ]
              .join(" ")
              .toLowerCase();

          const matchesSearch =
            !keyword ||
            searchableText.includes(
              keyword
            );

          return (
            pair.active &&
            matchesType &&
            matchesSearch
          );
        }
      );
    }, [
      search,
      filter,
    ]);

  return (
    <div className="clinical-page">

      <section className="clinical-page-header">

        <span className="clinical-eyebrow">
          AN TOÀN THUỐC
        </span>

        <h1>
          LASA – Bệnh viện 199
        </h1>

        <p>
          Tra cứu các cặp thuốc có nguy cơ
          nhầm lẫn về tên, hình thức,
          hàm lượng hoặc dạng bào chế.
        </p>

      </section>


      <section className="clinical-section">

        <div className="clinical-search-box">

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Tìm tên thuốc hoặc cặp LASA..."
          />

        </div>


        <div className="clinical-filter-row">

          {filterOptions.map(
            (item) => (

              <button
                key={item.id}
                type="button"
                className={
                  filter === item.id
                    ? "clinical-filter active"
                    : "clinical-filter"
                }
                onClick={() =>
                  setFilter(item.id)
                }
              >
                {item.label}
              </button>

            )
          )}

        </div>

      </section>


      <section className="clinical-section">

        <div className="clinical-section-heading">

          <span>
            DANH MỤC LASA
          </span>

          <h2>
            Các cặp thuốc cần lưu ý
          </h2>

          <p>
            {filteredPairs.length}
            {" "}cặp đang hiển thị
          </p>

        </div>


        <div className="lasa-grid">

          {filteredPairs.map(
            (pair) => (

              <article
                key={pair.id}
                className="lasa-card"
              >

                <div className="lasa-card-top">

                  <span className="lasa-badge">
                    {formatLASAType(
                      pair.type
                    )}
                  </span>

                </div>


                <div className="lasa-pair">

                  <div className="lasa-drug">

                    <span>
                      THUỐC A
                    </span>

                    <strong>
                      {formatDrugId(
                        pair.drugAId
                      )}
                    </strong>

                  </div>


                  <div className="lasa-arrow">
                    ↔
                  </div>


                  <div className="lasa-drug">

                    <span>
                      THUỐC B
                    </span>

                    <strong>
                      {formatDrugId(
                        pair.drugBId
                      )}
                    </strong>

                  </div>

                </div>


                <div className="lasa-detail">

                  <h3>
                    Nguy cơ nhầm lẫn
                  </h3>

                  <ul>
                    {pair.reasons.map(
                      (reason) => (
                        <li key={reason}>
                          {reason}
                        </li>
                      )
                    )}
                  </ul>

                </div>


                <div className="lasa-detail lasa-prevention">

                  <h3>
                    Biện pháp phòng ngừa
                  </h3>

                  <ul>
                    {pair.prevention.map(
                      (item) => (
                        <li key={item}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                </div>

              </article>

            )
          )}

        </div>

      </section>

    </div>
  );
}