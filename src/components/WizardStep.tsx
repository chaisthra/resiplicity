import React, { ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardStepProps {
  title: string;
  children: ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  showNext?: boolean;
  showPrev?: boolean;
}

const WizardStep: React.FC<WizardStepProps> = ({
  title,
  children,
  onNext,
  onPrev,
  showNext,
  showPrev
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-display text-brown-800 mb-8">{title}</h2>
      <div className="space-y-6">
        {children}
      </div>
      <div className="flex justify-between pt-6">
        {showPrev && (
          <button
            onClick={onPrev}
            className="flex items-center px-4 py-2 text-brown-600 hover:text-brown-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        )}
        {showNext && (
          <button
            onClick={onNext}
            className="flex items-center px-4 py-2 text-brown-600 hover:text-brown-800 transition-colors ml-auto"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}

export default WizardStep;