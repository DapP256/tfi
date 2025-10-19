"use client";

import DynamicPricing from "../components/dynamic-pricing";

const DynamicPricingPage = () => {
  return (
    <main>
      <DynamicPricing
        onApply={(amount) => {
          window.alert(`Tarifa seleccionada: ARS ${amount.toLocaleString("es-AR")}`);
        }}
        onClose={() => {
          window.history.back();
        }}
      />
    </main>
  );
};

export default DynamicPricingPage;
