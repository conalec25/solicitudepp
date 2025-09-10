import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EppRequestWebPartStrings';
import EppRequest from './components/EppRequest';
import { IEppRequestProps } from './components/IEppRequestProps';

export interface IEppRequestWebPartProps {
  description: string;
}

export default class EppRequestWebPart extends BaseClientSideWebPart<IEppRequestWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IEppRequestProps> = React.createElement(
      EppRequest,
      {
        description: this.properties.description,
        context: this.context,
        mockUser: undefined
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', { label: strings.DescriptionFieldLabel })
              ]
            }
          ]
        }
      ]
    };
  }
}
