'use client';
import PropTypes from 'prop-types';

export function Kpi({ label, value, big }) {
return (
<div className={`rounded-2xl border bg-white p-4 ${big?'shadow-sm':''}`}>
<div className="text-xs text-neutral-500">{label}</div>
<div className={`font-semibold text-neutral-900 ${big?'text-2xl':'text-lg'}`}>{value}</div>
</div>
);
}

Kpi.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  big: PropTypes.bool
};
export function labelTipoPago(t){
switch(t){
case 'payout_trabajador': return 'Payout trabajador';
case 'cobro_negocio': return 'Cobro a negocio';
default: return t;
}
}
export function labelEstadoPago(e){
switch(e){
case 'pendiente': return 'Pendiente';
case 'aprobado': return 'Aprobado';
case 'rechazado': return 'Rechazado';
default: return e;
}
}
export function labelEstadoInc(e){
switch(e){
case 'abierta': return 'Abierta';
case 'en_revisión': return 'En revisión';
case 'resuelta': return 'Resuelta';
case 'reembolsar_negocio': return 'Reembolsar negocio';
case 'pagar_trabajador': return 'Pagar trabajador';
default: return e;
}
}
export function csvEscape(v){
if(v==null) return '';
const s = String(v).replaceAll('"','""');
if(s.includes(',')||s.includes('\n')||s.includes('"')) return `"${s}"`;
return s;
}