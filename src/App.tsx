import { useState } from "react";
import { HeroSection } from "./components/HeroSection";
import { AcercaDelCampamento } from "./components/AcercaDelCampamento";
import { FormularioInscripcion } from "./components/FormularioInscripcion";
import { ModalPago } from "./components/ModalPago";
import { TalleresAcceso } from "./components/TalleresAcceso";
import { SeleccionTaller } from "./components/SeleccionTaller";
import { Footer } from "./components/Footer";
import { googleSheetsService } from "./services/googleSheets";
import { InscripcionData } from "./config/campamento";
import { Toaster, toast } from "sonner";
import { Users, Home, ArrowLeft } from "lucide-react";

type Vista = "inicio" | "acceso-talleres" | "seleccion-taller" | "taller-registrado";

export default function App() {
  const [vistaActual, setVistaActual] = useState<Vista>("inicio");
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

    // Verificar si ya tiene un taller asignado
    const yaRegistrado = await googleSheetsService.verificarTallerAsignado(dni);
    
    if (yaRegistrado) {
      toast.info("Ya estás registrado en un taller", {
        description: "No puedes registrarte en más talleres.",
        duration: 5000,
      });
      setVistaActual("taller-registrado");
    } else {
      setVistaActual("seleccion-taller");
    }
  };

  const handleRegistrarEnTaller = async (dni: string, tallerId: string) => {
    const resultado = await googleSheetsService.registrarEnTaller(dni, tallerId);
    
    // Sincronizar talleres automáticamente después del registro exitoso
    if (resultado) {
      try {
        await fetch('http://localhost:3002/api/sincronizar-talleres', {
          method: 'POST'
        });
        console.log('✅ Talleres sincronizados automáticamente');
      } catch (error) {
        console.warn('⚠️ No se pudo sincronizar talleres automáticamente:', error);
      }
    }
    
    return resultado;
  };

  const handleTallerRegistrado = () => {
    setVistaActual("taller-registrado");
  };

  const handleVolverAInicio = () => {
    setVistaActual("inicio");
    setDniUsuario("");
    setDatosUsuario(null);
  };

  const handleVolverDesdeSeleccion = () => {
    setVistaActual("acceso-talleres");
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      
      {vistaActual === "inicio" && (
        <>
          {/* Hero Section */}
          <HeroSection onIrATalleres={() => setVistaActual("acceso-talleres")} />

          {/* Acerca del Campamento */}
          <AcercaDelCampamento />

          {/* Formulario de Inscripción */}
          <FormularioInscripcion
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />

          {/* Footer */}
          <Footer />

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
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 font-semibold border-2 border-white flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Inicio
            </button>
          </div>
        </>
      )}

      {vistaActual === "seleccion-taller" && (
        <>
          <SeleccionTaller
            dniUsuario={dniUsuario}
            datosUsuario={datosUsuario}
            onTallerRegistrado={handleTallerRegistrado}
            onVolver={handleVolverDesdeSeleccion}
            registrarEnTaller={handleRegistrarEnTaller}
          />
          <Footer />
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
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 font-bold border-2 border-white flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
