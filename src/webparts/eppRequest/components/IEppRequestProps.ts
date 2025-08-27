import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IEppRequestProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext; // 👈 agregado para poder usar context en SelectCentro
}
