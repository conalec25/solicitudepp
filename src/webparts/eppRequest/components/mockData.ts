// src/webparts/eppRequest/components/mockData.ts

export const MockCentros = [
  {
    Title: "A_CPL_CAR01",
    Centro: "Centro de Privación de Libertad Carchi N°1",
    EncargadoNombre: "Salome Salazar",
    Correo_Encargado: { EMail: "CONALEC Carchi" },
    Activo: true
  },
  {
    Title: "D_CPL_ESM01",
    Centro: "Centro de Privación de Libertad Esmeraldas N°1",
    EncargadoNombre: "Jessica Sol",
    Correo_Encargado: { EMail: "Jessica Sol" },
    Activo: true
  }
  // 👉 el resto de centros los dejamos como antes
];

// Catálogo de EPP (mock)
export const MockCatalogoEPP = [
  { Codigo: "EPP-001", Descripcion: "Casco de seguridad", Categoria: "Cabeza", UnidadMedida: "Unidad", RequiereTalla: false },
  { Codigo: "EPP-002", Descripcion: "Gafas de protección", Categoria: "Ojos", UnidadMedida: "Unidad", RequiereTalla: false },
  { Codigo: "EPP-003", Descripcion: "Guantes de cuero", Categoria: "Manos", UnidadMedida: "Par", RequiereTalla: true },
  { Codigo: "EPP-004", Descripcion: "Botas de seguridad", Categoria: "Pies", UnidadMedida: "Par", RequiereTalla: true },
  { Codigo: "EPP-005", Descripcion: "Chaleco reflectivo", Categoria: "Torso", UnidadMedida: "Unidad", RequiereTalla: false }
];
