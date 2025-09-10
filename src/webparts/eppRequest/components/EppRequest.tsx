import * as React from 'react';
import { useState } from 'react';
import { Text } from '@fluentui/react';
import SelectCentro from './SelectCentro';
import RequestForm from './RequestForm';
import Observaciones from './Observaciones';
import { IEppRequestProps } from './IEppRequestProps';

import styles from './EppRequest.module.scss';
import logo from '../assets/logo.png';

interface ICentro {
  key: string;
  text: string;
}

const EppRequest: React.FC<IEppRequestProps> = (props) => {
  const [step, setStep] = useState<number>(1);
  const [selectedCentro, setSelectedCentro] = useState<ICentro | null>(null);
  const [solicitante, setSolicitante] = useState<string>("");
  const [fechaEnvio, setFechaEnvio] = useState<string>("");
  const [payload, setPayload] = useState<any>(null);

  // Usuario real del contexto (validado para evitar errores en Teams)
  const userName =
    props.context?.pageContext?.user?.displayName ?? "Usuario desconocido";
  const userEmail =
    props.context?.pageContext?.user?.email ?? "correo@desconocido";

  const handleCentroSelected = (centro: ICentro): void => {
    setSelectedCentro(centro);
    setStep(2);
  };

  const handleFormSubmit = (data: any): void => {
    setPayload(data);
    setStep(3);
  };

  const handleObservacionesSubmit = async (obs: string): Promise<void> => {
    let isMounted = true; // protección para desmontaje
    const fechaISO = new Date().toISOString();
    const fechaLocal =
      new Date().toLocaleDateString("es-EC") +
      " " +
      new Date().toLocaleTimeString("es-EC");

    const finalData = {
      correoSolicitante: userEmail,
      centro: payload?.centro,
      fechaSolicitud: fechaISO,
      observaciones: obs,
      detalleSolicitud: payload?.items,
    };

    try {
      const response = await fetch(
        "https://default2309395f0c254a3eb51c6d8572989c.5a.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/51e01d28f8ec46f98a46e7d4b1e9b556/triggers/manual/paths/invoke/?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=BbxqI1uQC-xhkiRVnWCUqmit6eGUk_TKo-ThHeTxNW0",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      await response.json().catch(() => ({}));

      if (isMounted) {
        alert("Solicitud enviada correctamente ✅");
        setSolicitante(userName);
        setFechaEnvio(fechaLocal);
        setStep(4);
      }
    } catch {
      if (isMounted) {
        alert("Hubo un error al enviar la solicitud ❌");
      }
    }

    // cleanup manual (no return, para evitar error TS)
    isMounted = false;
  };

  return (
    <div>
      {step === 1 && (
        <SelectCentro
          context={props.context}
          onCentroSelected={handleCentroSelected}
        />
      )}
      {step === 2 && selectedCentro && (
        <RequestForm
          context={props.context}
          selectedCentro={selectedCentro}
          solicitante={userName}
          onSubmit={handleFormSubmit}
        />
      )}
      {step === 3 && <Observaciones onSubmit={handleObservacionesSubmit} />}
      {step === 4 && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <img src={logo} alt="Logo corporativo" className={styles.logo} />
          <Text className={styles.tituloVerde} variant="xLarge">
            Solicitud Enviada
          </Text>
          <br />
          <Text className={styles.tituloVerde}>{solicitante}</Text>
          <br />
          <Text className={styles.subtituloNegro}>{fechaEnvio}</Text>

          {/* Leyenda institucional */}
          <div style={{ marginTop: "30px", color: "#666", fontSize: "13px" }}>
            <Text>Desarrollado por Edison Vaca</Text>
            <br />
            <Text>Dpto. Facturación - Sistemas</Text>
            <br />
            <Text>Sep./2025</Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default EppRequest;
