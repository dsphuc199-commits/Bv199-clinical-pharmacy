"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  PKPDModule,
} from "@/lib/types/pkpd";

import {
  getPKPDSource,
} from "@/data/pkpd/sources";

type Props = {
  module: PKPDModule;
};

type Tab =
  | "overview"
  | "lecture"
  | "evidence"
  | "application"
  | "quiz";

export default function PKPDModuleView({
  module,
}: Props) {

  const [
    activeTab,
    setActiveTab,
  ] = useState<Tab>("overview");

  const references =
    useMemo(() => {

      return module.references
        .map((id) =>
          getPKPDSource(id)
        )
        .filter(Boolean);

    }, [module.references]);

  return (
    <div className="pkpd-learning-page">

      <section className="pkpd-learning-hero">

        <span className="pkpd-learning-eyebrow">
          PK/PD KHÁNG SINH
        </span>

        <h1>
          {module.title}
        </h1>

        <p>
          {module.description}
        </p>

        <div className="pkpd-keyword-list">

          {module.keywords.map(
            (keyword) => (
              <span key={keyword}>
                {keyword}
              </span>
            )
          )}

        </div>

      </section>

      <div className="pkpd-tabs">

        <button
          type="button"
          className={
            activeTab === "overview"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("overview")
          }
        >
          Tổng quan
        </button>

        <button
          type="button"
          className={
            activeTab === "lecture"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("lecture")
          }
        >
          Bài giảng gốc
        </button>

        <button
          type="button"
          className={
            activeTab === "evidence"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("evidence")
          }
        >
          Cập nhật bằng chứng
        </button>

        <button
          type="button"
          className={
            activeTab === "application"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("application")
          }
        >
          Hiểu & ứng dụng
        </button>

        <button
          type="button"
          className={
            activeTab === "quiz"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("quiz")
          }
        >
          Tự kiểm tra
        </button>

      </div>

      {activeTab === "overview" && (

        <section className="pkpd-tab-content">

          <div className="pkpd-section-heading">

            <span>
              MỤC TIÊU HỌC TẬP
            </span>

            <h2>
              Sau chuyên đề này cần nắm được
            </h2>

          </div>

          <div className="pkpd-objective-list">

            {module.objectives.map(
              (
                objective,
                index
              ) => (

                <div
                  key={objective}
                  className="pkpd-objective-item"
                >
                  <span>
                    {index + 1}
                  </span>

                  <p>
                    {objective}
                  </p>
                </div>

              )
            )}

          </div>

          {module.formulas &&
            module.formulas.length > 0 && (

              <>
                <div className="pkpd-section-heading pkpd-section-heading-space">

                  <span>
                    CHỈ SỐ PK/PD
                  </span>

                  <h2>
                    Công thức cần nắm
                  </h2>

                </div>

                <div className="pkpd-formula-grid">

                  {module.formulas.map(
                    (formula) => (

                      <article
                        key={formula.id}
                        className="pkpd-formula-card"
                      >
                        <span>
                          {formula.name}
                        </span>

                        <strong>
                          {formula.formula}
                        </strong>

                        <p>
                          {formula.interpretation}
                        </p>
                      </article>

                    )
                  )}

                </div>
              </>

            )}

        </section>

      )}

      {activeTab === "lecture" && (

        <section className="pkpd-tab-content">

          <div className="pkpd-verbatim-warning">

            <strong>
              Bài giảng gốc
            </strong>

            <span>
              Nội dung trong phần này được giữ nguyên câu chữ theo slide nguồn.
            </span>

          </div>

          {module.originalLecture ? (

            <div className="pkpd-lecture-list">

              {module.originalLecture.blocks.map(
                (block) => (

                  <article
                    key={block.id}
                    className="pkpd-lecture-card"
                  >

                    <div className="pkpd-lecture-meta">

                      <span>
                        {block.page
                          ? `Trang ${block.page}`
                          : "Slide"}
                      </span>

                      <small>
                        NGUYÊN VĂN
                      </small>

                    </div>

                    {block.heading && (
                      <h2>
                        {block.heading}
                      </h2>
                    )}

                    <div className="pkpd-verbatim-lines">

                      {block.lines.map(
                        (
                          line,
                          index
                        ) => (
                          <p
                            key={`${block.id}-${index}`}
                          >
                            {line}
                          </p>
                        )
                      )}

                    </div>

                  </article>

                )
              )}

            </div>

          ) : (
            <p>
              Chưa có dữ liệu bài giảng gốc.
            </p>
          )}

        </section>

      )}

      {activeTab === "evidence" && (

        <section className="pkpd-tab-content">

          <div className="pkpd-section-heading">

            <span>
              CẬP NHẬT BẰNG CHỨNG
            </span>

            <h2>
              Guideline & consensus
            </h2>

          </div>

          <div className="pkpd-evidence-list">

            {module.evidenceUpdates.map(
              (evidence) => (

                <article
                  key={evidence.id}
                  className="pkpd-evidence-card"
                >

                  <div className="pkpd-evidence-top">

                    <span>
                      {evidence.evidenceLevel}
                    </span>

                    <small>
                      Cập nhật {evidence.updatedAt}
                    </small>

                  </div>

                  {evidence.title && (
                    <h3>
                      {evidence.title}
                    </h3>
                  )}

                  <p>
                    {evidence.statement}
                  </p>

                  <div className="pkpd-evidence-sources">

                    {evidence.sourceIds.map(
                      (id) => {

                        const source =
                          getPKPDSource(id);

                        if (!source) {
                          return null;
                        }

                        return (
                          <span key={id}>
                            {source.shortTitle ??
                              source.title}
                          </span>
                        );
                      }
                    )}

                  </div>

                </article>

              )
            )}

          </div>

        </section>

      )}

      {activeTab === "application" && (

        <section className="pkpd-tab-content">

          <div className="pkpd-section-heading">

            <span>
              HIỂU & ỨNG DỤNG
            </span>

            <h2>
              Từ lý thuyết đến thực hành
            </h2>

          </div>

          <div className="pkpd-learning-grid">

            {module.learningPoints.map(
              (point) => (

                <article
                  key={point.id}
                  className="pkpd-learning-card"
                >

                  <h3>
                    {point.title}
                  </h3>

                  <p>
                    {point.explanation}
                  </p>

                  {point.clinicalMeaning && (

                    <div className="pkpd-clinical-meaning">

                      <strong>
                        Ý nghĩa
                      </strong>

                      <span>
                        {point.clinicalMeaning}
                      </span>

                    </div>

                  )}

                  {point.remember && (

                    <div className="pkpd-remember">

                      <strong>
                        Điểm cần nhớ
                      </strong>

                      <span>
                        {point.remember}
                      </span>

                    </div>

                  )}

                </article>

              )
            )}

          </div>

        </section>

      )}

      {activeTab === "quiz" && (

        <section className="pkpd-tab-content">

          <div className="pkpd-section-heading">

            <span>
              TỰ KIỂM TRA
            </span>

            <h2>
              Câu hỏi củng cố kiến thức
            </h2>

          </div>

          {module.quiz &&
          module.quiz.length > 0 ? (

            <div className="pkpd-quiz-list">

              {module.quiz.map(
                (
                  question,
                  index
                ) => (

                  <details
                    key={question.id}
                    className="pkpd-quiz-card"
                  >

                    <summary>
                      {index + 1}.{" "}
                      {question.question}
                    </summary>

                    <div className="pkpd-quiz-options">

                      {question.options.map(
                        (
                          option,
                          optionIndex
                        ) => (

                          <div key={option}>
                            {String.fromCharCode(
                              65 +
                                optionIndex
                            )}
                            . {option}
                          </div>

                        )
                      )}

                    </div>

                    <div className="pkpd-quiz-answer">

                      <strong>
                        Đáp án:{" "}
                        {String.fromCharCode(
                          65 +
                            question.answer
                        )}
                      </strong>

                      <p>
                        {question.explanation}
                      </p>

                    </div>

                  </details>

                )
              )}

            </div>

          ) : (
            <p>
              Chưa có câu hỏi tự kiểm tra.
            </p>
          )}

        </section>

      )}

      <section className="pkpd-reference-section">

        <div className="pkpd-section-heading">

          <span>
            TÀI LIỆU THAM KHẢO
          </span>

          <h2>
            Nguồn sử dụng
          </h2>

        </div>

        <div className="pkpd-reference-list">

          {references.map(
            (source) => {

              if (!source) {
                return null;
              }

              return (
                <div
                  key={source.id}
                  className="pkpd-reference-item"
                >

                  <strong>
                    {source.title}
                  </strong>

                  <span>
                    {source.organization
                      ?.join(" · ")}
                  </span>

                  <small>
                    {source.year}

                    {source.version
                      ? ` · ${source.version}`
                      : ""}
                  </small>

                </div>
              );
            }
          )}

        </div>

      </section>

    </div>
  );
}