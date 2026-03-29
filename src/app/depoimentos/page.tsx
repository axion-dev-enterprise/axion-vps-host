import React from "react";
import { Topbar } from "@/components/layout/Topbar";
import { TestimonialsContent } from "@/components/testimonials/TestimonialsContent";

export default function DepoimentosPage() {
  return (
    <main className="min-h-screen bg-bg-app font-sans pb-20">
      <Topbar />
      
      <div className="mx-auto mt-8 max-w-[1440px] px-6 md:px-10">
        <TestimonialsContent />
      </div>

      {/* Footer minimal as seen in UI trends */}
      <footer className="mx-auto mt-20 flex max-w-[1440px] items-center justify-center border-t border-border-soft py-12 px-10">
        <p className="text-sm text-text-soft">
          &copy; 2026 PontoTecc. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  );
}
