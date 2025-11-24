import { InscripcionData } from "../config/campamento";

/**
 * SERVICIO DE GOOGLE SHEETS CON BACKEND
 * 
 * Este servicio se conecta a un backend Node.js que maneja
 * la autenticación con Google Sheets usando Service Account.
 * 
 * El backend debe estar corriendo en http://localhost:3001
 */

const API_URL = 'http://localhost:3002/api';

export class GoogleSheetsService {
  constructor() {
    // El spreadsheet ID se maneja en el backend
  }

  /**
   * Agrega una nueva inscripción en estado Pendiente
   */
  async agregarInscripcion(data: InscripcionData): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/inscripciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar inscripción');
      }

      const result = await response.json();
      console.log('✅ Inscripción guardada:', result);
      return result.success;
    } catch (error) {
      console.error('Error al guardar inscripción:', error);
      throw error;
    }
  }

  /**
   * Verifica si un DNI ya está registrado
   */
  async verificarDNIExistente(dni: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/verificar-dni/${dni}`);
      
      if (!response.ok) {
        throw new Error('Error al verificar DNI');
      }

      const result = await response.json();
      return result.existe;
    } catch (error) {
      console.error('Error al verificar DNI:', error);
      return false;
    }
  }

  /**
   * Verifica si un usuario tiene su pago confirmado
   */
  async verificarPagoConfirmado(dni: string): Promise<{ permitido: boolean; datos: any }> {
    try {
      const response = await fetch(`${API_URL}/verificar-pago/${dni}`);
      
      if (!response.ok) {
        throw new Error('Error al verificar pago');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error al verificar pago confirmado:', error);
      return { permitido: false, datos: null };
    }
  }

  /**
   * Verifica si un usuario ya tiene un taller asignado
   */
  async verificarTallerAsignado(dni: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/verificar-taller/${dni}`);
      
      if (!response.ok) {
        throw new Error('Error al verificar taller');
      }

      const result = await response.json();
      return result.tieneTaller;
    } catch (error) {
      console.error('Error al verificar taller asignado:', error);
      return false;
    }
  }

  /**
   * Registra un usuario en un taller específico
   */
  async registrarEnTaller(dni: string, tallerId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/registrar-taller`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni, tallerId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al registrar en taller');
      }

      const result = await response.json();
      console.log('✅ Registrado en taller:', result);
      return result.success;
    } catch (error) {
      console.error('Error al registrar en taller:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las inscripciones pendientes (para uso futuro)
   */
  async obtenerInscripciones(): Promise<any[]> {
    console.warn("Método no implementado aún");
    return [];
  }
}

// Crear instancia singleton
export const googleSheetsService = new GoogleSheetsService();
