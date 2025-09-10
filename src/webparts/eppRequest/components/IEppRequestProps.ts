import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEppRequestProps {
  description: string;
  context: WebPartContext;
  mockUser?: { displayName: string; email: string };

  selectedCentro?: { key: string; text: string };
  solicitante?: string;
  onSubmit?: (data: any) => void;
}
