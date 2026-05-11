import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EvolucaoTemporal } from "@/types";

interface Props {
  dados: EvolucaoTemporal[];
}

export function GraficoEvolucao({ dados }: Props) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-[#1F2937]">
        Evolução Temporal de Casos
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="periodoLabel" tick={{ fontSize: 12, fill: "#6B7280" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, borderColor: "#E5E7EB", fontSize: 13 }}
              formatter={(v, name) => [
                Number(v).toLocaleString("pt-BR"),
                String(name),
              ]}
              labelFormatter={(l) => `Período: ${l}`}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Line type="monotone" dataKey="dengue" name="Dengue" stroke="#E63946" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="zika" name="Zika" stroke="#F39200" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="chikungunya" name="Chikungunya" stroke="#0066B3" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
