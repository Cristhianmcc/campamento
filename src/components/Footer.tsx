import { campamentoConfig } from "../config/campamento";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#1E3A8A] to-[#1F2933] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Información del Campamento */}
          <div>
            <h3 className="text-2xl mb-4 text-[#E0B84C] font-['Playfair_Display'] font-bold">
              {campamentoConfig.nombre}
            </h3>
            <p className="text-white mb-4 font-['Inter']">
              {campamentoConfig.lema}
            </p>
            <div className="space-y-2 text-white font-['Inter']">
              <p>{campamentoConfig.fechas}</p>
              <p>{campamentoConfig.lugar}</p>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-xl mb-4 text-[#E0B84C] font-['Playfair_Display'] font-semibold">Contacto</h4>
            <div className="space-y-3">
              <a
                href={`mailto:${campamentoConfig.contacto.email}`}
                className="flex items-center gap-3 text-white hover:text-[#E0B84C] transition-colors font-['Inter']"
              >
                <Mail className="w-5 h-5" />
                <span>{campamentoConfig.contacto.email}</span>
              </a>
              <a
                href={`tel:${campamentoConfig.contacto.telefono}`}
                className="flex items-center gap-3 text-white hover:text-[#E0B84C] transition-colors font-['Inter']"
              >
                <Phone className="w-5 h-5" />
                <span>{campamentoConfig.contacto.telefono}</span>
              </a>
              <a
                href={`https://wa.me/${campamentoConfig.contacto.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white hover:text-[#E0B84C] transition-colors font-['Inter']"
              >
                <Phone className="w-5 h-5" />
                <span>WhatsApp: {campamentoConfig.contacto.telefono}</span>
              </a>
              <div className="flex items-start gap-3 text-white font-['Inter']">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>{campamentoConfig.contacto.direccion}</span>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div>
            <h4 className="text-xl mb-4 text-[#E0B84C] font-['Playfair_Display'] font-semibold">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href={campamentoConfig.redesSociales.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2563EB] hover:bg-[#C2A36B] p-3 rounded-full transition-colors border-2 border-transparent hover:border-[#E0B84C]"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href={campamentoConfig.redesSociales.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2563EB] hover:bg-[#C2A36B] p-3 rounded-full transition-colors border-2 border-transparent hover:border-[#E0B84C]"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href={campamentoConfig.redesSociales.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2563EB] hover:bg-[#C2A36B] p-3 rounded-full transition-colors border-2 border-transparent hover:border-[#E0B84C]"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-6 bg-[#2563EB]/30 p-4 rounded-lg border border-[#C2A36B]/30">
              <p className="text-sm text-white font-['Inter']">
                ¿Preguntas sobre el campamento? ¡Contáctanos por cualquier medio!
              </p>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-[#C2A36B]/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white text-sm font-['Inter']">
            <p>
              © {currentYear} {campamentoConfig.nombre}. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-2">
              Hecho con <span className="text-[#E0B84C]">❤</span> para la gloria de Dios
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
