"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";

/**
 * Pantalla: Backoffice / Administrador del sistema
 * Contexto: Manito (operación y soporte)
 *
 * ✔️ Un solo archivo, sin dependencias externas
 * ✔️ Tailwind para estilos
 * ✔️ Módulos: Resumen, Usuarios, Negocios, Incidencias, Pagos, Planes, Ajustes
 * ✔️ Listados con búsqueda, filtros, acciones rápidas y exportación CSV
 * ✔️ Modales simples para editar/bannear, resolver incidencias, aprobar pagos y editar planes
 * ✔️ Toasts de confirmación
 */
export default function AdminBackoffice() {
  const hoyISO = new Date().toISOString().slice(0, 10);
  const usuariosInit = useMemo(
    () => [
      { id: 1, nombre: "Carla López", email: "carla@correo.com", rol: "empleado", estado: "activo", createdAt: "2025-08-12" },
      { id: 2, nombre: "Diego Fernández", email: "diego@correo.com", rol: "empleado", estado: "activo", createdAt: "2025-07-02" },
      { id: 3, nombre: "Restó La Plaza", email: "admin@laplaza.com", rol: "negocio", estado: "activo", createdAt: "2025-06-10" },
      { id: 4, nombre: "Cafetería 9 de Julio", email: "admin@cafe9.com", rol: "negocio", estado: "suspendido", createdAt: "2025-05-28" },
      { id: 5, nombre: "Mariana Silva", email: "mariana@correo.com", rol: "empleado", estado: "activo", createdAt: "2025-08-30" },
    ],
    []
  );

  const negociosInit = useMemo(
    () => [
      { id: 101, nombre: "Restó La Plaza", plan: "Profesional", publicaciones: 12, deudaARS: 0, ownerEmail: "admin@laplaza.com", alta: "2025-04-01" },
      { id: 102, nombre: "Cafetería 9 de Julio", plan: "Esencial", publicaciones: 5, deudaARS: 45800, ownerEmail: "admin@cafe9.com", alta: "2025-06-12" },
      { id: 103, nombre: "Sushi Central", plan: "Enterprise", publicaciones: 44, deudaARS: 0, ownerEmail: "cto@sushicentral.com", alta: "2025-03-22" },
    ],
    []
  );

  const incidenciasInit = useMemo(
    () => [
      { id: "INC-1201", servicio: "SRV-2025-0001", negocio: "Restó La Plaza", trabajador: "Diego Fernández", motivo: "tardanza", estado: "abierta", creada: hoyISO },
      { id: "INC-1202", servicio: "SRV-2025-0007", negocio: "Cafetería 9 de Julio", trabajador: "Mariana Silva", motivo: "desempeno", estado: "en_revisión", creada: "2025-09-19" },
      { id: "INC-1203", servicio: "SRV-2025-0009", negocio: "Sushi Central", trabajador: "Carla López", motivo: "otros", estado: "resuelta", creada: "2025-09-15" },
    ],
    [hoyISO]
  );

  const pagosInit = useMemo(
    () => [
      { id: "PAY-901", tipo: "payout_trabajador", beneficiario: "Diego Fernández", monto: 54000, metodo: "CBU", estado: "pendiente", creado: hoyISO },
      { id: "PAY-902", tipo: "payout_trabajador", beneficiario: "Mariana Silva", monto: 38000, metodo: "CBU", estado: "aprobado", creado: "2025-09-18" },
      { id: "PAY-903", tipo: "cobro_negocio", beneficiario: "Cafetería 9 de Julio", monto: 45800, metodo: "MP", estado: "pendiente", creado: "2025-09-18" },
    ],
    [hoyISO]
  );

  const PLANES = useMemo(
    () => ({
      Esencial: {
        mensual: 9900,
        comision: 0.08,
        publicaciones: 5,
        release: "48h",
        notas: "Analítica básica, soporte chat",
      },
      Profesional: {
        mensual: 14900,
        comision: 0.05,
        publicaciones: 20,
        release: "24h",
        notas: "Analítica intermedia, SLA ≤4h",
      },
      Enterprise: {
        mensual: 19900,
        comision: 0.03,
        publicaciones: "ilimitadas",
        release: "inmediata",
        notas: "Analítica avanzada/BI, prioridad matching, API/SSO",
      },
    }),
    []
  );

  const [tab, setTab] = useState("resumen");
  const [q, setQ] = useState("");
  const [usuarios, setUsuarios] = useState(usuariosInit);
  const [negocios] = useState(negociosInit);
  const [incidencias, setIncidencias] = useState(incidenciasInit);
  const [pagos, setPagos] = useState(pagosInit);
  const [toast, setToast] = useState<any | null>(null);
  const [modal, setModal] = useState<any | null>(null);

  const showToast = (title: string, description?: string) => {
    setToast({ title, description });
    setTimeout(() => setToast(null), 3200);
  };

  const fmt = (n: number | string) => (Number(n) || 0).toLocaleString("es-AR");

  const exportCSV = (rows: any[][], filename: string) => {
    const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const filteredUsers = usuarios.filter((user) => (q ? (user.nombre + user.email).toLowerCase().includes(q.toLowerCase()) : true));
  const filteredBiz = negocios.filter((biz) => (q ? (biz.nombre + biz.ownerEmail).toLowerCase().includes(q.toLowerCase()) : true));
  const filteredInc = incidencias.filter((inc) => (q ? (inc.id + inc.servicio + inc.negocio + inc.trabajador).toLowerCase().includes(q.toLowerCase()) : true));
  const filteredPay = pagos.filter((pay) => (q ? (pay.id + pay.beneficiario + pay.tipo).toLowerCase().includes(q.toLowerCase()) : true));

  const toggleBan = (id: number) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, estado: u.estado === "activo" ? "suspendido" : "activo" } : u)));
    showToast("Usuario actualizado", `ID ${id} · estado cambiado`);
  };

  const updateUserRole = (id: number, rol: string) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol } : u)));
    showToast("Rol actualizado", `${rol.toUpperCase()} aplicado`);
  };

  const resolveIncidencia = (id: string, decision: string) => {
    setIncidencias((prev) => prev.map((inc) => (inc.id === id ? { ...inc, estado: decision } : inc)));
    showToast("Incidencia actualizada", `#${id} → ${decision}`);
  };

  const updatePago = (id: string, estado: string) => {
    setPagos((prev) => prev.map((pay) => (pay.id === id ? { ...pay, estado } : pay)));
    showToast("Pago actualizado", `#${id} → ${estado}`);
  };

  const updatePlan = (nombre: string, patch: any) => {
    const nuevo = { ...PLANES[nombre], ...patch };
    PLANES[nombre] = nuevo;
    showToast("Plan guardado", `${nombre} actualizado`);
    setModal(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">Backoffice / Administrador</h1>
              <p className="text-sm text-neutral-500">Monitoreo, soporte y configuración del sistema</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Kpi label="Usuarios" value={usuarios.length} />
              <Kpi label="Negocios" value={negocios.length} />
              <Kpi label="Incidencias abiertas" value={incidencias.filter((inc) => inc.estado !== "resuelta").length} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border overflow-hidden">
            {[
              ["resumen", "Resumen"],
              ["usuarios", "Usuarios"],
              ["negocios", "Negocios"],
              ["incidencias", "Incidencias"],
              ["pagos", "Pagos"],
              ["planes", "Planes"],
              ["ajustes", "Ajustes"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className={`px-3 py-2 text-sm ${tab === key ? "bg-neutral-100" : "hover:bg-neutral-50"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Buscar…" className="rounded-xl border px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="mt-6">
          {tab === "resumen" && <Resumen usuarios={usuarios} negocios={negocios} incidencias={incidencias} pagos={pagos} fmt={fmt} />}

          {tab === "usuarios" && (
            <UsuariosTable
              rows={filteredUsers}
              onBan={toggleBan}
              onRole={updateUserRole}
              onExport={() => {
                const rows = [["ID", "Nombre", "Email", "Rol", "Estado", "Creado"]];
                filteredUsers.forEach((user) => rows.push([user.id, user.nombre, user.email, user.rol, user.estado, user.createdAt]));
                exportCSV(rows, `usuarios_${hoyISO}.csv`);
              }}
              onOpen={(user) => setModal({ type: "usuario", payload: user })}
            />
          )}

          {tab === "negocios" && (
            <NegociosTable
              rows={filteredBiz}
              onExport={() => {
                const rows = [["ID", "Nombre", "Plan", "Publicaciones", "Deuda", "Owner", "Alta"]];
                filteredBiz.forEach((biz) => rows.push([biz.id, biz.nombre, biz.plan, String(biz.publicaciones), biz.deudaARS, biz.ownerEmail, biz.alta]));
                exportCSV(rows, `negocios_${hoyISO}.csv`);
              }}
            />
          )}

          {tab === "incidencias" && (
            <IncidenciasTable
              rows={filteredInc}
              onResolver={(inc) => setModal({ type: "incidencia", payload: inc })}
              onExport={() => {
                const rows = [["ID", "Servicio", "Negocio", "Trabajador", "Motivo", "Estado", "Creada"]];
                filteredInc.forEach((inc) => rows.push([inc.id, inc.servicio, inc.negocio, inc.trabajador, inc.motivo, inc.estado, inc.creada]));
                exportCSV(rows, `incidencias_${hoyISO}.csv`);
              }}
            />
          )}

          {tab === "pagos" && (
            <PagosTable
              rows={filteredPay}
              onEstado={(pay) => setModal({ type: "pago", payload: pay })}
              onExport={() => {
                const rows = [["ID", "Tipo", "Beneficiario", "Monto", "Método", "Estado", "Creado"]];
                filteredPay.forEach((pay) => rows.push([pay.id, pay.tipo, pay.beneficiario, pay.monto, pay.metodo, pay.estado, pay.creado]));
                exportCSV(rows, `pagos_${hoyISO}.csv`);
              }}
            />
          )}

          {tab === "planes" && <PlanesPanel planes={PLANES} onEdit={(nombre: string) => setModal({ type: "plan", payload: { nombre, data: PLANES[nombre] } })} />}

          {tab === "ajustes" && <AjustesPanel />}
        </div>
      </div>

      {modal?.type === "usuario" && (
        <Modal onClose={() => setModal(null)} title="Usuario">
          <UsuarioModal u={modal.payload} onBan={toggleBan} onRole={updateUserRole} />
        </Modal>
      )}

      {modal?.type === "incidencia" && (
        <Modal onClose={() => setModal(null)} title={`Incidencia ${modal.payload.id}`}>
          <IncidenciaModal
            i={modal.payload}
            onResolve={(decision: string) => {
              resolveIncidencia(modal.payload.id, decision);
              setModal(null);
            }}
          />
        </Modal>
      )}

      {modal?.type === "pago" && (
        <Modal onClose={() => setModal(null)} title={`Pago ${modal.payload.id}`}>
          <PagoModal
            p={modal.payload}
            onUpdate={(estado: string) => {
              updatePago(modal.payload.id, estado);
              setModal(null);
            }}
          />
        </Modal>
      )}

      {modal?.type === "plan" && (
        <Modal onClose={() => setModal(null)} title={`Editar plan: ${modal.payload.nombre}`}>
          <PlanModal nombre={modal.payload.nombre} data={modal.payload.data} onSave={updatePlan} />
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-2xl shadow-lg border bg-white px-4 py-3 min-w-[280px]">
            <p className="text-sm font-medium text-neutral-800">{toast.title}</p>
            {toast.description && <p className="text-xs text-neutral-500 mt-0.5">{toast.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function Resumen({ usuarios, negocios, incidencias, pagos, fmt }: any) {
  const activos = usuarios.filter((user: any) => user.estado === "activo").length;
  const incAbiertas = incidencias.filter((inc: any) => inc.estado !== "resuelta").length;
  const pagosPend = pagos.filter((pay: any) => pay.estado === "pendiente").length;
  const deudaTotal = negocios.reduce((acc: number, negocio: any) => acc + (Number(negocio.deudaARS) || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Kpi big label="Usuarios activos" value={activos} />
      <Kpi big label="Incidencias abiertas" value={incAbiertas} />
      <Kpi big label="Pagos pendientes" value={pagosPend} />
      <Kpi big label="Deuda total (ARS)" value={`$${fmt(deudaTotal)}`} />

      <div className="md:col-span-2 bg-white rounded-2xl border p-4">
        <h3 className="text-sm font-semibold text-neutral-800 mb-2">Últimos movimientos</h3>
        <ul className="text-sm text-neutral-700 space-y-2">
          {pagos.slice(0, 3).map((pay: any) => (
            <li key={pay.id} className="flex items-center justify-between">
              <span>
                Pago {pay.id} · {pay.tipo} → {pay.beneficiario}
              </span>
              <span className="text-xs text-neutral-500">
                {pay.estado} · {pay.creado}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-2xl border p-4">
        <h3 className="text-sm font-semibold text-neutral-800 mb-2">Incidencias recientes</h3>
        <ul className="text-sm text-neutral-700 space-y-2">
          {incidencias.slice(0, 3).map((inc: any) => (
            <li key={inc.id} className="flex items-center justify-between">
              <span>
                #{inc.id} · {inc.motivo} · {inc.negocio}
              </span>
              <span className="text-xs text-neutral-500">{inc.estado}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function UsuariosTable({ rows, onBan, onRole, onExport, onOpen }: any) {
  return (
    <div className="bg-white rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-800">Usuarios</h3>
        <div className="flex items-center gap-2">
          <button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
            Exportar CSV
          </button>
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
            {rows.map((user: any) => (
              <tr key={user.id} className="hover:bg-neutral-50">
                <td className="py-2 pr-3">{user.id}</td>
                <td className="py-2 pr-3">{user.nombre}</td>
                <td className="py-2 pr-3">{user.email}</td>
                <td className="py-2 pr-3">{user.rol}</td>
                <td className="py-2 pr-3">{user.estado}</td>
                <td className="py-2 pr-3">{user.createdAt}</td>
                <td className="py-2 pr-3 flex items-center gap-2">
                  <button onClick={() => onOpen(user)} className="rounded-lg border px-2 py-1 text-xs">
                    Ver/Editar
                  </button>
                  <button onClick={() => onRole(user.id, user.rol === "empleado" ? "negocio" : "empleado")} className="rounded-lg border px-2 py-1 text-xs">
                    Cambiar rol
                  </button>
                  <button
                    onClick={() => onBan(user.id)}
                    className={`rounded-lg px-2 py-1 text-xs border ${user.estado === "activo" ? "hover:bg-neutral-50" : "bg-amber-100 border-amber-300"}`}
                  >
                    {user.estado === "activo" ? "Suspender" : "Reactivar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NegociosTable({ rows, onExport }: any) {
  return (
    <div className="bg-white rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-800">Negocios</h3>
        <button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
          Exportar CSV
        </button>
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
            {rows.map((biz: any) => (
              <tr key={biz.id} className="hover:bg-neutral-50">
                <td className="py-2 pr-3">{biz.id}</td>
                <td className="py-2 pr-3">{biz.nombre}</td>
                <td className="py-2 pr-3">{biz.plan}</td>
                <td className="py-2 pr-3">{String(biz.publicaciones)}</td>
                <td className="py-2 pr-3">${biz.deudaARS.toLocaleString("es-AR")}</td>
                <td className="py-2 pr-3">{biz.ownerEmail}</td>
                <td className="py-2 pr-3">{biz.alta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IncidenciasTable({ rows, onResolver, onExport }: any) {
  return (
    <div className="bg-white rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-800">Incidencias</h3>
        <div className="flex items-center gap-2">
          <button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
            Exportar CSV
          </button>
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
            {rows.map((inc: any) => (
              <tr key={inc.id} className="hover:bg-neutral-50">
                <td className="py-2 pr-3">{inc.id}</td>
                <td className="py-2 pr-3">{inc.servicio}</td>
                <td className="py-2 pr-3">{inc.negocio}</td>
                <td className="py-2 pr-3">{inc.trabajador}</td>
                <td className="py-2 pr-3">{inc.motivo}</td>
                <td className="py-2 pr-3">{labelEstadoInc(inc.estado)}</td>
                <td className="py-2 pr-3">{inc.creada}</td>
                <td className="py-2 pr-3 flex items-center gap-2">
                  <button onClick={() => onResolver(inc)} className="rounded-lg border px-2 py-1 text-xs">
                    Resolver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PagosTable({ rows, onEstado, onExport }: any) {
  return (
    <div className="bg-white rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-800">Pagos</h3>
        <button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
          Exportar CSV
        </button>
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
            {rows.map((pay: any) => (
              <tr key={pay.id} className="hover:bg-neutral-50">
                <td className="py-2 pr-3">{pay.id}</td>
                <td className="py-2 pr-3">{labelTipoPago(pay.tipo)}</td>
                <td className="py-2 pr-3">{pay.beneficiario}</td>
                <td className="py-2 pr-3">${pay.monto.toLocaleString("es-AR")}</td>
                <td className="py-2 pr-3">{pay.metodo}</td>
                <td className="py-2 pr-3">{labelEstadoPago(pay.estado)}</td>
                <td className="py-2 pr-3">{pay.creado}</td>
                <td className="py-2 pr-3 flex items-center gap-2">
                  <button onClick={() => onEstado(pay)} className="rounded-lg border px-2 py-1 text-xs">
                    Cambiar estado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlanesPanel({ planes, onEdit }: any) {
  return (
    <div className="bg-white rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-800">Planes</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(planes).map(([nombre, plan]: any) => (
          <div key={nombre} className="rounded-2xl border p-4 bg-neutral-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">{nombre}</h4>
                <p className="text-xs text-neutral-600">{plan.notas}</p>
              </div>
              <button onClick={() => onEdit(nombre)} className="rounded-lg border px-2 py-1 text-xs">
                Editar
              </button>
            </div>
            <div className="mt-3 text-sm text-neutral-800 space-y-1">
              <div>
                Mensual: <strong>${plan.mensual.toLocaleString("es-AR")}</strong>
              </div>
              <div>
                Comisión: <strong>{Math.round(plan.comision * 100)}%</strong>
              </div>
              <div>
                Publicaciones: <strong>{String(plan.publicaciones)}</strong>
              </div>
              <div>
                Liberación: <strong>{plan.release}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AjustesPanel() {
  const [maintenance, setMaintenance] = useState(false);
  const [emailSoporte, setEmailSoporte] = useState("soporte@manito.app");
  const [whitelist, setWhitelist] = useState("@manito.app, @empresa.com");
  return (
    <div className="bg-white rounded-2xl border p-4 space-y-4">
      <h3 className="text-sm font-semibold text-neutral-800">Ajustes</h3>
      <label className="inline-flex items-center gap-2 text-xs text-neutral-700">
        <input type="checkbox" checked={maintenance} onChange={(event) => setMaintenance(event.target.checked)} />
        Activar modo mantenimiento (solo admin/soporte)
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-neutral-600">Email de soporte</label>
          <input value={emailSoporte} onChange={(event) => setEmailSoporte(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-neutral-600">Whitelist de dominios (registro)</label>
          <input value={whitelist} onChange={(event) => setWhitelist(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="text-xs text-neutral-500">Nota: Los cambios aquí son globales. En una implementación real, confirmar con doble control.</div>
    </div>
  );
}

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border shadow-xl w-full max-w-2xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
          <button onClick={onClose} className="rounded-lg border px-2 py-1 text-xs">
            Cerrar
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

function UsuarioModal({ u, onBan, onRole }: any) {
  const [rol, setRol] = useState(u.rol);
  const [estado, setEstado] = useState(u.estado);
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-neutral-600">Nombre</div>
          <div className="font-medium">{u.nombre}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-600">Email</div>
          <div className="font-medium">{u.email}</div>
        </div>
        <div>
          <label className="text-xs text-neutral-600">Rol</label>
          <select value={rol} onChange={(event) => setRol(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm">
            <option value="empleado">Empleado</option>
            <option value="negocio">Negocio</option>
            <option value="soporte">Soporte</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-neutral-600">Estado</label>
          <select value={estado} onChange={(event) => setEstado(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm">
            <option value="activo">Activo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onRole(u.id, rol)} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
          Guardar rol
        </button>
        <button onClick={() => onBan(u.id)} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
          {estado === "activo" ? "Suspender" : "Reactivar"}
        </button>
      </div>
    </div>
  );
}

function IncidenciaModal({ i, onResolve }: any) {
  const [decision, setDecision] = useState("resuelta");
  const [nota, setNota] = useState("");
  return (
    <div className="space-y-3 text-sm">
      <div className="text-neutral-700">
        Resolver incidencia <strong>#{i.id}</strong> del servicio <strong>{i.servicio}</strong>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-600">Decisión</label>
          <select value={decision} onChange={(event) => setDecision(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm">
            <option value="resuelta">Marcar como resuelta</option>
            <option value="reembolsar_negocio">Reembolsar negocio</option>
            <option value="pagar_trabajador">Pagar trabajador</option>
            <option value="en_revisión">Mantener en revisión</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-neutral-600">Nota interna</label>
          <input value={nota} onChange={(event) => setNota(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" placeholder="Resumen de soporte" />
        </div>
      </div>
      <div>
        <button onClick={() => onResolve(decision)} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm">
          Aplicar resolución
        </button>
      </div>
    </div>
  );
}

function PagoModal({ p, onUpdate }: any) {
  const [estado, setEstado] = useState(p.estado);
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-neutral-600">Beneficiario</div>
          <div className="font-medium">{p.beneficiario}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-600">Monto</div>
          <div className="font-medium">${p.monto.toLocaleString("es-AR")}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-600">Método</div>
          <div className="font-medium">{p.metodo}</div>
        </div>
        <div>
          <label className="text-xs text-neutral-600">Estado</label>
          <select value={estado} onChange={(event) => setEstado(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm">
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
      </div>
      <button onClick={() => onUpdate(estado)} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm">
        Guardar
      </button>
    </div>
  );
}

function PlanModal({ nombre, data, onSave }: any) {
  const [mensual, setMensual] = useState(data.mensual);
  const [comision, setComision] = useState(data.comision);
  const [publicaciones, setPublicaciones] = useState(String(data.publicaciones));
  const [release, setRelease] = useState(data.release);
  const [notas, setNotas] = useState(data.notas);
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-600">Precio mensual (ARS)</label>
          <input type="number" value={mensual} onChange={(event) => setMensual(Number(event.target.value) || 0)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-neutral-600">Comisión (%)</label>
          <input type="number" step="0.01" value={comision} onChange={(event) => setComision(Number(event.target.value) || 0)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-neutral-600">Publicaciones</label>
          <input value={publicaciones} onChange={(event) => setPublicaciones(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-neutral-600">Liberación de pagos</label>
          <input value={release} onChange={(event) => setRelease(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-neutral-600">Notas</label>
          <input value={notas} onChange={(event) => setNotas(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
      </div>
      <button onClick={() => onSave(nombre, { mensual, comision, publicaciones, release, notas })} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm">
        Guardar plan
      </button>
    </div>
  );
}

function Kpi({ label, value, big = false }: any) {
  return (
    <div className={`rounded-2xl border bg-white p-4 ${big ? "shadow-sm" : ""}`}>
      <div className="text-xs text-neutral-500">{label}</div>
      <div className={`font-semibold text-neutral-900 ${big ? "text-2xl" : "text-lg"}`}>{value}</div>
    </div>
  );
}

function labelTipoPago(tipo: string) {
  switch (tipo) {
    case "payout_trabajador":
      return "Payout trabajador";
    case "cobro_negocio":
      return "Cobro a negocio";
    default:
      return tipo;
  }
}

function labelEstadoPago(estado: string) {
  switch (estado) {
    case "pendiente":
      return "Pendiente";
    case "aprobado":
      return "Aprobado";
    case "rechazado":
      return "Rechazado";
    default:
      return estado;
  }
}

function labelEstadoInc(estado: string) {
  switch (estado) {
    case "abierta":
      return "Abierta";
    case "en_revisión":
      return "En revisión";
    case "resuelta":
      return "Resuelta";
    case "reembolsar_negocio":
      return "Reembolsar negocio";
    case "pagar_trabajador":
      return "Pagar trabajador";
    default:
      return estado;
  }
}

function csvEscape(value: any) {
  if (value == null) return "";
  const stringValue = String(value).replaceAll('"', '""');
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue}"`;
  }
  return stringValue;
}
