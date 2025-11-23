// Configuración del Campamento - Actualiza estos valores para cada nuevo campamento

export const campamentoConfig = {
  // Información General
  nombre: "Campamento Esperanza 2025",
  lema: "Renovando nuestra fe en Cristo",
  fechas: "15 - 20 de Enero 2025",
  lugar: "Centro Recreacional Valle Verde, Lima",
  
  // Costos
  precio: "S/ 250.00",
  precioDescripcion: "Incluye alojamiento, alimentación completa y materiales",
  
  // Información de Pago
  yapeNumero: "+51 987 654 321",
  yapeTitular: "Iglesia Nueva Vida",
  plinNumero: "+51 987 654 321",
  plinTitular: "Iglesia Nueva Vida",
  
  // URL de imágenes (puedes cambiar estas URLs)
  imagenHero: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&q=80", // Imagen de banner principal
  imagenQRYape: "https://images.unsplash.com/photo-1609356767591-002b28e37b09?w=400&q=80", // Reemplazar con QR real de YAPE
  imagenQRPlin: "https://images.unsplash.com/photo-1609356767591-002b28e37b09?w=400&q=80", // Reemplazar con QR real de PLIN
  
  // Google Sheets - Configuración para almacenar inscripciones
  googleSheets: {
    apiKey: "TU_API_KEY_DE_GOOGLE", // Obtener de Google Cloud Console
    spreadsheetId: "TU_SPREADSHEET_ID", // ID de tu hoja de Google Sheets
    rangePendientes: "Pendientes!A:L", // Inscripciones esperando confirmación de pago
    rangeConfirmadas: "Confirmadas!A:L", // Inscripciones con pago confirmado
  },
  
  // Información de Contacto
  contacto: {
    email: "campamento@iglesianvida.org",
    telefono: "+51 987 654 321",
    whatsapp: "51987654321", // Solo números, sin + ni espacios
    direccion: "Av. Principal 123, Lima, Perú",
  },
  
  // Sobre el Campamento
  descripcion: [
    "Un tiempo especial de renovación espiritual",
    "Actividades recreativas y deportivas",
    "Enseñanza bíblica profunda",
    "Compañerismo cristiano",
  ],
  
  // Redes Sociales
  redesSociales: {
    facebook: "https://facebook.com/iglesianvida",
    instagram: "https://instagram.com/iglesianvida",
    youtube: "https://youtube.com/iglesianvida",
  }
};

export type InscripcionData = {
  nombres: string;
  apellidos: string;
  edad: string;
  dni: string;
  email: string;
  telefono: string;
  iglesia: string;
  necesidadesEspeciales: string;
  fechaInscripcion: string;
  codigoInscripcion: string;
  estadoPago: 'Pendiente' | 'Confirmado';
  fechaConfirmacion?: string;
};
