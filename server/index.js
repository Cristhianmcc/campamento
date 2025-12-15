import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Mapeo de IDs de talleres a nombres completos
const TALLERES_NOMBRES = {
  'dia1-taller1': 'Resiliencia y esperanza',
  'dia1-taller2': 'Amistad, enamoramiento y noviazgo',
  'dia1-taller3': 'Identidad en la era digital',
  'dia2-taller1': 'Finanzas inteligentes',
  'dia2-taller2': 'Música y contenido',
  'dia2-taller3': 'Verdad vs relativismo',
  'dia3-taller1': 'Propósito y vocación',
  'dia3-taller2': 'Misiones',
  'dia3-taller3': 'Orientación vocacional y elección de carrera',
  'dia4-taller1': 'Impacto comunitario',
  'dia4-taller2': 'Comunicación y redes sociales',
  'dia4-taller3': 'Proyecto de vida recargado'
};

// Middleware
app.use(cors());
app.use(express.json());

// Configurar Google Sheets API con Service Account
let auth;
let sheets;

try {
  // En Render, buscar en /etc/secrets/service-account.json
  // En local, buscar en la raíz del proyecto
  const possiblePaths = [
    '/etc/secrets/service-account.json',  // Render Secret Files
    path.join(__dirname, 'service-account.json'),  // server/service-account.json
    path.join(__dirname, '../service-account.json'),  // raíz del proyecto
  ];

  let keyFilePath = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      keyFilePath = testPath;
      console.log('✅ Credenciales encontradas en:', keyFilePath);
      break;
    }
  }
  
  if (!keyFilePath) {
    console.error('❌ ERROR: No se encontró el archivo service-account.json');
    console.error('   Rutas intentadas:');
    possiblePaths.forEach(p => console.error(`   - ${p}`));
    process.exit(1);
  }
  
  auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheets = google.sheets({ version: 'v4', auth });
  console.log('✅ Google Sheets API configurada correctamente');
} catch (error) {
  console.error('❌ Error al configurar Google Sheets:', error.message);
  process.exit(1);
}

// Obtener spreadsheetId del archivo .env o configuración
const SPREADSHEET_ID = process.env.VITE_SPREADSHEET_ID || '1hCbcC82oeY4auvQ6TC4FdmWcfr35Cnw-EJcPg8B8MCg';

// ==================== ENDPOINTS ====================

