'use client';
import { labelEstadoInc } from './ui';
type IncidenciaRow = {
  id: string | number;
  servicio: string;
  negocio: string;
  trabajador: string;
  motivo: string;
  estado: string;
  creada: string;
};

type IncidenciasProps = {
  readonly rows: readonly IncidenciaRow[];
  readonly onResolver: (row: IncidenciaRow) => void;
  readonly onExport: () => void;
};

export default function Incidencias({ rows, onResolver, onExport }: IncidenciasProps){
return (
<div className="bg-white rounded-2xl border p-4">
<div className="flex items-center justify-between mb-3">
<h3 className="text-sm font-semibold text-neutral-800">Incidencias</h3>
<div className="flex items-center gap-2">
<button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">Exportar CSV</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="min-w-full text-sm">
<thead>
<tr className="text-left text-neutral-500">
<th className="py-2 pr-3">ID</th>
<th className="py-2 pr-3">Servicio</th>
<th className="py-2 pr-3">Negocio</th>
<th className="py-2 pr-3">Trabajador</th>
<th className="py-2 pr-3">Motivo</th>
<th className="py-2 pr-3">Estado</th>
<th className="py-2 pr-3">Creada</th>
<th className="py-2 pr-3">Acciones</th>
</tr>
</thead>
<tbody className="divide-y">
{rows.map((i) => (
<tr key={i.id} className="hover:bg-neutral-50">
<td className="py-2 pr-3">{i.id}</td>
<td className="py-2 pr-3">{i.servicio}</td>
<td className="py-2 pr-3">{i.negocio}</td>
<td className="py-2 pr-3">{i.trabajador}</td>
<td className="py-2 pr-3">{i.motivo}</td>
<td className="py-2 pr-3">{labelEstadoInc(i.estado)}</td>
<td className="py-2 pr-3">{i.creada}</td>
<td className="py-2 pr-3 flex items-center gap-2">
<button onClick={()=>onResolver(i)} className="rounded-lg border px-2 py-1 text-xs">Resolver</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}