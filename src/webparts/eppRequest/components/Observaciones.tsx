import * as React from 'react';
import { useState } from 'react';
import { Text, TextField, PrimaryButton } from '@fluentui/react';

import styles from './EppRequest.module.scss';

interface IObservacionesProps {
  onSubmit: (observaciones: string) => void;
}

const Observaciones: React.FC<IObservacionesProps> = ({ onSubmit }) => {
  const [obs, setObs] = useState<string>("");

  const handleSubmit = (): void => {
    onSubmit(obs);
  };

  return (
    <div style={{ marginTop: "30px", padding: "15px" }}>
      <Text className={styles.tituloVerde} variant="xLarge">
        Observaciones
      </Text>
      <br />

      <Text className={styles.subtituloNegro}>
        Ingrese observaciones adicionales para su solicitud:
      </Text>
      <br /><br />

      <TextField
        multiline
        resizable={false}
        placeholder="Escriba aquí sus observaciones..."
        value={obs}
        onChange={(_, newValue) => setObs(newValue || "")}
        rows={5}
        styles={{
          fieldGroup: { borderColor: "#029A35" },
          field: { fontSize: "14px" }
        }}
      />

      <br />
      <PrimaryButton
        text="Enviar Solicitud"
        onClick={handleSubmit}
        styles={{
          root: { backgroundColor: "#029A35", border: "none" },
          rootHovered: { backgroundColor: "#027a2a" }
        }}
      />
    </div>
  );
};

export default Observaciones;
