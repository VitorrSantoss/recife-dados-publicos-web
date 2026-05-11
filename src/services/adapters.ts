import type { CasoArbovirose, Doenca, UnidadeSaude } from "@/types";
import type { CasoArboviroseBackend, UnidadeSaudeBackend } from "./api";

// Mapeia o tipo em CAPS do backend para o formato capitalizado do frontend
const MAPA_DOENCA: Record<string, Doenca> = {
  DENGUE: "Dengue",
  ZIKA: "Zika",
  CHIKUNGUNYA: "Chikungunya",
};

// Converte cada palavra pra Title Case (ex: "BOA VIAGEM" -> "Boa Viagem")
function titleCase(texto: string | null | undefined): string {
  if (!texto) return "";
  return texto
    .toLowerCase()
    .split(" ")
    .map((palavra) =>
      palavra.length > 0
        ? palavra[0].toUpperCase() + palavra.slice(1)
        : palavra
    )
    .join(" ");
}

// Garante que o bairro nunca vem vazio (fallback)
function normalizarBairro(bairro: string | null | undefined): string {
  const b = titleCase(bairro);
  return b.length > 0 ? b : "Nao informado";
}

let _contadorCaso = 0;

export function adaptarCaso(backend: CasoArboviroseBackend): CasoArbovirose {
  const doenca: Doenca = MAPA_DOENCA[backend.tipo?.toUpperCase()] ?? "Dengue";

  return {
    id: `api-${++_contadorCaso}`,
    doenca,
    bairro: normalizarBairro(backend.bairro),
    ano: backend.ano ?? 2025,
    mes: backend.mes ?? 1,
  };
}

export function adaptarUnidade(
  backend: UnidadeSaudeBackend
): UnidadeSaude {
  return {
    id: String(backend.id ?? ""),
    nome: backend.nome ?? "Unidade sem nome",
    tipo: backend.servico ?? backend.tipo ?? "UBS",
    endereco: backend.endereco ?? "Endereco nao informado",
    bairro: titleCase(backend.bairro),
    telefone: backend.telefone ?? "Nao informado",
  };
}