import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/DashboardPage";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Saúde Pública do Recife — Dashboard" },
      {
        name: "description",
        content:
          "Dashboard de monitoramento da saúde pública do Recife com indicadores de arboviroses e rede de unidades de saúde.",
      },
    ],
  }),
});

function Index() {
  return <DashboardPage />;
}
