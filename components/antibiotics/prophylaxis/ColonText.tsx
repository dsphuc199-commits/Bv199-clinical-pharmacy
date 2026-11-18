/* Trinh bay cau co dau hai cham: phan truoc dau hai cham mot dong, noi dung xuong dong.
   Chi doi cach ngat dong va viet hoa chu dau dong, khong doi noi dung.
   Dau hai cham nam giua cau dai hoac trong ngoac: giu nguyen ca cau. */
const upperFirst = (s: string) => s.charAt(0).toLocaleUpperCase("vi") + s.slice(1);
const MAX_LABEL = 60;

export default function ColonText({ text }: { text: string }) {
  const cut = text.indexOf(": ");
  const label = cut > 0 ? text.slice(0, cut) : "";
  if (!label || label.length > MAX_LABEL || /[.(]/.test(label)) return <>{text}</>;
  const lines = text.slice(cut + 2).split(/;\s+/).map((l) => l.trim()).filter(Boolean);
  return (
    <span className="ksdp-colon">
      <b>{label}:</b>
      {lines.map((l) => <span key={l}>{upperFirst(l)}</span>)}
    </span>
  );
}
