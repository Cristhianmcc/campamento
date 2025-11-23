import { campamentoConfig, InscripcionData } from "../config/campamento";

/**
 * CONFIGURACIÓN DE GOOGLE SHEETS API
 * 
 * Para conectar con Google Sheets, sigue estos pasos:
 * 
 * 1. Ve a Google Cloud Console (https://console.cloud.google.com)
 * 2. Crea un nuevo proyecto o selecciona uno existente
 * 3. Habilita la API de Google Sheets:
 *    - Ve a "APIs y servicios" > "Biblioteca"
 *    - Busca "Google Sheets API"
 *    - Haz clic en "Habilitar"
 * 
 * 4. Crea credenciales:
 *    - Ve a "APIs y servicios" > "Credenciales"
 *    - Haz clic en "Crear credenciales" > "Clave de API"
 *    - Copia la clave y pégala en /config/campamento.ts en googleSheets.apiKey
 * 
 * 5. Crea tu Google Sheet con DOS hojas:
 *    - Crea una nueva hoja de cálculo en Google Sheets
 *    - Renombra la primera hoja como "Pendientes"
 *    - Crea una segunda hoja llamada "Confirmadas"
 *    - En ambas hojas, agrega estos encabezados en la fila 1:
 *      A1: Código | B1: Nombres | C1: Apellidos | D1: Edad | E1: DNI | F1: Email | 
 *      G1: Teléfono | H1: Iglesia | I1: Necesidades Especiales | J1: Estado Pago | 
 *      K1: Fecha Inscripción | L1: Fecha Confirmación
 * 
 * 6. Configura permisos:
 *    - Haz clic en "Compartir" en tu Google Sheet
 *    - Cambia los permisos a "Cualquier persona con el enlace puede editar"
 *    - Copia el ID de la hoja (está en la URL entre /d/ y /edit)
 *    - Pégalo en /config/campamento.ts en googleSheets.spreadsheetId
 * 
 * IMPORTANTE:
 * - Esta es una implementación básica para prototipos
 * - Para producción, usa OAuth 2.0 o una cuenta de servicio
 * - Nunca expongas tu API key en producción
 * - Considera usar un backend para manejar las credenciales de forma segura
 */

export class GoogleSheetsService {
  private apiKey: string;
  private spreadsheetId: string;
  private rangePendientes: string;
  private rangeConfirmadas: string;

  constructor() {
    this.apiKey = campamentoConfig.googleSheets.apiKey;
    this.spreadsheetId = campamentoConfig.googleSheets.spreadsheetId;
    this.rangePendientes = campamentoConfig.googleSheets.rangePendientes;
    this.rangeConfirmadas = campamentoConfig.googleSheets.rangeConfirmadas;
  }

  /**
   * Agrega una nueva inscripción en estado Pendiente
   */
  async agregarInscripcion(data: InscripcionData): Promise<boolean> {
    try {
      // Validar que las credenciales estén configuradas
      if (this.apiKey === "TU_API_KEY_DE_GOOGLE" || this.spreadsheetId === "TU_SPREADSHEET_ID") {
        console.warn("Google Sheets no está configurado. Por favor, actualiza las credenciales en /config/campamento.ts");
        
        // Simular éxito para propósitos de demostración
        console.log("Datos que se guardarían:", data);
        await this.simulateDelay(1000);
        return true;
      }

      // Preparar los datos en el orden correcto para las columnas
      const values = [[
        data.codigoInscripcion,
        data.nombres,
        data.apellidos,
        data.edad,
        data.dni,
        data.email,
        data.telefono,
        data.iglesia,
        data.necesidadesEspeciales || "N/A",
        data.estadoPago,
        new Date(data.fechaInscripcion).toLocaleString("es-PE"),
        data.fechaConfirmacion ? new Date(data.fechaConfirmacion).toLocaleString("es-PE") : "",
      ]];

      // Construir URL de la API - guardar en Pendientes
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.rangePendientes}:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`;

      // Enviar datos a Google Sheets
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: values,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error de Google Sheets API: ${errorData.error?.message || "Error desconocido"}`);
      }

      console.log("Inscripción guardada en Pendientes");
      return true;
    } catch (error) {
      console.error("Error al guardar en Google Sheets:", error);
      throw error;
    }
  }

  /**
   * Verifica si un DNI ya está registrado en Pendientes o Confirmadas
   */
  async verificarDNIExistente(dni: string): Promise<boolean> {
    try {
      if (this.apiKey === "TU_API_KEY_DE_GOOGLE" || this.spreadsheetId === "TU_SPREADSHEET_ID") {
        // En modo demo, simular que no hay duplicados
        return false;
      }

      // Buscar en ambas hojas
      const urlPendientes = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.rangePendientes}?key=${this.apiKey}`;
      const urlConfirmadas = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.rangeConfirmadas}?key=${this.apiKey}`;

      const [resPendientes, resConfirmadas] = await Promise.all([
        fetch(urlPendientes),
        fetch(urlConfirmadas)
      ]);

      if (!resPendientes.ok || !resConfirmadas.ok) {
        console.warn("No se pudo verificar DNI duplicado");
        return false; // En caso de error, permitir el registro
      }

      const dataPendientes = await resPendientes.json();
      const dataConfirmadas = await resConfirmadas.json();

      const pendientes = dataPendientes.values || [];
      const confirmadas = dataConfirmadas.values || [];

      // Buscar DNI en columna E (índice 4)
      // Saltar la primera fila (encabezados)
      for (let i = 1; i < pendientes.length; i++) {
        if (pendientes[i][4] === dni) return true;
      }

      for (let i = 1; i < confirmadas.length; i++) {
        if (confirmadas[i][4] === dni) return true;
      }

      return false;
    } catch (error) {
      console.error("Error al verificar DNI:", error);
      return false; // En caso de error, permitir el registro
    }
  }

  /**
   * Obtiene todas las inscripciones pendientes
   */
  async obtenerInscripciones(): Promise<any[]> {
    try {
      if (this.apiKey === "TU_API_KEY_DE_GOOGLE" || this.spreadsheetId === "TU_SPREADSHEET_ID") {
        console.warn("Google Sheets no está configurado");
        return [];
      }

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.rangePendientes}?key=${this.apiKey}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Error al obtener las inscripciones");
      }

      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error("Error al obtener inscripciones:", error);
      throw error;
    }
  }

  /**
   * Simula un delay para propósitos de demostración
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Crear instancia singleton
export const googleSheetsService = new GoogleSheetsService();
