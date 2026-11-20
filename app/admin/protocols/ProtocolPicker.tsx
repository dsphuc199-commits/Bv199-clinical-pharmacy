"use client";

import { useState } from "react";

type DiseaseOption = { id: string; title: string; specialty: string };

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}

export default function ProtocolPicker({ diseases, currentId }: { diseases: DiseaseOption[]; currentId: string }) {
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState(currentId);
  const term = normalize(query.trim());
  const matches = diseases.filter((disease) => normalize(`${disease.title} ${disease.specialty}`).includes(term));
  const selected = matches.some((disease) => disease.id === selection) ? selection : matches[0]?.id ?? "";
  const groups = new Map<string, DiseaseOption[]>();
  for (const disease of matches) {
    const group = groups.get(disease.specialty) ?? [];
    group.push(disease);
    groups.set(disease.specialty, group);
  }

  return (
    <form action="/admin/protocols" className="flex flex-wrap items-end gap-3">
      <label className="grid min-w-44 flex-1 gap-1 text-sm font-semibold">
        Tìm theo tên bệnh hoặc chuyên khoa
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 font-normal" />
      </label>
      <label className="grid min-w-56 flex-1 gap-1 text-sm font-semibold">
        Bệnh cảnh
        <select name="disease" value={selected} onChange={(event) => setSelection(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" disabled={!selected}>
          {!selected && <option value="">Không tìm thấy bệnh cảnh</option>}
          {[...groups].map(([specialty, group]) => (
            <optgroup label={specialty} key={specialty}>
              {group.map(({ id, title }) => <option value={id} key={id}>{title}</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <button className="rounded-lg bg-teal-800 px-4 py-2 font-semibold text-white disabled:opacity-50" disabled={!selected}>
        Chọn bệnh cảnh
      </button>
    </form>
  );
}
