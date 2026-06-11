import fs from "node:fs/promises";
import path from "node:path";
import * as XLSX from "xlsx";
import { slugify } from "transliteration";

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
  slug: string;
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

function slugifySiteName(siteName: string) {
  const slug = slugify(siteName, {
    lowercase: true,
    separator: "-",
  });

  return slug || "site";
}

function buildSlug(siteName: string) {
  return slugifySiteName(siteName);
}

function normalizeIncomingSlug(slug: string) {
  try {
    return decodeURIComponent(slug).trim().toLowerCase().normalize("NFKC");
  } catch {
    return slug.trim().toLowerCase().normalize("NFKC");
  }
}

export async function loadSites(): Promise<SiteData[]> {
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

  const slugCounts = new Map<string, number>();

  return Array.from(siteMap.values())
    .sort((left, right) => {
      return (
        left.location.localeCompare(right.location, "ar") ||
        left.siteName.localeCompare(right.siteName, "ar")
      );
    })
    .map((site) => {
      const baseSlug = buildSlug(site.siteName);
      const existingCount = slugCounts.get(baseSlug) ?? 0;
      const nextCount = existingCount + 1;

      slugCounts.set(baseSlug, nextCount);

      return {
        slug: existingCount === 0 ? baseSlug : `${baseSlug}-${nextCount}`,
        location: site.location,
        siteName: site.siteName,
        committees: Array.from(site.committees.entries()).map(([name, members]) => ({
          name,
          members,
        })),
      };
    });
}

export async function loadSiteBySlug(slug: string) {
  const sites = await loadSites();
  const normalizedSlug = normalizeIncomingSlug(slug);

  return sites.find((site) => site.slug === normalizedSlug);
}