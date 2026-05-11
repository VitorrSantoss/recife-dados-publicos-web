const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(
      `Erro na requisicao ${path}: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

// Tipos crus que vem do backend (espelham os DTOs Java)

export interface UnidadeSaudeBackend {
  id: string;
  nome: string;
  tipo: string;
  servico: string;
  endereco: string;
  bairro: string;
  regiaoPolitico: number;
  distritoSanitario: number;
  cnes: number;
  telefone: string;
  horarioFuncionamento: string;
  especialidades: string;
  comoUsar: string;
  latitude: number;
  longitude: number;
}

export interface CasoArboviroseBackend {
  tipo: string;          // "DENGUE" | "ZIKA" | "CHIKUNGUNYA"
  numeroNotificacao: string;
  bairro: string;
  idBairro: number;
  ano: number;
  mes: number;
  semanaEpidemiologica: number;
  classificacao: string;
  sexo: string;
  hospitalizado: boolean;
}

export async function buscarUnidades(): Promise<UnidadeSaudeBackend[]> {
  return get<UnidadeSaudeBackend[]>("/v1/unidades-saude");
}

export async function buscarCasos(): Promise<CasoArboviroseBackend[]> {
  return get<CasoArboviroseBackend[]>("/v1/arboviroses");
}