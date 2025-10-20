'use client';
type NegociosProps = {
  readonly rows: ReadonlyArray<{
	id: number;
	nombre: string;
	plan: string;
	publicaciones: number;
	deudaARS: number;
	ownerEmail: string;
	alta: string;
  }>;
  readonly onExport: () => void;
};

export default function Negocios({ rows, onExport }: NegociosProps){
return (
<div className="bg-white rounded-2xl border p-4">
<div className="flex items-center justify-between mb-3">
<h3 className="text-sm font-semibold text-neutral-800">Negocios</h3>
<button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">Exportar CSV</button>
</div>
<div className="overflow-x-auto">
<table className="min-w-full text-sm">
<thead>
<tr className="text-left text-neutral-500">
<th className="py-2 pr-3">ID</th>
<th className="py-2 pr-3">Nombre</th>
<th className="py-2 pr-3">Plan</th>
<th className="py-2 pr-3">Publicaciones</th>
<th className="py-2 pr-3">Deuda (ARS)</th>
<th className="py-2 pr-3">Owner</th>
<th className="py-2 pr-3">Alta</th>
</tr>
</thead>
<tbody className="divide-y">
{rows.map((b) => (
<tr key={b.id} className="hover:bg-neutral-50">
<td className="py-2 pr-3">{b.id}</td>
<td className="py-2 pr-3">{b.nombre}</td>
<td className="py-2 pr-3">{b.plan}</td>
<td className="py-2 pr-3">{String(b.publicaciones)}</td>
<td className="py-2 pr-3">${b.deudaARS.toLocaleString('es-AR')}</td>
<td className="py-2 pr-3">{b.ownerEmail}</td>
<td className="py-2 pr-3">{b.alta}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}