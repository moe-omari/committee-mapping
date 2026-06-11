import Image from "next/image";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1b1464] px-6">
      <Image
        src="/logo-acted-blanc.png"
        alt="ACTED"
        width={240}
        height={90}
        className="h-auto w-40 sm:w-52 md:w-60"
        priority
      />
    </main>
  );
}
