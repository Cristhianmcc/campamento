import { campamentoConfig } from "../config/campamento";
import { Heart, Users, Book, Mountain } from "lucide-react";

const caracteristicas = [
  {
    icon: Heart,
    titulo: "Renovación Espiritual",
    descripcion: "Tiempo dedicado a fortalecer tu relación con Dios",
  },
  {
    icon: Book,
    titulo: "Enseñanza Bíblica",
    descripcion: "Profundiza en la Palabra de Dios con maestros capacitados",
  },
  {
    icon: Users,
    titulo: "Compañerismo",
    descripcion: "Conoce y comparte con hermanos de diferentes iglesias",
  },
  {
    icon: Mountain,
    titulo: "Actividades Recreativas",
    descripcion: "Deportes, dinámicas y aventuras al aire libre",
  },
];

export function AcercaDelCampamento() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4 text-sm sm:text-base">
            Acerca del Campamento
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 mb-4 sm:mb-6 leading-tight px-4">
            Una Experiencia Transformadora
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {campamentoConfig.lema}
          </p>
        </div>

        {/* Grid de características */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {caracteristicas.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500"
            >
              <div className="bg-blue-100 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl text-blue-900 mb-2 sm:mb-3">{item.titulo}</h3>
              <p className="text-sm sm:text-base text-gray-600">{item.descripcion}</p>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl mb-4 sm:mb-6">¿Qué incluye?</h3>
              <ul className="space-y-2 sm:space-y-3">
                {campamentoConfig.descripcion.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-yellow-300 text-lg sm:text-xl mt-1 flex-shrink-0">✓</span>
                    <span className="text-base sm:text-lg">{item}</span>
                  </li>
                ))}
                <li className="flex items-start gap-3">
                  <span className="text-yellow-300 text-lg sm:text-xl mt-1 flex-shrink-0">✓</span>
                  <span className="text-base sm:text-lg">{campamentoConfig.precioDescripcion}</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20">
              <div className="text-center">
                <p className="text-sm sm:text-base text-blue-200 mb-2">Ubicación</p>
                <p className="text-xl sm:text-2xl mb-4 sm:mb-6">{campamentoConfig.lugar}</p>
                <p className="text-sm sm:text-base text-blue-200 mb-2">Fechas</p>
                <p className="text-xl sm:text-2xl mb-4 sm:mb-6">{campamentoConfig.fechas}</p>
                <div className="bg-yellow-400 text-blue-900 inline-block px-5 sm:px-6 py-2 sm:py-3 rounded-xl">
                  <p className="text-xs sm:text-sm">Inversión</p>
                  <p className="text-2xl sm:text-3xl font-bold">{campamentoConfig.precio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
