import { useState, useEffect } from "react";
import { HeroSection } from "./components/HeroSection";
import { AcercaDelCampamento } from "./components/AcercaDelCampamento";
import { FormularioInscripcion } from "./components/FormularioInscripcion";
import { ModalPago } from "./components/ModalPago";
import { TalleresAcceso } from "./components/TalleresAcceso";
import { SeleccionTalleresPorDia } from "./components/SeleccionTalleresPorDia";
import { MiPerfil } from "./components/MiPerfil";
import EstadisticasTalleres from "./components/EstadisticasTalleres";
import { AdminTalleres } from "./components/AdminTalleres";
import { googleSheetsService } from "./services/googleSheets";
import { InscripcionData } from "./config/campamento";
import { Toaster, toast } from "sonner";
import { Home, ArrowLeft } from "lucide-react";

type Vista = "inicio" | "acceso-talleres" | "seleccion-taller" | "taller-registrado" | "mi-perfil" | "estadisticas" | "admin";

export default function App() {
  const [vistaActual, setVistaActual] = useState<Vista>(() => {
    // Leer la ruta inicial desde el hash
    const hash = window.location.hash.replace('#/', '');
    if (hash === 'estadisticas') return 'estadisticas';
    if (hash === 'admin') return 'admin';
    return 'inicio';
  });
  const [modalPagoOpen, setModalPagoOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inscripcionGuardada, setInscripcionGuardada] = useState<InscripcionData | null>(null);
  const [dniUsuario, setDniUsuario] = useState<string>("");
  const [datosUsuario, setDatosUsuario] = useState<any>(null);

  const handleFormSubmit = async (data: InscripcionData) => {
    setIsSubmitting(true);

    try {
      // Verificar si el DNI ya existe
      const dniExiste = await googleSheetsService.verificarDNIExistente(data.dni);
      
      if (dniExiste) {
        setIsSubmitting(false);
        toast.error("DNI ya registrado", {
          description: "Este DNI ya fue registrado anteriormente. Si tienes dudas, contacta con el organizador.",
          duration: 6000,
        });
        return;
      }
      
      // Preparar datos completos (usar DNI como código único)
      const inscripcionCompleta: InscripcionData = {
        ...data,
        codigoInscripcion: data.dni, // El DNI es el código único
        estadoPago: 'Pendiente',
        fechaInscripcion: new Date().toISOString(),
      };

      // Guardar inmediatamente en Google Sheets como Pendiente
      await googleSheetsService.agregarInscripcion(inscripcionCompleta);
      
      // Guardar para mostrar en el modal
      setInscripcionGuardada(inscripcionCompleta);

      setIsSubmitting(false);
      setModalPagoOpen(true);
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Error al procesar tu inscripción", {
        description: "Por favor, intenta nuevamente o contacta con el organizador",
        duration: 5000,
      });
      console.error("Error:", error);
    }
  };

  // Funciones para el flujo de talleres
  const handleVerificarPagoConfirmado = async (dni: string) => {
    return await googleSheetsService.verificarPagoConfirmado(dni);
  };

  const handleAccesoPermitido = async (dni: string, datos: any) => {
    setDniUsuario(dni);
    setDatosUsuario(datos);

    // Verificar si ya tiene talleres asignados (sistema nuevo)
    const yaRegistrado = await googleSheetsService.verificarTallerAsignado(dni);
    
    if (yaRegistrado) {
      // No mostrar toast aquí porque ya se mostró en TalleresAcceso
      setVistaActual("taller-registrado");
      return { yaRegistrado: true };
    } else {
      setVistaActual("seleccion-taller");
      return { yaRegistrado: false };
    }
  };

  // Sistema anterior - mantener por compatibilidad (función comentada por no uso)
  // const handleRegistrarEnTaller = async (dni: string, tallerId: string) => {
  //   const resultado = await googleSheetsService.registrarEnTaller(dni, tallerId);
  //   
  //   if (resultado) {
  //     try {
  //       const API_URL = 'http://localhost:3002/api';
  //       await fetch(`${API_URL}/sincronizar-talleres`, {
  //         method: 'POST'
  //       });
  //       console.log('✅ Talleres sincronizados automáticamente');
  //     } catch (error) {
  //       console.warn('⚠️ No se pudo sincronizar talleres automáticamente:', error);
  //     }
  //   }
  //   
  //   return resultado;
  // };

  // NUEVO SISTEMA: Registrar múltiples talleres por día
  const handleRegistrarTalleresPorDia = async (dni: string, talleres: Array<{ dia: number, talleres: string[] }>) => {
    const resultado = await googleSheetsService.registrarTalleresPorDia(dni, talleres);
    return resultado;
  };

  const handleTallerRegistrado = () => {
    setVistaActual("taller-registrado");
  };

  // Sincronizar vistaActual con URL hash
  useEffect(() => {
    // Actualizar URL cuando cambia la vista
    if (vistaActual === 'estadisticas') {
      window.location.hash = '#/estadisticas';
    } else if (vistaActual === 'inicio') {
      window.location.hash = '';
    }
  }, [vistaActual]);

  // Escuchar cambios en el hash de URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash === 'estadisticas') {
        setVistaActual('estadisticas');
      } else if (hash === 'admin') {
        setVistaActual('admin');
      } else if (hash === '' && vistaActual !== 'inicio') {
        setVistaActual('inicio');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [vistaActual]);

  const handleVolverAInicio = () => {
    setVistaActual("inicio");
    setDniUsuario("");
    setDatosUsuario(null);
  };

  const handleVolverDesdeSeleccion = () => {
    setVistaActual("acceso-talleres");
  };

  const handleVerificarDatosPerfil = async (dni: string) => {
    return await googleSheetsService.obtenerDatosPerfil(dni);
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      
      {vistaActual === "inicio" && (
        <>
          {/* Hero Section */}
          <HeroSection 
            onIrATalleres={() => setVistaActual("acceso-talleres")}
            onVerMiPerfil={() => setVistaActual("mi-perfil")}
          />

          {/* Acerca del Campamento */}
          <AcercaDelCampamento />

          {/* Formulario de Inscripción */}
          <FormularioInscripcion
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />

          {/* Footer */}
          {/* <Footer /> */}

          {/* Modal de Pago */}
          <ModalPago
            isOpen={modalPagoOpen}
            onClose={() => setModalPagoOpen(false)}
            inscripcionData={inscripcionGuardada}
          />
        </>
      )}

      {vistaActual === "acceso-talleres" && (
        <>
          <TalleresAcceso
            onAccesoPermitido={handleAccesoPermitido}
            verificarPagoConfirmado={handleVerificarPagoConfirmado}
          />
          
          {/* Botón para volver - MEJORADO */}
          <div className="fixed bottom-8 left-8 z-50">
            <button
              onClick={handleVolverAInicio}
              className="bg-[#1F2933] hover:bg-[#1E3A8A] !text-white px-6 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 font-['Inter'] font-semibold border-2 border-[#E0B84C] flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Inicio
            </button>
          </div>
        </>
      )}

      {vistaActual === "seleccion-taller" && (
        <>
          {/* NUEVO SISTEMA: Selección de talleres por día */}
          <SeleccionTalleresPorDia
            dniUsuario={dniUsuario}
            datosUsuario={datosUsuario}
            onTalleresRegistrados={handleTallerRegistrado}
            onVolver={handleVolverDesdeSeleccion}
            registrarTalleres={handleRegistrarTalleresPorDia}
          />
          {/* <Footer /> */}
        </>
      )}

      {vistaActual === "taller-registrado" && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-green-500">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-6">
                  <svg className="w-20 h-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-3xl sm:text-4xl text-green-600 mb-4 font-bold">
                ¡Ya estás registrado en un taller!
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Ya tienes un taller asignado. No puedes registrarte en más talleres.
                Si tienes alguna consulta, contacta con el organizador.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleVolverAInicio}
                  className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1E3A8A] !text-white px-8 py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 font-['Inter'] font-medium border-2 border-[#E0B84C] flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {vistaActual === "mi-perfil" && (
        <MiPerfil
          onVolver={handleVolverAInicio}
          verificarDatos={handleVerificarDatosPerfil}
        />
      )}

      {vistaActual === "estadisticas" && (
        <div className="relative">
          <button
            onClick={handleVolverAInicio}
            className="fixed top-4 left-4 z-50 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 border border-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <EstadisticasTalleres />
        </div>
      )}

      {vistaActual === "admin" && (
        <div className="relative">
          <button
            onClick={handleVolverAInicio}
            className="fixed top-4 left-4 z-50 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 border border-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <AdminTalleres onVerEstadisticas={() => setVistaActual("estadisticas")} />
        </div>
      )}
    </div>
  );
}
