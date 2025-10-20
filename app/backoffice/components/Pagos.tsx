'use client';
import { labelTipoPago, labelEstadoPago } from './ui';
type PagoRow = {
  id: string | number;
  tipo: string;
  beneficiario: string;
  monto: number;
  metodo: string;
  estado: string;
  creado: string;
};

type PagosProps = {
  rows: PagoRow[];
  onEstado: (row: PagoRow) => void;
  onExport: () => void;
};

export default function Pagos({ rows, onEstado, onExport }: Readonly<PagosProps>){
return (
<div className="bg-white rounded-2xl border p-4">
<div className="flex items-center justify-between mb-3">
<h3 className="text-sm font-semibold text-neutral-800">Pagos</h3>
<button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">Exportar CSV</button>
</div>
<div className="overflow-x-auto">
<table className="min-w-full text-sm">
<thead>
<tr className="text-left text-neutral-500">
<th className="py-2 pr-3">ID</th>
<th className="py-2 pr-3">Tipo</th>
<th className="py-2 pr-3">Beneficiario</th>
<th className="py-2 pr-3">Monto (ARS)</th>
<th className="py-2 pr-3">Método</th>
<th className="py-2 pr-3">Estado</th>
<th className="py-2 pr-3">Creado</th>
<th className="py-2 pr-3">Acciones</th>
</tr>
</thead>
<tbody className="divide-y">
{rows.map((p) => (
<tr key={p.id} className="hover:bg-neutral-50">
<td className="py-2 pr-3">{p.id}</td>
<td className="py-2 pr-3">{labelTipoPago(p.tipo)}</td>
<td className="py-2 pr-3">{p.beneficiario}</td>
<td className="py-2 pr-3">${p.monto.toLocaleString('es-AR')}</td>
<td className="py-2 pr-3">{p.metodo}</td>
<td className="py-2 pr-3">{labelEstadoPago(p.estado)}</td>
<td className="py-2 pr-3">{p.creado}</td>
<td className="py-2 pr-3 flex items-center gap-2">
<button onClick={()=>onEstado(p)} className="rounded-lg border px-2 py-1 text-xs">Cambiar estado</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}