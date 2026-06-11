import type { SiteData } from "../lib/committee-data";
import { PageShell, SummaryCard } from "./page-shell";

type SiteDetailsProps = {
  site: SiteData;
};

export function SiteDetails({ site }: SiteDetailsProps) {
  const totalMembers = site.committees.reduce((sum, committee) => {
    return sum + committee.members.length;
  }, 0);

  return (
    <PageShell
      eyebrow={site.location}
      siteCode={site.siteCode}
      title={site.siteName}
      description="هذه صفحة مستقلة لهذا الموقع فقط. يمكنك مشاركة الرابط مباشرة مع السكان لفتح بيانات اللجان والأعضاء لهذا الموقع."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="المنطقة" value={site.location} />
        <SummaryCard label="عدد اللجان" value={String(site.committees.length)} />
        <SummaryCard label="عدد الأعضاء" value={String(totalMembers)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {site.committees.map((committee) => (
          <article
            key={committee.name}
            className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 text-right shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{committee.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">أعضاء اللجنة في هذا الموقع</p>
              </div>
              <div className="rounded-full bg-[linear-gradient(135deg,var(--brand-soft-strong),var(--brand-soft))] px-3 py-1 text-sm font-medium text-[var(--brand-text)]">
                {committee.members.length} عضو
              </div>
            </div>

            <ul className="space-y-3">
              {committee.members.map((member, index) => (
                <li
                  key={`${committee.name}-${member.name}-${index}`}
                  className="rounded-2xl bg-[linear-gradient(135deg,#ffffff,var(--brand-soft))] px-4 py-3"
                >
                  <span className="block text-base font-medium text-slate-900">
                    {member.name}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </PageShell>
  );
}