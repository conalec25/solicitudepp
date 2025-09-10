import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class AdaptiveCardService {
  private sp;

  constructor(context: WebPartContext) {
    this.sp = spfi().using(SPFx(context));
  }

  /**
   * 🔹 Pantalla 1: Selección de Centro
   */
  public async getStep1Card(userEmail: string): Promise<any> {
    const centros = await this.sp.web.lists
      .getByTitle("SSO_CENTROS")
      .items.select("Title,Centro,Activo,Correo_Encargado/EMail")
      .expand("Correo_Encargado")();

    const permitidos = centros.filter(
      (c: any) =>
        c.Activo === true &&
        c.Correo_Encargado?.EMail?.toLowerCase() === userEmail.toLowerCase()
    );

    const choices = permitidos.map((c: any) => ({
      title: c.Centro,
      value: c.Title
    }));

    return {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.4",
      body: [
        {
          type: "TextBlock",
          text: "Seleccione su Centro",
          weight: "Bolder",
          color: "Good",
          size: "Large"
        },
        {
          type: "Input.ChoiceSet",
          id: "centro",
          style: "expanded",
          choices
        }
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Siguiente",
          data: { step: 2 }
        }
      ]
    };
  }

  /**
   * 🔹 Pantalla 2: Selección de EPP
   */
  public async getStep2Card(centro: string): Promise<any> {
    const catalogo = await this.sp.web.lists
      .getByTitle("SSO_CATALOGO_EPP")
      .items.select("Id,Title,field_2")(); // field_2 = Categoria

    const categorias: string[] = Array.from(
      new Set(catalogo.map((item: any) => item.field_2))
    );

    const body: any[] = [
      {
        type: "TextBlock",
        text: "Solicitud de EPP",
        weight: "Bolder",
        color: "Good",
        size: "Large"
      },
      {
        type: "TextBlock",
        text: "Centro seleccionado:",
        weight: "Default",
        color: "Default"
      },
      {
        type: "TextBlock",
        text: centro,
        weight: "Bolder",
        color: "Good"
      }
    ];

    categorias.forEach((cat) => {
      body.push({
        type: "TextBlock",
        text: cat,
        weight: "Bolder",
        color: "Good"
      });

      catalogo
        .filter((item: any) => item.field_2 === cat)
        .forEach((item: any) => {
          body.push({
            type: "TextBlock",
            text: item.Title,
            weight: "Default",
            color: "Default"
          });
          body.push({
            type: "Input.Number",
            id: item.Title,
            placeholder: "0",
            max: 999
          });
        });
    });

    return {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.4",
      body,
      actions: [
        {
          type: "Action.Submit",
          title: "Siguiente",
          data: { step: 3, centro }
        }
      ]
    };
  }

  /**
   * 🔹 Pantalla 3: Observaciones
   */
  public getStep3Card(): any {
    return {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.4",
      body: [
        {
          type: "TextBlock",
          text: "Observaciones",
          weight: "Bolder",
          color: "Good",
          size: "Large"
        },
        {
          type: "Input.Text",
          id: "observaciones",
          isMultiline: true,
          placeholder: "Ingrese observaciones adicionales"
        }
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Enviar Solicitud",
          data: { step: 4 }
        }
      ]
    };
  }

  /**
   * 🔹 Pantalla 4: Confirmación
   */
  public getStep4Card(
    solicitante: string,
    fechaHora: string,
    logoUrl: string
  ): any {
    return {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.4",
      body: [
        {
          type: "Image",
          url: logoUrl,
          size: "Medium"
        },
        {
          type: "TextBlock",
          text: "Solicitud Enviada",
          weight: "Bolder",
          color: "Good",
          size: "Large"
        },
        {
          type: "TextBlock",
          text: solicitante,
          weight: "Bolder",
          color: "Good"
        },
        {
          type: "TextBlock",
          text: fechaHora,
          color: "Default"
        }
      ]
    };
  }
}
