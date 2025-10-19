"use client";

import React, { useEffect, useMemo, useState } from "react";

import useAuthContext from "app/contexts/auth/useAuthContext";

type PlanId = "esencial" | "profesional" | "enterprise";
type Period = "monthly" | "yearly";

type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number;
  recommended?: boolean;
  highlights: string[];
};

type EmpresaElegirPlanProps = {
  currentPlanId?: PlanId;
  initialPeriod?: Period;
  plans?: Plan[];
  onSelectPlan?: (selection: { planId: PlanId; period: Period }) => void;
};

const currency = (value: number) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const priceFor = (plan: Plan, period: Period) => (period === "monthly" ? plan.priceMonthly : Math.round(plan.priceMonthly * 10));

const featureMatrix = () => {
  type Row = { name: string; byPlan: Record<PlanId, React.ReactNode> };
  const dash = <span className="text-gray-400">—</span>;
  const mk = (name: string, esencial: React.ReactNode, profesional: React.ReactNode, enterprise: React.ReactNode): Row => ({
    name,
    byPlan: { esencial, profesional, enterprise },
  });

  return [
    mk("Precio mensual (ARS)", "$9.900/mes", "$14.900/mes", "$19.900/mes"),
    mk("Comisión por servicio", "8%", "5%", "3%"),
    mk("Publicaciones activas", "5", "20", "Ilimitadas"),
    mk("Liberación de pagos", "2 días hábiles", "1 día hábil", "Inmediata"),
    mk("Analítica", "Básica", "Intermedia", "Avanzada/BI"),
    mk("Soporte", "Chat", "Chat (SLA < 4 h)", "Prioritario"),
    mk(
      "Extras",
      dash,
      dash,
      "Integraciones (API/Webhooks), SSO opcional, roles avanzados y auditoría, prioridad de matching, cobertura ≤ 2 h",
    ),
  ];
};

