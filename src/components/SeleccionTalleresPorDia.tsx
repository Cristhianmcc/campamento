import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowLeft, Check, Users, AlertCircle, Calendar } from "lucide-react";
import { campamentoConfig } from "../config/campamento";
import { googleSheetsService } from "../services/googleSheets";
import { toast } from "sonner";

interface TallerSeleccionado {
  dia: number;
  talleres: string[]; // IDs de los talleres seleccionados (máximo 2 por día)
}

interface SeleccionTalleresPorDiaProps {
  dniUsuario: string;
  datosUsuario: any;
  onVolver: () => void;
  onTalleresRegistrados: () => void;
  registrarTalleres: (dni: string, talleres: TallerSeleccionado[]) => Promise<boolean>;
}

export function SeleccionTalleresPorDia({
  dniUsuario,
  datosUsuario,
  onVolver,
  onTalleresRegistrados,
  registrarTalleres,
}: SeleccionTalleresPorDiaProps) {
  const [selecciones, setSelecciones] = useState<Record<number, string[]>>({
    1: [],
    2: [],
    3: [],
    4: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diaActual, setDiaActual] = useState(1);
  const [inscritosPorTaller, setInscritosPorTaller] = useState<Record<string, number>>({});
  const [cargandoCupos, setCargandoCupos] = useState(true);

  // Cargar cupos al montar el componente
  useEffect(() => {
    const cargarCupos = async () => {
      setCargandoCupos(true);
      try {
        const cupos = await googleSheetsService.obtenerCuposTalleres();
        setInscritosPorTaller(cupos);
        console.log('📊 Cupos cargados:', cupos);
      } catch (error) {
        console.error('Error al cargar cupos:', error);
        toast.error('No se pudieron cargar los cupos disponibles');
      } finally {
        setCargandoCupos(false);
      }
    };
    
    cargarCupos();
  }, []);

  const handleToggleTaller = (dia: number, tallerId: string) => {
    setSelecciones(prev => {
      const talleresDelDia = prev[dia] || [];
      
      if (talleresDelDia.includes(tallerId)) {
        // Quitar taller
        return {
          ...prev,
          [dia]: talleresDelDia.filter(id => id !== tallerId)
        };
      } else {
        // Verificar si el taller está lleno ANTES de agregar
        const inscritos = inscritosPorTaller[tallerId] || 0;
        const capacidad = 17;
        
        if (inscritos >= capacidad) {
          toast.error('Este taller ya está lleno', {
            description: `Capacidad máxima: ${capacidad} personas alcanzada`
          });
          return prev;
        }
        
        // Agregar taller (máximo 2 por día)
        if (talleresDelDia.length >= 2) {
          toast.error(`Solo puedes seleccionar 2 talleres por día`);
          return prev;
        }
        return {
          ...prev,
          [dia]: [...talleresDelDia, tallerId]
        };
      }
    });
  };

  const handleSubmit = async () => {
    // Validar que se haya seleccionado al menos 1 taller por día
    const diasSinSeleccion = [1, 2, 3, 4].filter(dia => 
      (selecciones[dia] || []).length === 0
    );

    if (diasSinSeleccion.length > 0) {
      toast.error(`Debes seleccionar al menos 1 taller para los días: ${diasSinSeleccion.join(', ')}`);
      return;
    }

    // Convertir selecciones al formato esperado
    const talleresSeleccionados: TallerSeleccionado[] = [1, 2, 3, 4].map(dia => ({
      dia,
      talleres: selecciones[dia] || []
    }));

    setIsSubmitting(true);

    try {
      const resultado = await registrarTalleres(dniUsuario, talleresSeleccionados);
      
      if (resultado) {
        toast.success("¡Talleres registrados exitosamente!");
        setTimeout(() => {
          onTalleresRegistrados();
        }, 1500);
      } else {
        toast.error("Error al registrar los talleres. Por favor, intenta nuevamente.");
      }
    } catch (error: any) {
      // Mostrar el mensaje de error específico del servidor
      const errorMessage = error?.message || "Error al registrar los talleres";
      toast.error(errorMessage);
      console.error('Error al registrar talleres por dia:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const diaInfo = campamentoConfig.talleresPorDia[diaActual - 1];
  const talleresSeleccionadosDelDia = selecciones[diaActual] || [];
  const totalSeleccionados = Object.values(selecciones).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Selecciona tus Talleres
          </h1>
          <p className="text-gray-600">
            Elige hasta 2 talleres por cada día del campamento
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-blue-900 font-semibold">
              {datosUsuario.nombres} {datosUsuario.apellidos}
            </span>
          </div>
        </div>

        {/* Loading de cupos */}
        {cargandoCupos && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Cargando disponibilidad de talleres...
            </AlertDescription>
          </Alert>
        )}

        {/* Resumen de selecciones */}
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Talleres seleccionados</p>
                <p className="text-3xl font-bold text-green-700">{totalSeleccionados} / 8</p>
                <p className="text-xs text-gray-500">Máximo 2 por día</p>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(dia => {
                  const count = selecciones[dia]?.length || 0;
                  return (
                    <div key={dia} className="text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        count === 2 ? 'bg-green-500 text-white' :
                        count === 1 ? 'bg-yellow-400 text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        <span className="font-bold">{count}</span>
                      </div>
                      <p className="text-xs mt-1 text-gray-600">Día {dia}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navegación por días */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {campamentoConfig.talleresPorDia.map((diaData) => (
            <button
              key={diaData.dia}
              onClick={() => setDiaActual(diaData.dia)}
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                diaActual === diaData.dia
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Día {diaData.dia}
            </button>
          ))}
        </div>

        {/* Información del día */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Día {diaInfo.dia}: {diaInfo.titulo}
            </CardTitle>
            <CardDescription className="text-blue-100">
              Seleccionados: {talleresSeleccionadosDelDia.length} / 2
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Talleres del día */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {diaInfo.talleres.map((taller) => {
            const isSeleccionado = talleresSeleccionadosDelDia.includes(taller.id);
            const inscritosReales = inscritosPorTaller[taller.id] || 0;
            const cuposDisponibles = taller.capacidadMaxima - inscritosReales;
            const estaLleno = inscritosReales >= taller.capacidadMaxima;

            return (
              <Card
                key={taller.id}
                className={`relative transition-all ${
                  estaLleno && !isSeleccionado
                    ? 'opacity-50 bg-gray-100 cursor-not-allowed'
                    : 'cursor-pointer'
                } ${
                  isSeleccionado
                    ? 'border-2 border-green-500 bg-green-50 shadow-lg scale-105'
                    : 'hover:shadow-lg hover:scale-102 border-2 border-transparent'
                }`}
                onClick={() => !estaLleno && handleToggleTaller(diaInfo.dia, taller.id)}
              >
                {isSeleccionado && (
                  <div className="absolute -top-3 -right-3 bg-green-500 rounded-full p-2 shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Badge className="mb-2 bg-blue-600">Taller {taller.numero}</Badge>
                      <CardTitle className="text-lg">{taller.nombre}</CardTitle>
                    </div>
                    <Checkbox
                      checked={isSeleccionado}
                      disabled={estaLleno && !isSeleccionado}
                      className="mt-1"
                    />
                  </div>
                  <CardDescription className="text-sm">
                    {taller.descripcion}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {inscritosReales}/{taller.capacidadMaxima} inscritos
                      </span>
                    </div>
                    {estaLleno ? (
                      <Badge variant="destructive" className="text-xs">
                        🔒 Lleno
                      </Badge>
                    ) : cuposDisponibles <= 3 ? (
                      <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                        ⚠️ {cuposDisponibles} cupos
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        ✓ Disponible
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alert de advertencia */}
        {totalSeleccionados < 4 && (
          <Alert className="mb-6 border-yellow-300 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Recuerda seleccionar al menos 1 taller por cada uno de los 4 días.
              Has seleccionado {totalSeleccionados} talleres en total.
            </AlertDescription>
          </Alert>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onVolver}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || totalSeleccionados < 4}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6"
          >
            {isSubmitting ? (
              "Registrando..."
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Confirmar Inscripción ({totalSeleccionados} talleres)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
