import * as React from 'react';
import styles from './EppRequest.module.scss';
import type { IEppRequestProps } from './IEppRequestProps';
import SelectCentro from './SelectCentro';

export default class EppRequest extends React.Component<IEppRequestProps, { centro: { key: string, text: string } | null }> {
  constructor(props: IEppRequestProps) {
    super(props);
    this.state = {
      centro: null
    };
  }

  private handleCentroSelected = (centro: { key: string, text: string }) => {
    this.setState({ centro });
  };

  public render(): React.ReactElement<IEppRequestProps> {
    const { context } = this.props;

    return (
      <section className={styles.eppRequest}>
        {!this.state.centro ? (
          <SelectCentro
            context={context}
            onCentroSelected={this.handleCentroSelected}
          />
        ) : (
          <div>
            <h3>Centro seleccionado:</h3>
            <p><strong>{this.state.centro.text}</strong></p>
            {/* Aquí luego cargaremos la siguiente ventana */}
          </div>
        )}
      </section>
    );
  }
}
