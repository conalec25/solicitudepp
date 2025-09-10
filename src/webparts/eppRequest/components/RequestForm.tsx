import * as React from "react";
import { useState, useEffect } from "react";
import { PrimaryButton, Text, TextField } from "@fluentui/react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

import styles from "./EppRequest.module.scss";

// Import explícito de los iconos
import iconCaida from "../assets/proteccion_caida.png";
import iconInferior from "../assets/proteccion_inferior.png";
import iconRespiratoria from "../assets/proteccion_respiratoria.png";
import iconSuperior from "../assets/proteccion_superior.png";
import iconVestimenta from "../assets/vestimenta.png";

interface IRequestFormProps {
  context: WebPartContext;
  selectedCentro: { key: string; text: string };
  solicitante: string;
  onSubmit: (data: any) => void;
}

interface ICatalogoItem {
  Title: string;   // Código
  field_1: string; // Descripción
  field_2: string; // Categoría
}

// Mapeo de categorías exactas → iconos
const categoryIcons: Record<string, string> = {
  "Protección De Extremidades Superiores": iconSuperior,
  "Protección Extremidades Inferiores": iconInferior,
  "Vestimenta De Protección": iconVestimenta,
  "Protección Respiratoria": iconRespiratoria,
  "Protección Contra Caida": iconCaida,
};

const RequestForm: React.FC<IRequestFormProps> = ({
  context,
  selectedCentro,
  solicitante,
  onSubmit,
}) => {
  const [items, setItems] = useState<ICatalogoItem[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCatalogo = async (): Promise<void> => {
      try {
        const url = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('SSO_CATALOGO_EPP')/items?$select=Title,field_1,field_2`;
        const response: SPHttpClientResponse = await context.spHttpClient.get(
          url,
          SPHttpClient.configurations.v1
        );
        const data = await response.json();
        setItems(data.value);
      } catch (err) {
        console.error("❌ Error cargando catálogo EPP:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCatalogo().catch(console.error);
  }, [context]);

  const handleCantidadChange = (codigo: string, value?: string): void => {
    const cantidad = value ? parseInt(value, 10) || 0 : 0;
    setCantidades((prev) => ({ ...prev, [codigo]: cantidad }));
  };

  const handleSubmit = (): void => {
    const itemsSeleccionados = items
      .filter((i) => cantidades[i.Title] && cantidades[i.Title] > 0)
      .map((i) => ({
        codigo: i.Title,
        descripcion: i.field_1,
        categoria: i.field_2,
        cantidad: cantidades[i.Title],
      }));

    const payload = {
      centro: selectedCentro.text,
      solicitante,
      items: itemsSeleccionados,
    };

    onSubmit(payload);
  };

  const categoriasUnicas = Array.from(new Set(items.map((i) => i.field_2)));

  return (
    <div>
      <h2 className={styles.tituloVerde}>
        Solicitud de EPP - {selectedCentro.text}
      </h2>

      <Text className={styles.subtituloNegro}>
        Solicitante: {solicitante}
      </Text>

      {loading ? (
        <Text>Cargando catálogo...</Text>
      ) : (
        <div>
          {categoriasUnicas.map((cat) => (
            <div key={cat} style={{ marginTop: "30px" }}>
              {/* Encabezado categoría con icono alineado a la derecha */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Text className={styles.tituloNegro}>{cat}</Text>
                <img
                  src={categoryIcons[cat] || iconVestimenta}
                  alt={cat}
                  style={{ width: "58px", height: "58px" }} // 20% más grande
                />
              </div>

              {/* Listado de ítems */}
              <div>
                {items
                  .filter((i) => i.field_2 === cat)
                  .map((i) => (
                    <div
                      key={i.Title}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <Text style={{ flex: 1 }}>{i.field_1}</Text>
                      <TextField
                        type="number"
                        placeholder="Cantidad"
                        value={cantidades[i.Title] ? cantidades[i.Title].toString() : ""}
                        onChange={(_, v) => handleCantidadChange(i.Title, v)}
                        styles={{ root: { width: "120px" } }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <PrimaryButton
        text="Siguiente"
        onClick={handleSubmit}
        disabled={Object.values(cantidades).filter((c) => c > 0).length === 0}
        styles={{
          root: { backgroundColor: "#029A35", border: "none", marginTop: 30 },
          rootHovered: { backgroundColor: "#027a2a" },
        }}
      />
    </div>
  );
};

export default RequestForm;
