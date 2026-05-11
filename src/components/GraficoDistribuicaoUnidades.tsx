import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { DistribuicaoPorTipo } from "@/types";

const CORES = ["#0066B3", "#F39200", "#00A651", "#E63946", "#6366F1", "#8B5CF6"];

interface Props {
  dados: DistribuicaoPorTipo[];
}

export function GraficoDistribuicaoUnidades({ dados }: Props) {
  const total = dados.reduce((s, d) => s + d.quantidade, 0);
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-[#1F2937]">
        Distribuição da Rede de Saúde
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{ borderRadius: 8, borderColor: "#E5E7EB", fontSize: 13 }}
              formatter={(v, name) => [
                `${Number(v).toLocaleString("pt-BR")} (${((Number(v) / total) * 100).toFixed(1)}%)`,
                String(name),
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 13 }}
              formatter={(value, entry) => {
                const p = entry?.payload as unknown as { quantidade?: number } | undefined;
                const q = p?.quantidade ?? 0;
                const pct = total ? ((q / total) * 100).toFixed(1) : "0";
                return `${value} — ${q} (${pct}%)`;
              }}
            />
            <Pie
              data={dados}
              dataKey="quantidade"
              nameKey="tipo"
              outerRadius={90}
              innerRadius={45}
              paddingAngle={2}
            >
              {dados.map((_, i) => (
                <Cell key={i} fill={CORES[i % CORES.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
