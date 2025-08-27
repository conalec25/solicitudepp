import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  Text,
  ChoiceGroup,
  IChoiceGroupOption
} from '@fluentui/react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

// Mock local
import { MockCentros } from './mockData';

interface ISelectCentroProps {
  context: WebPartContext;
  onCentroSelected: (centro: { key: string; text: string }) => void;
}

const SelectCentro: React.FC<ISelectCentroProps> = ({ context, onCentroSelected }) => {
  const [centros, setCentros] = useState<IChoiceGroupOption[]>([]);
  const [usuarios, setUsuarios] = useState<IDropdownOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedCentro, setSelectedCentro] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [allItems, setAllItems] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      // Detectamos si estamos en entorno local
      if (context.isServedFromLocalhost) {
        console.log("🔵 Modo LOCAL - usando MockCentros");
        setAllItems(MockCentros);

        const correosUnicos = Array.from(
          new Set(MockCentros.map((item: any) => item.Correo_Encargado?.EMail).filter(Boolean))
        );

        const opcionesUsuarios: IDropdownOption[] = correosUnicos.map((correo: string) => ({
          key: correo,
          text: correo
        }));

        setUsuarios(opcionesUsuarios);
        setLoading(false);
        return;
      }

      // Caso real: SharePoint REST API
      console.log("🟢 Modo ONLINE - consultando lista SSO_CENTROS");

      const response: SPHttpClientResponse = await context.spHttpClient.get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('SSO_CENTROS')/items?$select=Title,Centro,Activo,EncargadoNombre,Correo_Encargado/EMail&$expand=Correo_Encargado`,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        throw new Error(`Error en REST API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Datos cargados de SharePoint:", data.value);

      setAllItems(data.value);

      const correosUnicos = Array.from(
        new Set(data.value.map((item: any) => item.Correo_Encargado?.EMail).filter(Boolean))
      );

      const opcionesUsuarios: IDropdownOption[] = correosUnicos.map((correo: string) => ({
        key: correo,
        text: correo
      }));

      setUsuarios(opcionesUsuarios);
    } catch (error) {
      console.error("❌ Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
    if (!option) return;
    setSelectedUser(option.key as string);

    const centrosPermitidos = allItems
      .filter(
        (c: any) =>
          c.Activo === true &&
          c.Correo_Encargado?.EMail?.toLowerCase() === (option.key as string).toLowerCase()
      )
      .map((c: any) => ({
        key: c.Title,
        text: c.Centro
      }));

    const opcionesCentro: IChoiceGroupOption[] = centrosPermitidos.map((c: any) => ({
      key: c.key,
      text: c.text
    }));

    setCentros(opcionesCentro);
    setSelectedCentro(undefined);

    console.log("👉 Centros filtrados para usuario:", option.key, opcionesCentro);
  };

  const handleCentroChange = (
    event?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IChoiceGroupOption
  ): void => {
    if (option) setSelectedCentro(option.key);
  };

  const handleNext = (): void => {
    const centroSeleccionado = centros.find((c) => c.key === selectedCentro);
    if (centroSeleccionado) {
      console.log("✅ Centro seleccionado:", centroSeleccionado);
      onCentroSelected({ key: centroSeleccionado.key, text: centroSeleccionado.text });
    }
  };

  return (
    <div>
      <Text variant="large">Seleccione su usuario y centro</Text>

      {loading ? (
        <Text>Cargando datos...</Text>
      ) : (
        <>
          <Dropdown
            placeholder="Seleccione un usuario"
            options={usuarios}
            onChange={handleUserChange}
            selectedKey={selectedUser || undefined}
          />
          <br />
          <ChoiceGroup
            label="Centros disponibles"
            options={centros}
            onChange={handleCentroChange}
            selectedKey={selectedCentro}
            disabled={!selectedUser}
          />
        </>
      )}

      <br />
      <PrimaryButton text="Siguiente" onClick={handleNext} disabled={!selectedCentro} />
    </div>
  );
};

export default SelectCentro;
