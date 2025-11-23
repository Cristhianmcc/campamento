import { useState } from "react";
import { HeroSection } from "./components/HeroSection";
import { AcercaDelCampamento } from "./components/AcercaDelCampamento";
import { FormularioInscripcion } from "./components/FormularioInscripcion";
import { ModalPago } from "./components/ModalPago";
import { Footer } from "./components/Footer";
import { googleSheetsService } from "./services/googleSheets";
import { InscripcionData } from "./config/campamento";
import { Toaster, toast } from "sonner@2.0.3";

export default function App() {
  const [modalPagoOpen, setModalPagoOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inscripcionGuardada, setInscripcionGuardada] = useState<InscripcionData | null>(null);

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

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      
      {/* Hero Section */}
      <HeroSection />

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
    </div>
  );
}
