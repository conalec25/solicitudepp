import * as React from 'react';
import { useState } from 'react';
import { Text } from '@fluentui/react';
import SelectCentro from './SelectCentro';
import RequestForm from './RequestForm';
import { IEppRequestProps } from './IEppRequestProps';

const EppRequest: React.FC<IEppRequestProps> = (props) => {
  const [step, setStep] = useState<number>(1);
  const [selectedCentro, setSelectedCentro] = useState<{ key: string; text: string } | null>(null);

  const handleCentroSelected = (centro: { key: string; text: string }) => {
    console.log("✅ Centro seleccionado:", centro);
    setSelectedCentro(centro);
    setStep(2);
  };

  const handleFormSubmit = (data: any) => {
    console.log("📤 Datos enviados desde formulario:", data);
    setStep(3);
  };

  return (
    <div>
      <Text variant="xLarge">Solicitud de EPP</Text>

      {step === 1 && (
        <SelectCentro
          context={props.context}
          onCentroSelected={handleCentroSelected}
        />
      )}

      {step === 2 && selectedCentro && (
        <RequestForm
          selectedCentro={selectedCentro}
          onSubmit={handleFormSubmit}
        />
      )}

      {step === 3 && (
        <div>
          <Text variant="large">✅ Solicitud enviada correctamente</Text>
        </div>
      )}
    </div>
  );
};

export default EppRequest;
