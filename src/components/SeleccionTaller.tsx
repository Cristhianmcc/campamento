import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { campamentoConfig, Taller } from "../config/campamento";
import { Users, Clock, MapPin, User, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface SeleccionTallerProps {
  dniUsuario: string;
  datosUsuario: any;
  onTallerRegistrado: () => void;
  onVolver: () => void;
  registrarEnTaller: (dni: string, tallerId: string) => Promise<boolean>;
}

export function SeleccionTaller({ 
  dniUsuario, 
  datosUsuario, 
  onTallerRegistrado, 
  onVolver,
  registrarEnTaller 
}: SeleccionTallerProps) {
  const [tallerSeleccionado, setTallerSeleccionado] = useState<Taller | null>(null);
  const [modalConfirmacionOpen, setModalConfirmacionOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSeleccionarTaller = (taller: Taller) => {
    // Verificar si hay cupos disponibles
    if (taller.inscritos >= taller.capacidadMaxima) {
      toast.error("Taller lleno", {
        description: "Este taller ya alcanzó su capacidad máxima. Por favor, elige otro taller.",
      });
      return;
    }

    setTallerSeleccionado(taller);
    setModalConfirmacionOpen(true);
  };

  const handleConfirmarRegistro = async () => {
    if (!tallerSeleccionado) return;

    setIsRegistering(true);

    try {
      const exito = await registrarEnTaller(dniUsuario, tallerSeleccionado.id);

      if (exito) {
        toast.success("¡Registro exitoso!", {
          description: `Te has registrado en el taller: ${tallerSeleccionado.nombre}`,
          duration: 5000,
        });
        setModalConfirmacionOpen(false);
        
        // Esperar un momento para que el usuario vea el mensaje
        setTimeout(() => {
          onTallerRegistrado();
        }, 2000);
      } else {
        toast.error("Error al registrar", {
          description: "No se pudo completar tu registro. Por favor, intenta nuevamente.",
        });
      }
    } catch (error) {
      console.error("Error al registrar en taller:", error);
      toast.error("Error al registrar", {
        description: "Ocurrió un error. Por favor, contacta con el organizador.",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancelarRegistro = () => {
    setModalConfirmacionOpen(false);
    setTallerSeleccionado(null);
  };

  return (
    <section id="seleccion-talleres" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full mb-4 text-sm sm:text-base">
            Bienvenido, {datosUsuario?.nombres || "Participante"}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 mb-4 leading-tight px-2">
            Elige tu Taller
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 px-4 mb-6">
            Selecciona el taller en el que deseas participar durante el campamento
          </p>
          
          <Button
            variant="outline"
            onClick={onVolver}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Información importante */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-8 max-w-3xl mx-auto">
          <p className="text-sm text-gray-700 text-center">
            <strong>Importante:</strong> Solo podrás registrarte en UN taller. Una vez confirmado tu registro,
            no podrás cambiarlo. Elige con cuidado.
          </p>
        </div>

        {/* Grid de Talleres */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campamentoConfig.talleres.map((taller) => {
            const cuposDisponibles = taller.capacidadMaxima - taller.inscritos;
            const porcentajeOcupacion = (taller.inscritos / taller.capacidadMaxima) * 100;
            const estaLleno = cuposDisponibles === 0;

            return (
              <Card 
                key={taller.id} 
                className={`hover:shadow-xl transition-all duration-300 ${estaLleno ? 'opacity-75' : 'hover:scale-105'}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl text-blue-900">
                      {taller.nombre}
                    </CardTitle>
                    {estaLleno && (
                      <Badge variant="destructive">Lleno</Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {taller.descripcion}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Instructor */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>{taller.instructor}</span>
                  </div>

                  {/* Horario */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{taller.horario}</span>
                  </div>

                  {/* Lugar */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{taller.lugar}</span>
                  </div>

                  {/* Cupos */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>Cupos disponibles</span>
                      </div>
                      <span className={`text-sm font-semibold ${estaLleno ? 'text-red-600' : 'text-green-600'}`}>
                        {cuposDisponibles} / {taller.capacidadMaxima}
                      </span>
                    </div>
                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          porcentajeOcupacion >= 90 ? 'bg-red-500' : 
                          porcentajeOcupacion >= 70 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${porcentajeOcupacion}%` }}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => handleSeleccionarTaller(taller)}
                    disabled={estaLleno}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white"
                  >
                    {estaLleno ? "Taller Lleno" : "Seleccionar Taller"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal de Confirmación */}
      <Dialog open={modalConfirmacionOpen} onOpenChange={setModalConfirmacionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-blue-900">
              Confirmar Registro
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas registrarte en este taller?
            </DialogDescription>
          </DialogHeader>

          {tallerSeleccionado && (
            <div className="py-4 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {tallerSeleccionado.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {tallerSeleccionado.descripcion}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>{tallerSeleccionado.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{tallerSeleccionado.horario}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{tallerSeleccionado.lugar}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-xs text-gray-700">
                  <strong>Recuerda:</strong> Una vez confirmado, no podrás cambiar de taller.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleCancelarRegistro}
              disabled={isRegistering}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarRegistro}
              disabled={isRegistering}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              {isRegistering ? (
                "Registrando..."
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirmar Registro
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
