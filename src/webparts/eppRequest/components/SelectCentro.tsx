import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  PrimaryButton,
  Text,
  ChoiceGroup,
  IChoiceGroupOption
} from '@fluentui/react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import styles from './EppRequest.module.scss';

interface ISelectCentroProps {
  context: WebPartContext;
  onCentroSelected: (centro: { key: string; text: string }) => void;
}

interface ICentroItem {
  Title?: string;
  field_1?: string; // Nombre del centro
  field_4?: string | boolean; // Activo
  Correo_Encargado?: { EMail: string };
}

const SelectCentro: React.FC<ISelectCentroProps> = ({ context, onCentroSelected }) => {
  const [centros, setCentros] = useState<IChoiceGroupOption[]>([]);
  const [selectedCentro, setSelectedCentro] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [nombreSolicitante, setNombreSolicitante] = useState<string>("");

  const loadData = async (): Promise<void> => {
    try {
      const url = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('SSO_CENTROS')/items?$select=Title,field_1,field_4,Correo_Encargado/EMail&$expand=Correo_Encargado`;

      const response: SPHttpClientResponse = await context.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );

      const data: { value: ICentroItem[] } = await response.json();

      const userEmail = context.pageContext.user.email.toLowerCase();
      const allowedAdmins = [
        "facturacion@conalec.com",
        "sso@conalec.com",
        "asistente.facturacion@conalec.com"
      ];

      let centrosPermitidos: ICentroItem[] = [];

      if (allowedAdmins.includes(userEmail)) {
        centrosPermitidos = data.value.filter((c) => {
          const activo = String(c.field_4).toLowerCase();
          return activo === "sí" || activo === "true" || activo === "1";
        });
      } else {
        centrosPermitidos = data.value.filter((c) => {
          const activo = String(c.field_4).toLowerCase();
          return (
            (activo === "sí" || activo === "true" || activo === "1") &&
            c.Correo_Encargado?.EMail?.toLowerCase() === userEmail
          );
        });
      }

      // 👇 Mostrar siempre el nombre del usuario conectado
      setNombreSolicitante(context.pageContext.user.displayName);

      const opcionesCentro: IChoiceGroupOption[] = centrosPermitidos.map((c) => ({
        key: String(c.Title ?? ""),
        text: c.field_1 ?? ""
      }));

      setCentros(opcionesCentro);
    } catch (error) {
      console.error("❌ Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData().catch(console.error);
  }, []);

  const handleCentroChange = (
    _: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IChoiceGroupOption
  ): void => {
    if (option) setSelectedCentro(option.key);
  };

  const handleNext = (): void => {
    const centroSeleccionado = centros.find((c) => c.key === selectedCentro);
    if (centroSeleccionado) {
      onCentroSelected({ key: centroSeleccionado.key, text: centroSeleccionado.text });
    }
  };

  return (
    <div>
      {/* Cabecera con título y usuario */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Text className={styles.tituloVerdeXL}>Solicitud de EPP</Text>
        <Text className={styles.tituloNegro}>
          {nombreSolicitante}
        </Text>
      </div>

      <br />
      <Text className={styles.tituloNegro}>Seleccione su Centro</Text>
      <br />
      <Text className={styles.subtituloNegro}>Centros disponibles:</Text>

      {loading ? (
        <Text>Cargando datos...</Text>
      ) : (
        <ChoiceGroup
          options={centros}
          onChange={handleCentroChange}
          selectedKey={selectedCentro}
        />
      )}

      {/* Botón siguiente y logo */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
        <PrimaryButton 
          text="Siguiente" 
          onClick={handleNext} 
          disabled={!selectedCentro} 
          className={styles.btnVerde} 
        />
        <img src={require('../assets/logo.png')} alt="Logo" className={styles.logoInferior} />
      </div>
    </div>
  );
};

export default SelectCentro;
