import { campamentoConfig } from "../config/campamento";
import { ImageWithFallback } from "./figma/ImageWithFallback";
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
        {/* Overlay oscuro con tonos sepia/marrón para mantener legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/70 via-stone-900/75 to-amber-950/80"></div>
        {/* Efecto de desenfoque sobre toda la imagen */}
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
        {/* Viñeta en los bordes */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }}></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 text-white py-20">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Badge de año */}
          <div className="inline-block bg-amber-800/30 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full border border-amber-400/40 text-sm sm:text-base">
            <span className="text-yellow-300">✝</span> {campamentoConfig.fechas.split(" ").pop()}
          </div>

          {/* Título principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white drop-shadow-lg leading-tight px-2">
            {campamentoConfig.nombre}
          </h1>

          {/* Lema */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-100 max-w-2xl mx-auto px-4">
            {campamentoConfig.lema}
          </p>

          {/* Información clave */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center pt-2 sm:pt-4">
            <div className="flex items-center gap-2 bg-amber-800/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-amber-400/30 w-full sm:w-auto">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
              <span className="text-sm sm:text-base">{campamentoConfig.fechas}</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-800/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-amber-400/30 w-full sm:w-auto">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
              <span className="text-sm sm:text-base truncate">{campamentoConfig.lugar}</span>
            </div>
          </div>

          {/* Precio */}
          <div className="pt-2 sm:pt-4">
            <div className="inline-block bg-yellow-400 text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-xl">
              <p className="text-xs sm:text-sm opacity-90">Inversión</p>
              <p className="text-2xl sm:text-3xl font-bold">{campamentoConfig.precio}</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToForm}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 text-base sm:text-lg font-bold w-full sm:w-auto max-w-xs border-2 border-amber-200 flex items-center justify-center gap-2"
            >
              <Edit3 className="w-5 h-5" />
              ¡Inscríbete Ahora!
            </button>
            
            {onIrATalleres && (
              <button
                onClick={onIrATalleres}
                className="bg-amber-800/40 backdrop-blur-sm hover:bg-amber-700/60 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg font-bold w-full sm:w-auto max-w-xs border-2 border-amber-400/50 flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Acceder a Talleres
              </button>
            )}

            {onVerMiPerfil && (
              <button
                onClick={onVerMiPerfil}
                className="bg-amber-800/40 backdrop-blur-sm hover:bg-amber-700/60 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg font-bold w-full sm:w-auto max-w-xs border-2 border-amber-400/50 flex items-center justify-center gap-2"
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
