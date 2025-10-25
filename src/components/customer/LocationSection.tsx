import React from 'react';
import QRImage from "../../assets/QR_location.png"; 

export function LocationSection() {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Nuestra Ubicación</h2>
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
        <p className="text-gray-500">Escanea el código QR para abrir la ubicación</p>
        {/* Espacio para el Iframe de Google Maps */}
        <div className="h-96 bg-gray-200 rounded-lg shadow-inner flex items-center justify-center">
          <img
            src={QRImage} 
            alt="Código QR de la ubicación"
            className="w-64 h-64 object-contain mb-4"
          />
          {/* <a
            href="https://maps.app.goo.gl/t88VP2Ssg99ThQJP8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Ver en Google Maps
          </a> */}
        </div>
      </div>
    </div>
  );
}