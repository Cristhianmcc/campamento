// Script de prueba del backend
// Ejecutar: node test-backend.js

const API_URL = 'http://localhost:3001/api';

async function probarBackend() {
  console.log('🧪 Iniciando pruebas del backend...\n');

  // 1. Verificar que el backend esté corriendo
  try {
    console.log('1️⃣ Verificando conexión con backend...');
    const response = await fetch('http://localhost:3001/');
    const data = await response.json();
    console.log('✅', data.message);
  } catch (error) {
    console.error('❌ Error: Backend no está corriendo');
    console.log('   Ejecuta: npm run server');
    return;
  }

  // 2. Probar inscripción
  try {
    console.log('\n2️⃣ Probando crear inscripción...');
    const inscripcion = {
      codigo: 'TEST' + Date.now(),
      nombres: 'Juan',
      apellidos: 'Pérez Test',
      edad: '25',
      dni: '87654321', // DNI diferente para no duplicar
      email: 'test@example.com',
      telefono: '987654321',
      iglesia: 'Iglesia Prueba',
      necesidadesEspeciales: 'Ninguna',
      estadoPago: 'Pendiente',
      fechaInscripcion: new Date().toLocaleString('es-PE'),
      fechaConfirmacion: '',
      tallerAsignado: '',
      fechaRegistroTaller: ''
    };

    const response = await fetch(`${API_URL}/inscripciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inscripcion)
    });

    const data = await response.json();
    console.log('✅', data.message || 'Inscripción creada');
    console.log('   DNI de prueba:', inscripcion.dni);
  } catch (error) {
    console.error('❌ Error al crear inscripción:', error.message);
  }

  // 3. Probar verificación de DNI
  try {
    console.log('\n3️⃣ Probando verificar DNI...');
    const response = await fetch(`${API_URL}/verificar-dni/87654321`);
    const data = await response.json();
    console.log('✅ DNI existe:', data.existe);
  } catch (error) {
    console.error('❌ Error al verificar DNI:', error.message);
  }

  console.log('\n✅ Pruebas completadas');
  console.log('\n📝 Siguiente paso:');
  console.log('   1. Abre Google Sheets');
  console.log('   2. Verifica que haya una nueva fila en "Pendientes"');
  console.log('   3. Mueve la fila a "Confirmadas" y cambia Estado a "Confirmado"');
  console.log('   4. Ejecuta el frontend: npm run dev');
}

probarBackend();
