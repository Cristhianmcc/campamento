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
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-white to-[#F5F7FA]">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block bg-[#E0B84C]/20 text-[#1E3A8A] px-4 py-2 rounded-full mb-4 text-sm sm:text-base border border-[#C2A36B]/30 font-['Inter'] font-medium">
            Acerca del Campamento
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#1E3A8A] mb-4 sm:mb-6 leading-tight px-4 font-['Playfair_Display'] font-bold">
            Una Experiencia Transformadora
          </h2>
          <p className="text-lg sm:text-xl text-[#6B7280] max-w-3xl mx-auto px-4 font-['Inter']">
            {campamentoConfig.lema}
          </p>
        </div>

        {/* Grid de características */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {caracteristicas.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#2563EB] text-center"
            >
              <div className="bg-[#2563EB]/10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#2563EB]" />
              </div>
              <h3 className="text-lg sm:text-xl mb-2 sm:mb-3 font-['Playfair_Display'] font-semibold" style={{ color: '#1E3A8A' }}>{item.titulo}</h3>
              <p className="text-sm sm:text-base font-['Inter']" style={{ color: '#1F2933' }}>{item.descripcion}</p>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border-2" style={{ backgroundColor: '#F5F5F5', borderColor: '#C2A36B' }}>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl mb-4 sm:mb-6 font-['Playfair_Display'] font-bold" style={{ color: '#1E3A8A' }}>¿Qué incluye?</h3>
              <ul className="space-y-2 sm:space-y-3">
                {campamentoConfig.descripcion.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-lg sm:text-xl mt-1 flex-shrink-0" style={{ color: '#2563EB' }}>✓</span>
                    <span className="text-base sm:text-lg font-['Inter']" style={{ color: '#1F2933' }}>{item}</span>
                  </li>
                ))}
                <li className="flex items-start gap-3">
                  <span className="text-lg sm:text-xl mt-1 flex-shrink-0" style={{ color: '#2563EB' }}>✓</span>
                  <span className="text-base sm:text-lg font-['Inter']" style={{ color: '#1F2933' }}>{campamentoConfig.precioDescripcion}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2" style={{ backgroundColor: 'white', borderColor: '#C2A36B' }}>
              <div className="text-center">
                <p className="text-sm sm:text-base mb-2 font-['Inter']" style={{ color: '#6B7280' }}>Ubicación</p>
                <p className="text-xl sm:text-2xl mb-4 sm:mb-6 font-['Inter'] font-medium" style={{ color: '#1E3A8A' }}>{campamentoConfig.lugar}</p>
                <p className="text-sm sm:text-base mb-2 font-['Inter']" style={{ color: '#6B7280' }}>Fechas</p>
                <p className="text-xl sm:text-2xl mb-4 sm:mb-6 font-['Inter'] font-medium" style={{ color: '#1E3A8A' }}>{campamentoConfig.fechas}</p>
                <div className="inline-block px-8 sm:px-10 py-3 sm:py-4 rounded-xl border-2" style={{ backgroundColor: '#E0B84C', borderColor: '#C2A36B' }}>
                  <p className="text-sm sm:text-base font-['Inter'] font-medium" style={{ color: '#1E3A8A' }}>Inversión</p>
                  <p className="text-3xl sm:text-4xl font-bold font-['Inter']" style={{ color: '#1E3A8A' }}>{campamentoConfig.precio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
