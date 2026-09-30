import Sidebar from "@/components/Sidebar/sidebar";

export default function Home() {
  const triagens = [
    {
      id: "DOA-0042",
      nome: "Ana Oliveira",
      data: "22/09/2025",
      horario: "14:30",
      status: "Concluída",
    },
    {
      id: "DOA-0108",
      nome: "Juliana Souza",
      data: "22/09/2025",
      horario: "11:15",
      status: "Em andamento",
    },
    {
      id: "DOA-0097",
      nome: "Mariana Costa",
      data: "21/09/2025",
      horario: "16:45",
      status: "Concluída",
    },
    {
      id: "DOA-0085",
      nome: "Carolina Lima",
      data: "21/09/2025",
      horario: "09:20",
      status: "Concluída",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      {/* Conteúdo principal */}
      <main className="ml-64 min-h-screen px-10 py-9">

        <div className="mx-auto max-w-7xl">

          {/* Cabeçalho */}
          <section className="mb-9">
            <h1 className="text-3xl font-bold text-slate-800">
              Olá, Maria!
            </h1>

            <p className="mt-2 text-slate-500">
              O que deseja fazer hoje?
            </p>
          </section>


          {/* Cards principais */}
          <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Nova Triagem */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="mb-6 flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-500">
                  ✚
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Nova Triagem
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Inicie um novo processo de triagem para uma doadora.
                  </p>
                </div>

              </div>

              <button className="w-full rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
                Iniciar triagem
              </button>

            </div>


            {/* Consultar Doadora */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="mb-6 flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl text-orange-400">
                  ⌕
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Consultar Doadora
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Localize uma doadora cadastrada no sistema.
                  </p>
                </div>

              </div>

              <button className="w-full rounded-lg border border-blue-500 py-3 text-sm font-semibold text-blue-500 transition hover:bg-blue-50">
                Consultar
              </button>

            </div>

          </section>


          {/* Triagens recentes */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-7 py-5">
              <h2 className="text-lg font-semibold text-slate-800">
                Triagens Recentes
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Acompanhe as últimas triagens realizadas.
              </p>
            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">

                    <th className="px-7 py-4">
                      ID da Doadora
                    </th>

                    <th className="px-7 py-4">
                      Nome
                    </th>

                    <th className="px-7 py-4">
                      Data
                    </th>

                    <th className="px-7 py-4">
                      Horário
                    </th>

                    <th className="px-7 py-4">
                      Status
                    </th>

                    <th className="px-7 py-4 text-right">
                      Ação
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {triagens.map((triagem) => (

                    <tr
                      key={triagem.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* ID */}
                      <td className="px-7 py-5 text-sm font-semibold text-slate-700">
                        {triagem.id}
                      </td>

                      {/* Nome */}
                      <td className="px-7 py-5 text-sm font-medium text-slate-600">
                        {triagem.nome}
                      </td>

                      {/* Data */}
                      <td className="px-7 py-5 text-sm text-slate-500">
                        {triagem.data}
                      </td>

                      {/* Horário */}
                      <td className="px-7 py-5 text-sm text-slate-500">
                        {triagem.horario}
                      </td>

                      {/* Status */}
                      <td className="px-7 py-5">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            triagem.status === "Concluída"
                              ? "bg-green-50 text-green-600"
                              : "bg-orange-50 text-orange-500"
                          }`}
                        >
                          {triagem.status}
                        </span>

                      </td>

                      {/* Ação */}
                      <td className="px-7 py-5 text-right">

                        <button className="text-sm font-semibold text-blue-500 transition hover:text-blue-700">
                          Visualizar
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}