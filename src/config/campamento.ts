// Configuración del Campamento - Actualiza estos valores para cada nuevo campamento

// Configuración de cupos
const CAPACIDAD_TOTAL_CAMPAMENTO = 50;
const TALLERES_POR_DIA = 3;
const TALLERES_POR_PERSONA = 2;
const CUPO_POR_TALLER = Math.ceil((CAPACIDAD_TOTAL_CAMPAMENTO * TALLERES_POR_PERSONA) / TALLERES_POR_DIA);

export const capacidadConfig = {
  capacidadTotal: CAPACIDAD_TOTAL_CAMPAMENTO,
  talleresPorDia: TALLERES_POR_DIA,
  talleresPorPersona: TALLERES_POR_PERSONA,
  cupoPorTaller: CUPO_POR_TALLER
};

export const campamentoConfig = {
  // Información General
  nombre: "Campamento Juvenil ¡SI, SEÑOR!",
  lema: "Un llamado que transforma",
  fechas: "27 - 30 de Enero 2026",
  lugar: "La Roca Av. Las Palmas",
  
  // Costos
  precio: "S/ 160.00",
  precioDescripcion: "Incluye alojamiento, alimentación completa y materiales",
  
  // Información de Pago
  yapeNumero: "+51 998 337 031",
  yapeTitular: "Anibal Carazas",
  plinNumero: "+51 998 337 031",
  plinTitular: "Anibal Carazas",
  
  // Información Bancaria
  cuentaBancaria: "107-7164760",
  banco: "Scotiabank",
  cci: "009-266-201077164760-86",
  titularCuenta: "Anibal Carazas",
  
  // URL de imágenes (puedes cambiar estas URLs)
  imagenHero: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&q=80", // Imagen de banner principal
  imagenQRYape: "/qr.jpeg", // QR de YAPE (en carpeta public)
  imagenQRPlin: "/plin.jpeg", // QR de PLIN (en carpeta public)
  imagenCuentaBancaria: "/cuenta.jpeg", // Imagen de datos bancarios (en carpeta public)
  
  // Google Sheets - Configuración para almacenar inscripciones
  googleSheets: {
    apiKey: (import.meta as any).env?.VITE_GOOGLE_SHEETS_API_KEY || "AIzaSyBBh9Dw6HJ8mrnSm8_-Wn7FIzKQdpSRixU",
    spreadsheetId: (import.meta as any).env?.VITE_SPREADSHEET_ID || "TU_SPREADSHEET_ID", // Reemplazar con el ID de tu hoja
    rangePendientes: "Pendientes!A:N", // Inscripciones esperando confirmación de pago
    rangeConfirmadas: "Confirmadas!A:N", // Inscripciones con pago confirmado
  },
  
  // Información de Contacto
  contacto: {
    email: "campamento@iglesialaroca.org",
    telefono: "+51 998 337 031",
    whatsapp: (import.meta as any).env?.VITE_WHATSAPP_NUMBER || "51998337031", // Solo números, sin + ni espacios
    direccion: "Av. Las Palmas, Lima, Perú",
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

  // Talleres Disponibles - Sistema por Días
  // Cada día tiene 3 talleres, cada persona puede elegir 2 por día
  talleresPorDia: [
    {
      dia: 1,
      titulo: "El me llama por mi nombre",
      talleres: [
        {
          id: "dia1-taller1",
          numero: 1,
          nombre: "Resiliencia y esperanza",
          descripcion: "Objetivo: problema de la frustración y ansiedad",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        },
        {
          id: "dia1-taller2",
          numero: 2,
          nombre: "Amistad, enamoramiento y noviazgo",
          descripcion: "Objetivo: problemas en los tiempos de superficialidad",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        },
        {
          id: "dia1-taller3",
          numero: 3,
          nombre: "Identidad en la era digital",
          descripcion: "Objetivo: problemas con la presión social y cultural",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        }
      ]
    },
    {
      dia: 2,
      titulo: "El transforma mi manera de vivir",
      talleres: [
        {
          id: "dia2-taller1",
          numero: 1,
          nombre: "Finanzas inteligentes",
          descripcion: "Objetivo: Ser un buen administrador. Educación financiera en la juventud",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        },
        {
          id: "dia2-taller2",
          numero: 2,
          nombre: "Música y contenido",
          descripcion: "Objetivo: Lo que consumo forma lo que soy",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        },
        {
          id: "dia2-taller3",
          numero: 3,
          nombre: "Verdad vs relativismo",
          descripcion: "Objetivo: mi verdad y la verdad del evangelio, dilema ético",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        }
      ]
    },
    {
      dia: 3,
      titulo: "El guía mi vocación",
      talleres: [
        {
          id: "dia3-taller1",
          numero: 1,
          nombre: "Propósito y vocación",
          descripcion: "Objetivo: Dones y talentos conectados con la visión de Dios",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        },
        {
          id: "dia3-taller2",
          numero: 2,
          nombre: "Misiones",
          descripcion: "Objetivo: ayudar a los jóvenes a comprender qué significa misión en un sentido integral",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        },
        {
          id: "dia3-taller3",
          numero: 3,
          nombre: "Orientación vocacional y elección de carrera",
          descripcion: "Objetivo: ¿Cómo descubro mi llamado?",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        }
      ]
    },
    {
      dia: 4,
      titulo: "El me envía al mundo",
      talleres: [
        {
          id: "dia4-taller1",
          numero: 1,
          nombre: "Impacto comunitario",
          descripcion: "Objetivo: Cómo ser sal y luz en mi barrio",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        },
        {
          id: "dia4-taller2",
          numero: 2,
          nombre: "Comunicación y redes sociales",
          descripcion: "Objetivo: Impacto digital",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        },
        {
          id: "dia4-taller3",
          numero: 3,
          nombre: "Proyecto de vida recargado",
          descripcion: "Objetivo: Mi historia como carta abierta",
          capacidadMaxima: CUPO_POR_TALLER,
          inscritos: 0
        }
      ]
    }
  ],

  // Mantener talleres antiguos para compatibilidad (se eliminará después)
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
  sexo: string;
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
