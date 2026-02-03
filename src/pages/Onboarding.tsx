import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext, FitnessGoal, ExperienceLevel, TrainingDays, Equipment } from '@/context/GlobalContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Dumbbell, Target, Calendar, Wrench } from 'lucide-react';

const STEPS = ['goal', 'experience', 'frequency', 'equipment'] as const;
type Step = typeof STEPS[number];

interface OptionCard {
  value: string;
  label: string;
  description: string;
}

const GOAL_OPTIONS: OptionCard[] = [
  { value: 'muscle', label: 'Build Muscle', description: 'Focus on hypertrophy and size gains' },
  { value: 'weight-loss', label: 'Lose Weight', description: 'Burn fat and get lean' },
  { value: 'strength', label: 'Build Strength', description: 'Increase your lifting numbers' },
  { value: 'general', label: 'General Fitness', description: 'Balanced health and wellness' },
];

const EXPERIENCE_OPTIONS: OptionCard[] = [
  { value: 'beginner', label: 'Beginner', description: '0-1 year of training' },
  { value: 'intermediate', label: 'Intermediate', description: '1-3 years of training' },
  { value: 'advanced', label: 'Advanced', description: '3+ years of training' },
];

const FREQUENCY_OPTIONS: OptionCard[] = [
  { value: '2', label: '2 Days', description: 'Full body twice per week' },
  { value: '3', label: '3 Days', description: 'Push/Pull/Legs split' },
  { value: '4', label: '4 Days', description: 'Upper/Lower split' },
  { value: '5', label: '5 Days', description: 'Push/Pull/Legs + Upper/Lower' },
  { value: '6', label: '6 Days', description: 'Push/Pull/Legs twice' },
];

const EQUIPMENT_OPTIONS: OptionCard[] = [
  { value: 'full-gym', label: 'Full Gym', description: 'Access to all equipment' },
  { value: 'home-gym', label: 'Home Gym', description: 'Dumbbells, bench, basic equipment' },
  { value: 'minimal', label: 'Minimal', description: 'Bodyweight and resistance bands' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { 
    fitnessGoal, setFitnessGoal,
    experienceLevel, setExperienceLevel,
    trainingDays, setTrainingDays,
    equipment, setEquipment,
    generateUserProgram,
    setOnboardingComplete
  } = useGlobalContext();
  
  const [currentStep, setCurrentStep] = useState<number>(0);
  const step = STEPS[currentStep];

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      generateUserProgram();
      setOnboardingComplete(true);
      navigate('/');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 'goal':
        return <Target className="w-10 h-10 mx-auto text-accent mb-2" />;
      case 'experience':
        return <Dumbbell className="w-10 h-10 mx-auto text-accent mb-2" />;
      case 'frequency':
        return <Calendar className="w-10 h-10 mx-auto text-accent mb-2" />;
      case 'equipment':
        return <Wrench className="w-10 h-10 mx-auto text-accent mb-2" />;
    }
  };

  const renderOptionCards = (options: OptionCard[], selected: string, onSelect: (value: string) => void) => (
    <div className="space-y-3">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selected === option.value ? 'default' : 'outline'}
          className="w-full h-auto p-4 flex-col items-start text-left"
          onClick={() => onSelect(option.value)}
        >
          <span className="font-semibold">{option.label}</span>
          <span className="text-sm opacity-80">{option.description}</span>
        </Button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Progress value={progress} />
        </div>
        <span className="text-sm text-muted-foreground">
          {currentStep + 1}/{STEPS.length}
        </span>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {getStepIcon()}
            {step === 'goal' && (
              <>
                <CardTitle>What's your fitness goal?</CardTitle>
                <CardDescription>This helps us customize your training program</CardDescription>
              </>
            )}
            {step === 'experience' && (
              <>
                <CardTitle>Experience Level</CardTitle>
                <CardDescription>How long have you been training?</CardDescription>
              </>
            )}
            {step === 'frequency' && (
              <>
                <CardTitle>Training Frequency</CardTitle>
                <CardDescription>How many days per week can you train?</CardDescription>
              </>
            )}
            {step === 'equipment' && (
              <>
                <CardTitle>Available Equipment</CardTitle>
                <CardDescription>What equipment do you have access to?</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'goal' && renderOptionCards(
              GOAL_OPTIONS,
              fitnessGoal,
              (value) => setFitnessGoal(value as FitnessGoal)
            )}

            {step === 'experience' && renderOptionCards(
              EXPERIENCE_OPTIONS,
              experienceLevel,
              (value) => setExperienceLevel(value as ExperienceLevel)
            )}

            {step === 'frequency' && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {FREQUENCY_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={trainingDays.toString() === option.value ? 'default' : 'outline'}
                    className="h-auto p-4 flex-col"
                    onClick={() => setTrainingDays(parseInt(option.value) as TrainingDays)}
                  >
                    <span className="text-2xl font-bold">{option.value}</span>
                    <span className="text-xs opacity-80">days/week</span>
                  </Button>
                ))}
              </div>
            )}

            {step === 'equipment' && renderOptionCards(
              EQUIPMENT_OPTIONS,
              equipment,
              (value) => setEquipment(value as Equipment)
            )}

            <Button onClick={handleNext} className="w-full h-12 text-lg">
              {currentStep === STEPS.length - 1 ? 'Create Program' : 'Continue'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
