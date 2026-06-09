import fs from "node:fs/promises";
import path from "node:path";
import * as XLSX from "xlsx";

import { CommitteeBrowser } from "./ui/committee-browser";

export const dynamic = "force-dynamic";

type WorkbookRow = {
  location?: string;
  "site name"?: string;
  Committee?: string;
  name?: string;
};

export type CommitteeMember = {
  name: string;
};

export type SiteData = {
  location: string;
  siteName: string;
  committees: Array<{
    name: string;
    members: CommitteeMember[];
  }>;
};

const workbookPath = path.join(
  process.cwd(),
  "public",
  "gny committee mapping.xlsx",
);

async function loadSites(): Promise<SiteData[]> {
  const fileBuffer = await fs.readFile(workbookPath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return [];
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<WorkbookRow>(sheet, {
    defval: "",
  });

  const siteMap = new Map<
    string,
    {
      location: string;
      siteName: string;
      committees: Map<string, CommitteeMember[]>;
    }
  >();

  for (const row of rows) {
    const location = row.location?.trim();
    const siteName = row["site name"]?.trim();
    const committeeName = row.Committee?.trim();
    const memberName = row.name?.trim();

    if (!location || !siteName || !committeeName || !memberName) {
      continue;
    }

    const siteKey = `${location}::${siteName}`;
    const siteEntry =
      siteMap.get(siteKey) ??
      {
        location,
        siteName,
        committees: new Map<string, CommitteeMember[]>(),
      };

    const committeeMembers = siteEntry.committees.get(committeeName) ?? [];
    committeeMembers.push({
      name: memberName,
    });
    siteEntry.committees.set(committeeName, committeeMembers);
    siteMap.set(siteKey, siteEntry);
  }

  return Array.from(siteMap.values())
    .sort((left, right) => {
      return (
        left.location.localeCompare(right.location, "ar") ||
        left.siteName.localeCompare(right.siteName, "ar")
      );
    })
    .map((site) => ({
      location: site.location,
      siteName: site.siteName,
      committees: Array.from(site.committees.entries()).map(([name, members]) => ({
        name,
        members,
      })),
    }));
}

export default async function Home() {
  const sites = await loadSites();

  return <CommitteeBrowser sites={sites} />;
}
