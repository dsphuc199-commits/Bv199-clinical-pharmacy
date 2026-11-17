import EntDiseasePage from "@/components/ent/EntDiseasePage";
import { getDisease } from "@/data/ent";

export const dynamic = "force-static";
export const metadata = { title: `${getDisease("gas-pharyngitis")!.title} – BV199` };

export default function Page() {
  return <EntDiseasePage id="gas-pharyngitis" />;
}
