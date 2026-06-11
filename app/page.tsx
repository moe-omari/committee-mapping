import { loadSites } from "./lib/committee-data";
import { SiteDirectory } from "./ui/site-directory";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sites = await loadSites();

  return <SiteDirectory sites={sites} />;
}
