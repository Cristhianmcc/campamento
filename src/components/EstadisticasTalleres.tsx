import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AlertCircle, Users, TrendingUp, Calendar, Award, BarChart3, CalendarDays, ListChecks } from 'lucide-react';

interface EstadisticasTaller {
  id: string;
  inscritos: number;
  cupoMaximo: number;
  disponibles: number;
  porcentajeOcupacion: string;
  excedeCapacidad?: boolean;
  exceso?: number;
}

interface Estadisticas {
  resumen: {
    totalInscritos: number;
    personasConTalleres: number;
    personasSinTalleres: number;
    porcentajeConTalleres: string;
    cupoMaximoPorTaller: number;
    promedioTalleresPorPersona: string;
    totalTalleresAsignados: number;
  };
  demografia: {
    genero: { M: number; F: number };
    edad: Record<string, number>;
    iglesias: Array<{ nombre: string; cantidad: number }>;
    pago: { Pagado: number; Pendiente: number };
  };
  talleresDetallado: Record<string, EstadisticasTaller>;
  talleresAgrupadosPorDia: Record<string, Record<string, EstadisticasTaller>>;
  talleresMasLlenos: Array<{ nombre: string } & EstadisticasTaller>;
  talleresConMenosInscritos: Array<{ nombre: string } & EstadisticasTaller>;
  talleresExcedidos: Array<{ nombre: string } & EstadisticasTaller>;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function EstadisticasTalleres() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3002/api/estadisticas-talleres');
      const data = await response.json();
      
