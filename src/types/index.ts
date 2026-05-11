export type Doenca = "Dengue" | "Zika" | "Chikungunya";

export interface CasoArbovirose {
  id: string;
  doenca: Doenca;
  bairro: string;
  ano: number;
  mes: number;
}

export interface UnidadeSaude {
  id: string;
  nome: string;
  tipo: string;
  endereco: string;
  bairro: string;
  telefone: string;
}

export interface KpiDashboard {
  totalUnidadesSaude: number;
  totalHospitais: number;
  totalCasosArboviroses: number;
  totalCasosDengue: number;
  totalCasosZika: number;
  totalCasosChikungunya: number;
  bairroMaisAfetado: string;
  periodoReferencia: string;
}

export interface EvolucaoTemporal {
  periodo: string;
  periodoLabel: string;
  total: number;
  dengue: number;
  zika: number;
  chikungunya: number;
}

export interface CasosPorBairro {
  bairro: string;
  total: number;
  dengue: number;
  zika: number;
  chikungunya: number;
}

export interface DistribuicaoPorTipo {
  tipo: string;
  quantidade: number;
}

export interface Filtros {
  ano: "todos" | number;
  doenca: "todas" | Doenca;
  bairro: string;
}
