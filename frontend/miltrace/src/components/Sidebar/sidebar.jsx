export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-200 px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-lg text-white">
            ♡
          </div>

          <span className="text-xl font-bold text-slate-800">
            MilkTrace
          </span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>

        <div className="space-y-2">

          <button className="flex w-full items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-left font-medium text-blue-600">
            <span>⌂</span>
            Início
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-500 transition hover:bg-slate-50 hover:text-blue-600">
            <span>♙</span>
            Doadoras
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-500 transition hover:bg-slate-50 hover:text-blue-600">
            <span>▣</span>
            Triagens
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-500 transition hover:bg-slate-50 hover:text-blue-600">
            <span>◷</span>
            Histórico
          </button>

        </div>
      </nav>

      {/* Usuário */}
      <div className="border-t border-slate-200 p-5">

        <div className="mb-4 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
            MS
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Maria Santos
            </p>

            <p className="text-xs text-slate-400">
              Funcionário
            </p>
          </div>

        </div>

        <button className="w-full rounded-lg border border-slate-200 py-2 text-sm text-slate-500 transition hover:bg-slate-50">
          Sair
        </button>

      </div>

    </aside>
  );
}