import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowLeftRight, Dumbbell } from 'lucide-react';
import { exerciseLibrary, type ExerciseDefinition, type MuscleGroup, type EquipmentType } from '@/lib/exerciseLibrary';

interface ExerciseSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExercise: {
    exerciseId: string;
    name: string;
    sets: number;
    reps: string;
  };
  userEquipment: 'full-gym' | 'home-gym' | 'minimal';
  onSwap: (newExercise: ExerciseDefinition) => void;
}

// Map user equipment settings to available equipment types
const equipmentMap: Record<string, EquipmentType[]> = {
  'full-gym': ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'resistance-band'],
  'home-gym': ['dumbbell', 'bodyweight', 'kettlebell', 'resistance-band'],
  'minimal': ['bodyweight', 'resistance-band'],
};

export function ExerciseSwapModal({ 
  isOpen, 
  onClose, 
  currentExercise, 
  userEquipment,
  onSwap 
}: ExerciseSwapModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Find the current exercise definition
  const currentDef = useMemo(() => 
    exerciseLibrary.find(ex => ex.id === currentExercise.exerciseId),
    [currentExercise.exerciseId]
  );

  // Get alternative exercises for the same muscle group
  const alternatives = useMemo(() => {
    if (!currentDef) return [];

    const availableEquipment = equipmentMap[userEquipment] || equipmentMap['minimal'];

    return exerciseLibrary.filter(ex => 
      // Same primary muscle
      ex.primaryMuscle === currentDef.primaryMuscle &&
      // Not the current exercise
      ex.id !== currentDef.id &&
      // Has at least one equipment type available
      ex.equipment.some(eq => availableEquipment.includes(eq))
    );
  }, [currentDef, userEquipment]);

  if (!isOpen) return null;

  const handleSwap = () => {
    const selected = alternatives.find(ex => ex.id === selectedId);
    if (selected) {
      onSwap(selected);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border">
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Swap Exercise
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Current Exercise */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Current Exercise</p>
            <p className="font-medium">{currentExercise.name}</p>
            <p className="text-sm text-muted-foreground">
              {currentExercise.sets} sets × {currentExercise.reps}
            </p>
          </div>

          {/* Alternatives List */}
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Alternative exercises ({alternatives.length})
            </p>
            
            {alternatives.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No alternatives available for your equipment
              </p>
            ) : (
              alternatives.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedId(ex.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    selectedId === ex.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{ex.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {ex.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-muted rounded">
                          {ex.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {ex.equipment.join(', ')}
                        </span>
                      </div>
                    </div>
                    {selectedId === ex.id && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </CardContent>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border">
          <Button 
            className="w-full"
            onClick={handleSwap}
            disabled={!selectedId}
          >
            <Dumbbell className="w-4 h-4 mr-2" />
            Swap Exercise
          </Button>
        </div>
      </Card>
    </div>
  );
}
