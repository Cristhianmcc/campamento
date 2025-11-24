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
  imagenQRYape: "src/img/qr.jpeg", // Reemplazar con QR real de YAPE
  imagenQRPlin: "https://images.unsplash.com/photo-1609356767591-002b28e37b09?w=400&q=80", // Reemplazar con QR real de PLIN
  
  // Google Sheets - Configuración para almacenar inscripciones
  googleSheets: {
    apiKey: (import.meta as any).env?.VITE_GOOGLE_SHEETS_API_KEY || "AIzaSyBBh9Dw6HJ8mrnSm8_-Wn7FIzKQdpSRixU",
    spreadsheetId: (import.meta as any).env?.VITE_SPREADSHEET_ID || "TU_SPREADSHEET_ID", // Reemplazar con el ID de tu hoja
    rangePendientes: "Pendientes!A:N", // Inscripciones esperando confirmación de pago
    rangeConfirmadas: "Confirmadas!A:N", // Inscripciones con pago confirmado
  },
  
  // Información de Contacto
  contacto: {
    email: "campamento@iglesianvida.org",
    telefono: "+51 987 654 321",
    whatsapp: (import.meta as any).env?.VITE_WHATSAPP_NUMBER || "51987654321", // Solo números, sin + ni espacios
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
  },

  // Talleres Disponibles
  talleres: [
    {
      id: "taller-1",
      nombre: "Adoración y Música",
      descripcion: "Aprende técnicas de adoración, manejo de instrumentos y liderazgo en alabanza",
      instructor: "Pastor Juan Música",
      capacidadMaxima: 30,
      inscritos: 0,
      horario: "Lunes a Viernes - 2:00 PM a 4:00 PM",
      lugar: "Salón Principal"
    },
    {
      id: "taller-2",
      nombre: "Evangelismo y Misiones",
      descripcion: "Estrategias prácticas para compartir el evangelio y alcanzar tu comunidad",
      instructor: "Misionera Ana López",
      capacidadMaxima: 25,
      inscritos: 0,
      horario: "Lunes a Viernes - 2:00 PM a 4:00 PM",
      lugar: "Salón de Conferencias"
    },
    {
      id: "taller-3",
      nombre: "Liderazgo Juvenil",
      descripcion: "Desarrolla habilidades de liderazgo cristiano para impactar a tu generación",
      instructor: "Pastor Carlos Mendoza",
      capacidadMaxima: 35,
      inscritos: 0,
      horario: "Lunes a Viernes - 2:00 PM a 4:00 PM",
      lugar: "Auditorio"
    },
    {
      id: "taller-4",
      nombre: "Estudio Bíblico Profundo",
      descripcion: "Métodos de interpretación bíblica y estudio inductivo de las escrituras",
      instructor: "Teóloga María Sánchez",
      capacidadMaxima: 20,
      inscritos: 0,
      horario: "Lunes a Viernes - 2:00 PM a 4:00 PM",
      lugar: "Biblioteca"
    },
    {
      id: "taller-5",
      nombre: "Ministerio Infantil",
      descripcion: "Herramientas creativas para enseñar la Palabra de Dios a los niños",
      instructor: "Maestra Luz Torres",
      capacidadMaxima: 25,
      inscritos: 0,
      horario: "Lunes a Viernes - 2:00 PM a 4:00 PM",
      lugar: "Sala Infantil"
    },
    {
      id: "taller-6",
      nombre: "Consejería Cristiana",
      descripcion: "Principios bíblicos para acompañar y restaurar vidas",
      instructor: "Consejero Roberto Paz",
      capacidadMaxima: 15,
      inscritos: 0,
      horario: "Lunes a Viernes - 2:00 PM a 4:00 PM",
      lugar: "Sala de Consejería"
    }
  ] as Taller[],
};

export type Taller = {
  id: string;
  nombre: string;
  descripcion: string;
  instructor: string;
  capacidadMaxima: number;
  inscritos: number;
  horario: string;
  lugar: string;
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
  tallerAsignado?: string; // ID del taller
  fechaRegistroTaller?: string;
};
