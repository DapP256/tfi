/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Errors, RegisterForm } from "../lib/types";
import StrongBarPassword from "./StrongBarPassword";
import useAuthContext from "@/app/contexts/auth/useAuthContext";
import { User } from "@/app/lib/types/user";

const LoginForm = () => {
  const { handleRegister, loading } = useAuthContext();

  const [form, setForm] = useState<RegisterForm>({
    role: "empleador",
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    cp: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const emailRegex = /\S+@\S+\.\S+/;
  const pwdScore = useMemo(() => {
    const p = form.password || "";
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^\w\s]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 5); 
  }, [form.password]);

  function validate() {
    const e: Errors = {};
    if (!form.nombre.trim()) e.nombre = "Ingresá tu nombre.";
    if (!form.email) e.email = "Ingresá tu correo.";
    else if (!emailRegex.test(form.email)) e.email = "El correo no tiene un formato válido.";
    if (!form.password) e.password = "Ingresá una contraseña.";
    else if (form.password.length < 8) e.password = "Mínimo 8 caracteres.";
    if (!form.confirm) e.confirm = "Repetí la contraseña.";
    else if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden.";
    if (!form.terms) e.terms = "Debés aceptar los Términos y la Política.";
    // Teléfono, ciudad y CP opcionales pero recomendados
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!validate()) return;
    const payload: User = {
      email: form.email,
      name: form.nombre,
      password: form.password,
      role: form.role,
      telefono: form.telefono || undefined,
      ciudad: form.ciudad || undefined,
      cp: form.cp || undefined,
    }
    await handleRegister?.(payload);
  }

  const inputBase = "w-full rounded-xl border px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition";
  return (
    <div className="flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-md ml-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-100">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              {/* Rol */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Quiero registrarme como</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["empleador", "trabajador"]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm((f: any) => ({ ...f, role: r }))}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                        form.role === r ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      aria-pressed={form.role === r}
                    >
                      {r === "empleador" ? "Empleador" : "Trabajador"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nombre */}
              <div className="space-y-1">
                {form.role == "trabajador" ? 
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre y apellido</label> : 
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre de la empresa</label>
                }
                <input
                  id="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className={`${inputBase} border-gray-300 focus:ring-emerald-100 focus:border-emerald-500`}
                  placeholder={form.role == "trabajador" ? "Juana Pérez" : "Mi Empresa"}
                />
                {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={`${inputBase} ${errors.email ? "border-red-400 ring-red-100" : "border-gray-300 focus:ring-emerald-100 focus:border-emerald-500"}`}
                  placeholder="usuario@correo.com"
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <p id="email-error" className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Teléfono y ciudad/CP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono (opcional)</label>
                  <input
                    id="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                    className={`${inputBase} border-gray-300 focus:ring-emerald-100 focus:border-emerald-500`}
                    placeholder="11 5555 5555"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="cp" className="block text-sm font-medium text-gray-700">CP</label>
                  <input
                    id="cp"
                    type="text"
                    value={form.cp}
                    onChange={(e) => setForm((f) => ({ ...f, cp: e.target.value }))}
                    className={`${inputBase} border-gray-300 focus:ring-emerald-100 focus:border-emerald-500`}
                    placeholder="C1000"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">Ciudad</label>
                <input
                  id="ciudad"
                  type="text"
                  value={form.ciudad}
                  onChange={(e) => setForm((f) => ({ ...f, ciudad: e.target.value }))}
                  className={`${inputBase} border-gray-300 focus:ring-emerald-100 focus:border-emerald-500`}
                  placeholder="CABA / AMBA"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <div className={`relative flex items-center rounded-xl border ${errors.password ? "border-red-400" : "border-gray-300"}`}>
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full rounded-xl px-3 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-2.5 inline-flex items-center justify-center rounded-lg px-2 py-1 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}>
                    {/* ojo */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 5c5.5 0 9.7 4.4 11 7-1.3 2.6-5.5 7-11 7S2.3 14.6 1 12C2.3 9.4 6.5 5 12 5zm0 3.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5z"/></svg>
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                <StrongBarPassword score={pwdScore} />
              </div>

              {/* Confirmación */}
              <div className="space-y-1">
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                <div className={`relative flex items-center rounded-xl border ${errors.confirm ? "border-red-400" : "border-gray-300"}`}>
                  <input
                    id="confirm"
                    type={showPwd2 ? "text" : "password"}
                    value={form.confirm}
                    onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                    className="w-full rounded-xl px-3 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none"
                    placeholder="Repetí la contraseña"
                  />
                  <button type="button" onClick={() => setShowPwd2((s) => !s)} className="absolute right-2.5 inline-flex items-center justify-center rounded-lg px-2 py-1 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label={showPwd2 ? "Ocultar contraseña" : "Mostrar contraseña"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 5c5.5 0 9.7 4.4 11 7-1.3 2.6-5.5 7-11 7S2.3 14.6 1 12C2.3 9.4 6.5 5 12 5zm0 3.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5z"/></svg>
                  </button>
                </div>
                {errors.confirm && <p className="text-sm text-red-600 mt-1">{errors.confirm}</p>}
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => setForm((f) => ({ ...f, terms: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Acepto los <a className="underline" href="#">Términos y Condiciones</a> <a className="underline" href="#">d</a>.
                </label>
                {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white font-medium py-2.5 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                    Creando cuenta…
                  </span>
                ) : (
                  <>Crear cuenta</>
                )}
              </button>

              <div className="pt-2 text-center text-sm text-gray-600">
                ¿Ya tenés cuenta? {" "}
                <button type="button" onClick={() => {}} className="text-emerald-700 hover:text-emerald-800 font-medium">Iniciar sesión</button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-4">© {new Date().getFullYear()} Manito · CABA/AMBA</p>
        </div>
      </div>

  )

}

export default LoginForm;
