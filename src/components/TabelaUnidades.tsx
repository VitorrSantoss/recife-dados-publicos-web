import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { UnidadeSaude } from "@/types";

interface Props {
  unidades: UnidadeSaude[];
}

type SortKey = keyof Pick<UnidadeSaude, "nome" | "tipo" | "bairro">;

export function TabelaUnidades({ unidades }: Props) {
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const PER_PAGE = 10;

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    const arr = q
      ? unidades.filter(
          (u) =>
            u.nome.toLowerCase().includes(q) ||
            u.bairro.toLowerCase().includes(q) ||
            u.tipo.toLowerCase().includes(q),
        )
      : unidades;
    return [...arr].sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey], "pt-BR");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [unidades, busca, sortKey, sortDir]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / PER_PAGE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtradas.slice((paginaAtual - 1) * PER_PAGE, paginaAtual * PER_PAGE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-[#1F2937]">
          Unidades de Saúde por Bairro
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
            placeholder="Buscar unidade, tipo ou bairro..."
            className="w-72 rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-[#0066B3] focus:outline-none focus:ring-2 focus:ring-[#0066B3]/30"
            aria-label="Buscar unidades"
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              {(
                [
                  ["nome", "Nome"],
                  ["tipo", "Tipo"],
                  ["bairro", "Bairro"],
                ] as [SortKey, string][]
              ).map(([k, label]) => (
                <th key={k} className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleSort(k)}
                    className="flex items-center gap-1 hover:text-[#0066B3]"
                  >
                    {label}
                    {sortKey === k && (
                      <span aria-hidden>{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </button>
                </th>
              ))}
              <th className="px-3 py-2">Endereço</th>
              <th className="px-3 py-2">Telefone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visiveis.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-gray-500">
                  Nenhum resultado encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
            {visiveis.map((u) => (
              <tr key={u.id} className="text-[#1F2937] transition hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">{u.nome}</td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-[#0066B3]/10 px-2 py-0.5 text-xs font-medium text-[#0066B3]">
                    {u.tipo}
                  </span>
                </td>
                <td className="px-3 py-2">{u.bairro}</td>
                <td className="px-3 py-2 text-gray-600">{u.endereco}</td>
                <td className="px-3 py-2 text-gray-600">{u.telefone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          {filtradas.length.toLocaleString("pt-BR")} unidade(s) — página {paginaAtual} de {totalPaginas}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
            className="rounded-md border border-gray-200 px-3 py-1 transition hover:bg-gray-50 disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas}
            className="rounded-md border border-gray-200 px-3 py-1 transition hover:bg-gray-50 disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
