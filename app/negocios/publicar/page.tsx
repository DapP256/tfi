"use client";

import CreateJobPost from "../components/publicar-aviso";

const PublicarAvisoPage = () => {
  return (
    <main>
      <CreateJobPost
        plan="Esencial"
        activeCount={3}
        onSubmit={(payload) => {
          console.log("Aviso publicado", payload);
        }}
        onPauseSome={() => {
          window.alert("Abrir pantalla para pausar/cerrar avisos");
        }}
        onUpgradePlan={() => {
          window.alert("Abrir pantalla para upgrade de plan");
        }}
        onOpenDynamicPricing={() => {
          window.open("/negocios/tarifa-dinamica", "_blank");
        }}
      />
    </main>
  );
};

export default PublicarAvisoPage;