      if (data.success) {
        setEstadisticas(data.estadisticas);
      } else {
        setError('Error al cargar estadísticas');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error || !estadisticas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'No se pudieron cargar las estadísticas'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Preparar datos para gráficos
  const datosTop5 = estadisticas.talleresMasLlenos.map(t => ({
    nombre: t.nombre.substring(0, 30) + (t.nombre.length > 30 ? '...' : ''),
    inscritos: t.inscritos,
    cupo: t.cupoMaximo
  }));

  const datosPorDia = Object.entries(estadisticas.talleresAgrupadosPorDia).map(([dia, talleres]) => {
    const totalInscritos = Object.values(talleres).reduce((sum, t) => sum + t.inscritos, 0);
    return {
      dia: dia.replace('dia', 'Día '),
      inscritos: totalInscritos,
      talleres: Object.keys(talleres).length
    };
  });

  const datosOcupacion = [
    { name: 'Con Talleres', value: estadisticas.resumen.personasConTalleres, color: '#10b981' },
    { name: 'Sin Talleres', value: estadisticas.resumen.personasSinTalleres, color: '#ef4444' }
  ];

  const datosGenero = estadisticas?.demografia ? [
    { name: 'Masculino', value: estadisticas.demografia.genero.M, color: '#3b82f6' },
    { name: 'Femenino', value: estadisticas.demografia.genero.F, color: '#ec4899' }
  ] : [];

  const datosEdad = estadisticas?.demografia ? Object.entries(estadisticas.demografia.edad).map(([rango, cantidad]) => ({
    rango,
    cantidad
  })) : [];

  const datosPago = estadisticas?.demografia ? [
    { name: 'Pagado', value: estadisticas.demografia.pago.Pagado, color: '#10b981' },
    { name: 'Pendiente', value: estadisticas.demografia.pago.Pendiente, color: '#f59e0b' }
  ] : [];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Panel de Estadísticas</h1>
          <p className="text-xl text-gray-700">Análisis en tiempo real de inscripciones a talleres</p>
        </div>

        {/* Alertas de talleres excedidos */}
        {estadisticas.talleresExcedidos.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>⚠️ Talleres con capacidad excedida</AlertTitle>
            <AlertDescription>
              {estadisticas.talleresExcedidos.length} taller(es) han superado el límite de 40 personas:
              <ul className="mt-2 ml-4 list-disc">
                {estadisticas.talleresExcedidos.map(t => (
                  <li key={t.nombre}>
                    <strong>{t.nombre}</strong>: {t.inscritos} personas (+{t.exceso} exceso)
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-700 shadow-xl hover:shadow-2xl transition-shadow rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-5xl font-bold text-gray-900">
                {estadisticas.resumen.totalInscritos}
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-gray-800">
              Total Inscritos
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-700 shadow-xl hover:shadow-2xl transition-shadow rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-5xl font-bold text-gray-900">
                {estadisticas.resumen.personasConTalleres}
              </div>
              <Award className="h-12 w-12 text-green-600" />
            </div>
            <div className="text-xl font-bold text-gray-800">
              Con Talleres ({estadisticas.resumen.porcentajeConTalleres}%)
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-700 shadow-xl hover:shadow-2xl transition-shadow rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-5xl font-bold text-gray-900">
                {estadisticas.resumen.personasSinTalleres}
              </div>
              <AlertCircle className="h-12 w-12 text-orange-600" />
            </div>
            <div className="text-xl font-bold text-gray-800">
              Sin Talleres Asignados
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-700 shadow-xl hover:shadow-2xl transition-shadow rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-5xl font-bold text-gray-900">
                {estadisticas.resumen.cupoMaximoPorTaller}
              </div>
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-gray-800">
              Cupo por Taller
            </div>
          </div>
        </div>

        {/* Gráficos Principales */}
        <Tabs defaultValue="general" className="space-y-8">
          <TabsList className="flex w-full bg-gradient-to-r from-gray-100 to-gray-200 p-2 rounded-xl gap-4 shadow-md border border-gray-300">
            <TabsTrigger 
              value="general" 
              className="flex-1 text-gray-900 font-bold text-lg py-4 px-6 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="por-dia" 
              className="flex-1 text-gray-900 font-bold text-lg py-4 px-6 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <CalendarDays className="w-5 h-5" />
              Por Día
            </TabsTrigger>
            <TabsTrigger 
              value="detallado" 
              className="flex-1 text-gray-900 font-bold text-lg py-4 px-6 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <ListChecks className="w-5 h-5" />
              Detallado
            </TabsTrigger>
          </TabsList>

          {/* Tab General */}
          <TabsContent value="general" className="space-y-6">
            {/* Métricas adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border-2 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {estadisticas.resumen?.promedioTalleresPorPersona || '0'}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      Promedio de Talleres por Persona
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-600 mb-2">
                      {estadisticas.demografia?.pago.Pagado || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      Pagos Completados
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-amber-600 mb-2">
                      {estadisticas.demografia?.pago.Pendiente || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      Pagos Pendientes
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de barras - Top 5 */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Talleres Más Populares</CardTitle>
                  <CardDescription className="text-base text-gray-700">Top 5 talleres con más inscritos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={datosTop5}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inscritos" fill="#10b981" name="Inscritos" />
                      <Bar dataKey="cupo" fill="#e5e7eb" name="Cupo Máximo" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico circular - Ocupación */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Distribución de Inscripciones</CardTitle>
                  <CardDescription className="text-base text-gray-700">Personas con vs sin talleres</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={datosOcupacion}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {datosOcupacion.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribución por Género */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Distribución por Género</CardTitle>
                  <CardDescription className="text-base text-gray-700">Masculino vs Femenino</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={datosGenero}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {datosGenero.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribución por Edad */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Distribución por Edad</CardTitle>
                  <CardDescription className="text-base text-gray-700">Rangos de edad de participantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={datosEdad}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rango" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cantidad" fill="#8b5cf6" name="Participantes" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Iglesias */}
              {estadisticas.demografia?.iglesias && estadisticas.demografia.iglesias.length > 0 && (
                <Card className="border-2 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">Top 10 Iglesias</CardTitle>
                    <CardDescription className="text-base text-gray-700">Iglesias con más participantes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={estadisticas.demografia.iglesias}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cantidad" fill="#f59e0b" name="Participantes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab Por Día */}
          <TabsContent value="por-dia" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Inscritos por Día</CardTitle>
                <CardDescription className="text-base text-gray-700">Distribución de participantes a lo largo de los días del campamento</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={datosPorDia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="inscritos" stroke="#10b981" strokeWidth={2} name="Total Inscritos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Desglose por día */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(estadisticas.talleresAgrupadosPorDia).map(([dia, talleres]) => (
                <Card key={dia} className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
                    <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      {dia.replace('dia', 'Día ')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {Object.entries(talleres).map(([nombre, data]) => (
                        <div key={nombre} className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0">
                          <span className="truncate flex-1 text-gray-800 font-medium">{nombre.substring(0, 25)}...</span>
                          <Badge 
                            variant={data.excedeCapacidad ? "destructive" : data.inscritos > 30 ? "default" : "secondary"}
                            className="font-bold text-base px-3 py-1"
                          >
                            {data.inscritos}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Detallado */}
          <TabsContent value="detallado" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Todos los Talleres</CardTitle>
                <CardDescription className="text-base text-gray-700">Listado completo con porcentajes de ocupación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(estadisticas.talleresDetallado)
                    .sort((a, b) => b[1].inscritos - a[1].inscritos)
                    .map(([nombre, data]) => (
                      <div key={nombre} className="border-2 rounded-xl p-6 hover:bg-gray-50 transition-all hover:shadow-xl bg-white">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-xl text-gray-900 flex-1 pr-4">{nombre}</h3>
                          <Badge 
                            variant={
                              data.excedeCapacidad ? "destructive" : 
                              data.inscritos > 35 ? "default" : 
                              data.inscritos > 20 ? "secondary" : 
                              "outline"
                            }
                            className="text-base font-bold px-3 py-1"
                          >
                            {data.inscritos}/{data.cupoMaximo}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-700 font-semibold">Ocupación:</span>
                            <span className="font-bold text-2xl text-gray-900">{data.porcentajeOcupacion}%</span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
                            <div 
                              className={`h-3 rounded-full transition-all shadow-sm ${
                                data.excedeCapacidad ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                                parseFloat(data.porcentajeOcupacion) > 87.5 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                                'bg-gradient-to-r from-green-500 to-green-600'
                              }`}
                              style={{ width: `${Math.min(parseFloat(data.porcentajeOcupacion), 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-gray-700">Disponibles:</span>
                              <span className="text-lg font-bold text-blue-600">{data.disponibles}</span>
                            </div>
                            {data.excedeCapacidad && (
                              <span className="text-red-600 font-bold text-sm bg-red-50 px-3 py-1 rounded-full border border-red-200">
                                ⚠️ Exceso: +{data.exceso}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botón de actualizar */}
        <div className="mt-8 text-center">
          <button
            onClick={cargarEstadisticas}
            className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 border-2 border-gray-300 flex items-center gap-3 mx-auto"
          >
            <TrendingUp className="w-5 h-5" />
            Actualizar Estadísticas
          </button>
        </div>
      </div>
    </div>
  );
}
