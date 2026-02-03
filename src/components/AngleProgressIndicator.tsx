import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, AlertCircle } from 'lucide-react';

interface AngleProgressIndicatorProps {
  currentAngle: number | null;
  bottomAngleRange: [number, number];
  topAngleRange: [number, number];
  currentPhase: string;
}

export interface AngleProgressResult {
  progress: number;
  zone: 'bottom' | 'middle' | 'top' | 'outside';
  inOptimalZone: boolean;
}

export function calculateAngleProgress(
  currentAngle: number,
  bottomRange: [number, number],
  topRange: [number, number]
): AngleProgressResult {
  const minAngle = bottomRange[0];
  const maxAngle = topRange[1];
  const range = maxAngle - minAngle;
  
  const progress = ((currentAngle - minAngle) / range) * 100;
  
  const inBottom = currentAngle >= bottomRange[0] && currentAngle <= bottomRange[1];
  const inTop = currentAngle >= topRange[0] && currentAngle <= topRange[1];
  
  let zone: AngleProgressResult['zone'];
  if (inBottom) {
    zone = 'bottom';
  } else if (inTop) {
    zone = 'top';
  } else if (currentAngle < bottomRange[0] || currentAngle > topRange[1]) {
    zone = 'outside';
  } else {
    zone = 'middle';
  }
  
  return {
    progress: Math.max(0, Math.min(100, progress)),
    zone,
    inOptimalZone: inBottom || inTop,
  };
}

export function AngleProgressIndicator({
  currentAngle,
  bottomAngleRange,
  topAngleRange,
  currentPhase,
}: AngleProgressIndicatorProps) {
  const angleInfo = useMemo(() => {
    if (currentAngle === null) return null;
    return calculateAngleProgress(currentAngle, bottomAngleRange, topAngleRange);
  }, [currentAngle, bottomAngleRange, topAngleRange]);

  if (currentAngle === null || !angleInfo) {
    return (
      <div className="bg-muted/50 rounded-lg p-4 text-center text-muted-foreground text-sm">
        Position yourself in view to start tracking
      </div>
    );
  }

  const { progress, zone, inOptimalZone } = angleInfo;

  // Determine colors based on zone
  const getZoneColor = () => {
    switch (zone) {
      case 'bottom':
      case 'top':
        return 'bg-success';
      case 'middle':
        return 'bg-warning';
      case 'outside':
        return 'bg-destructive';
    }
  };

  const getTextColor = () => {
    switch (zone) {
      case 'bottom':
      case 'top':
        return 'text-success';
      case 'middle':
        return 'text-warning';
      case 'outside':
        return 'text-destructive';
    }
  };

  // Calculate zone positions for visual markers
  const bottomZoneStart = 0;
  const bottomZoneEnd = ((bottomAngleRange[1] - bottomAngleRange[0]) / (topAngleRange[1] - bottomAngleRange[0])) * 100;
  const topZoneStart = ((topAngleRange[0] - bottomAngleRange[0]) / (topAngleRange[1] - bottomAngleRange[0])) * 100;
  const topZoneEnd = 100;

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      {/* Header with current angle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Current Angle</span>
          {inOptimalZone && <Check className="w-4 h-4 text-success" />}
        </div>
        <div className={`text-2xl font-bold ${getTextColor()}`}>
          {currentAngle}°
        </div>
      </div>

      {/* Progress bar with zone markers */}
      <div className="relative">
        {/* Zone indicators - background layer */}
        <div className="absolute inset-0 flex h-4 rounded-full overflow-hidden">
          {/* Bottom zone (contracted) */}
          <div 
            className="bg-success/30"
            style={{ width: `${bottomZoneEnd}%` }}
          />
          {/* Middle zone (transition) */}
          <div 
            className="bg-muted"
            style={{ width: `${topZoneStart - bottomZoneEnd}%` }}
          />
          {/* Top zone (extended) */}
          <div 
            className="bg-success/30"
            style={{ width: `${topZoneEnd - topZoneStart}%` }}
          />
        </div>
        
        {/* Current position indicator */}
        <div className="relative h-4">
          <div 
            className={`absolute top-0 h-4 w-1 rounded-full ${getZoneColor()} transition-all duration-150 z-10`}
            style={{ 
              left: `calc(${progress}% - 2px)`,
            }}
          />
          {/* Glow effect for current position */}
          <div 
            className={`absolute top-0 h-4 w-3 rounded-full ${getZoneColor()} opacity-50 blur-sm transition-all duration-150`}
            style={{ 
              left: `calc(${progress}% - 6px)`,
            }}
          />
        </div>
      </div>

      {/* Range labels */}
      <div className="flex justify-between text-xs">
        <div className="text-center">
          <div className="font-medium text-muted-foreground">BOTTOM</div>
          <div className="text-foreground">{bottomAngleRange[0]}° - {bottomAngleRange[1]}°</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-muted-foreground">TOP</div>
          <div className="text-foreground">{topAngleRange[0]}° - {topAngleRange[1]}°</div>
        </div>
      </div>

      {/* Status row */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          {inOptimalZone ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <AlertCircle className="w-4 h-4 text-warning" />
          )}
          <span className={`text-sm font-medium ${inOptimalZone ? 'text-success' : 'text-warning'}`}>
            {inOptimalZone ? 'In Range' : zone === 'outside' ? 'Outside Range' : 'Transitioning'}
          </span>
        </div>
        <div className="text-xs text-muted-foreground capitalize">
          Phase: {currentPhase}
        </div>
      </div>
    </div>
  );
}
