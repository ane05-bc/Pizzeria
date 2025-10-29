import React from 'react';
import QRImage from "../../assets/QR_location.png";

export function LocationSection() {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Nuestra Ubicación</h2>

      {/* Contenedor principal con 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-semibold">¡Visítanos!</h3>
          <p className="text-lg mt-4">
            Encuéntranos en nuestra sucursal principal:
          </p>
          <address className="mt-2 text-xl not-italic font-medium text-gray-700">
            AV. HERNANDO SILES ESQ CALLE 9<br />
            EDIF. VISION MODERNA<br />
            La Paz, Bolivia
          </address>
          <p className="mt-4">¡Te esperamos para que disfrutes del Señor Sabor!</p>
        </div>
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <p className="text-gray-500 mb-4">
            Escanea el código QR para abrir la ubicación:
          </p>
          
          {/* Imagen del QR clickable */}
          <a
            href="https://maps.app.goo.gl/HeW4kU9747yxbmp89"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <img
              src={QRImage}
              alt="Código QR de la ubicación"
              className="w-48 h-48 object-contain shadow-lg rounded-lg"
            />
          </a>
        </div>

      </div>
    </div>
  );
}