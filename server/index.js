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
      data.tallerAsignado || '',
      data.fechaRegistroTaller || ''
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inscripciones!A:N',
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
      range: 'Inscripciones!A:N', // Hoja única
    });

    const rows = result.data.values || [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[4] === dni) {
        const tieneTaller = row[12] && row[12] !== '';
        return res.json({ tieneTaller });
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

// 6. Sincronizar talleres - Crear/actualizar hojas por taller
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
