'use client';


import { useMemo, useState } from 'react';

import Negocios from './Negocios';
import Incidencias from './Incidencias';
import Pagos from './Pagos';
import Planes from './Planes';
import Ajustes from './Ajustes';
import { Kpi, csvEscape, labelEstadoPago, labelEstadoInc, labelTipoPago } from './ui';





export default function AdminBackoffice() {
// ====== Mock data ======
const hoyISO = new Date().toISOString().slice(0, 10);
const usuariosInit = useMemo(
() => [
{ id: 1, nombre: 'Carla López', email: 'carla@correo.com', rol: 'empleado', estado: 'activo', createdAt: '2025-08-12' },
{ id: 2, nombre: 'Diego Fernández', email: 'diego@correo.com', rol: 'empleado', estado: 'activo', createdAt: '2025-07-02' },
{ id: 3, nombre: 'Restó La Plaza', email: 'admin@laplaza.com', rol: 'negocio', estado: 'activo', createdAt: '2025-06-10' },
{ id: 4, nombre: 'Cafetería 9 de Julio', email: 'admin@cafe9.com', rol: 'negocio', estado: 'suspendido', createdAt: '2025-05-28' },
{ id: 5, nombre: 'Mariana Silva', email: 'mariana@correo.com', rol: 'empleado', estado: 'activo', createdAt: '2025-08-30' },
],
[]
);


const negociosInit = useMemo(
() => [
{ id: 101, nombre: 'Restó La Plaza', plan: 'Profesional', publicaciones: 12, deudaARS: 0, ownerEmail: 'admin@laplaza.com', alta: '2025-04-01' },
{ id: 102, nombre: 'Cafetería 9 de Julio', plan: 'Esencial', publicaciones: 5, deudaARS: 45800, ownerEmail: 'admin@cafe9.com', alta: '2025-06-12' },
{ id: 103, nombre: 'Sushi Central', plan: 'Enterprise', publicaciones: 44, deudaARS: 0, ownerEmail: 'cto@sushicentral.com', alta: '2025-03-22' },
],
[]
);


const incidenciasInit = useMemo(
() => [
{ id: 'INC-1201', servicio: 'SRV-2025-0001', negocio: 'Restó La Plaza', trabajador: 'Diego Fernández', motivo: 'tardanza', estado: 'abierta', creada: hoyISO },
{ id: 'INC-1202', servicio: 'SRV-2025-0007', negocio: 'Cafetería 9 de Julio', trabajador: 'Mariana Silva', motivo: 'desempeno', estado: 'en_revisión', creada: '2025-09-19' },
{ id: 'INC-1203', servicio: 'SRV-2025-0009', negocio: 'Sushi Central', trabajador: 'Carla López', motivo: 'otros', estado: 'resuelta', creada: '2025-09-15' },
],
[hoyISO]
);


const pagosInit = useMemo(
() => [
{ id: 'PAY-901', tipo: 'payout_trabajador', beneficiario: 'Diego Fernández', monto: 54000, metodo: 'CBU', estado: 'pendiente', creado: hoyISO },
{ id: 'PAY-902', tipo: 'payout_trabajador', beneficiario: 'Mariana Silva', monto: 38000, metodo: 'CBU', estado: 'aprobado', creado: '2025-09-18' },
{ id: 'PAY-903', tipo: 'cobro_negocio', beneficiario: 'Cafetería 9 de Julio', monto: 45800, metodo: 'MP', estado: 'pendiente', creado: '2025-09-18' },
],
[hoyISO]
);


// === Admins (seed) ===
const adminsInit = useMemo(
() => [
{ id: 1, nombre: 'Súper Admin', email: 'admin@manito.app', rol: 'admin', estado: 'activo', createdAt: '2025-06-01' },
{ id: 2, nombre: 'Soporte 1', email: 'soporte1@manito.app', rol: 'admin', estado: 'activo', createdAt: '2025-08-10' },
{ id: 3, nombre: 'Soporte 2', email: 'soporte2@manito.app', rol: 'soporte', estado: 'suspendido', createdAt: '2025-09-05' },
],
[]
);


const PLANES = useMemo(
() => ({
Esencial: { mensual: 9900, comision: 0.08, publicaciones: 5, release: '48h', notas: 'Analítica básica, soporte chat' },
Profesional: { mensual: 14900, comision: 0.05, publicaciones: 20, release: '24h', notas: 'Analítica intermedia, SLA ≤4h' },
Enterprise: { mensual: 19900, comision: 0.03, publicaciones: 'ilimitadas', release: 'inmediata', notas: 'Analítica avanzada/BI, prioridad matching, API/SSO' },
}),
[]
);


// ====== State ======
const [tab, setTab] = useState('resumen');
const [q, setQ] = useState('');
const [usuarios, setUsuarios] = useState(usuariosInit);
const [negocios, setNegocios] = useState(negociosInit);
const [incidencias, setIncidencias] = useState(incidenciasInit);
const [pagos, setPagos] = useState(pagosInit);
const [admins, setAdmins] = useState(adminsInit);


const [toast, setToast] = useState(null);


// Modales
const [modal, setModal] = useState(null); // { type: 'usuario'|'incidencia'|'pago'|'plan'|'admin', payload: any }


// ====== Helpers ======
const showToast = (title, description) => {
setToast({ title, description });
}