"use client";

import { FormEvent, useState } from "react";

type RecoverMode = "request" | "reset";

interface RecoverPasswordPageProps {
  onRequest?: (payload: { email: string }) => void;
  onReset?: (payload: { email: string; code: string; password: string }) => void;
  onGoLogin?: () => void;
}

interface RecoverFormState {
  email: string;
  code: string;
  password: string;
  confirm: string;
}

interface RecoverErrors {
  email?: string;
  code?: string;
  password?: string;
  confirm?: string;
}

const emailRegex = /\S+@\S+\.\S+/;

const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition ${
    hasError
      ? "border-red-400 ring-red-100"
      : "border-gray-300 focus:ring-emerald-100 focus:border-emerald-500"
  }`;

const RecoverPassword = ({ onRequest, onReset, onGoLogin }: RecoverPasswordPageProps) => {
  const [mode, setMode] = useState<RecoverMode>("request");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState<RecoverErrors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const [form, setForm] = useState<RecoverFormState>({
    email: "",
    code: "",
    password: "",
    confirm: "",
  });

  const validateRequest = () => {
    const e: RecoverErrors = {};
    if (!form.email) e.email = "Ingresá tu correo.";
    else if (!emailRegex.test(form.email)) e.email = "El correo no tiene un formato válido.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateReset = () => {
    const e: RecoverErrors = {};
    if (!form.code) e.code = "Ingresá el código que te enviamos.";
    if (!form.password) e.password = "Ingresá tu nueva contraseña.";
    else if (form.password.length < 8) e.password = "Mínimo 8 caracteres.";
    if (!form.confirm) e.confirm = "Repetí la contraseña.";
    else if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateRequest()) return;
    setLoading(true);
    setMsg("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      onRequest?.({ email: form.email });
      setMsg(
        "Te enviamos un email con instrucciones y un código (OTP). Revisá tu bandeja de entrada y spam."
      );
      setMode("reset");
    } catch (error) {
      console.error(error);
      setErrors({ email: "No pudimos enviar el correo. Probá nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateReset()) return;
    setLoading(true);
    setMsg("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      onReset?.({ email: form.email, code: form.code, password: form.password });
      setMsg("¡Listo! Tu contraseña fue restablecida. Ahora podés iniciar sesión.");
    } catch (error) {
      console.error(error);
      setErrors({ code: "El código es inválido o expiró. Pedí uno nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 grid grid-cols-1 md:grid-cols-2">
      <div className="relative flex items-center justify-center p-8 md:p-12 order-1 md:order-none">
        <div className="max-w-lg w-full flex flex-col items-center md:items-start">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm">
              M
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">Manito</h1>
              <p className="text-sm md:text-base text-gray-600">Recuperá el acceso a tu cuenta en pocos pasos.</p>
            </div>
          </div>
          <div className="w-full rounded-3xl border border-emerald-100 bg-white/60 backdrop-blur-sm p-6 shadow-sm hidden sm:block">
            <ul className="text-gray-700 text-sm space-y-2">
              <li>
                • Te enviamos un <strong>enlace</strong> y un <strong>código</strong> (OTP) al email.
              </li>
              <li>• Podés pegar el código acá y definir tu nueva contraseña.</li>
              <li>• Por seguridad, el código expira en minutos.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-md ml-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-100">
            {mode === "request" ? (
              <form onSubmit={handleRequest} className="p-6 sm:p-8 space-y-5">
                <h2 className="text-lg font-semibold text-gray-900">Recuperar contraseña</h2>
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    className={inputClass(Boolean(errors.email))}
                    placeholder="usuario@correo.com"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-600 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white font-medium py-2.5 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Enviar instrucciones
                    </span>
                  ) : (
                    <>Enviar instrucciones</>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Te llegará un enlace y un código (OTP). Si no aparece, revisá spam.
                </p>

                <div className="pt-2 text-center text-sm text-gray-600">
                  ¿Ya lo recibiste? {" "}
                  <button
                    type="button"
                    onClick={() => setMode("reset")}
                    className="text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    Ingresar código
                  </button>
                </div>

                <div className="pt-2 text-center text-sm text-gray-600">
                  ¿Recordaste tu clave? {" "}
                  <button
                    type="button"
                    onClick={() => onGoLogin?.()}
                    className="text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    Volver a iniciar sesión
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleReset} className="p-6 sm:p-8 space-y-5">
                <h2 className="text-lg font-semibold text-gray-900">Ingresar código y nueva contraseña</h2>

                <div className="space-y-1">
                  <label htmlFor="email2" className="block text-sm font-medium text-gray-700">
                    Correo (al que te llegó el código)
                  </label>
                  <input
                    id="email2"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    className={inputClass(Boolean(errors.email))}
                    placeholder="usuario@correo.com"
                    aria-invalid={Boolean(errors.email)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Código (OTP)
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={form.code}
                    onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
                    className={inputClass(Boolean(errors.code))}
                    placeholder="p. ej., 123456"
                    aria-describedby={errors.code ? "code-error" : undefined}
                    aria-invalid={Boolean(errors.code)}
                  />
                  {errors.code && (
                    <p id="code-error" className="text-sm text-red-600 mt-1">
                      {errors.code}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Nueva contraseña
                  </label>
                  <div
                    className={`relative flex items-center rounded-xl border ${
                      errors.password ? "border-red-400" : "border-gray-300"
                    }`}
                  >
                    <input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                      className="w-full rounded-xl px-3 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none"
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((state) => !state)}
                      className="absolute right-2.5 inline-flex items-center justify-center rounded-lg px-2 py-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M12 5c5.5 0 9.7 4.4 11 7-1.3 2.6-5.5 7-11 7S2.3 14.6 1 12C2.3 9.4 6.5 5 12 5zm0 3.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5z" />
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                    Confirmar contraseña
                  </label>
                  <div
                    className={`relative flex items-center rounded-xl border ${
                      errors.confirm ? "border-red-400" : "border-gray-300"
                    }`}
                  >
                    <input
                      id="confirm"
                      type={showPwd2 ? "text" : "password"}
                      value={form.confirm}
                      onChange={(event) => setForm((prev) => ({ ...prev, confirm: event.target.value }))}
                      className="w-full rounded-xl px-3 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none"
                      placeholder="Repetí la contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd2((state) => !state)}
                      className="absolute right-2.5 inline-flex items-center justify-center rounded-lg px-2 py-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={showPwd2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M12 5c5.5 0 9.7 4.4 11 7-1.3 2.6-5.5 7-11 7S2.3 14.6 1 12C2.3 9.4 6.5 5 12 5zm0 3.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5z" />
                      </svg>
                    </button>
                  </div>
                  {errors.confirm && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.confirm}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white font-medium py-2.5 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Restablecer contraseña
                    </span>
                  ) : (
                    <>Restablecer contraseña</>
                  )}
                </button>

                <div className="pt-2 text-center text-sm text-gray-600">
                  ¿No te llegó el código? {" "}
                  <button
                    type="button"
                    onClick={() => setMode("request")}
                    className="text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    Reenviar email
                  </button>
                </div>

                <div className="pt-2 text-center text-sm text-gray-600">
                  ¿Ya podés entrar? {" "}
                  <button
                    type="button"
                    onClick={() => onGoLogin?.()}
                    className="text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    Volver a iniciar sesión
                  </button>
                </div>
              </form>
            )}
          </div>

          {msg && (
            <div className="mt-3 text-center text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              {msg}
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-4">© {new Date().getFullYear()} Manito · CABA/AMBA</p>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
