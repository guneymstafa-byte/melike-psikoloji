'use client';

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF7F2] p-6 text-center text-[#192923]">
      <h1 className="text-2xl font-semibold">Sayfa yüklenirken bir sorun oluştu</h1>
      <p>Lütfen bağlantınızı kontrol edip tekrar deneyin.</p>
      <button onClick={retry} className="rounded-xl bg-[#446A5E] px-5 py-3 text-white">Tekrar dene</button>
      <a href="/" className="underline">Ana sayfaya dön</a>
    </main>
  );
}
