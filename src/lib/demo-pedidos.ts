export type DemoPedidoFila = {
  id: string;
  numero: string;
  fecha: string;
  comprador: string;
  email: string;
  itemsResumen: string;
  total: number;
  estado: "Pendiente" | "Pagado" | "En preparación" | "Enviado" | "Entregado";
};

export const demoPedidosFeriante: DemoPedidoFila[] = [
  {
    id: "ped-demo-1",
    numero: "LP-24089",
    fecha: "2026-04-22T14:30:00-03:00",
    comprador: "Lucía Fernández",
    email: "lucia.f.89@gmail.com",
    itemsResumen: "Remera oversize estampada (x2), Jean mom tiro alto",
    total: 42800,
    estado: "Pagado",
  },
  {
    id: "ped-demo-2",
    numero: "LP-24088",
    fecha: "2026-04-21T10:15:00-03:00",
    comprador: "Martín Ricci",
    email: "mricci.dev@outlook.com",
    itemsResumen: "Zapatilla urbana cuero, Riñonera premium",
    total: 67100,
    estado: "En preparación",
  },
  {
    id: "ped-demo-3",
    numero: "LP-24087",
    fecha: "2026-04-20T18:45:00-03:00",
    comprador: "Soledad Ortiz",
    email: "sol.ortiz@yahoo.com.ar",
    itemsResumen: "Vestido midi floreado (M, Azul)",
    total: 28900,
    estado: "Enviado",
  },
  {
    id: "ped-demo-4",
    numero: "LP-24086",
    fecha: "2026-04-19T09:00:00-03:00",
    comprador: "Bruno Acosta",
    email: "bacosta.ventas@gmail.com",
    itemsResumen: "Campera puffer corta, Top crop rib slim",
    total: 55300,
    estado: "Entregado",
  },
  {
    id: "ped-demo-5",
    numero: "LP-24085",
    fecha: "2026-04-18T11:20:00-03:00",
    comprador: "Camila Duarte",
    email: "camiduarte@hotmail.com",
    itemsResumen: "Conjunto deportivo dry-fit, Calza deportiva",
    total: 31200,
    estado: "Pendiente",
  },
];
