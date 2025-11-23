import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { User, Mail, Phone, Church, FileText, CreditCard } from "lucide-react";
import { InscripcionData } from "../config/campamento";

interface FormularioInscripcionProps {
  onSubmit: (data: InscripcionData) => void;
  isSubmitting: boolean;
}

export function FormularioInscripcion({ onSubmit, isSubmitting }: FormularioInscripcionProps) {
  const [formData, setFormData] = useState<Omit<InscripcionData, "fechaInscripcion" | "codigoInscripcion" | "estadoPago" | "fechaConfirmacion">>({
    nombres: "",
    apellidos: "",
    edad: "",
    dni: "",
    email: "",
    telefono: "",
    iglesia: "",
    necesidadesEspeciales: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombres.trim()) newErrors.nombres = "Los nombres son requeridos";
    if (!formData.apellidos.trim()) newErrors.apellidos = "Los apellidos son requeridos";
    if (!formData.edad || parseInt(formData.edad) < 1 || parseInt(formData.edad) > 120) {
      newErrors.edad = "Ingrese una edad válida";
    }
    if (!formData.dni.trim() || formData.dni.length !== 8) {
      newErrors.dni = "El DNI debe tener 8 dígitos";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingrese un email válido";
    }
    if (!formData.telefono.trim() || formData.telefono.length < 9) {
      newErrors.telefono = "Ingrese un teléfono válido";
    }
    if (!formData.iglesia.trim()) newErrors.iglesia = "La iglesia es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataWithDate: InscripcionData = {
        ...formData,
        fechaInscripcion: new Date().toISOString(),
        codigoInscripcion: "",
        estadoPago: 'Pendiente',
      };
      onSubmit(dataWithDate);
    }
  };

  return (
    <section id="inscripcion" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-4 text-sm sm:text-base">
            Inscripción
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 mb-4 leading-tight px-2">
            ¡Asegura tu Lugar!
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 px-4">
            Completa el formulario y realiza tu pago para confirmar tu inscripción
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border-t-4 border-blue-500"
        >
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Nombres */}
            <div>
              <Label htmlFor="nombres" className="flex items-center gap-2 mb-2 text-blue-900">
                <User className="w-4 h-4" />
                Nombres *
              </Label>
              <Input
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Juan Carlos"
                className={errors.nombres ? "border-red-500" : ""}
              />
              {errors.nombres && (
                <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
              )}
            </div>

            {/* Apellidos */}
            <div>
              <Label htmlFor="apellidos" className="flex items-center gap-2 mb-2 text-blue-900">
                <User className="w-4 h-4" />
                Apellidos *
              </Label>
              <Input
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="García Pérez"
                className={errors.apellidos ? "border-red-500" : ""}
              />
              {errors.apellidos && (
                <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
              )}
            </div>

            {/* Edad */}
            <div>
              <Label htmlFor="edad" className="flex items-center gap-2 mb-2 text-blue-900">
                <FileText className="w-4 h-4" />
                Edad *
              </Label>
              <Input
                id="edad"
                name="edad"
                type="number"
                value={formData.edad}
                onChange={handleChange}
                placeholder="18"
                min="1"
                max="120"
                className={errors.edad ? "border-red-500" : ""}
              />
              {errors.edad && (
                <p className="text-red-500 text-sm mt-1">{errors.edad}</p>
              )}
            </div>

            {/* DNI */}
            <div>
              <Label htmlFor="dni" className="flex items-center gap-2 mb-2 text-blue-900">
                <CreditCard className="w-4 h-4" />
                DNI *
              </Label>
              <Input
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="12345678"
                maxLength={8}
                className={errors.dni ? "border-red-500" : ""}
              />
              {errors.dni && (
                <p className="text-red-500 text-sm mt-1">{errors.dni}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-blue-900">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <Label htmlFor="telefono" className="flex items-center gap-2 mb-2 text-blue-900">
                <Phone className="w-4 h-4" />
                Teléfono/WhatsApp *
              </Label>
              <Input
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+51 987 654 321"
                className={errors.telefono ? "border-red-500" : ""}
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
              )}
            </div>
          </div>

          {/* Iglesia */}
          <div className="mb-6">
            <Label htmlFor="iglesia" className="flex items-center gap-2 mb-2 text-blue-900">
              <Church className="w-4 h-4" />
              Iglesia a la que perteneces *
            </Label>
            <Input
              id="iglesia"
              name="iglesia"
              value={formData.iglesia}
              onChange={handleChange}
              placeholder="Iglesia Cristiana Nueva Vida"
              className={errors.iglesia ? "border-red-500" : ""}
            />
            {errors.iglesia && (
              <p className="text-red-500 text-sm mt-1">{errors.iglesia}</p>
            )}
          </div>

          {/* Necesidades Especiales */}
          <div className="mb-8">
            <Label htmlFor="necesidadesEspeciales" className="mb-2 text-blue-900">
              Necesidades especiales o alergias (opcional)
            </Label>
            <Textarea
              id="necesidadesEspeciales"
              name="necesidadesEspeciales"
              value={formData.necesidadesEspeciales}
              onChange={handleChange}
              placeholder="Alguna alergia, medicación especial, restricción alimenticia, etc."
              rows={3}
            />
          </div>

          {/* Botón de envío */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isSubmitting ? "Procesando..." : "Continuar al Pago"}
            </Button>
            <p className="text-xs sm:text-sm text-gray-500 mt-4">
              * Campos obligatorios
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
