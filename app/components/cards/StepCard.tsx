export function StepCard({
  number,
  title,
  description,
  color,
  image,
}: {
  number: string;
  title: string;
  description: string;
  color: string;
  image: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`neo-border-thick neo-shadow-lg  bg-white w-full aspect-square mb-6 flex items-center justify-center overflow-hidden relative group`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
        <div className="relative z-10 text-center">
          <img src={image} alt={title} />
        </div>
      </div>

      <div
        className={`neo-border-thick neo-shadow-lg ${color} w-20 h-20 flex items-center justify-center mb-4 hover-lift`}
      >
        <span className="font-display text-4xl">{number}</span>
      </div>

      <h3 className="font-display text-2xl mb-3">{title}</h3>
      <p className="font-body text-base opacity-80 max-w-xs leading-relaxed">
        {description}
      </p>
    </div>
  );
}