// 1. Agregar inscripción a la hoja única "Inscripciones"
app.post('/api/inscripciones', async (req, res) => {
  try {
    const data = req.body;
    
    const values = [[
      data.codigoInscripcion,
      data.nombres,
      data.apellidos,
      data.edad,
      data.dni,
      data.email,
      data.telefono,
      data.iglesia,
      data.necesidadesEspeciales || 'N/A',
      data.estadoPago, // "Pendiente" por defecto
      new Date(data.fechaInscripcion).toLocaleString('es-PE', { timeZone: 'America/Lima' }),
      data.fechaConfirmacion || '',
      '', // Columna M - Ya no se usa (mantener para compatibilidad)
      '', // Columna N - Ya no se usa
      '', // Columna O - Día 1 Taller 1
      '', // Columna P - Día 1 Taller 2
      '', // Columna Q - Día 2 Taller 1
      '', // Columna R - Día 2 Taller 2
      '', // Columna S - Día 3 Taller 1
      '', // Columna T - Día 3 Taller 2
      '', // Columna U - Día 4 Taller 1
      ''  // Columna V - Día 4 Taller 2
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inscripciones!A:V', // Actualizado a columna V
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });

    res.json({ success: true, message: 'Inscripción guardada' });
  } catch (error) {
    console.error('Error al guardar inscripción:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Verificar si DNI existe
app.get('/api/verificar-dni/:dni', async (req, res) => {
  try {
    const { dni } = req.params;

    // Buscar solo en la hoja Inscripciones
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inscripciones!A:N',
    });

    const rows = response.data.values || [];

    // Buscar DNI en columna E (índice 4)
    let existe = false;
    
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][4] === dni) {
        existe = true;
        break;
      }
    }

    res.json({ existe });
  } catch (error) {
    console.error('Error al verificar DNI:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Verificar pago confirmado (Estado Pago = "Confirmado")
app.get('/api/verificar-pago/:dni', async (req, res) => {
  try {
    const { dni } = req.params;

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inscripciones!A:N', // Hoja única
    });

    const rows = result.data.values || [];

    // Buscar DNI en columna E (índice 4) Y Estado Pago = "Confirmado" en columna J (índice 9)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[4] === dni && row[9] === 'Confirmado') {
        return res.json({
          permitido: true,
          datos: {
            codigoInscripcion: row[0],
            nombres: row[1],
            apellidos: row[2],
            edad: row[3],
            dni: row[4],
            email: row[5],
            telefono: row[6],
            iglesia: row[7],
            necesidadesEspeciales: row[8],
            estadoPago: row[9],
            fechaInscripcion: row[10],
            fechaConfirmacion: row[11],
            tallerAsignado: row[12] || null,
            fechaRegistroTaller: row[13] || null
          }
        });
      }
    }

    res.json({ permitido: false, datos: null });
  } catch (error) {
    console.error('Error al verificar pago:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Verificar si tiene taller asignado
app.get('/api/verificar-taller/:dni', async (req, res) => {
  try {
    const { dni } = req.params;

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inscripciones!A:V', // Incluir nuevas columnas
    });

    const rows = result.data.values || [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[4] === dni) {
        const tieneTallerAntiguo = row[12] && row[12] !== '';
        
        // Verificar también columnas O-V (sistema nuevo de talleres por día)
        const talleresNuevos = row.slice(14, 22); // columnas O-V
        const tieneTalleresNuevos = talleresNuevos && talleresNuevos.some(t => t && t.trim() !== '');
        
        const tieneTaller = tieneTallerAntiguo || tieneTalleresNuevos;
        return res.json({ 
          tieneTaller,
          talleresRegistrados: tieneTalleresNuevos ? talleresNuevos : null
        });
      }
    }

    res.json({ tieneTaller: false });
  } catch (error) {
    console.error('Error al verificar taller:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Registrar en taller
app.post('/api/registrar-taller', async (req, res) => {
  try {
    const { dni, tallerId } = req.body;

    // Buscar la fila del usuario
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inscripciones!A:N', // Hoja única
    });

    const rows = result.data.values || [];
    let rowIndex = -1;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][4] === dni) {
        rowIndex = i + 1; // +1 porque Sheets empieza en 1
        break;
      }
    }

    if (rowIndex === -1) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    // Actualizar columnas M y N
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Inscripciones!M${rowIndex}:N${rowIndex}`, // Hoja única
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          tallerId,
          new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })
        ]]
      }
    });

    res.json({ success: true, message: 'Registrado en taller' });
  } catch (error) {
    console.error('Error al registrar en taller:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5B. Registrar múltiples talleres por día (NUEVO SISTEMA)
app.post('/api/registrar-talleres-por-dia', async (req, res) => {
  try {
    const { dni, talleres } = req.body;
    // talleres es un array de { dia: number, talleres: string[] }
    
    if (!dni || !talleres || !Array.isArray(talleres)) {
      return res.status(400).json({ success: false, error: 'Datos inválidos' });
    }

    // Buscar la fila del usuario
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inscripciones!A:V',
    });

    const rows = result.data.values || [];
    let rowIndex = -1;
    let filaUsuario = null;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][4] === dni) {
        rowIndex = i + 1;
        filaUsuario = rows[i];
        break;
      }
    }

    if (rowIndex === -1) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    // VERIFICAR SI YA TIENE TALLERES REGISTRADOS (columnas O-V, índices 14-21)
    const talleresExistentes = filaUsuario.slice(14, 22); // columnas O-V
    const tieneAlgunTaller = talleresExistentes.some(t => t && t.trim() !== '');
    
    if (tieneAlgunTaller) {
      console.log(`⚠️ Usuario ${dni} ya tiene talleres registrados`);
      return res.status(400).json({ 
        success: false, 
        error: 'Ya tienes talleres registrados. No puedes inscribirte nuevamente.' 
      });
    }

    // Preparar los datos para actualizar
    // Columnas: O(14), P(15), Q(16), R(17), S(18), T(19), U(20), V(21)
    const talleresPorColumna = ['', '', '', '', '', '', '', '']; // 8 columnas para talleres

    talleres.forEach(diaData => {
      const dia = diaData.dia;
      const talleresDelDia = diaData.talleres;

      if (dia >= 1 && dia <= 4 && Array.isArray(talleresDelDia)) {
        const baseIndex = (dia - 1) * 2; // Cada día tiene 2 columnas
        
        // Convertir IDs a NOMBRES completos
        if (talleresDelDia[0]) {
          const nombreTaller = TALLERES_NOMBRES[talleresDelDia[0]] || talleresDelDia[0];
          talleresPorColumna[baseIndex] = nombreTaller;
        }
        if (talleresDelDia[1]) {
          const nombreTaller = TALLERES_NOMBRES[talleresDelDia[1]] || talleresDelDia[1];
          talleresPorColumna[baseIndex + 1] = nombreTaller;
        }
      }
    });

    // Actualizar columnas O a V (índices 14 a 21 en la hoja)
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Inscripciones!O${rowIndex}:V${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [talleresPorColumna]
      }
    });

    console.log(`✅ Talleres registrados para DNI ${dni}:`, talleresPorColumna);
    res.json({ success: true, message: 'Talleres registrados exitosamente' });
  } catch (error) {
    console.error('Error al registrar talleres por día:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5C. Obtener cupos disponibles por taller (NUEVO)
app.get('/api/cupos-talleres', async (req, res) => {
  try {
    console.log('📊 Obteniendo cupos de talleres...');
    
    // Obtener todas las inscripciones
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inscripciones!A:V',
    });

    const rows = result.data.values || [];
    
    // Contar inscritos por taller
    const inscritosPorTaller = {};
    
    // Inicializar contadores para todos los talleres
    for (let dia = 1; dia <= 4; dia++) {
      for (let taller = 1; taller <= 3; taller++) {
        const tallerId = `dia${dia}-taller${taller}`;
        inscritosPorTaller[tallerId] = 0;
      }
    }
    
    // Contar inscritos (saltar la fila de encabezados)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Leer columnas O-V (índices 14-21)
      // O=Día1-T1, P=Día1-T2, Q=Día2-T1, R=Día2-T2, S=Día3-T1, T=Día3-T2, U=Día4-T1, V=Día4-T2
      const talleres = row.slice(14, 22);
      
      talleres.forEach(nombreTaller => {
        if (nombreTaller && nombreTaller.trim() !== '') {
          // Buscar el ID del taller por su nombre
          for (const [tallerId, nombre] of Object.entries(TALLERES_NOMBRES)) {
            if (nombre === nombreTaller.trim()) {
              inscritosPorTaller[tallerId] = (inscritosPorTaller[tallerId] || 0) + 1;
              break;
            }
          }
        }
      });
    }
    
    console.log('✅ Cupos calculados:', inscritosPorTaller);
    res.json({ success: true, inscritos: inscritosPorTaller });
  } catch (error) {
    console.error('Error al obtener cupos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Obtener datos completos del usuario por DNI (para perfil)
app.get('/api/perfil/:dni', async (req, res) => {
  try {
    const { dni } = req.params;

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inscripciones!A:V', // Incluir columnas de talleres
    });

    const rows = result.data.values || [];

    // Buscar DNI en columna E (índice 4)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[4] === dni) {
        // Extraer talleres de columnas O-V (índices 14-21)
        const talleresPorDia = {
          dia1: [row[14] || null, row[15] || null].filter(t => t),
          dia2: [row[16] || null, row[17] || null].filter(t => t),
          dia3: [row[18] || null, row[19] || null].filter(t => t),
          dia4: [row[20] || null, row[21] || null].filter(t => t)
        };
        
        return res.json({
          encontrado: true,
          datos: {
            codigo: row[0],
            nombres: row[1],
            apellidos: row[2],
            edad: row[3],
            dni: row[4],
            email: row[5],
            telefono: row[6],
            iglesia: row[7],
            estadoPago: row[9] || 'Pendiente',
            fechaInscripcion: row[10],
            tallerAsignado: row[12] || null, // Sistema antiguo (mantener compatibilidad)
            talleresPorDia // Sistema nuevo
          }
        });
      }
    }

    res.json({ encontrado: false, datos: null });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Sincronizar talleres - Crear/actualizar hojas por taller
app.post('/api/sincronizar-talleres', async (req, res) => {
  try {
    console.log('📊 Sincronizando talleres...');

    // Obtener todas las inscripciones con talleres asignados
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inscripciones!A:N',
    });

    const datos = response.data.values || [];
    
    // Agrupar por taller
    const talleresMapa = {};
    
    for (let i = 1; i < datos.length; i++) {
      const row = datos[i];
      const tallerId = row[12]; // Columna M
      
      if (tallerId && tallerId !== '') {
        if (!talleresMapa[tallerId]) {
          talleresMapa[tallerId] = [];
        }
        
        talleresMapa[tallerId].push({
          codigo: row[0],
          nombres: row[1],
          apellidos: row[2],
          edad: row[3],
          dni: row[4],
          email: row[5],
          telefono: row[6],
          iglesia: row[7],
          fechaRegistro: row[13] || ''
        });
      }
    }

    // Obtener info de las hojas existentes
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const hojasExistentes = sheetInfo.data.sheets.map(s => s.properties.title);

    // Nombres de talleres
    const nombresTalleres = {
      'taller-1': 'Taller - Adoración y Alabanza',
      'taller-2': 'Taller - Evangelismo Creativo',
      'taller-3': 'Taller - Liderazgo Juvenil',
      'taller-4': 'Taller - Multimedia y Diseño',
      'taller-5': 'Taller - Teatro y Drama',
      'taller-6': 'Taller - Servicio y Misiones'
    };

    // Crear/actualizar cada hoja de taller
    for (const [tallerId, participantes] of Object.entries(talleresMapa)) {
      const nombreHoja = nombresTalleres[tallerId] || tallerId;
      
      // Si la hoja no existe, crearla
      if (!hojasExistentes.includes(nombreHoja)) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [{
              addSheet: {
                properties: {
                  title: nombreHoja
                }
              }
            }]
          }
        });
        console.log(`✅ Hoja creada: ${nombreHoja}`);
      }

      // Preparar datos para la hoja
      const encabezados = ['Código', 'Nombres', 'Apellidos', 'Edad', 'DNI', 'Email', 'Teléfono', 'Iglesia', 'Fecha Registro'];
      const filas = participantes.map(p => [
        p.codigo,
        p.nombres,
        p.apellidos,
        p.edad,
        p.dni,
        p.email,
        p.telefono,
        p.iglesia,
        p.fechaRegistro
      ]);

      // Limpiar y escribir datos
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `${nombreHoja}!A:I`,
      });

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${nombreHoja}!A1:I${filas.length + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [encabezados, ...filas]
        }
      });

      console.log(`✅ ${nombreHoja}: ${participantes.length} participantes`);
    }

    res.json({ 
      success: true, 
      message: 'Talleres sincronizados',
      talleres: Object.keys(talleresMapa).length,
      participantes: Object.values(talleresMapa).reduce((sum, arr) => sum + arr.length, 0)
    });
  } catch (error) {
    console.error('Error al sincronizar talleres:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint de health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend de Campamento Cristiano funcionando',
    status: 'OK',
    spreadsheetId: SPREADSHEET_ID
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📊 Conectado a Google Sheets: ${SPREADSHEET_ID}`);
  console.log('');
  console.log('Endpoints disponibles:');
  console.log(`  POST   http://localhost:${PORT}/api/inscripciones`);
  console.log(`  GET    http://localhost:${PORT}/api/verificar-dni/:dni`);
  console.log(`  GET    http://localhost:${PORT}/api/verificar-pago/:dni`);
  console.log(`  GET    http://localhost:${PORT}/api/verificar-taller/:dni`);
  console.log(`  POST   http://localhost:${PORT}/api/registrar-taller`);
  console.log(`  POST   http://localhost:${PORT}/api/registrar-talleres-por-dia`);
  console.log(`  GET    http://localhost:${PORT}/api/cupos-talleres`);
  console.log(`  GET    http://localhost:${PORT}/api/perfil/:dni`);
  console.log(`  POST   http://localhost:${PORT}/api/sincronizar-talleres`);
  console.log('');
  console.log('⏳ Esperando peticiones...');
});

// Manejo de errores del servidor
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: El puerto ${PORT} ya está en uso`);
    console.error('   Cierra el otro proceso o usa un puerto diferente');
  } else {
    console.error('❌ Error del servidor:', error);
  }
  process.exit(1);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
});
