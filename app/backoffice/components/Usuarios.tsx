'use client';

interface Usuario {
  id: string | number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  createdAt: string;
}

interface UsuariosProps {
  rows: Usuario[];
  onBan: (id: string | number) => void;
  onRole: (id: string | number, newRol: string) => void;
  onExport: () => void;
  onOpen: (usuario: Usuario) => void;
}

export default function Usuarios({ rows, onBan, onRole, onExport, onOpen }: Readonly<UsuariosProps>) {
return (
<div className="bg-white rounded-2xl border p-4">
<div className="flex items-center justify-between mb-3">
<h3 className="text-sm font-semibold text-neutral-800">Usuarios</h3>
<div className="flex items-center gap-2">
<button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">Exportar CSV</button>
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
{rows.map((u) => (
<tr key={u.id} className="hover:bg-neutral-50">
<td className="py-2 pr-3">{u.id}</td>
<td className="py-2 pr-3">{u.nombre}</td>
<td className="py-2 pr-3">{u.email}</td>
<td className="py-2 pr-3">{u.rol}</td>
<td className="py-2 pr-3">{u.estado}</td>
<td className="py-2 pr-3">{u.createdAt}</td>
<td className="py-2 pr-3 flex items-center gap-2">
<button onClick={()=>onOpen(u)} className="rounded-lg border px-2 py-1 text-xs">Ver/Editar</button>
<button onClick={()=>onRole(u.id, u.rol==='empleado'?'negocio':'empleado')} className="rounded-lg border px-2 py-1 text-xs">Cambiar rol</button>
<button onClick={()=>onBan(u.id)} className={`rounded-lg px-2 py-1 text-xs border ${u.estado==='activo'?'hover:bg-neutral-50':'bg-amber-100 border-amber-300'}`}>{u.estado==='activo'?'Suspender':'Reactivar'}</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}