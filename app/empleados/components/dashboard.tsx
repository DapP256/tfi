"use client";

import useAuthContext from "@/app/contexts/auth/useAuthContext";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";

// Dashboard para Empleados (Trabajador)
// - TailwindCSS, responsive
// - KPIs: próximos turnos, ingresos del mes, horas trabajadas, tasa de aceptación
// - Listas: Próximos turnos, Oportunidades sugeridas
// - Widgets: Estado de cuenta (pagos en garantía/liberados), Documentación, Reputación
// - Filtros por zona/rol/franja horaria

export default function EmpleadosDashboard({
  zones = ["CABA Centro", "CABA Norte", "AMBA Oeste"],
  roles = ["Mozo/a", "Cajero/a", "Cocina", "Delivery"],
  kpis = {
    nextShifts: 3,
    monthEarnings: 152000,
    workedHours: 48,
    acceptanceRate: 92, // %
  },
  account = {
    escrow: 28000,
    released: 124000,
    month: "Septiembre 2025",
    payoutPolicy: "Según plan del negocio: 2 días / 1 día / inmediato",
  },
  upcomingShifts = [
    { id: "s1", date: "2025-09-22", time: "18:00–23:00", role: "Mozo/a", site: "Bar Centro", status: "Confirmado", address: "Av. Siempre Viva 123" },
    { id: "s2", date: "2025-09-23", time: "12:00–16:00", role: "Cocina", site: "Resto Norte", status: "Pendiente", address: "Av. Libertad 456" },
    { id: "s3", date: "2025-09-24", time: "09:00–13:00", role: "Cajero/a", site: "Café Oeste", status: "Confirmado", address: "Calle Sol 789" },
  ],
  suggestedJobs = [
    { id: "j1", role: "Mozo/a", site: "Bistró Palermo", date: "2025-09-22", time: "19:00–23:30", distanceKm: 2.1, pay: 18000 },
    { id: "j2", role: "Cocina", site: "Parrilla Centro", date: "2025-09-22", time: "11:30–15:30", distanceKm: 3.8, pay: 16000 },
    { id: "j3", role: "Delivery", site: "Pizza Norte", date: "2025-09-23", time: "20:00–00:00", distanceKm: 5.2, pay: 21000 },
  ],
  documents = [
    { id: "d1", name: "DNI", status: "Vigente" },
    { id: "d2", name: "Libreta sanitaria", status: "Vence en 12 días" },
    { id: "d3", name: "Cert. Manipulación", status: "Vencido" },
  ],
  reputation = {
    rating: 4.7,
    punctuality: 98,
    completion: 97,
    reviews: [
      { id: "r1", by: "Resto Norte", text: "Excelente predisposición y rapidez." },
      { id: "r2", by: "Café Centro", text: "Muy puntual y prolija." },
    ],
  },
  onAcceptJob,
  onRejectJob,
  onViewDetails,
  onCheckIn,
  onCheckOut,
  onUpdateDocs,
  onExport,
}: any) {
  const [filters, setFilters] = useState({ zone: "all", role: "all", time: "all" });

  const currency = (n: any) => n?.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  const formatDate = (isoDate: string) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    if (!year || !month || !day) return isoDate;
    return `${day}/${month}/${year}`;
  };

  const filteredJobs = useMemo(() => {
    return suggestedJobs.filter((j: any) => {
      if (filters.zone !== "all" && !j.site.includes(filters.zone.split(" ")[1] || "")) return false; // demo filter
      if (filters.role !== "all" && j.role !== filters.role) return false;
      // time filter demo omitted
      return true;
    });
  }, [suggestedJobs, filters]);
  const { user } = useAuthContext();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">M</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Hola, {user?.role == "trabajador" ? user?.name.split(" ")[0] : user?.name}</h1>
            <p className="text-sm text-gray-500">Tu actividad y oportunidades</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onExport?.()} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">Descargar historial</button>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Próximos turnos" value={kpis.nextShifts} subtitle="Confirmados/Pendientes" />
        <KpiCard title="Ingresos del mes" value={currency(kpis.monthEarnings)} subtitle="Bruto estimado" />
        <KpiCard title="Horas trabajadas" value={kpis.workedHours} subtitle="Últimos 30 días" />
        <KpiCard title="Tasa de aceptación" value={`${kpis.acceptanceRate}%`} subtitle="Postulaciones" />
      </section>

      {/* Filtros */}
      <section className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-5 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="text-xs text-gray-600">Zona</label>
            <select className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900" value={filters.zone} onChange={(e) => setFilters((f) => ({ ...f, zone: e.target.value }))}>
              <option value="all">Todas</option>
              {zones.map((z: any) => (<option key={z} value={z}>{z}</option>))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600">Rol</label>
            <select className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900" value={filters.role} onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}>
              <option value="all">Todos</option>
              {roles.map((r: any) => (<option key={r} value={r}>{r}</option>))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600">Franja</label>
            <select className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900" value={filters.time} onChange={(e) => setFilters((f) => ({ ...f, time: e.target.value }))}>
              {(["all", "Mañana", "Tarde", "Noche"]).map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={() => setFilters({ zone: "all", role: "all", time: "all" })} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm hover:bg-gray-50">Limpiar</button>
          </div>
        </div>
      </section>

      {/* Grid principal */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Próximos turnos */}
        <div className="xl:col-span-2 bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Próximos turnos</h3>
          <div className="divide-y divide-gray-100">
            {upcomingShifts.map((t: any) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.role} · <span className="text-gray-600">{t.site}</span></p>
                  <p className="text-xs text-gray-600">{formatDate(t.date)} · {t.time}</p>
                  <p className="text-xs text-gray-500">{t.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  {t.status === "Confirmado" ? (
                    <button onClick={() => onCheckIn?.(t)} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700">Check-in</button>
                  ) : t.status === "Pendiente" ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">Pendiente</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-700">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estado de cuenta */}
        <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Mi cuenta</h3>
          <p className="text-xs text-gray-500 mb-3">{account.month}</p>
          <div className="space-y-2">
            <Row label="En garantía" value={currency(account.escrow)} />
            <Row label="Disponible (liberado)" value={currency(account.released)} />
            <p className="text-xs text-gray-500">{account.payoutPolicy}</p>
          </div>
          <div className="mt-3 text-right">
            <button onClick={() => onExport?.()} className="text-sm rounded-xl border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50">Ver comprobantes</button>
          </div>
        </div>
      </section>

      {/* Oportunidades + Documentos + Reputación */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        {/* Oportunidades */}
        <div className="xl:col-span-2 bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">Oportunidades sugeridas</h3>
            <span className="text-xs text-gray-500">Basadas en tu perfil y zona</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-3">Rol</th>
                  <th className="py-2 pr-3">Lugar</th>
                  <th className="py-2 pr-3">Fecha</th>
                  <th className="py-2 pr-3">Horario</th>
                  <th className="py-2 pr-3">Distancia</th>
                  <th className="py-2 pr-3">Pago</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((j: any) => (
                  <tr key={j.id} className="border-top border-gray-100">
                    <td className="py-2 pr-3 font-medium text-gray-900">{j.role}</td>
                    <td className="py-2 pr-3">{j.site}</td>
                    <td className="py-2 pr-3">{formatDate(j.date)}</td>
                    <td className="py-2 pr-3">{j.time}</td>
                    <td className="py-2 pr-3">{j.distanceKm} km</td>
                    <td className="py-2 pr-3">{currency(j.pay)}</td>
                    <td className="py-2 flex gap-2 justify-end">
                      <button onClick={() => onViewDetails?.(j)} className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-gray-700 hover:bg-gray-50">Ver detalles</button>
                      <button onClick={() => onAcceptJob?.(j)} className="rounded-lg bg-emerald-600 text-white px-2.5 py-1.5 hover:bg-emerald-700">Aceptar</button>
                      <button onClick={() => onRejectJob?.(j)} className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 hover:bg-gray-50">Rechazar</button>
                    </td>
                  </tr>
                ))}
                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">No hay oportunidades para los filtros seleccionados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documentos & Reputación */}
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-5 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Documentación</h3>
            <ul className="space-y-2 text-sm">
              {documents.map((d: any) => (
                <li key={d.id} className="flex items-center justify-between">
                  <span className="text-gray-700">{d.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${d.status.includes("Vence") ? "bg-amber-100 text-amber-800" : d.status === "Vencido" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>{d.status}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-right">
              <button onClick={() => onUpdateDocs?.()} className="text-sm rounded-xl border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50">Actualizar documentos</button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-5 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Reputación</h3>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-semibold text-gray-900">{reputation.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-600">Puntualidad {reputation.punctuality}% · Finalización {reputation.completion}%</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              {reputation.reviews.map((r: any) => (
                <li key={r.id} className="border-t border-gray-100 pt-2">
                  <strong className="text-gray-900">{r.by}:</strong> {r.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-xs text-gray-400 mt-6">© {new Date().getFullYear()} Manito · CABA/AMBA</footer>
    </div>
  );
}

function KpiCard({ title, value, subtitle }: any) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-5 shadow-sm">
      <p className="text-xs text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
