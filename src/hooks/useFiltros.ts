import { useState, useCallback } from "react";
import type { Filtros } from "@/types";

const FILTROS_INICIAIS: Filtros = {
  ano: "todos",
  doenca: "todas",
  bairro: "",
};

export function useFiltros() {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);

  const atualizar = useCallback(<K extends keyof Filtros>(chave: K, valor: Filtros[K]) => {
    setFiltros((f) => ({ ...f, [chave]: valor }));
  }, []);

  const limpar = useCallback(() => setFiltros(FILTROS_INICIAIS), []);

  return { filtros, atualizar, limpar };
}
