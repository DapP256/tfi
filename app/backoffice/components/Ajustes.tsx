'use client';

import React from 'react';

interface AdminRow {
  id: string | number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  createdAt: string;
}

interface AjustesProps {
  rows: AdminRow[];
  onNew: () => void;
  onEdit: (row: AdminRow) => void;
  onExport: () => void;
  onBan: (id: AdminRow['id']) => void;
  onDelete: (id: AdminRow['id']) => void;
}

export default function Ajustes({ rows, onNew, onEdit, onExport, onBan, onDelete }: Readonly<AjustesProps>){
return (
<div className="bg-white rounded-2xl border p-4">
<div className="flex items-center justify-between mb-3">
<h3 className="text-sm font-semibold text-neutral-800">Administradores del sistema</h3>
<div className="flex items-center gap-2">
<button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">Exportar CSV</button>
<button onClick={onNew} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 text-sm">Nuevo admin</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="min-w-full text-sm">
<thead>
<tr className="text-left text-neutral-500">
<th className="py-2 pr-3">ID</th>
<th className="py-2 pr-3">Nombre</th>
<th className="py-2 pr-3">Email</th>
<th className="py-2 pr-3">Rol</th>
<th className="py-2 pr-3">Estado</th>
<th className="py-2 pr-3">Creado</th>
<th className="py-2 pr-3">Acciones</th>
</tr>
</thead>
<tbody className="divide-y">
{rows.map((a) => (
<tr key={a.id} className="hover:bg-neutral-50">
<td className="py-2 pr-3">{a.id}</td>
<td className="py-2 pr-3">{a.nombre}</td>
<td className="py-2 pr-3">{a.email}</td>
<td className="py-2 pr-3">{a.rol}</td>
<td className="py-2 pr-3">{a.estado}</td>
<td className="py-2 pr-3">{a.createdAt}</td>
<td className="py-2 pr-3 flex items-center gap-2">
<button onClick={()=>onEdit(a)} className="rounded-lg border px-2 py-1 text-xs">Editar</button>
<button onClick={()=>onBan(a.id)} className={`rounded-lg px-2 py-1 text-xs border ${a.estado==='activo'?'hover:bg-neutral-50':'bg-amber-100 border-amber-300'}`}>{a.estado==='activo'?'Suspender':'Reactivar'}</button>
<button onClick={()=>onDelete(a.id)} className="rounded-lg border px-2 py-1 text-xs text-red-600">Eliminar</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}