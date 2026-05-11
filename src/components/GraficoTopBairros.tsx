import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CasosPorBairro } from "@/types";

interface Props {
  dados: CasosPorBairro[];
}

export function GraficoTopBairros({ dados }: Props) {
  const top = dados.slice(0, 10);
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-[#1F2937]">
        Top 10 Bairros com Mais Casos
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={top} margin={{ top: 10, right: 16, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#6B7280" }} />
            <YAxis dataKey="bairro" type="category" width={110} tick={{ fontSize: 12, fill: "#6B7280" }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, borderColor: "#E5E7EB", fontSize: 13 }}
              formatter={(v, name) => [Number(v).toLocaleString("pt-BR"), String(name)]}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Bar dataKey="dengue" name="Dengue" stackId="a" fill="#E63946" />
            <Bar dataKey="zika" name="Zika" stackId="a" fill="#F39200" />
            <Bar dataKey="chikungunya" name="Chikungunya" stackId="a" fill="#0066B3" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
