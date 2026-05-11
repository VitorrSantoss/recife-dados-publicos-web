import { useQuery } from "@tanstack/react-query";
import { buscarCasos, buscarUnidades } from "@/services/api";
import { adaptarCaso, adaptarUnidade } from "@/services/adapters";
import type { CasoArbovirose, UnidadeSaude } from "@/types";
import { CASOS, UNIDADES_SAUDE } from "@/data/mockData";

// Tempo que os dados ficam em cache no cliente (5 minutos)
// O backend ja tem cache de 1h, entao isso evita re-buscar sem necessidade
const STALE_TIME_MS = 5 * 60 * 1000;

function usarMockComoFallback(): boolean {
  return import.meta.env.VITE_API_URL === undefined;
}

// Hook de unidades de saude
export function useUnidades() {
  return useQuery<UnidadeSaude[]>({
    queryKey: ["unidades-saude"],
    queryFn: async () => {
      const dados = await buscarUnidades();
      return dados.map(adaptarUnidade);
    },
    staleTime: STALE_TIME_MS,
    // Se a API falhar, usa os mocks como fallback silencioso
    placeholderData: UNIDADES_SAUDE,
    retry: 2,
    retryDelay: 1000,
  });
}

// Hook de casos de arboviroses
export function useCasos() {
  return useQuery<CasoArbovirose[]>({
    queryKey: ["casos-arboviroses"],
    queryFn: async () => {
      const dados = await buscarCasos();
      return dados.map(adaptarCaso);
    },
    staleTime: STALE_TIME_MS,
    placeholderData: CASOS,
    retry: 2,
    retryDelay: 1000,
  });
}

// Hook agregador — use esse na DashboardPage
export function useDadosBackend() {
  const {
    data: unidades = UNIDADES_SAUDE,
    isLoading: carregandoUnidades,
    isError: erroUnidades,
  } = useUnidades();

  const {
    data: casos = CASOS,
    isLoading: carregandoCasos,
    isError: erroCasos,
  } = useCasos();

  const carregando = carregandoUnidades || carregandoCasos;

  // Se ambos falharem = mostra erro. Se um falhar = usa mock silenciosamente.
  const erro = erroUnidades && erroCasos;

  return {
    unidades,
    casos,
    carregando,
    erro,
    // Flags individuais caso queira granularidade na UI
    erroUnidades,
    erroCasos,
  };
}