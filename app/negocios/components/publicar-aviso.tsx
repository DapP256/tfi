"use client";

import React, { useMemo, useState } from "react";

export type PlanName = "Esencial" | "Profesional" | "Enterprise";

export type Site = { id: string; name: string };

export type CreateJobForm = {
  role: string;
  siteId: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  pay: string;
  vacancies: number;
  dressCode: string;
  notes: string;
};

type CreateJobPostProps = {
  plan?: PlanName;
  activeCount?: number;
  sites?: Site[];
  roles?: string[];
  onSubmit?: (payload: CreateJobForm & { site?: string; plan: PlanName; activeCount: number }) => void;
  onPauseSome?: () => void;
  onUpgradePlan?: () => void;
  onOpenDynamicPricing?: (form: CreateJobForm) => void;
};

const defaultSites: Site[] = [
  { id: "s1", name: "Sucursal Centro" },
  { id: "s2", name: "Sucursal Norte" },
  { id: "s3", name: "Sucursal Oeste" },
];

const defaultRoles = ["Mozo/a", "Cajero/a", "Cocina", "Delivery"];

const planLimit = (plan: PlanName) => {
  if (plan === "Esencial") return 5;
  if (plan === "Profesional") return 20;
  return Infinity;
};

const CreateJobPost = ({
  plan = "Esencial",
  activeCount = 5,
  sites = defaultSites,
  roles = defaultRoles,
  onSubmit,
  onPauseSome,
  onUpgradePlan,
  onOpenDynamicPricing,
}: CreateJobPostProps) => {
  const limit = useMemo(() => planLimit(plan), [plan]);
  const atLimit = limit !== Infinity && activeCount >= limit;

  const [form, setForm] = useState<CreateJobForm>({
    role: "",
    siteId: "",
    date: "",
    timeFrom: "",
    timeTo: "",
    pay: "",
    vacancies: 1,
    dressCode: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<CreateJobForm & { site?: string; plan: PlanName; activeCount: number } | null>(null);

  const inputClass =
    "w-full rounded-xl border px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition";

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.role) nextErrors.role = "Elegí un rol";
    if (!form.siteId) nextErrors.siteId = "Seleccioná una sede";
    if (!form.date) nextErrors.date = "Indicá la fecha";
    if (!form.timeFrom || !form.timeTo) nextErrors.time = "Completá el horario";
    if (!form.pay || Number(form.pay) <= 0) nextErrors.pay = "Ingresá una tarifa válida";
    if (!form.vacancies || Number(form.vacancies) < 1) nextErrors.vacancies = "Mínimo 1";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate() || atLimit) return;
    const payload = { ...form, site: sites.find((site) => site.id === form.siteId)?.name, plan, activeCount };
    setPendingPayload(payload);
    setShowConfirm(true);
  };

  const confirmPublish = async () => {
    if (!pendingPayload) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSubmit?.(pendingPayload);
      alert("Aviso publicado");
      setShowConfirm(false);
      setPendingPayload(null);
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, _global: "No pudimos publicar el aviso. Intentá nuevamente." }));
    } finally {
      setLoading(false);
    }
  };

  const badgeClass = useMemo(() => {
    if (plan === "Enterprise") return "bg-emerald-100 text-emerald-800";
    if (plan === "Profesional") return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-700";
  }, [plan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4 md:p-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">M</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Publicar aviso</h1>
            <p className="text-sm text-gray-500">Creá un nuevo aviso respetando tu plan</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${badgeClass}`}>Plan {plan}</span>
      </header>

      <section className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Publicaciones activas: <strong>{activeCount}</strong>{" "}
              {limit !== Infinity ? (
                <>
                  / <strong>{limit}</strong>
                </>
              ) : (
                <>
                  (<strong>ilimitadas</strong>)
                </>
              )}
            </p>
            <p className="text-xs text-gray-500">
              Contabiliza avisos publicados y vigentes. Borradores, pausados y cerrados no cuentan.
            </p>
          </div>
          {atLimit ? (
            <span className="px-3 py-1 rounded-full text-xs bg-rose-100 text-rose-800 font-medium">Límite alcanzado</span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 font-medium">Podés publicar</span>
          )}
        </div>
        {atLimit && (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 p-3 text-sm">
            Alcanzaste el máximo de publicaciones activas para tu plan. Podés{" "}
            <button onClick={onPauseSome} className="underline font-medium">
              pausar o cerrar
            </button>{" "}
            un aviso para liberar cupo, o{" "}
            <button onClick={onUpgradePlan} className="underline font-medium">
              mejorar tu plan
            </button>{" "}
            para ampliar el límite.
          </div>
        )}
      </section>

      <section className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <select
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                className={`${inputClass} ${errors.role ? "border-red-400 ring-red-100" : "border-gray-300 focus:ring-emerald-100 focus:border-emerald-500"}`}
              >
                <option value="">Seleccioná…</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sede</label>
              <select
                value={form.siteId}
                onChange={(event) => setForm((prev) => ({ ...prev, siteId: event.target.value }))}
                className={`${inputClass} ${errors.siteId ? "border-red-400 ring-red-100" : "border-gray-300 focus:ring-emerald-100 focus:border-emerald-500"}`}
              >
                <option value="">Seleccioná…</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
              {errors.siteId && <p className="text-sm text-red-600 mt-1">{errors.siteId}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  className={`${inputClass} ${errors.date ? "border-red-400 ring-red-100" : "border-gray-300 focus:ring-emerald-100 focus:border-emerald-500"}`}
                />
                {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Desde</label>
                <input
                  type="time"
                  value={form.timeFrom}
                  onChange={(event) => setForm((prev) => ({ ...prev, timeFrom: event.target.value }))}
                  className={`${inputClass} ${errors.time ? "border-red-400 ring-red-100" : "border-gray-300 focus:ring-emerald-100 focus:border-emerald-500"}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hasta</label>
                <input
                  type="time"
                  value={form.timeTo}
                  onChange={(event) => setForm((prev) => ({ ...prev, timeTo: event.target.value }))}
                  className={`${inputClass} ${errors.time ? "border-red-400 ring-red-100" : "border-gray-300 focus:ring-emerald-100 focus:border-emerald-500"}`}
                />
                {errors.time && <p className="text-sm text-red-600 mt-1">{errors.time}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tarifa (ARS)</label>
              <input
                type="number"
                min={0}
                value={form.pay}
                onChange={(event) => setForm((prev) => ({ ...prev, pay: event.target.value }))}
                className={`${inputClass} ${errors.pay ? "border-red-400 ring-red-100" : "border-gray-300 focus:ring-emerald-100 focus:border-emerald-500"}`}
                placeholder="Ej: 18000"
              />
              {errors.pay && <p className="text-sm text-red-600 mt-1">{errors.pay}</p>}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => onOpenDynamicPricing?.(form)}
                  className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 hover:bg-emerald-100"
                >
                  Tarifa dinámica
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Vacantes (mismo rol/sede)</label>
              <input
                type="number"
                min={1}
                value={form.vacancies}
                onChange={(event) => setForm((prev) => ({ ...prev, vacancies: Number(event.target.value) }))}
                className={`${inputClass} ${errors.vacancies ? "border-red-400 ring-red-100" : "border-gray-300 focus:ring-emerald-100 focus:border-emerald-500"}`}
              />
              {errors.vacancies && <p className="text-sm text-red-600 mt-1">{errors.vacancies}</p>}
              <p className="text-xs text-gray-500 mt-1">Sugerencia: agrupar múltiples vacantes iguales en un solo aviso.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dress code / Requisitos</label>
              <input
                type="text"
                value={form.dressCode}
                onChange={(event) => setForm((prev) => ({ ...prev, dressCode: event.target.value }))}
                className={`${inputClass} border-gray-300 focus:ring-emerald-100 focus:border-emerald-500`}
                placeholder="Camisa negra, zapatos cerrados…"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notas para el turno</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                className={`${inputClass} border-gray-300 focus:ring-emerald-100 focus:border-emerald-500`}
                placeholder="Punto de encuentro, contacto, indicaciones…"
              />
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {errors._global && (
              <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{errors._global}</p>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPauseSome}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm hover:bg-gray-50"
              >
                Pausar/Cerrar avisos
              </button>
              <button
                type="button"
                onClick={onUpgradePlan}
                className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 hover:bg-amber-100"
              >
                Mejorar plan
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || atLimit}
              className={`rounded-xl px-4 py-2.5 font-medium text-white transition ${atLimit ? "bg-gray-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {loading ? "Publicando…" : atLimit ? "Límite alcanzado" : "Publicar aviso"}
            </button>
          </div>
        </form>
      </section>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowConfirm(false)} />
          <div className="relative w-full sm:max-w-lg bg-white rounded-2xl shadow-xl border p-4 sm:p-6 m-0 sm:m-4">
            <h2 className="text-lg font-semibold text-gray-900">Confirmar publicación</h2>
            <p className="text-sm text-gray-600 mt-1">Revisá los datos antes de publicar el aviso.</p>
            <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Rol</span>
                <span className="font-medium">{form.role || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sede</span>
                <span className="font-medium">{sites.find((site) => site.id === form.siteId)?.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha</span>
                <span className="font-medium">{form.date || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Horario</span>
                <span className="font-medium">
                  {form.timeFrom || "—"} – {form.timeTo || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tarifa</span>
                <span className="font-medium">
                  {form.pay ? `ARS ${Number(form.pay).toLocaleString("es-AR")}` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vacantes</span>
                <span className="font-medium">{form.vacancies || "—"}</span>
              </div>
              {form.dressCode && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Dress code</span>
                  <span className="font-medium text-right">{form.dressCode}</span>
                </div>
              )}
              {form.notes && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Notas</span>
                  <span className="font-medium text-right max-w-[60%]">{form.notes}</span>
                </div>
              )}
              <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-900">
                <p className="text-xs">
                  Plan <strong>{plan}</strong> · Publicaciones activas <strong>{activeCount}</strong>
                  {limit !== Infinity ? (
                    <>
                      {" "}/ <strong>{limit}</strong>
                    </>
                  ) : (
                    <>
                      {" "}(<strong>ilimitadas</strong>)
                    </>
                  )}.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmPublish}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium text-white ${loading ? "bg-gray-300" : "bg-emerald-600 hover:bg-emerald-700"}`}
                disabled={loading}
              >
                {loading ? "Publicando…" : "Confirmar y publicar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="text-xs text-gray-400 mt-6">© {new Date().getFullYear()} Manito · CABA/AMBA</footer>
    </div>
  );
};

export default CreateJobPost;
