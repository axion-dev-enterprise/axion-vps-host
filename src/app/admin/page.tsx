import { AdminContent } from "@/components/admin/AdminContent";
import { Topbar } from "@/components/layout/Topbar";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-bg-app pb-20">
      <Topbar />

      <div className="mx-auto mt-8 max-w-[1440px] px-6 md:px-10">
        <AdminContent />
      </div>

      <footer className="mx-auto mt-20 flex max-w-[1440px] items-center justify-center border-t border-border-soft px-10 py-12">
        <p className="text-sm text-text-soft">&copy; 2026 AXION VPS - Painel operacional</p>
      </footer>
    </main>
  );
}
