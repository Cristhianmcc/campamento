import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import { campamentoConfig } from "../config/campamento";
import { googleSheetsService } from "../services/googleSheets";

interface TalleresAccesoProps {
  onAccesoPermitido: (dni: string, datosUsuario: any) => Promise<{ yaRegistrado: boolean }>;
  verificarPagoConfirmado: (dni: string) => Promise<{ permitido: boolean; datos: any }>;
}

export function TalleresAcceso({ onAccesoPermitido, verificarPagoConfirmado }: TalleresAccesoProps) {
  const [dni, setDni] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar DNI
    if (!dni.trim() || dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos");
      return;
    }

    setIsVerifying(true);

    try {
      // Verificar que el pago esté confirmado en Google Sheets
      const resultado = await verificarPagoConfirmado(dni);

      if (resultado.permitido) {
        // PRIMERO verificar si ya tiene talleres registrados
        const yaTieneTalleres = await googleSheetsService.verificarTallerAsignado(dni);
        
        if (yaTieneTalleres) {
          // Si ya tiene talleres, solo llamar a onAccesoPermitido y mostrar mensaje de ya registrado
          await onAccesoPermitido(dni, resultado.datos);
          toast.info("Ya estás registrado en talleres", {
            description: "Ya completaste tu inscripción a talleres.",
            duration: 5000,
          });
        } else {
          // Si no tiene talleres, mostrar mensaje de bienvenida
          toast.success("¡Acceso permitido!", {
            description: "Tu pago ha sido confirmado. Bienvenido a la selección de talleres.",
            duration: 4000,
          });
          await onAccesoPermitido(dni, resultado.datos);
        }
      } else {
        toast.error("Acceso denegado", {
          description: "Tu pago aún no ha sido confirmado. Por favor, contacta con el organizador.",
          duration: 6000,
        });
        setError("Pago no confirmado o DNI no registrado");
      }
    } catch (error) {
      console.error("Error al verificar acceso:", error);
      toast.error("Error al verificar acceso", {
        description: "Por favor, intenta nuevamente o contacta con el organizador.",
      });
      setError("Error al verificar el DNI");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section id="talleres-acceso" className="py-12 sm:py-16 md:py-20 px-4 bg-[#F5F7FA] min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Encabezado */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block bg-[#E0B84C]/20 text-[#1E3A8A] px-4 py-2 rounded-full mb-4 text-sm sm:text-base border border-[#C2A36B]/30 font-['Inter'] font-medium">
            Acceso a Talleres
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#1E3A8A] mb-4 leading-tight px-2 font-['Playfair_Display'] font-bold">
            Registra tu Taller
          </h2>
          <p className="text-lg sm:text-xl text-[#6B7280] px-4 font-['Inter']">
            Ingresa tu DNI para acceder a la selección de talleres
          </p>
        </div>

        {/* Card de Acceso */}
        <Card className="p-6 sm:p-8 md:p-12 shadow-2xl border-t-4 border-[#2563EB]">
          <div className="flex justify-center mb-6">
            <div className="bg-[#2563EB]/10 p-4 rounded-full">
              <Lock className="w-12 h-12 text-[#2563EB]" />
            </div>
          </div>

          <div className="bg-[#E0B84C]/10 p-4 rounded-lg border border-[#C2A36B]/40 mb-6">
            <p className="text-sm text-[#1F2933] font-['Inter']">
              <strong>Nota importante:</strong> Solo podrás acceder si tu pago ya fue confirmado por el organizador.
              Si acabas de realizar el pago, espera la confirmación antes de intentar registrarte en un taller.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input DNI */}
            <div>
              <Label htmlFor="dni-acceso" className="flex items-center gap-2 mb-2 text-[#1E3A8A] text-lg font-['Inter'] font-medium">
                <CreditCard className="w-5 h-5" />
                Ingresa tu DNI
              </Label>
              <Input
                id="dni-acceso"
                name="dni"
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value);
                  if (error) setError("");
                }}
                placeholder="12345678"
                maxLength={8}
                className={`text-lg p-6 ${error ? "border-red-500" : ""}`}
                disabled={isVerifying}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            {/* Botón de verificación */}
            <Button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#2563EB] hover:bg-[#1E3A8A] !text-white py-6 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#E0B84C] font-['Inter'] font-medium [&>*]:!text-white"
              style={{ color: 'white', backgroundColor: '#1E3A8A' }}
            >
              <span style={{ color: 'white' }}>{isVerifying ? "Verificando..." : "Verificar y Continuar"}</span>
            </Button>
          </form>

          {/* Información adicional */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#6B7280] font-['Inter']">
              ¿Problemas para acceder?{" "}
              <a
                href={`https://wa.me/${campamentoConfig.contacto.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] hover:underline font-medium"
              >
                Contacta con nosotros
              </a>
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
