import { Filter, X } from "lucide-react";
import type { Filtros } from "@/types";
import { BAIRROS } from "@/data/mockData";

interface Props {
  filtros: Filtros;
  atualizar: <K extends keyof Filtros>(chave: K, valor: Filtros[K]) => void;
  limpar: () => void;
}

export function FiltrosBar({ filtros, atualizar, limpar }: Props) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-[#0066B3]">
          <Filter className="h-4 w-4" /> Filtros
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">Ano</label>
          <select
            value={String(filtros.ano)}
            onChange={(e) =>
              atualizar("ano", e.target.value === "todos" ? "todos" : Number(e.target.value))
            }
            className="mt-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-[#1F2937] focus:border-[#0066B3] focus:outline-none focus:ring-2 focus:ring-[#0066B3]/30"
          >
            <option value="todos">Todos</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">Doença</label>
          <select
            value={filtros.doenca}
            onChange={(e) => atualizar("doenca", e.target.value as Filtros["doenca"])}
            className="mt-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-[#1F2937] focus:border-[#0066B3] focus:outline-none focus:ring-2 focus:ring-[#0066B3]/30"
          >
            <option value="todas">Todas</option>
            <option value="Dengue">Dengue</option>
            <option value="Zika">Zika</option>
            <option value="Chikungunya">Chikungunya</option>
          </select>
        </div>

        <div className="flex flex-1 flex-col" style={{ minWidth: 200 }}>
          <label className="text-xs font-medium text-gray-600">Bairro</label>
          <input
            list="lista-bairros"
            value={filtros.bairro}
            onChange={(e) => atualizar("bairro", e.target.value)}
            placeholder="Buscar bairro..."
            className="mt-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-[#1F2937] focus:border-[#0066B3] focus:outline-none focus:ring-2 focus:ring-[#0066B3]/30"
          />
          <datalist id="lista-bairros">
            {BAIRROS.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>

        <button
          type="button"
          onClick={limpar}
          className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-[#0066B3]"
        >
          <X className="h-4 w-4" /> Limpar filtros
        </button>
      </div>
    </div>
  );
}
