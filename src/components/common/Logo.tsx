import React from 'react';
import logo from '@/assets/logo_MrPizza.png'; // si configuraste alias "@"
// si no tienes el alias, usa la ruta relativa correcta:
// import logo from '../../assets/logo_MrPizza.png';

interface LogoProps {
  size?: number;       // tamaño en píxeles (opcional)
  rounded?: boolean;   // si quieres que sea circular (opcional)
  bordered?: boolean;  // si quieres borde degradado (opcional)
}

export const Logo: React.FC<LogoProps> = ({ size = 40, rounded = false, bordered = false }) => {
  const sizeClass = `w-[${size}px] h-[${size}px] object-contain`;

  if (bordered) {
    return (
    //   <div className="p-[3px] rounded-full bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="p-[3px] rounded-full bg-transparent p-1 ">
          <img
            src={logo}
            alt="Logo Mr. Pizza"
            className={`object-contain ${rounded ? 'rounded-full' : ''}`}
            style={{ width: size, height: size }}
          />
        </div>
    //   </div>
    );
  }

  return (
    <img
      src={logo}
      alt="Logo Mr. Pizza"
      className={`object-contain ${rounded ? 'rounded-full' : ''}`}
      style={{ width: size, height: size }}
    />
  );
};
