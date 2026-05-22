import {
  MdAssignmentReturn,
  MdLocalShipping,
  MdOutlineSupportAgent,
  MdVerified,
} from "react-icons/md";

export const FeatureGrid = () => {
  return (
    <section className="bg-slate-100 py-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        <div className="flex items-center gap-4">
          <MdLocalShipping size={24} className="shrink-0 text-slate-600" />

          <div className="space-y-1 text-slate-700">
            <p className="font-semibold leading-none">Envío gratis</p>
            <p className="text-sm leading-5">En todos nuestros productos</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <MdAssignmentReturn size={24} className="shrink-0 text-slate-600" />

          <div className="space-y-1 text-slate-700">
            <p className="font-semibold leading-none">Devoluciones</p>
            <p className="text-sm leading-5">
              Devuelve el equipo si no te satisface la compra dentro de 72 horas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <MdOutlineSupportAgent size={24} className="shrink-0 text-slate-600" />

          <div className="space-y-1 text-slate-700">
            <p className="font-semibold leading-none">Soporte 24/7</p>
            <p className="text-sm leading-5">Soporte técnico en cualquier momento</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <MdVerified size={24} className="shrink-0 text-slate-600" />

          <div className="space-y-1 text-slate-700">
            <p className="font-semibold leading-none">Garantía</p>
            <p className="text-sm leading-5">Garantía 30 días en todos los productos</p>
          </div>
        </div>
      </div>
    </section>
  );
};