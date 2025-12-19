import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Settings, Users, Save, TrendingUp, AlertCircle, CheckCircle, BarChart3, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { capacidadConfig } from "../config/campamento";

interface AdminTalleresProps {
  onVerEstadisticas: () => void;
}

export function AdminTalleres({ onVerEstadisticas }: AdminTalleresProps) {
  const [capacidadActual, setCapacidadActual] = useState<number>(capacidadConfig.capacidadTotal);
  const [nuevaCapacidad, setNuevaCapacidad] = useState<string>(capacidadConfig.capacidadTotal.toString());
  const [cuposPorTaller, setCuposPorTaller] = useState<number>(capacidadConfig.cupoPorTaller);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    calcularCupos(capacidadConfig.capacidadTotal);
  }, []);

  const calcularCupos = (capacidad: number) => {
    const cupos = Math.ceil((capacidad * 2) / 3);
    setCuposPorTaller(cupos);
  };

  const handleCapacidadChange = (valor: string) => {
    setNuevaCapacidad(valor);
    const num = parseInt(valor);
    if (!isNaN(num) && num > 0) {
      calcularCupos(num);
    }
  };

  const handleGuardar = async () => {
    const num = parseInt(nuevaCapacidad);
    
    if (isNaN(num) || num <= 0) {
      toast.error("Capacidad inválida", {
        description: "Ingresa un número mayor a 0"
      });
      return;
    }

    if (num < 20 || num > 200) {
      toast.error("Capacidad fuera de rango", {
        description: "La capacidad debe estar entre 20 y 200 personas"
      });
      return;
    }

    setGuardando(true);
    
    try {
      const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3002/api' 
        : 'https://campamento-nz0r.onrender.com/api';

      const response = await fetch(`${API_URL}/admin/actualizar-capacidad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaCapacidad: num })
      });

      const data = await response.json();

      if (data.success) {
        setCapacidadActual(num);
        toast.success("Capacidad actualizada correctamente", {
          description: `Nueva capacidad: ${data.nuevaCapacidad} personas | ${data.nuevoCupoPorTaller} cupos por taller`,
          duration: 4000,
        });
        
        setTimeout(() => {
          toast.info("Reiniciando aplicación para aplicar cambios...");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }, 1500);
      } else {
        toast.error("Error al actualizar", {
          description: data.error || "No se pudo actualizar la capacidad"
        });
      }
    } catch (error) {
      toast.error("Error de conexión", {
        description: "No se pudo conectar con el servidor"
      });
    } finally {
      setGuardando(false);
    }
  };

  const ejemplos = [
    { personas: 30, cupos: Math.ceil((30 * 2) / 3), descripcion: "Campamento pequeño" },
    { personas: 40, cupos: Math.ceil((40 * 2) / 3), descripcion: "Inscripciones bajas" },
    { personas: 50, cupos: Math.ceil((50 * 2) / 3), descripcion: "Capacidad actual" },
    { personas: 60, cupos: Math.ceil((60 * 2) / 3), descripcion: "Demanda alta" },
    { personas: 70, cupos: Math.ceil((70 * 2) / 3), descripcion: "Capacidad máxima" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white border-2 border-[#1E3A8A] px-8 py-4 rounded-lg mb-4 shadow-lg">
            <Settings className="w-6 h-6" style={{ color: '#1E3A8A' }} />
            <h1 className="text-2xl font-bold" style={{ color: '#000000', fontFamily: 'Playfair Display, serif' }}>Panel de Administración</h1>
          </div>
          <p style={{ color: '#1F2933', fontFamily: 'Inter, sans-serif' }}>Gestiona la capacidad del campamento y visualiza estadísticas</p>
        </div>

        {/* Información actual */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-[#2563EB] bg-white shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#1E3A8A] flex items-center gap-2 font-['Inter']">
                <Users className="w-4 h-4 text-[#2563EB]" />
                Capacidad Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold" style={{ color: '#1E3A8A' }}>{capacidadActual}</p>
              <p className="text-xs mt-1" style={{ color: '#1F2933' }}>personas</p>
            </CardContent>
          </Card>

          <Card className="border-[#E0B84C] bg-white shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 font-['Inter']" style={{ color: '#1E3A8A' }}>
                <TrendingUp className="w-4 h-4 text-[#E0B84C]" />
                Cupos por Taller
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold" style={{ color: '#1E3A8A' }}>{cuposPorTaller}</p>
              <p className="text-xs mt-1" style={{ color: '#1F2933' }}>por taller</p>
            </CardContent>
          </Card>

          <Card className="border-[#2563EB] bg-white shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 font-['Inter']" style={{ color: '#1E3A8A' }}>
                <BarChart3 className="w-4 h-4 text-[#2563EB]" />
                Total Cupos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold" style={{ color: '#1E3A8A' }}>{cuposPorTaller * 12}</p>
              <p className="text-xs mt-1" style={{ color: '#1F2933' }}>4 días por 3 talleres</p>
            </CardContent>
          </Card>
        </div>

        {/* Configuración */}
        <Card className="mb-8 shadow-lg border-2 border-[#C2A36B]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-['Playfair_Display'] text-[#1E3A8A]">
              <Settings className="w-5 h-5 text-[#2563EB]" />
              Ajustar Capacidad
            </CardTitle>
            <CardDescription className="font-['Inter'] text-[#1F2933]">
              Cambia la capacidad total del campamento. Los cupos por taller se calcularán automáticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="capacidad" className="text-base font-['Inter'] text-[#1E3A8A]">
                Capacidad Total de Personas
              </Label>
              <div className="flex gap-4">
                <Input
                  id="capacidad"
                  type="number"
                  min="20"
                  max="200"
                  value={nuevaCapacidad}
                  onChange={(e) => handleCapacidadChange(e.target.value)}
                  className="text-lg h-12 border-[#2563EB] focus:border-[#1E3A8A]"
                  placeholder="Ej: 50"
                />
                <button 
                  onClick={handleGuardar}
                  disabled={guardando || nuevaCapacidad === capacidadActual.toString()}
                  className="bg-[#2563EB] hover:bg-[#1E3A8A] px-8 h-12 rounded-md font-['Inter'] disabled:opacity-50"
                  style={{ color: 'black', fontWeight: 'bold' }}
                >
                  {guardando ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                      <span style={{ color: 'black' }}>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 inline" />
                      <span style={{ color: 'black' }}>Guardar</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-[#1F2933] font-['Inter']">
                Fórmula: Cupos por taller = (Capacidad por 2 talleres por persona) entre 3 talleres disponibles
              </p>
            </div>

            {/* Vista previa */}
            <Alert className="bg-white border-[#2563EB]">
              <AlertCircle className="h-4 w-4 text-[#2563EB]" />
              <AlertDescription className="text-[#1F2933] font-['Inter']">
                <strong>Vista previa:</strong> Con {nuevaCapacidad} personas, cada taller tendrá capacidad de {cuposPorTaller} personas.
                <br />
                <span className="text-sm text-[#1F2933]">
                  Total de cupos disponibles: {cuposPorTaller * 12} (12 talleres en 4 días)
                </span>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Ejemplos de configuración */}
        <Card className="mb-8 shadow-lg border-2 border-[#C2A36B]">
          <CardHeader>
            <CardTitle className="text-lg font-['Playfair_Display'] text-[#1E3A8A]">Ejemplos de Configuración</CardTitle>
            <CardDescription className="font-['Inter'] text-[#1F2933]">Capacidades comunes según el tamaño del campamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {ejemplos.map((ejemplo) => (
                <button
                  key={ejemplo.personas}
                  onClick={() => handleCapacidadChange(ejemplo.personas.toString())}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    parseInt(nuevaCapacidad) === ejemplo.personas
                      ? 'border-[#2563EB] bg-white shadow-lg'
                      : 'border-[#C2A36B] hover:border-[#2563EB] bg-white'
                  }`}
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>{ejemplo.personas}</p>
                    <p className="text-xs mb-2 font-['Inter']" style={{ color: '#1F2933' }}>{ejemplo.descripcion}</p>
                    <div className="bg-[#E0B84C] rounded px-2 py-1">
                      <p className="text-sm font-semibold" style={{ color: 'white' }}>{ejemplo.cupos} cupos</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botón de estadísticas */}
        <div className="text-center pb-8">
          <button
            onClick={onVerEstadisticas}
            className="bg-[#2563EB] hover:bg-[#1E3A8A] px-8 py-6 text-lg shadow-lg font-['Inter'] border-2 border-[#E0B84C] rounded-md"
            style={{ color: 'black', fontWeight: 'bold' }}
          >
            <BarChart3 className="w-5 h-5 mr-2 inline" />
            <span style={{ color: 'black' }}>Ver Estadísticas de Talleres</span>
          </button>
        </div>
      </div>
    </div>
  );
}
