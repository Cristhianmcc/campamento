import { campamentoConfig } from "../config/campamento";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, MapPin, ChevronDown } from "lucide-react";

export function HeroSection() {
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
        <ImageWithFallback
          src={campamentoConfig.imagenHero}
          alt="Campamento Cristiano"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/60 to-blue-900/80"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 text-white py-20">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Badge de año */}
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full border border-white/30 text-sm sm:text-base">
            <span className="text-yellow-300">✝</span> {campamentoConfig.fechas.split(" ").pop()}
          </div>

          {/* Título principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white drop-shadow-lg leading-tight px-2">
            {campamentoConfig.nombre}
          </h1>

          {/* Lema */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-2xl mx-auto px-4">
            {campamentoConfig.lema}
          </p>

          {/* Información clave */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center pt-2 sm:pt-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white/20 w-full sm:w-auto">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
              <span className="text-sm sm:text-base">{campamentoConfig.fechas}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white/20 w-full sm:w-auto">
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

          {/* CTA Button */}
          <div className="pt-4 sm:pt-6">
            <button
              onClick={scrollToForm}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 text-base sm:text-lg w-full sm:w-auto max-w-xs"
            >
              ¡Inscríbete Ahora!
            </button>
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
