"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import useAuthContext from "app/contexts/auth/useAuthContext";

export type DocItem = {
  tipo: string;
  helper?: string;
  required?: boolean;
  askNumero?: boolean;
  requiredNumero?: boolean;
  askVence?: boolean;
  requiredVence?: boolean;
  numero?: string;
  vence?: string;
  file?: File | { name: string; size: number; type?: string };
};

type DocumentacionEmpleadoProps = {
  initialDocs?: DocItem[];
  onSave?: (docs: Array<{
    tipo: string;
    numero?: string;
    vence?: string;
    nombreArchivo?: string;
    size?: number;
    mime?: string;
  }>) => void;
  onCancel?: () => void;
};

const MAX_FILES = 10;
const MAX_MB = 10;
const ACCEPT = ".jpg,.jpeg,.png,.pdf";
const splitAccept = ACCEPT.split(",").map((ext) => ext.trim());

export default function DocumentacionEmpleado({
  initialDocs = defaultDocs(),
  onSave,
  onCancel,
}: DocumentacionEmpleadoProps) {
  const { user } = useAuthContext();

  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const setField = (idx: number, key: keyof DocItem, value: unknown) =>
    setDocs((prev) => prev.map((doc, index) => (index === idx ? { ...doc, [key]: value } : doc)));

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const clickPick = (index: number) => inputRefs.current[index]?.click();

  const errors = useMemo(() => validateDocs(docs), [docs]);
  const isValid = useMemo(() => errors.every((error) => !error), [errors]);

  const handlePickedFile = useCallback((index: number, file: File) => {
    const lowerName = file.name.toLowerCase();
    if (!splitAccept.some((ext) => lowerName.endsWith(ext))) {
      alert("Tipo de archivo no permitido");
      return;
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`El archivo supera ${MAX_MB} MB`);
      return;
    }

    const filledCount = docs.reduce((acc, doc, i) => acc + (doc.file && i !== index ? 1 : 0), 0);
    if (!docs[index]?.file && filledCount + 1 > MAX_FILES) {
      alert(`Podés cargar hasta ${MAX_FILES} archivos en total`);
      return;
    }

    setField(index, "file", file);
  }, [docs]);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) handlePickedFile(index, file);
  }, [handlePickedFile]);

  const removeFile = (index: number) => setField(index, "file", undefined);

  const save = () => {
    if (!isValid) return;
    const payload = docs.map((doc) => ({
      tipo: doc.tipo,
      numero: doc.numero || undefined,
      vence: doc.vence || undefined,
      nombreArchivo: doc.file?.name,
      size: doc.file?.size,
      mime: doc.file ? ("type" in doc.file && doc.file.type ? doc.file.type : guessMime(doc.file.name)) : undefined,
    }));

    onSave?.(payload);
    alert("Documentación actualizada");
  };

  useEffect(() => {
    const missingRequired = validateDocs(defaultDocs().map((doc) => ({ ...doc, file: undefined })));
    console.assert(!!missingRequired[0] && !!missingRequired[1], "DNI frente y dorso deberían marcarse obligatorios");

    const needsExpiry = defaultDocs();
    needsExpiry[3].file = { name: "libreta.pdf", size: 1234 } as DocItem["file"];
    needsExpiry[3].vence = "";
    const expiryErrors = validateDocs(needsExpiry);
    console.assert(!!expiryErrors[3], "Libreta sanitaria debe requerir fecha de vencimiento si hay archivo/subida");

    const needsNumber = defaultDocs();
    needsNumber[2].file = { name: "cuil.pdf", size: 500 } as DocItem["file"];
    needsNumber[2].numero = "";
    const numberErrors = validateDocs(needsNumber);
    console.assert(!!numberErrors[2], "Constancia de CUIL debe exigir número/ID cuando se solicita");

    console.assert(guessMime("test.jpg") === "image/jpeg", "Debe reconocer .jpg como image/jpeg");
    console.assert(guessMime("test.png") === "image/png", "Debe reconocer .png como image/png");
    console.assert(guessMime("test.PDF").includes("pdf"), "Debe reconocer .pdf en cualquier case");

    const ok = defaultDocs();
    ok[0].file = { name: "dni-frente.jpg", size: 100 } as DocItem["file"];
    ok[0].numero = "12345678";
    ok[1].file = { name: "dni-dorso.jpg", size: 100 } as DocItem["file"];
    ok[2].file = { name: "cuil.pdf", size: 100 } as DocItem["file"];
    ok[2].numero = "20-12345678-9";
    ok[3].file = { name: "libreta.pdf", size: 100 } as DocItem["file"];
    ok[3].vence = "2030-01-01";
    ok[4].file = { name: "aptitud.pdf", size: 100 } as DocItem["file"];
    ok[4].vence = "2027-06-01";
    ok[5].file = { name: "cert-antecedentes.pdf", size: 100 } as DocItem["file"];
    const okErrors = validateDocs(ok);
    console.assert(okErrors.every((entry) => entry === ""), "No debería haber errores cuando todo lo requerido está completo");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white grid place-content-center font-bold">M</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Agregar documentación personal</h1>
            <p className="text-sm text-gray-500">Hola, {user?.name?.split(" ")[0] ?? ""}</p>
          </div>
        </header>

        <section className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 md:p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-2">Subí o actualizá tus documentos</h2>
          <p className="text-xs text-gray-500 mb-4">Formatos permitidos: JPG, PNG o PDF. Tamaño máx: {MAX_MB} MB por archivo.</p>

          <ul className="divide-y divide-gray-100">
            {docs.map((doc, index) => (
              <li key={doc.tipo} className="py-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {doc.tipo} {doc.required && <span className="text-rose-600">*</span>}
                    </p>
                    {doc.helper && <p className="text-xs text-gray-500">{doc.helper}</p>}

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {doc.askNumero && (
                        <Field label="Número / ID" required={doc.requiredNumero} error={errors[index] && (errors[index] as Record<string, string>).numero}>
                          <input
                            type="text"
                            className={cnInput(Boolean(errors[index] && (errors[index] as Record<string, string>).numero))}
                            value={doc.numero ?? ""}
                            onChange={(event) => setField(index, "numero", event.target.value)}
                          />
                        </Field>
                      )}
                      {doc.askVence && (
                        <Field label="Fecha de vencimiento" required={doc.requiredVence} error={errors[index] && (errors[index] as Record<string, string>).vence}>
                          <input
                            type="date"
                            className={cnInput(Boolean(errors[index] && (errors[index] as Record<string, string>).vence))}
                            value={doc.vence ?? ""}
                            onChange={(event) => setField(index, "vence", event.target.value)}
                          />
                        </Field>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-72">
                    <div
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => onDrop(event, index)}
                      className={`rounded-xl border-2 border-dashed p-4 text-center ${doc.file ? "border-emerald-300 bg-emerald-50" : "border-gray-300 bg-white"}`}
                      aria-label={`Uploader para ${doc.tipo}`}
                    >
                      <p className="text-sm text-gray-700 mb-2">{doc.file ? doc.file.name : "Arrastrá y soltá el archivo aquí"}</p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => clickPick(index)}
                          className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          Agregar archivo
                        </button>
                        {doc.file && (
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="rounded-xl border border-rose-300 bg-white text-rose-700 px-3 py-2 text-sm hover:bg-rose-50"
                          >
                            Quitar
                          </button>
                        )}
                      </div>
                      <input
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        type="file"
                        accept={ACCEPT}
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) handlePickedFile(index, file);
                          event.currentTarget.value = "";
                        }}
                      />
                    </div>
                    {errors[index] && (errors[index] as Record<string, string>).file && (
                      <p className="text-xs text-rose-600 mt-1">{(errors[index] as Record<string, string>).file}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-2">
            <button
              onClick={() => onCancel?.()}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              disabled={!isValid}
              className={`rounded-xl px-4 py-2 text-white ${isValid ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-300 cursor-not-allowed"}`}
            >
              Guardar
            </button>
          </div>
        </section>

        <footer className="text-xs text-gray-400 mt-6">© {new Date().getFullYear()} Manito · CABA/AMBA</footer>
      </div>
    </div>
  );
}

export function defaultDocs(): DocItem[] {
  return [
    { tipo: "DNI (frente)", helper: "Foto legible.", required: true, askNumero: true, requiredNumero: true },
    { tipo: "DNI (dorso)", helper: "Foto legible.", required: true },
    { tipo: "Constancia de CUIL", helper: "Descarga de ANSES o AFIP.", required: true, askNumero: true, requiredNumero: true },
    { tipo: "Libreta sanitaria", helper: "PDF o foto legible.", required: true, askVence: true, requiredVence: true },
    { tipo: "Certificado de aptitud médica", helper: "Si corresponde al puesto.", askVence: true, requiredVence: false },
    { tipo: "Certificado de antecedentes penales", helper: "Opcional, recomendado para ciertos rubros." },
    { tipo: "CV o referencias laborales", helper: "Adjuntá tu CV o referencias (opcional)." },
  ];
}

export function validateDocs(items: DocItem[]): Array<Record<string, string> | ""> {
  return items.map((doc) => {
    const error: Record<string, string> = {};
    if (doc.required && !doc.file) error.file = "Requerido";
    if (doc.askNumero && doc.requiredNumero && !doc.numero) error.numero = "Requerido";
    if (doc.askVence && doc.requiredVence && !doc.vence) error.vence = "Requerido";
    return Object.keys(error).length ? error : "";
  });
}

export function guessMime(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

function cnInput(hasError?: boolean) {
  return `w-full rounded-xl border px-3 py-2 bg-white ${hasError ? "border-rose-400 focus:outline-none" : "border-gray-300 focus:outline-none"}`;
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      <div className="mt-1">{children}</div>
      {error ? <p className="text-xs text-rose-600 mt-1">{error}</p> : null}
    </label>
  );
}
