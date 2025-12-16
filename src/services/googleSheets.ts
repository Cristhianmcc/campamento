import { InscripcionData } from "../config/campamento";

/**
 * SERVICIO DE GOOGLE SHEETS CON BACKEND
 * 
 * Este servicio se conecta a un backend Node.js que maneja
 * la autenticación con Google Sheets usando Service Account.
 * 
 * Backend desplegado en Render
 */

// Detectar automáticamente el entorno
const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalDevelopment 
  ? 'http://localhost:3002/api' 
  : 'https://campamento-nz0r.onrender.com/api';

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
   * Registra múltiples talleres por día (NUEVO SISTEMA)
   */
  async registrarTalleresPorDia(dni: string, talleres: Array<{ dia: number, talleres: string[] }>): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/registrar-talleres-por-dia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni, talleres }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Mostrar el mensaje específico del servidor
        throw new Error(result.error || 'Error al registrar talleres por día');
      }

      console.log('✅ Talleres por día registrados:', result);
      return result.success;
    } catch (error: any) {
      console.error('Error al registrar talleres por día:', error);
      // Propagar el error con el mensaje específico
      throw error;
    }
  }

  /**
   * Obtiene los cupos disponibles de cada taller
   */
  async obtenerCuposTalleres(): Promise<Record<string, number>> {
    try {
      const response = await fetch(`${API_URL}/cupos-talleres`);
      
      if (!response.ok) {
        throw new Error('Error al obtener cupos de talleres');
      }

      const result = await response.json();
      return result.inscritos || {};
    } catch (error) {
      console.error('Error al obtener cupos:', error);
      return {};
    }
  }

  /**
   * Obtiene los datos completos del usuario para el perfil
   */
  async obtenerDatosPerfil(dni: string): Promise<any | null> {
    try {
      const response = await fetch(`${API_URL}/perfil/${dni}`);
      
      if (!response.ok) {
        console.error('Error en la respuesta:', response.status, response.statusText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Resultado del perfil:', result);
      return result.encontrado ? result.datos : null;
    } catch (error) {
      console.error('Error al obtener datos del perfil:', error);
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
