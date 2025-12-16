import { campamentoConfig } from "../config/campamento";
import { Calendar, MapPin, ChevronDown, Edit3, Users, UserCircle } from "lucide-react";

interface HeroSectionProps {
  onIrATalleres?: () => void;
  onVerMiPerfil?: () => void;
}

export function HeroSection({ onIrATalleres, onVerMiPerfil }: HeroSectionProps) {
  const scrollToForm = () => {
    const formElement = document.getElementById("inscripcion");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen h-screen w-full overflow-hidden">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0">
        {/* Imagen de fondo principal con gradiente de respaldo */}
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/hero-campamento.png')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
        {/* Overlay oscuro con tonos azul profundo y tierra */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/70 via-[#1F2933]/75 to-[#1E3A8A]/80"></div>
        {/* Efecto de desenfoque sobre toda la imagen */}
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
        {/* Viñeta en los bordes */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(30,58,138,0.4) 100%)'
        }}></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 text-white py-20">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Badge de año */}
          <div className="inline-block bg-[#1E3A8A]/40 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full border border-[#C2A36B]/50 text-sm sm:text-base">
            <span className="text-[#E0B84C]">✝</span> {campamentoConfig.fechas.split(" ").pop()}
          </div>

          {/* Título principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white drop-shadow-2xl leading-tight px-2 font-['Playfair_Display']">
            {campamentoConfig.nombre}
          </h1>

          {/* Lema */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto px-4 font-['Inter']">
            {campamentoConfig.lema}
          </p>

          {/* Información clave */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center pt-2 sm:pt-4">
            <div className="flex items-center gap-2 bg-[#2563EB]/30 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-[#C2A36B]/40 w-full sm:w-auto">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#E0B84C] flex-shrink-0" />
              <span className="text-sm sm:text-base font-['Inter']">{campamentoConfig.fechas}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#2563EB]/30 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-[#C2A36B]/40 w-full sm:w-auto">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#E0B84C] flex-shrink-0" />
              <span className="text-sm sm:text-base truncate font-['Inter']">{campamentoConfig.lugar}</span>
            </div>
          </div>

          {/* Precio */}
          <div className="pt-2 sm:pt-4">
            <div className="inline-block">
              <p className="text-xs sm:text-sm font-['Inter'] font-medium text-white mb-1">Inversión</p>
              <div style={{ backgroundColor: '#E0B84C', color: '#000000ff' }} className="px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-2xl border-2 border-[#C2A36B]">
                <p className="text-2xl sm:text-3xl font-bold font-['Inter']" style={{ color: '#0f0d0dff' }}>{campamentoConfig.precio}</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToForm}
              className="bg-[#2563EB] hover:bg-[#1E3A8A] !text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 text-base sm:text-lg font-medium w-full sm:w-auto max-w-xs border-2 border-[#E0B84C] flex items-center justify-center gap-2 font-['Inter']"
            >
              <Edit3 className="w-5 h-5" />
              ¡Inscríbete Ahora!
            </button>
            
            {onIrATalleres && (
              <button
                onClick={onIrATalleres}
                className="bg-[#1E3A8A]/50 backdrop-blur-sm hover:bg-[#1E3A8A]/70 !text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg font-medium w-full sm:w-auto max-w-xs border-2 border-[#C2A36B]/60 flex items-center justify-center gap-2 font-['Inter']"
              >
                <Users className="w-5 h-5" />
                Acceder a Talleres
              </button>
            )}

            {onVerMiPerfil && (
              <button
                onClick={onVerMiPerfil}
                className="bg-[#1E3A8A]/50 backdrop-blur-sm hover:bg-[#1E3A8A]/70 !text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg font-medium w-full sm:w-auto max-w-xs border-2 border-[#C2A36B]/60 flex items-center justify-center gap-2 font-['Inter']"
              >
                <UserCircle className="w-5 h-5" />
                Mi Inscripción
              </button>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </div>
    </section>
  );
}
