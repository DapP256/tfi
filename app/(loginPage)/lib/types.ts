export type RegisterForm = {
  role: "empleador" | "trabajador";
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  cp: string;
  password: string;
  confirm: string;
  terms: boolean;
};

export type Errors = {
    nombre?: string;
    email?: string;
    password?: string;
    confirm?: string;
    terms?: string;
  };
