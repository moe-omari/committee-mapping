import Link from "next/link";

import type { SiteData } from "../lib/committee-data";
import { PageShell } from "./page-shell";

type SiteDirectoryProps = {
  sites: SiteData[];
};

export function SiteDirectory({ sites }: SiteDirectoryProps) {
  const sitesByLocation = Map.groupBy(sites, (site) => site.location);
  const orderedLocations = Array.from(sitesByLocation.keys()).sort((left, right) =>
    left.localeCompare(right, "ar"),
  );

  return (
    <PageShell
      eyebrow="دليل اللجان للسكان"
      title="اختَر اسم الموقع وافتح صفحته مباشرة"
      description="لكل موقع رابط مستقل. افتح اسم الموقع للوصول مباشرة إلى صفحة اللجان الخاصة به بدون أي قوائم منسدلة."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {orderedLocations.map((location) => {
          const locationSites = sitesByLocation.get(location) ?? [];

          return (
            <section
              key={location}
              className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 text-right shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{location}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {locationSites.length} موقع
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {locationSites.map((site) => (
                  <Link
                    key={site.slug}
                    href={`/sites/${site.slug}`}
                    className="group rounded-[1.25rem] border border-[var(--line)] bg-[linear-gradient(135deg,#ffffff,var(--brand-soft))] px-4 py-4 transition hover:border-[#1b1464] hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 transition group-hover:text-[#1b1464]">
                          {site.siteName}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {site.committees.length} لجنة
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[var(--brand-text)]">
                        افتح الصفحة
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}