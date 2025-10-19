"use client";

import React, { useEffect, useMemo, useState } from "react";

type DynamicPricingProps = {
  role?: string;
  site?: string;
  base?: number;
  distanceKm?: number;
  demandIndex?: number;
  reputation?: number;
  isPeakHour?: boolean;
  isShortNotice?: boolean;
  weatherSeverity?: number;
  lastPaidRates?: number[];
  min?: number;
  max?: number;
  onApply?: (amount: number) => void;
  onClose?: () => void;
};

const formatMoney = (value: number) => value.toLocaleString("es-AR");

const clamp = (value: number, minValue: number, maxValue: number) => Math.max(minValue, Math.min(maxValue, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t, 0, 1);

export type PriceModelParams = {
  base: number;
  distanceKm: number;
  demandIndex: number;
  reputation: number;
  isPeakHour: boolean;
  isShortNotice: boolean;
  weatherSeverity: number;
};

export const priceModel = ({
  base,
  distanceKm,
  demandIndex,
  reputation,
  isPeakHour,
  isShortNotice,
  weatherSeverity,
}: PriceModelParams) => {
  const demandFactor = lerp(0.05, 0.35, demandIndex);
  const peakFactor = isPeakHour ? 0.1 : 0;
  const shortNoticeFactor = isShortNotice ? 0.12 : 0;
  const distanceFactor = Math.min(0.2, distanceKm * 0.01);
  const reputationFactor = lerp(-0.04, 0.06, reputation / 5);
  const weatherFactor = weatherSeverity * 0.08;

  const factor = 1 + demandFactor + peakFactor + shortNoticeFactor + distanceFactor + reputationFactor + weatherFactor;
  return base * factor;
};

const genHint = (values: number[]) => {
  if (!values || values.length === 0) return { items: [] as number[], summary: "Sin historial" };
  const items = [...values].slice(-5);
  const avg = Math.round(items.reduce((sum, value) => sum + value, 0) / items.length);
  const minValue = Math.min(...items);
  const maxValue = Math.max(...items);
  return {
    items,
    summary: `Promedio reciente ARS ${formatMoney(avg)} (min ${formatMoney(minValue)} · max ${formatMoney(maxValue)})`,
  };
};

const cnInput = () => "w-full rounded-xl border px-3 py-2 bg-white border-gray-300 focus:outline-none";

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm">
    <h2 className="text-base font-semibold text-gray-900 mb-3">{title}</h2>
    {children}
  </section>
);

