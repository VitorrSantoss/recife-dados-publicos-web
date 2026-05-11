import { useQuery } from "@tanstack/react-query";
import { buscarCasos, buscarUnidades } from "@/services/api";
import { adaptarCaso, adaptarUnidade } from "@/services/adapters";
import type { CasoArbovirose, UnidadeSaude } from "@/types";
import { CASOS, CASOS_2023, CASOS_2024, UNIDADES_SAUDE } from "@/data/mockData";

const STALE_TIME_MS = 5 * 60 * 1000;

export function useUnidades() {
  return useQuery<UnidadeSaude[]>({
    queryKey: ["unidades-saude"],
    queryFn: async () => {
      const dados = await buscarUnidades();
      return dados.map(adaptarUnidade);
    },
    staleTime: STALE_TIME_MS,
    placeholderData: UNIDADES_SAUDE,
    retry: 2,
    retryDelay: 1000,
  });
}

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

export function useDadosBackend() {
  const resultadoUnidades = useUnidades();
  const resultadoCasos = useCasos();

  // Garante que nunca retorna undefined — usa fallback explícito
  const unidades: UnidadeSaude[] = resultadoUnidades.data ?? UNIDADES_SAUDE;
  const casos2025: CasoArbovirose[] = resultadoCasos.data ?? CASOS;

  const casos: CasoArbovirose[] = [
    ...CASOS_2023,
    ...CASOS_2024,
    ...casos2025,
  ];

  const carregando =
    resultadoUnidades.isLoading || resultadoCasos.isLoading;

  const erro =
    resultadoUnidades.isError && resultadoCasos.isError;

  return {
    unidades,
    casos,
    casos2025,
    carregando,
    erro,
    erroUnidades: resultadoUnidades.isError,
    erroCasos: resultadoCasos.isError,
  };
}