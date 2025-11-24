import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import { campamentoConfig } from "../config/campamento";

interface TalleresAccesoProps {
  onAccesoPermitido: (dni: string, datosUsuario: any) => void;
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
        toast.success("¡Acceso permitido!", {
          description: "Tu pago ha sido confirmado. Bienvenido a la selección de talleres.",
        });
        onAccesoPermitido(dni, resultado.datos);
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
    <section id="talleres-acceso" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Encabezado */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4 text-sm sm:text-base">
            Acceso a Talleres
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 mb-4 leading-tight px-2">
            Registra tu Taller
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 px-4">
            Ingresa tu DNI para acceder a la selección de talleres
          </p>
        </div>

        {/* Card de Acceso */}
        <Card className="p-6 sm:p-8 md:p-12 shadow-2xl border-t-4 border-blue-500">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Lock className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Nota importante:</strong> Solo podrás acceder si tu pago ya fue confirmado por el organizador.
              Si acabas de realizar el pago, espera la confirmación antes de intentar registrarte en un taller.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input DNI */}
            <div>
              <Label htmlFor="dni-acceso" className="flex items-center gap-2 mb-2 text-blue-900 text-lg">
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
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white"
            >
              {isVerifying ? "Verificando..." : "Verificar y Continuar"}
            </Button>
          </form>

          {/* Información adicional */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              ¿Problemas para acceder?{" "}
              <a
                href={`https://wa.me/${campamentoConfig.contacto.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
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
