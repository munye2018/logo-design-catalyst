import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '@/context/GlobalContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Activity } from 'lucide-react';

const STEPS = ['sex', 'event', 'time', 'program'] as const;
type Step = typeof STEPS[number];

export default function Onboarding() {
  const navigate = useNavigate();
  const { 
    sex, setSex, 
    event, setEvent, 
    bestTime, setBestTime, 
    programType, setProgramType,
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
            <Activity className="w-10 h-10 mx-auto text-accent mb-2" />
            {step === 'sex' && (
              <>
                <CardTitle>What's your sex?</CardTitle>
                <CardDescription>This helps us calibrate pace targets</CardDescription>
              </>
            )}
            {step === 'event' && (
              <>
                <CardTitle>Primary Event</CardTitle>
                <CardDescription>What distance are you training for?</CardDescription>
              </>
            )}
            {step === 'time' && (
              <>
                <CardTitle>Season's Best</CardTitle>
                <CardDescription>Enter your personal best time for {event}m</CardDescription>
              </>
            )}
            {step === 'program' && (
              <>
                <CardTitle>Program Type</CardTitle>
                <CardDescription>How would you like to train?</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'sex' && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={sex === 'male' ? 'default' : 'outline'}
                  className="h-24 text-lg"
                  onClick={() => setSex('male')}
                >
                  Male
                </Button>
                <Button
                  variant={sex === 'female' ? 'default' : 'outline'}
                  className="h-24 text-lg"
                  onClick={() => setSex('female')}
                >
                  Female
                </Button>
              </div>
            )}

            {step === 'event' && (
              <div className="grid grid-cols-2 gap-4">
                {[100, 200, 400, 800].map((dist) => (
                  <Button
                    key={dist}
                    variant={event === dist ? 'default' : 'outline'}
                    className="h-16 text-lg"
                    onClick={() => setEvent(dist)}
                  >
                    {dist}m
                  </Button>
                ))}
              </div>
            )}

            {step === 'time' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="time">Best Time (seconds)</Label>
                  <Input
                    id="time"
                    type="number"
                    step="0.01"
                    min="5"
                    max="180"
                    value={bestTime}
                    onChange={(e) => setBestTime(parseFloat(e.target.value) || 11.5)}
                    className="text-2xl text-center h-16 mt-2"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Enter your time in seconds (e.g., 11.37 for 100m)
                </p>
              </div>
            )}

            {step === 'program' && (
              <div className="space-y-4">
                <Button
                  variant={programType === 'ongoing' ? 'default' : 'outline'}
                  className="w-full h-auto p-4 flex-col items-start text-left"
                  onClick={() => setProgramType('ongoing')}
                >
                  <span className="font-semibold">Ongoing Training</span>
                  <span className="text-sm opacity-80">Continuous 20-week periodized program</span>
                </Button>
                <Button
                  variant={programType === 'peaking' ? 'default' : 'outline'}
                  className="w-full h-auto p-4 flex-col items-start text-left"
                  onClick={() => setProgramType('peaking')}
                >
                  <span className="font-semibold">Peak for Competition</span>
                  <span className="text-sm opacity-80">Build towards a specific event date</span>
                </Button>
              </div>
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
