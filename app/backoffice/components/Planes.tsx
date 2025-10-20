'use client';

interface Plane {
  notas: string;
  mensual: number;
  comision: number;
  publicaciones: number | string;
  release: string;
}

interface PlanesProps {
  readonly planes: Readonly<Record<string, Plane>>;
  readonly onEdit: (nombre: string) => void;
}

export default function Planes({ planes, onEdit }: PlanesProps){
return (
<div className="bg-white rounded-2xl border p-4">
<div className="flex items-center justify-between mb-3">
<h3 className="text-sm font-semibold text-neutral-800">Planes</h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{Object.entries(planes).map(([nombre, p]) => (
<div key={nombre} className="rounded-2xl border p-4 bg-neutral-50">
<div className="flex items-center justify-between">
<div>
<h4 className="text-sm font-semibold text-neutral-900">{nombre}</h4>
<p className="text-xs text-neutral-600">{p.notas}</p>
</div>
<button onClick={()=>onEdit(nombre)} className="rounded-lg border px-2 py-1 text-xs">Editar</button>
</div>
<div className="mt-3 text-sm text-neutral-800 space-y-1">
<div>Mensual: <strong>${p.mensual.toLocaleString('es-AR')}</strong></div>
<div>Comisión: <strong>{Math.round(p.comision*100)}%</strong></div>
<div>Publicaciones: <strong>{String(p.publicaciones)}</strong></div>
<div>Liberación: <strong>{p.release}</strong></div>
</div>
</div>
))}
</div>
</div>
);
}