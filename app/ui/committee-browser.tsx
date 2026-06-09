"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type { SiteData } from "../page";

type CommitteeBrowserProps = {
  sites: SiteData[];
};

export function CommitteeBrowser({ sites }: CommitteeBrowserProps) {
  const locations = useMemo(() => {
    return Array.from(new Set(sites.map((site) => site.location))).sort((left, right) =>
      left.localeCompare(right, "ar"),
    );
  }, [sites]);

  const [selectedLocation, setSelectedLocation] = useState("");
  const activeLocation = locations.includes(selectedLocation) ? selectedLocation : "";

  const visibleSites = useMemo(() => {
    if (!activeLocation) {
      return [];
    }

    return sites.filter((site) => site.location === activeLocation);
  }, [activeLocation, sites]);

  const [selectedSiteName, setSelectedSiteName] = useState("");
  const activeSiteName = visibleSites.some((site) => site.siteName === selectedSiteName)
    ? selectedSiteName
    : "";

  const selectedSite = visibleSites.find((site) => site.siteName === activeSiteName);
  const totalMembers = selectedSite?.committees.reduce((sum, committee) => {
    return sum + committee.members.length;
  }, 0);

  return (
    <div className="min-h-screen w-full" dir="rtl">
      <header className="w-full bg-[#1b1464] text-white shadow-[0_14px_35px_rgba(27,20,100,0.35)]">
        <div className="grid min-h-20 w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-4 sm:px-6 lg:px-8">
          <div className="justify-self-start">
            <Image
              src="/logo-acted-blanc.png"
              alt="ACTED"
              width={168}
              height={63}
              className="h-auto w-28 sm:w-36"
              priority
            />
          </div>
          <h1 className="text-center text-lg font-semibold tracking-tight sm:text-2xl">
            دليل لجان المواقع
          </h1>
          <div className="justify-self-end text-base font-semibold tracking-[0.18em] sm:text-xl">
            12GNY
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] px-5 py-6 shadow-[var(--shadow)] backdrop-blur sm:px-8 sm:py-8">
          <div className="relative flex flex-col gap-6">
          <div className="space-y-3 text-right">
            <span className="inline-flex w-fit rounded-full bg-[rgba(27,20,100,0.12)] px-3 py-1 text-sm font-medium text-[#1b1464]">
              دليل اللجان للسكان
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              ابحث عن لجان موقعك بسهولة
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              اختر المنطقة ثم اسم الموقع لعرض اللجان الموجودة وأسماء الأعضاء داخل كل لجنة بطريقة واضحة وسريعة على الهاتف.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 text-right shadow-sm">
              <span className="mb-2 block text-sm font-medium text-[var(--muted)]">
                المنطقة
              </span>
              <select
                value={activeLocation}
                onChange={(event) => {
                  const nextLocation = event.target.value;

                  setSelectedLocation(nextLocation);
                  setSelectedSiteName("");
                }}
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[#1b1464] focus:bg-white"
                dir="rtl"
              >
                <option value="">اختر المنطقة</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </label>

            <label className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 text-right shadow-sm">
              <span className="mb-2 block text-sm font-medium text-[var(--muted)]">
                اسم الموقع
              </span>
              <select
                value={activeSiteName}
                onChange={(event) => setSelectedSiteName(event.target.value)}
                disabled={!activeLocation}
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[#1b1464] focus:bg-white"
                dir="rtl"
              >
                <option value="">اختر اسم الموقع</option>
                {visibleSites.map((site) => (
                  <option key={site.siteName} value={site.siteName}>
                    {site.siteName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedSite ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <SummaryCard label="المنطقة" value={selectedSite.location} />
                <SummaryCard label="عدد اللجان" value={String(selectedSite.committees.length)} />
                <SummaryCard label="عدد الأعضاء" value={String(totalMembers ?? 0)} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {selectedSite.committees.map((committee) => (
                  <article
                    key={committee.name}
                    className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 text-right shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                          {committee.name}
                        </h2>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          أعضاء اللجنة في هذا الموقع
                        </p>
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
            </>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[var(--line)] bg-white/50 p-6 text-center text-[var(--muted)]">
              اختر المنطقة واسم الموقع لعرض بيانات اللجان.
            </div>
          )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 text-right shadow-sm">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}