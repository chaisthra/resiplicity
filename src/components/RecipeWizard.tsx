import React, { useState } from 'react';
import { IngredientInput } from './IngredientInput';
import { CuisineSelector } from './CuisineSelector';
import { DietaryRestrictions } from './DietaryRestrictions';
import { ProficiencySelector } from './ProficiencySelector';
import { TimeSelector } from './TimeSelector';
import { RecipeOutput } from './RecipeOutput';
import WizardStep from './WizardStep';
import { cuisineOptions } from '../data/cuisineOptions';

type WizardStep = 'proficiency' | 'ingredients' | 'time' | 'cuisine' | 'subcuisine' | 'dietary' | 'result';

export const RecipeWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('proficiency');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedMainCuisine, setSelectedMainCuisine] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [proficiency, setProficiency] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    const steps: WizardStep[] = ['proficiency', 'ingredients', 'time', 'cuisine', 'subcuisine', 'dietary', 'result'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const steps: WizardStep[] = ['proficiency', 'ingredients', 'time', 'cuisine', 'subcuisine', 'dietary', 'result'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'proficiency':
        return proficiency !== '';
      case 'ingredients':
        return ingredients.length > 0;
      case 'time':
        return timeAvailable !== '';
      case 'cuisine':
        return selectedMainCuisine !== '';
      case 'subcuisine':
        return selectedCuisine !== '';
      case 'dietary':
        return true; // Optional
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'proficiency':
        return (
          <WizardStep
            title="What's your cooking experience?"
            showNext={canProceed()}
            onNext={handleNext}
          >
            <ProficiencySelector
              selectedLevel={proficiency}
              onSelect={(level) => {
                setProficiency(level);
                handleNext();
              }}
            />
          </WizardStep>
        );

      case 'ingredients':
        return (
          <WizardStep
            title="What ingredients do you have?"
            showNext={canProceed()}
            showPrev={true}
            onNext={handleNext}
            onPrev={handlePrev}
          >
            <IngredientInput
              ingredients={ingredients}
              onChange={setIngredients}
            />
          </WizardStep>
        );

      case 'time':
        return (
          <WizardStep
            title="How much time do you have?"
            showNext={canProceed()}
            showPrev={true}
            onNext={handleNext}
            onPrev={handlePrev}
          >
            <TimeSelector
              selectedTime={timeAvailable}
              onSelect={(time) => {
                setTimeAvailable(time);
                handleNext();
              }}
            />
          </WizardStep>
        );

      case 'cuisine':
        return (
          <WizardStep
            title="Choose a cuisine type"
            showNext={false}
            showPrev={true}
            onPrev={handlePrev}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cuisineOptions.map((cuisine) => (
                <button
                  key={cuisine.name}
                  onClick={() => {
                    setSelectedMainCuisine(cuisine.name);
                    handleNext();
                  }}
                  className="p-6 rounded-lg bg-brown-100 hover:bg-brown-200 text-brown-800 transition-all text-left"
                >
                  <h3 className="text-lg font-semibold mb-2">{cuisine.name}</h3>
                  <p className="text-sm text-brown-600">
                    {cuisine.subcategories.length} styles available
                  </p>
                </button>
              ))}
            </div>
          </WizardStep>
        );

      case 'subcuisine':
        return (
          <WizardStep
            title={`Choose ${selectedMainCuisine} Style`}
            showNext={false}
            showPrev={true}
            onPrev={handlePrev}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cuisineOptions
                .find(c => c.name === selectedMainCuisine)
                ?.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedCuisine(`${selectedMainCuisine} - ${sub}`);
                      handleNext();
                    }}
                    className="p-6 rounded-lg bg-brown-100 hover:bg-brown-200 text-brown-800 transition-all"
                  >
                    {sub}
                  </button>
                ))}
            </div>
          </WizardStep>
        );

      case 'dietary':
        return (
          <WizardStep
            title="Any dietary restrictions?"
            showPrev={true}
            onPrev={handlePrev}
          >
            <DietaryRestrictions
              onComplete={(restrictions) => {
                setDietaryRestrictions(restrictions);
                handleNext();
              }}
            />
          </WizardStep>
        );

      case 'result':
        return (
          <WizardStep
            title="Your Personalized Recipe"
            showPrev={true}
            onPrev={handlePrev}
          >
            <RecipeOutput
              formData={{
                ingredients,
                selectedCuisine,
                dietaryRestrictions,
                proficiency,
                timeAvailable
              }}
            />
          </WizardStep>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-cream rounded-lg shadow-lg p-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600"></div>
          </div>
        ) : (
          renderStep()
        )}
      </div>
    </div>
  );
};