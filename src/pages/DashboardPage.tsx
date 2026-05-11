import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Building2,
  Download,
  Hospital,
  MapPin,
  Printer,
  ShieldPlus,
} from "lucide-react";
import { CASOS, UNIDADES_SAUDE } from "@/data/mockData";
import {
  aplicarFiltros,
  calcularKpis,
  casosPorBairro,
  distribuicaoPorTipo,
  evolucaoTemporal,
} from "@/utils/aggregations";
import { useFiltros } from "@/hooks/useFiltros";
import { KpiCard, KpiSkeleton } from "@/components/KpiCard";
import { FiltrosBar } from "@/components/FiltrosBar";
import { GraficoEvolucao } from "@/components/GraficoEvolucao";
import { GraficoTopBairros } from "@/components/GraficoTopBairros";
import { GraficoDistribuicaoUnidades } from "@/components/GraficoDistribuicaoUnidades";
import { TabelaUnidades } from "@/components/TabelaUnidades";
import logoPrefeitura from '@/assets/logo_prefeitura_semfundo.png';

export function DashboardPage() {
  const { filtros, atualizar, limpar } = useFiltros();
  const [carregando, setCarregando] = useState(true);
  const [erro] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCarregando(false), 700);
    return () => clearTimeout(t);
  }, []);

  const casosFiltrados = useMemo(() => aplicarFiltros(CASOS, filtros), [filtros]);

  const unidadesFiltradas = useMemo(() => {
    if (!filtros.bairro) return UNIDADES_SAUDE;
    return UNIDADES_SAUDE.filter((u) =>
      u.bairro.toLowerCase().includes(filtros.bairro.toLowerCase()),
    );
  }, [filtros.bairro]);

  const periodoRef =
    filtros.ano === "todos" ? "Período: 2023-2024" : `Período: ${filtros.ano}`;

  const kpis = useMemo(
    () => calcularKpis(casosFiltrados, UNIDADES_SAUDE, periodoRef),
    [casosFiltrados, periodoRef],
  );

  const evolucao = useMemo(() => evolucaoTemporal(casosFiltrados), [casosFiltrados]);
  const topBairros = useMemo(() => casosPorBairro(casosFiltrados), [casosFiltrados]);
  const distribuicao = useMemo(() => distribuicaoPorTipo(UNIDADES_SAUDE), []);

  const semDados = casosFiltrados.length === 0;

  function exportarCSV() {
    const linhas = [
      ["id", "doenca", "bairro", "ano", "mes"].join(","),
      ...casosFiltrados.map((c) =>
        [c.id, c.doenca, c.bairro, c.ano, c.mes].join(","),
      ),
    ].join("\n");
    const blob = new Blob([linhas], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `casos-arboviroses-recife.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  }

  if (erro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F9] p-6">
        <div className="max-w-md rounded-lg border border-gray-100 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-[#E63946]" />
          <h2 className="mt-3 text-lg font-semibold text-[#1F2937]">
            Não foi possível carregar os dados
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tente recarregar a página em alguns instantes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1F2937]">
      <header className="bg-[#0066B3] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex h-14 w-40 sm:h-16 sm:w-48 shrink-0">
            <img 
              src={logoPrefeitura} 
              alt="Logo da Prefeitura do Recife" 
              className="h-full w-full object-contain object-left" 
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold sm:text-xl">
              Saúde Pública do Recife
            </h1>
            <p className="truncate text-xs text-white/80 sm:text-sm">
              Dashboard de monitoramento • Dados Abertos da Prefeitura
            </p>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen((v) => !v)}
              className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              <Download className="h-4 w-4" /> Exportar
            </button>
            {exportOpen && (
              <div className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-md border border-gray-100 bg-white text-sm shadow-lg">
                <button
                  type="button"
                  onClick={exportarCSV}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[#1F2937] hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 text-[#0066B3]" /> Exportar CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExportOpen(false);
                    window.print();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[#1F2937] hover:bg-gray-50"
                >
                  <Printer className="h-4 w-4 text-[#0066B3]" /> Imprimir
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {/* KPI cards */}
        <section
          aria-label="Indicadores principais"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {carregando ? (
            <>
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
            </>
          ) : (
            <>
              <KpiCard
                titulo="Unidades de Saúde"
                valor={kpis.totalUnidadesSaude}
                icon={Building2}
                accent="blue"
              />
              <KpiCard
                titulo="Hospitais"
                valor={kpis.totalHospitais}
                icon={Hospital}
                accent="green"
              />
              <KpiCard
                titulo="Casos de Arboviroses"
                valor={kpis.totalCasosArboviroses}
                subtitulo={kpis.periodoReferencia}
                icon={Activity}
                accent="red"
              />
              <KpiCard
                titulo="Bairro Mais Afetado"
                valor={kpis.bairroMaisAfetado}
                icon={MapPin}
                accent="orange"
              />
            </>
          )}
        </section>

        {/* Doenças */}
        <section
          aria-label="Casos por doença"
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <KpiCard titulo="Dengue" valor={kpis.totalCasosDengue} icon={Activity} accent="red" />
          <KpiCard titulo="Zika" valor={kpis.totalCasosZika} icon={Activity} accent="orange" />
          <KpiCard
            titulo="Chikungunya"
            valor={kpis.totalCasosChikungunya}
            icon={Activity}
            accent="blue"
          />
        </section>

        <FiltrosBar filtros={filtros} atualizar={atualizar} limpar={limpar} />

        {semDados ? (
          <div className="rounded-lg border border-gray-100 bg-white p-10 text-center shadow-sm">
            <AlertCircle className="mx-auto h-8 w-8 text-[#F39200]" />
            <p className="mt-3 text-sm text-gray-600">
              Nenhum resultado encontrado para os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="space-y-6 transition-opacity duration-200">
            <GraficoEvolucao dados={evolucao} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <GraficoTopBairros dados={topBairros} />
              <GraficoDistribuicaoUnidades dados={distribuicao} />
            </div>
          </div>
        )}

        <TabelaUnidades unidades={unidadesFiltradas} />
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-gray-500 sm:px-6">
          <p>Dados: Portal de Dados Abertos da Prefeitura do Recife</p>
          <p className="mt-1">
            Aplicação desenvolvida para fins de teste técnico — Última atualização: 08/05/2026 14:32
          </p>
        </div>
      </footer>
    </div>
  );
}
