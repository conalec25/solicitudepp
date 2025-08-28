import * as React from 'react';
import { useState } from 'react';
import { Text, PrimaryButton, TextField } from '@fluentui/react';
import { catalogoEPP } from './mockData'; // asegúrate que esté exportado

interface IRequestFormProps {
  selectedCentro: { key: string; text: string };
  onSubmit: (data: any) => void;
}

const RequestForm: React.FC<IRequestFormProps> = ({ selectedCentro, onSubmit }) => {
  const [cantidades, setCantidades] = useState<{ [key: string]: number }>({});

  // Agrupar por categoría
  const categorias = Array.from(new Set(catalogoEPP.map((item) => item.field_2)));

  const handleChange = (key: string, value: string): void => {
    setCantidades((prev) => ({
      ...prev,
      [key]: Number(value) || 0
    }));
  };

  const handleSubmit = (): void => {
    const data = {
      centro: selectedCentro,
      items: catalogoEPP.map((item) => ({
        ...item,
        cantidad: cantidades[item.Title] || 0
      }))
    };
    onSubmit(data);
  };

  return (
    <div>
      <Text variant="large">Centro seleccionado: {selectedCentro.text}</Text>
      <br /><br />

      {categorias.map((cat) => (
        <div key={cat} style={{ marginBottom: '20px' }}>
          <Text variant="xLarge">{cat}</Text>
          <div style={{ marginLeft: '20px' }}>
            {catalogoEPP.filter((item) => item.field_2 === cat).map((item) => (
              <div key={item.Title} style={{ marginBottom: '10px' }}>
                <Text>{item.Title}</Text>
                <TextField
                  type="number"
                  value={cantidades[item.Title]?.toString() || ''}
                  onChange={(_, value) => handleChange(item.Title, value || '0')}
                  style={{ width: '100px', marginLeft: '10px' }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <PrimaryButton text="Guardar / Enviar" onClick={handleSubmit} />
    </div>
  );
};

export default RequestForm;
