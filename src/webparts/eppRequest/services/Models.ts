// 📌 Interface para la lista SSO_CATALOGO_EPP
export interface ICatalogoEpp {
  Id: number;
  Title: string;     // Código del EPP (columna estándar de SharePoint)
  field_1: string;   // Descripción del ítem
  field_2: string;   // Categoría
  field_3: string;   // Unidad de medida
  field_4: boolean;  // Requiere Talla
}
