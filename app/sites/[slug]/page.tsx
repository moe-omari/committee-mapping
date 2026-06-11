import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { loadSiteBySlug } from "../../lib/committee-data";
import { SiteDetails } from "../../ui/site-details";

export const dynamic = "force-dynamic";

type SitePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = await loadSiteBySlug(slug);

  if (!site) {
    return {
      title: "الموقع غير موجود",
    };
  }

  return {
    title: `${site.siteName} | دليل اللجان`,
    description: `صفحة لجان موقع ${site.siteName} في ${site.location}.`,
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const { slug } = await params;
  const site = await loadSiteBySlug(slug);

  if (!site) {
    notFound();
  }

  return <SiteDetails site={site} />;
}