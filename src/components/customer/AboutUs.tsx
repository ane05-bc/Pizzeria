import React from 'react';

export function AboutUsSection() {
  return (
    <div className="py-12 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Sobre Nosotros: Mr. Pizza</h2>
      <div className="space-y-6 text-lg text-gray-700">
        <p>
          Bienvenidos a <span className="font-bold text-red-600">Mr. Pizza</span>, donde nuestra pasión es crear la pizza perfecta, o como nos gusta llamarla: ¡El Señor Sabor!
        </p>
        <p>
          Nuestra historia comenzó hace más de 20 años con una simple misión: traer a la ciudad un sabor auténtico utilizando solo los ingredientes más frescos. Creemos que la calidad no es negociable. Por eso, nuestra masa se prepara a diario, nuestra salsa de tomate utiliza tomates seleccionados y nuestros quesos son de la más alta calidad.
        </p>
        <p>
          No somos solo una pizzería, somos parte de la comunidad. Gracias por elegirnos y permitirnos ser parte de tus cenas familiares, reuniones con amigos y momentos especiales.
        </p>
      </div>
    </div>
  );
}