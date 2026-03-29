import { ContatoContent } from "@/components/contato/ContatoContent";
import { Topbar } from "@/components/layout/Topbar";
import { getPublicSettings } from "@/lib/api/settings";

type ContatoPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContatoPage({ searchParams }: ContatoPageProps) {
  const params = await searchParams;
  const produto = typeof params?.produto === "string" ? params.produto : undefined;
  const settings = await getPublicSettings().catch(() => ({ data: undefined })).then((response) => response.data);

  return (
    <main className="min-h-screen bg-bg-app font-sans pb-20">
      <Topbar />

      <div className="mx-auto mt-8 max-w-[1440px] px-6 md:px-10">
        <ContatoContent initialProduct={produto} settings={settings} />
      </div>

      <footer className="mx-auto mt-20 flex max-w-[1440px] items-center justify-center border-t border-border-soft px-10 py-12">
        <p className="text-sm text-text-soft">&copy; 2026 PontoTecc. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
