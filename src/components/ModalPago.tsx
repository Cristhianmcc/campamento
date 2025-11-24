import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { campamentoConfig, InscripcionData } from "../config/campamento";
import { CheckCircle2, Copy, Info, MessageCircle, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ModalPagoProps {
  isOpen: boolean;
  onClose: () => void;
  inscripcionData: InscripcionData | null;
}

export function ModalPago({ isOpen, onClose, inscripcionData }: ModalPagoProps) {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [capturaFile, setCapturaFile] = useState<File | null>(null);
  const [capturaPreview, setCapturaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Número de ${type} copiado al portapapeles`);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor selecciona un archivo de imagen");
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 5MB");
        return;
      }

      setCapturaFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success("Captura cargada correctamente");
    }
  };

  const handleRemoveFile = () => {
    setCapturaFile(null);
    setCapturaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendToWhatsApp = () => {
    if (!inscripcionData) return;

    // Validar que se haya adjuntado la captura
    if (!capturaFile) {
      toast.error("Por favor adjunta la captura del comprobante de pago");
      return;
    }

    const mensaje = `Hola, he realizado el pago para el campamento.%0A%0A` +
      `DNI: *${inscripcionData.codigoInscripcion}*%0A` +
      `Nombre: ${inscripcionData.nombres} ${inscripcionData.apellidos}%0A` +
      `Monto: ${campamentoConfig.precio}%0A%0A` +
      `Adjunto captura del comprobante de pago.`;

    const urlWhatsApp = `https://wa.me/${campamentoConfig.contacto.whatsapp}?text=${mensaje}`;
    
    setPaymentConfirmed(true);
    
    // Nota: WhatsApp Web no permite adjuntar archivos directamente desde URL
    // El usuario deberá adjuntar manualmente la imagen después de abrir WhatsApp
    toast.info("Recuerda adjuntar la captura en WhatsApp", {
      description: "La imagen no se adjunta automáticamente, deberás enviarla manualmente",
      duration: 5000,
    });
    
    setTimeout(() => {
      window.open(urlWhatsApp, '_blank');
      setTimeout(() => {
        onClose();
        setPaymentConfirmed(false);
        handleRemoveFile();
      }, 1500);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-blue-900">
            Completa tu Pago
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Escanea el código QR o usa los números para realizar tu pago
          </DialogDescription>
        </DialogHeader>

        {!paymentConfirmed ? (
          <div className="space-y-6">
            {/* Información de DNI */}
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border-2 border-blue-300">
              <p className="text-xs sm:text-sm text-gray-700 mb-2">Tu DNI (Código de inscripción):</p>
              <div className="flex items-center justify-between bg-white p-2 sm:p-3 rounded border border-blue-200">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
                  {inscripcionData?.codigoInscripcion || "---"}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => inscripcionData && copyToClipboard(inscripcionData.codigoInscripcion, "DNI")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Incluye tu DNI al enviar tu comprobante de pago
              </p>
            </div>

            {/* Información del monto */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6 rounded-xl text-center">
              <p className="text-xs sm:text-sm opacity-90 mb-2">Monto a pagar</p>
              <p className="text-3xl sm:text-4xl font-bold">{campamentoConfig.precio}</p>
              <p className="text-xs sm:text-sm opacity-90 mt-2">{campamentoConfig.precioDescripcion}</p>
            </div>

            {/* Tabs para YAPE y PLIN */}
            <Tabs defaultValue="yape" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="yape" className="text-lg">
                  YAPE
                </TabsTrigger>
                <TabsTrigger value="plin" className="text-lg">
                  PLIN
                </TabsTrigger>
              </TabsList>

              {/* YAPE Tab */}
              <TabsContent value="yape" className="space-y-4 mt-6">
                <div className="flex flex-col items-center">
                  {/* QR Code */}
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border-4 border-purple-500">
                    <ImageWithFallback
                      src={campamentoConfig.imagenQRYape}
                      alt="QR YAPE"
                      className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain"
                    />
                  </div>

                  {/* Información del número */}
                  <div className="mt-4 sm:mt-6 w-full bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Número de YAPE:</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg sm:text-xl text-purple-700">
                        {campamentoConfig.yapeNumero}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(campamentoConfig.yapeNumero, "YAPE")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      A nombre de: <span className="text-gray-800">{campamentoConfig.yapeTitular}</span>
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* PLIN Tab */}
              <TabsContent value="plin" className="space-y-4 mt-6">
                <div className="flex flex-col items-center">
                  {/* QR Code */}
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border-4 border-blue-500">
                    <ImageWithFallback
                      src={campamentoConfig.imagenQRPlin}
                      alt="QR PLIN"
                      className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain"
                    />
                  </div>

                  {/* Información del número */}
                  <div className="mt-4 sm:mt-6 w-full bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Número de PLIN:</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg sm:text-xl text-blue-700">
                        {campamentoConfig.plinNumero}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(campamentoConfig.plinNumero, "PLIN")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      A nombre de: <span className="text-gray-800">{campamentoConfig.plinTitular}</span>
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Instrucciones */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="mb-2">
                    <strong>Instrucciones:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Escanea el código QR o usa el número de cuenta</li>
                    <li>Realiza el pago por el monto exacto</li>
                    <li>Toma captura de pantalla del comprobante</li>
                    <li>Adjunta la captura usando el botón de abajo</li>
                    <li>Envía tu comprobante por WhatsApp</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sección de carga de archivo */}
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-3">
                Adjuntar Comprobante de Pago *
              </p>
              
              {!capturaPreview ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-100 transition-colors"
                  >
                    <Upload className="w-10 h-10 text-blue-500 mb-2" />
                    <p className="text-sm text-blue-700 font-medium">
                      Haz clic para seleccionar imagen
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG o JPEG (Máx. 5MB)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={capturaPreview}
                    alt="Vista previa del comprobante"
                    className="w-full h-48 object-contain bg-white rounded-lg border border-blue-300"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {capturaFile?.name}
                  </p>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 w-full"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSendToWhatsApp}
                disabled={!capturaFile}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Enviar por WhatsApp</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl text-green-600 mb-2">
              Inscripción Registrada
            </h3>
            <p className="text-gray-600">
              Redirigiendo a WhatsApp para enviar tu comprobante
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
