import Image from "next/image";

type PageShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children: React.ReactNode;
};

export function PageShell({ title, description, eyebrow, children }: PageShellProps) {
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
              {eyebrow ? (
                <span className="inline-flex w-fit rounded-full bg-[rgba(27,20,100,0.12)] px-3 py-1 text-sm font-medium text-[#1b1464]">
                  {eyebrow}
                </span>
              ) : null}
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                {description}
              </p>
            </div>

            {children}
          </div>
        </section>
      </main>
    </div>
  );
}

export function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 text-right shadow-sm">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}