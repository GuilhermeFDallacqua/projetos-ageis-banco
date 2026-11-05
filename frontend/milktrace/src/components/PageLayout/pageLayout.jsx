import Sidebar from "@/components/Sidebar/sidebar";

// Estrutura padrão das telas internas: menu lateral + conteúdo
export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      {/* Conteúdo principal */}
      <main className="min-h-screen px-5 py-7 lg:ml-64 lg:px-10 lg:py-9">

        <div className="mx-auto max-w-7xl">
          {children}
        </div>

      </main>

    </div>
  );
}

export function PageHeader({ title, description, children }) {
  return (
    <section className="animate-fade-up mb-9 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex flex-wrap gap-3">
          {children}
        </div>
      )}
    </section>
  );
}
