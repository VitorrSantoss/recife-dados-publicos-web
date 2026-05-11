import type {
  CasoArbovirose,
  CasosPorBairro,
  DistribuicaoPorTipo,
  EvolucaoTemporal,
  Filtros,
  KpiDashboard,
  UnidadeSaude,
} from "@/types";

const MESES_CURTOS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function aplicarFiltros(
  casos: CasoArbovirose[],
  filtros: Filtros,
): CasoArbovirose[] {
  return casos.filter((c) => {
    if (filtros.ano !== "todos" && c.ano !== filtros.ano) return false;
    if (filtros.doenca !== "todas" && c.doenca !== filtros.doenca) return false;
    if (
      filtros.bairro &&
      !c.bairro.toLowerCase().includes(filtros.bairro.toLowerCase())
    )
      return false;
    return true;
  });
}

export function calcularKpis(
  casos: CasoArbovirose[],
  unidades: UnidadeSaude[],
  periodoReferencia: string,
): KpiDashboard {
  const porBairro = new Map<string, number>();
  let dengue = 0;
  let zika = 0;
  let chik = 0;
  for (const c of casos) {
    porBairro.set(c.bairro, (porBairro.get(c.bairro) ?? 0) + 1);
    if (c.doenca === "Dengue") dengue++;
    else if (c.doenca === "Zika") zika++;
    else chik++;
  }
  let bairroMaisAfetado = "—";
  let max = 0;
  for (const [b, n] of porBairro) {
    if (n > max) {
      max = n;
      bairroMaisAfetado = b;
    }
  }
  return {
    totalUnidadesSaude: unidades.length,
    totalHospitais: unidades.filter((u) => u.tipo === "Hospital").length,
    totalCasosArboviroses: casos.length,
    totalCasosDengue: dengue,
    totalCasosZika: zika,
    totalCasosChikungunya: chik,
    bairroMaisAfetado,
    periodoReferencia,
  };
}

export function evolucaoTemporal(casos: CasoArbovirose[]): EvolucaoTemporal[] {
  const map = new Map<string, EvolucaoTemporal>();
  for (const c of casos) {
    const key = `${c.ano}-${String(c.mes).padStart(2, "0")}`;
    let entry = map.get(key);
    if (!entry) {
      entry = {
        periodo: key,
        periodoLabel: `${MESES_CURTOS[c.mes - 1]}/${String(c.ano).slice(2)}`,
        total: 0,
        dengue: 0,
        zika: 0,
        chikungunya: 0,
      };
      map.set(key, entry);
    }
    entry.total++;
    if (c.doenca === "Dengue") entry.dengue++;
    else if (c.doenca === "Zika") entry.zika++;
    else entry.chikungunya++;
  }
  return Array.from(map.values()).sort((a, b) =>
    a.periodo.localeCompare(b.periodo),
  );
}

export function casosPorBairro(casos: CasoArbovirose[]): CasosPorBairro[] {
  const map = new Map<string, CasosPorBairro>();
  for (const c of casos) {
    let entry = map.get(c.bairro);
    if (!entry) {
      entry = {
        bairro: c.bairro,
        total: 0,
        dengue: 0,
        zika: 0,
        chikungunya: 0,
      };
      map.set(c.bairro, entry);
    }
    entry.total++;
    if (c.doenca === "Dengue") entry.dengue++;
    else if (c.doenca === "Zika") entry.zika++;
    else entry.chikungunya++;
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export function distribuicaoPorTipo(
  unidades: UnidadeSaude[],
): DistribuicaoPorTipo[] {
  const map = new Map<string, number>();
  for (const u of unidades) {
    map.set(u.tipo, (map.get(u.tipo) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([tipo, quantidade]) => ({ tipo, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);
}
