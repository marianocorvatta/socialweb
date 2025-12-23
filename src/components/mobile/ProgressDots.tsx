interface ProgressDotsProps {
  currentStep: 1 | 2 | 3;
}

export default function ProgressDots({ currentStep }: ProgressDotsProps) {
  return (
    <div className="fixed top-6 left-0 right-0 z-40 flex justify-center gap-2">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`h-2 rounded-full transition-all duration-300 ${
            step === currentStep
              ? "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 w-8"
              : step < currentStep
                ? "bg-pink-300 w-2"
                : "bg-gray-300 w-2"
          }`}
          aria-label={
            step === currentStep
              ? `Paso ${step} de 3 - Actual`
              : step < currentStep
                ? `Paso ${step} de 3 - Completado`
                : `Paso ${step} de 3`
          }
          role="status"
        />
      ))}
    </div>
  );
}
