import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Loader2, UserCircle, Check, X, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { campamentoConfig } from "../config/campamento";

interface PerfilData {
  codigo: string;
  nombres: string;
  apellidos: string;
  edad: number;
  dni: string;
  email: string;
  telefono: string;
  iglesia: string;
  estadoPago: string;
  fechaInscripcion: string;
  tallerAsignado?: string;
}

interface MiPerfilProps {
  onVolver: () => void;
  verificarDatos: (dni: string) => Promise<PerfilData | null>;
}

export function MiPerfil({ onVolver, verificarDatos }: MiPerfilProps) {
  const [dni, setDni] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [perfilData, setPerfilData] = useState<PerfilData | null>(null);

  // Función para obtener el nombre del taller por su ID
  const obtenerNombreTaller = (tallerId: string | undefined): string | null => {
    if (!tallerId) return null;
    
    const taller = campamentoConfig.talleres.find(t => t.id === tallerId);
    return taller ? taller.nombre : tallerId; // Si no se encuentra, devolver el ID
  };

  const handleBuscarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dni || dni.length < 8) {
      toast.error("Ingresa un DNI válido (8 dígitos)");
      return;
    }

    setIsLoading(true);

    try {
      const datos = await verificarDatos(dni);
      
      if (datos) {
        setPerfilData(datos);
        
        // Mostrar mensaje específico según el estado de pago
        if (datos.estadoPago === "Confirmado") {
          toast.success("Datos cargados correctamente");
        } else {
          toast.info("Inscripción encontrada", {
            description: "Tu pago aún está pendiente de confirmación",
            duration: 6000,
          });
        }
      } else {
        toast.error("No se encontró inscripción", {
          description: "Verifica que tu DNI sea correcto o regístrate primero",
          duration: 5000,
        });
        setPerfilData(null);
      }
    } catch (error: any) {
      console.error("Error al buscar perfil:", error);
      toast.error("Error al buscar tu inscripción", {
        description: "Por favor, intenta nuevamente o contacta al organizador",
        duration: 5000,
      });
      setPerfilData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-blue-100 rounded-full p-4 mb-4">
            <UserCircle className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Mi Inscripción
          </h1>
          <p className="text-gray-600">
            Consulta tu información y el taller al que estás inscrito
          </p>
        </div>

        {/* Formulario de búsqueda */}
        {!perfilData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Buscar mi inscripción</CardTitle>
              <CardDescription>
                Ingresa tu DNI para ver tu información
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuscarPerfil} className="space-y-4">
                <div>
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
                    type="text"
                    placeholder="Ej: 12345678"
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    maxLength={8}
                    className="text-lg"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || dni.length < 8}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    "Buscar mi inscripción"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Datos del perfil */}
        {perfilData && (
          <div className="space-y-6">
            {/* Estado de Pago */}
            <Card className={perfilData.estadoPago === "Confirmado" ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estado de Pago</p>
                    <div className="flex items-center gap-2">
                      {perfilData.estadoPago === "Confirmado" ? (
                        <>
                          <Check className="w-5 h-5 text-green-600" />
                          <Badge className="bg-green-600 hover:bg-green-700">
                            Confirmado
                          </Badge>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <Badge className="bg-yellow-600 hover:bg-yellow-700">
                            Pendiente
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  {perfilData.estadoPago !== "Confirmado" && (
                    <p className="text-sm text-yellow-700">
                      Tu pago está siendo verificado
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Código de Inscripción</p>
                    <p className="text-lg font-semibold text-blue-900">{perfilData.codigo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">DNI</p>
                    <p className="text-lg font-semibold">{perfilData.dni}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nombres</p>
                    <p className="text-lg font-semibold">{perfilData.nombres}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Apellidos</p>
                    <p className="text-lg font-semibold">{perfilData.apellidos}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Edad</p>
                    <p className="text-lg font-semibold">{perfilData.edad} años</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-semibold">{perfilData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="text-lg font-semibold">{perfilData.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Iglesia</p>
                    <p className="text-lg font-semibold">{perfilData.iglesia}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Inscripción</p>
                    <p className="text-lg font-semibold">{perfilData.fechaInscripcion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Taller Asignado */}
            <Card className={perfilData.tallerAsignado ? "border-blue-200 bg-blue-50" : "border-gray-200"}>
              <CardHeader>
                <CardTitle>Taller Asignado</CardTitle>
              </CardHeader>
              <CardContent>
                {perfilData.tallerAsignado ? (
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 rounded-full p-3">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estás inscrito en:</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {obtenerNombreTaller(perfilData.tallerAsignado)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-500">
                    <X className="w-6 h-6" />
                    <div>
                      <p className="text-lg">Aún no te has inscrito en ningún taller</p>
                      {perfilData.estadoPago === "Confirmado" && (
                        <p className="text-sm mt-1">
                          Tu pago está confirmado. Puedes inscribirte en un taller desde el botón "Acceder a Talleres"
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {
                  setPerfilData(null);
                  setDni("");
                }}
                variant="outline"
                className="flex-1"
              >
                Buscar otra inscripción
              </Button>
              <Button
                onClick={onVolver}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Inicio
              </Button>
            </div>
          </div>
        )}

        {/* Botón volver (cuando no hay búsqueda) */}
        {!perfilData && (
          <div className="text-center">
            <Button
              onClick={onVolver}
              variant="outline"
              className="mt-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
