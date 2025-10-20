'use client';
import { Kpi } from './ui';
type Usuario = { id: string; estado: string; /* add other fields as needed */ };
type Negocio = { id: string; deudaARS?: number; /* add other fields as needed */ };
type Incidencia = { id: string; estado: string; motivo: string; negocio: string; /* add other fields as needed */ };
type Pago = { id: string; estado: string; tipo: string; beneficiario: string; creado: string; /* add other fields as needed */ };

interface ResumenProps {
  usuarios: Usuario[];
  negocios: Negocio[];
  incidencias: Incidencia[];
  pagos: Pago[];
  fmt: (n: number) => string;
}

export default function Resumen({ usuarios, negocios, incidencias, pagos, fmt }: Readonly<ResumenProps>){
const activos = usuarios.filter(u=>u.estado==='activo').length;
const incAbiertas = incidencias.filter(i=>i.estado!=='resuelta').length;
const pagosPend = pagos.filter(p=>p.estado==='pendiente').length;
const deudaTotal = negocios.reduce((acc, n)=> acc + (Number(n.deudaARS)||0), 0);
return (
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
<Kpi big label="Usuarios activos" value={activos} />
<Kpi big label="Incidencias abiertas" value={incAbiertas} />
<Kpi big label="Pagos pendientes" value={pagosPend} />
<Kpi big label="Deuda total (ARS)" value={`$${fmt(deudaTotal)}`} />
<div className="md:col-span-2 bg-white rounded-2xl border p-4">
<h3 className="text-sm font-semibold text-neutral-800 mb-2">Últimos movimientos</h3>
<ul className="text-sm text-neutral-700 space-y-2">
{pagos.slice(0,3).map((p)=> (
<li key={p.id} className="flex items-center justify-between">
<span>Pago {p.id} · {p.tipo} → {p.beneficiario}</span>
<span className="text-xs text-neutral-500">{p.estado} · {p.creado}</span>
</li>
))}
</ul>
</div>
<div className="bg-white rounded-2xl border p-4">
<h3 className="text-sm font-semibold text-neutral-800 mb-2">Incidencias recientes</h3>
<ul className="text-sm text-neutral-700 space-y-2">
{incidencias.slice(0,3).map((i)=> (
<li key={i.id} className="flex items-center justify-between">
<span>#{i.id} · {i.motivo} · {i.negocio}</span>
<span className="text-xs text-neutral-500">{i.estado}</span>
</li>
))}
</ul>
</div>
</div>
);
}