const defaultPlans = (): Plan[] => [
  {
    id: "esencial",
    name: "Esencial",
    tagline: "Para locales con pocas publicaciones activas",
    priceMonthly: 9900,
    highlights: [
      "Comisión 8%",
      "Hasta 5 publicaciones activas",
      "Liberación en 2 días hábiles",
      "Analítica básica",
      "Soporte por chat",
    ],
  },
  {
    id: "profesional",
    name: "Profesional",
    tagline: "Más capacidad y SLA de soporte",
    priceMonthly: 14900,
    recommended: true,
    highlights: [
      "Comisión 5%",
      "Hasta 20 publicaciones activas",
      "Liberación en 1 día hábil",
      "Analítica intermedia",
      "Soporte chat (SLA < 4 h)",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Ilimitado, BI y soporte prioritario",
    priceMonthly: 19900,
    highlights: [
      "Comisión 3%",
      "Publicaciones ilimitadas",
      "Liberación inmediata",
      "Analítica avanzada/BI",
      "Soporte prioritario",
      "Integraciones (API/Webhooks), SSO opcional, roles avanzados y auditoría, prioridad de matching, cobertura ≤ 2 h",
    ],
  },
];

const EmpresaElegirPlan = ({
  currentPlanId = "profesional",
  initialPeriod = "monthly",
  plans = defaultPlans(),
  onSelectPlan,
}: EmpresaElegirPlanProps) => {
  const { user } = useAuthContext();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [selected, setSelected] = useState<Plan | null>(null);

  useEffect(() => {
    const profesional = plans.find((plan) => plan.id === "profesional");
    console.assert(!!profesional, "Debe existir plan Profesional por defecto");
    if (profesional) {
      const anual = priceFor(profesional, "yearly");
      console.assert(anual === profesional.priceMonthly * 10, "El anual debe ser 12m al precio de 10 (prepago)");
    }
  }, [plans]);

  const features = useMemo(() => featureMatrix(), []);

  const confirmSelect = () => {
    if (!selected) return;
    onSelectPlan?.({ planId: selected.id, period });
    alert(`Plan seleccionado: ${selected.name} (${period === "monthly" ? "Mensual" : "Anual (prepago)"})`);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex gap-6">
        <aside
          id="sidebar"
          className={`${sidebarVisible ? (sidebarCollapsed ? "w-16" : "w-64") : "w-0"} ${sidebarVisible ? "block" : "hidden"} ${sidebarVisible ? "xl:block" : "xl:hidden"}`}
        >
          <nav className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-5 shadow-sm h-full flex flex-col justify-between">
            <ul className="space-y-2 text-sm">
              <li>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50">{sidebarCollapsed ? "DB" : "Dashboard"}</button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50">{sidebarCollapsed ? "TU" : "Turnos"}</button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50">{sidebarCollapsed ? "PO" : "Postulaciones"}</button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50">{sidebarCollapsed ? "CT" : "Contrataciones"}</button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50">{sidebarCollapsed ? "PG" : "Pagos"}</button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 font-medium text-emerald-700">{sidebarCollapsed ? "PL" : "Planes"}</button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50">{sidebarCollapsed ? "PF" : "Perfil"}</button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-rose-700">{sidebarCollapsed ? "CS" : "Cerrar sesión"}</button>
              </li>
            </ul>
            <div>
              <button
                onClick={() => setSidebarCollapsed((state) => !state)}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                {sidebarCollapsed ? "»" : "«"} {sidebarCollapsed ? "Exp." : "Colapsar"}
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarCollapsed((state) => !state)}
                className="rounded-md p-1 bg-white/60 hover:bg-white hidden xl:inline"
              >
                {sidebarCollapsed ? "»" : "«"}
              </button>
              <button
                onClick={() => setSidebarVisible((value) => !value)}
                aria-expanded={sidebarVisible}
                aria-controls="sidebar"
                className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold"
                title="Mostrar/Ocultar sidebar"
              >
                M
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Elegir plan</h1>
                <p className="text-sm text-gray-500">{user?.name ?? ""} · Gestión de turnos y contrataciones</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/80 border border-emerald-100 rounded-xl p-1">
              <button
                onClick={() => setPeriod("monthly")}
                className={`px-3 py-1.5 text-sm rounded-lg ${period === "monthly" ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-gray-50"}`}
              >
                Mensual
              </button>
              <button
                onClick={() => setPeriod("yearly")}
                className={`px-3 py-1.5 text-sm rounded-lg ${period === "yearly" ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-gray-50"}`}
              >
                Anual <span className="text-xs opacity-70">(12× al precio de 10)</span>
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`rounded-2xl border ${plan.recommended ? "border-emerald-300" : "border-emerald-100"} bg-white/80 backdrop-blur-xl shadow-sm p-5 flex flex-col`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.name} {plan.id === currentPlanId && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 align-middle">Actual</span>}
                    </h3>
                    <p className="text-sm text-gray-500">{plan.tagline}</p>
                  </div>
                  {plan.recommended && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Recomendado</span>}
                </div>

                <div className="mt-4">
                  <div className="text-3xl font-semibold text-gray-900">
                    {currency(priceFor(plan, period))}
                    <span className="text-base text-gray-500 font-normal">/{period === "monthly" ? "mes" : "año"}</span>
                  </div>
                  {period === "yearly" && (
                    <p className="text-xs text-gray-500">Equivale a {currency(Math.round(priceFor(plan, "yearly") / 12))} / mes</p>
                  )}
                </div>

                <ul className="mt-4 space-y-2 text-sm text-gray-700 flex-1">
                  {plan.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-0.5">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  {plan.id === currentPlanId ? (
                    <button
                      disabled
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                    >
                      Tu plan actual
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelected(plan)}
                      className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-sm"
                    >
                      Elegir {plan.name}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>

          <section className="mt-6 bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Comparar planes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-3">Funcionalidad</th>
                    {plans.map((plan) => (
                      <th key={plan.id} className="py-2 pr-3">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature) => (
                    <tr key={feature.name} className="border-t border-gray-100">
                      <td className="py-2 pr-3 text-gray-700">{feature.name}</td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="py-2 pr-3">
                          {feature.byPlan[plan.id]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">• Sin reposición de publicaciones en todos los planes.</p>
          </section>

          <footer className="text-xs text-gray-400 mt-6">© {new Date().getFullYear()} Manito · Empresa</footer>
        </main>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelected(null)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Confirmar plan</h3>
            <p className="text-sm text-gray-600 mt-2">
              Vas a cambiar al plan <strong>{selected.name}</strong> con facturación <strong>{period === "monthly" ? "mensual" : "anual (prepago)"}</strong>.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Precio: <strong>{currency(priceFor(selected, period))}</strong> / {period === "monthly" ? "mes" : "año"}.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSelect}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaElegirPlan;
export type { Plan, Period, PlanId };
export { defaultPlans, featureMatrix, priceFor };