const Field = ({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) => (
  <label className="block mb-3">
    <span className="text-sm text-gray-700">{label}</span>
    <div className="mt-1">{children}</div>
    {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
  </label>
);

const FieldCheck = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) => (
  <label className="flex items-center gap-2 text-sm">
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <span className="text-gray-700">{label}</span>
  </label>
);

const DynamicPricing = ({
  role = "Mozo/a",
  site = "Sucursal Centro",
  base = 18000,
  distanceKm = 5,
  demandIndex = 0.5,
  reputation = 4.2,
  isPeakHour = false,
  isShortNotice = false,
  weatherSeverity = 0,
  lastPaidRates = [16000, 17500, 18500],
  min = 12000,
  max = 60000,
  onApply = () => {},
  onClose = () => {},
}: DynamicPricingProps) => {
  const [inputs, setInputs] = useState({
    base,
    distanceKm,
    demandIndex,
    reputation,
    isPeakHour,
    isShortNotice,
    weatherSeverity,
  });

  const hint = useMemo(() => genHint(lastPaidRates), [lastPaidRates]);

  const suggested = useMemo(
    () =>
      Math.round(
        clamp(
          priceModel({
            base: inputs.base,
            distanceKm: inputs.distanceKm,
            demandIndex: inputs.demandIndex,
            reputation: inputs.reputation,
            isPeakHour: inputs.isPeakHour,
            isShortNotice: inputs.isShortNotice,
            weatherSeverity: inputs.weatherSeverity,
          }),
          min,
          max,
        ),
      ),
    [inputs, min, max],
  );

  useEffect(() => {
    const lowDemand = priceModel({
      base: 18000,
      distanceKm: 5,
      demandIndex: 0.2,
      reputation: 4,
      isPeakHour: false,
      isShortNotice: false,
      weatherSeverity: 0,
    });
    const highDemand = priceModel({
      base: 18000,
      distanceKm: 5,
      demandIndex: 0.8,
      reputation: 4,
      isPeakHour: false,
      isShortNotice: false,
      weatherSeverity: 0,
    });
    console.assert(highDemand >= lowDemand, "Con mayor demanda el precio no debe bajar");

    const normalNotice = priceModel({
      base: 18000,
      distanceKm: 5,
      demandIndex: 0.5,
      reputation: 4,
      isPeakHour: false,
      isShortNotice: false,
      weatherSeverity: 0,
    });
    const urgentNotice = priceModel({
      base: 18000,
      distanceKm: 5,
      demandIndex: 0.5,
      reputation: 4,
      isPeakHour: false,
      isShortNotice: true,
      weatherSeverity: 0,
    });
    console.assert(urgentNotice > normalNotice, "Short notice debe incrementar precio");

    const lowReputation = priceModel({
      base: 18000,
      distanceKm: 5,
      demandIndex: 0.5,
      reputation: 2,
      isPeakHour: false,
      isShortNotice: false,
      weatherSeverity: 0,
    });
    const highReputation = priceModel({
      base: 18000,
      distanceKm: 5,
      demandIndex: 0.5,
      reputation: 5,
      isPeakHour: false,
      isShortNotice: false,
      weatherSeverity: 0,
    });
    console.assert(highReputation >= lowReputation, "Mayor reputación no debe bajar el precio");

    const clamped = clamp(
      priceModel({
        base: 200000,
        distanceKm: 50,
        demandIndex: 1,
        reputation: 5,
        isPeakHour: true,
        isShortNotice: true,
        weatherSeverity: 1,
      }),
      12000,
      60000,
    );
    console.assert(clamped <= 60000 && clamped >= 12000, "Debe clamp a límites");
  }, []);

  const update = <K extends keyof typeof inputs>(key: K, value: (typeof inputs)[K]) => {
    setInputs((state) => ({ ...state, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-sm p-4 md:p-6">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Tarifa dinámica</h1>
            <p className="text-sm text-gray-500">
              {role} · {site}
            </p>
          </div>
          <button onClick={() => onClose()} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
            Cerrar
          </button>
        </header>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Parámetros">
            <Field label="Base de mercado (ARS)">
              <input
                type="number"
                min={0}
                value={inputs.base}
                onChange={(event) => update("base", Number(event.target.value || 0))}
                className={cnInput()}
              />
            </Field>

            <Field label="Demanda del rol (0–1)" helper="0 = baja demanda; 1 = alta demanda">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={inputs.demandIndex}
                onChange={(event) => update("demandIndex", Number(event.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">{inputs.demandIndex.toFixed(2)}</p>
            </Field>

            <Field label="Distancia estimada (km)">
              <input
                type="number"
                min={0}
                step={0.1}
                value={inputs.distanceKm}
                onChange={(event) => update("distanceKm", Number(event.target.value || 0))}
                className={cnInput()}
              />
            </Field>

            <Field label="Reputación del empleador (0–5)">
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={inputs.reputation}
                onChange={(event) => update("reputation", Number(event.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">{inputs.reputation.toFixed(1)}</p>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <FieldCheck label="Horario pico" checked={inputs.isPeakHour} onChange={(value) => update("isPeakHour", value)} />
              <FieldCheck label="Aviso con poca anticipación" checked={inputs.isShortNotice} onChange={(value) => update("isShortNotice", value)} />
            </div>

            <Field label="Severidad climática (0–1)" helper="Usar 0 si no aplica">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={inputs.weatherSeverity}
                onChange={(event) => update("weatherSeverity", Number(event.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">{inputs.weatherSeverity.toFixed(2)}</p>
            </Field>
          </Card>

          <Card title="Sugerencia">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-sm text-emerald-800">Tarifa sugerida</p>
              <p className="text-3xl font-semibold text-emerald-900 mt-1">ARS {formatMoney(suggested)}</p>
              <p className="text-xs text-emerald-800/80 mt-1">
                Rango permitido: ARS {formatMoney(min)} – {formatMoney(max)}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900">Historial reciente</p>
              <ul className="mt-1 text-sm text-gray-600 list-disc ml-5">
                {hint.items.map((value, index) => (
                  <li key={index}>ARS {formatMoney(value)}</li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-1">{hint.summary}</p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => onApply(suggested)}
                className="rounded-xl px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Usar sugerida
              </button>
              <button
                onClick={() => onApply(clamp(Math.round(inputs.base), min, max))}
                className="rounded-xl px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50"
              >
                Usar base
              </button>
            </div>
          </Card>
        </div>

        <footer className="text-xs text-gray-400 mt-6">© {new Date().getFullYear()} Manito · CABA/AMBA</footer>
      </div>
    </div>
  );
};

export default DynamicPricing;
