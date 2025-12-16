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
  sexo?: string;
  estadoPago: string;
  fechaInscripcion: string;
  tallerAsignado?: string;
  talleresPorDia?: {
    dia1: string[];
    dia2: string[];
    dia3: string[];
    dia4: string[];
  };
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
        // Verificar si el pago está confirmado
        if (datos.estadoPago !== "Confirmado") {
          toast.error("Pago no confirmado", {
            description: "Tu inscripción existe pero el pago aún no ha sido confirmado. Por favor espera la confirmación del organizador.",
            duration: 7000,
          });
          setPerfilData(null);
          return;
        }
        
        // Solo mostrar datos si el pago está confirmado
        setPerfilData(datos);
        toast.success("Datos cargados correctamente");
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
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-[#2563EB]/10 rounded-full p-4 mb-4">
            <UserCircle className="w-12 h-12 text-[#2563EB]" />
          </div>
          <h1 className="text-4xl font-bold text-[#1E3A8A] mb-2 font-['Playfair_Display']">
            Mi Inscripción
          </h1>
          <p className="text-[#6B7280] font-['Inter']">
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

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading || dni.length < 8}
                    className="px-8 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 font-['Inter'] font-semibold border-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ 
                      backgroundColor: '#1F2933',
                      color: 'white',
                      borderColor: '#E0B84C'
                    }}
                  onMouseEnter={(e) => {
                    if (!isLoading && dni.length >= 8) {
                      e.currentTarget.style.backgroundColor = '#1E3A8A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1F2933';
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'white' }} />
                      <span style={{ color: 'white' }}>Buscando...</span>
                    </>
                  ) : (
                    <span style={{ color: 'white' }}>Buscar mi inscripción</span>
                  )}
                  </button>
                </div>
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
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  {/* Avatar */}
                  <div className="flex justify-center sm:justify-start">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E0B84C] shadow-lg">
                      <img
                        src={`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${perfilData.dni}`}
                        alt="Avatar"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  {/* Nombre completo */}
                  <div className="flex flex-col justify-center text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-[#1E3A8A] font-['Playfair_Display']">
                      {perfilData.nombres} {perfilData.apellidos}
                    </h2>
                    <p className="text-lg text-[#6B7280] mt-1 font-['Inter']">
                      {perfilData.edad} años {perfilData.sexo === 'M' ? '👨' : perfilData.sexo === 'F' ? '👩' : ''}
                    </p>
                  </div>
                </div>
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
            <Card className={
              (perfilData.talleresPorDia && Object.values(perfilData.talleresPorDia).some(dia => dia.length > 0)) || 
              perfilData.tallerAsignado 
                ? "border-blue-200 bg-blue-50" 
                : "border-gray-200"
            }>
              <CardHeader>
                <CardTitle>Talleres Inscritos</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Nuevo sistema: Talleres por día */}
                {perfilData.talleresPorDia && Object.values(perfilData.talleresPorDia).some(dia => dia.length > 0) ? (
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map(diaNum => {
                      const diaKey = `dia${diaNum}` as keyof typeof perfilData.talleresPorDia;
                      const talleresDia = perfilData.talleresPorDia![diaKey] || [];
                      
                      if (talleresDia.length === 0) return null;
                      
                      const diaInfo = campamentoConfig.talleresPorDia.find(d => d.dia === diaNum);
                      
                      return (
                        <div key={diaNum} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-blue-600">Día {diaNum}</Badge>
                            <p className="text-sm font-semibold text-gray-700">
                              {diaInfo?.titulo}
                            </p>
                          </div>
                          <div className="space-y-2">
                            {talleresDia.map((taller, idx) => (
                              <div key={idx} className="flex items-start gap-2 bg-white rounded-lg p-3 shadow-sm">
                                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-semibold text-gray-900">{taller}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="text-sm text-gray-600">
                        Total de talleres: <span className="font-bold text-blue-900">
                          {Object.values(perfilData.talleresPorDia).flat().length}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : perfilData.tallerAsignado ? (
                  /* Sistema antiguo: Un solo taller */
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
                  /* No tiene talleres */
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
                variant="outline"
                className="flex-1"
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
