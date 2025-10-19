"use client";

import { useRouter } from "next/navigation";
import RecoverPassword from "../components/RecoverPassword";

const RecoverPasswordPage = () => {
  const router = useRouter();

  return <RecoverPassword onGoLogin={() => router.push("/")} />;
};

export default RecoverPasswordPage;
