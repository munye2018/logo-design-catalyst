import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useGlobalContext } from '@/context/GlobalContext';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { audioFeedback } from '@/lib/audioFeedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Camera, CameraOff, AlertCircle, CheckCircle, Info, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { analyzeMovement, getExerciseType, getAnalyzableExercises, type ExerciseType } from '@/lib/exerciseRules';
import { exerciseRepConfigs } from '@/lib/repCounter';

export default function Analysis() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { program, currentWeek, feedbackHistory, addFeedback, clearFeedback } = useGlobalContext();
  
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>('squat');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [repFlash, setRepFlash] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Handle rep completion with audio
  const handleRepComplete = useCallback(() => {
    if (audioEnabled) {
      audioFeedback.playRepComplete();
    }
  }, [audioEnabled]);

  const session = program?.[currentWeek]?.sessions[0];
  const exercises = session?.exercises || [];

  // Initialize selected exercise from URL param
  useEffect(() => {
    if (exerciseId && exercises[parseInt(exerciseId)]) {
      const exercise = exercises[parseInt(exerciseId)];
      setSelectedExercise(getExerciseType(exercise.name));
    }
  }, [exerciseId, exercises]);

  // Pose detection hook with rep counting
  const { isLoading, isDetecting, keypoints, error, repState, resetReps } = usePoseDetection({
    webcamRef,
    canvasRef,
    enabled: cameraEnabled,
    exerciseType: selectedExercise,
    onRepComplete: handleRepComplete,
  });

  // Toggle audio feedback
  const handleAudioToggle = useCallback(() => {
    setAudioEnabled((prev) => {
      const newValue = !prev;
      audioFeedback.setEnabled(newValue);
      return newValue;
    });
  }, []);

  // Flash effect when rep is counted
  useEffect(() => {
    if (repState.isValidRep) {
      setRepFlash(true);
      const timeout = setTimeout(() => setRepFlash(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [repState.repCount, repState.isValidRep]);

  // Update canvas size to match video
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    if (!container || !canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Analyze movement when we have keypoints
  useEffect(() => {
    if (keypoints && keypoints.length > 0) {
      const feedback = analyzeMovement(keypoints, selectedExercise);
      feedback.forEach((fb) => {
        addFeedback(fb);
      });
    }
  }, [keypoints, selectedExercise, addFeedback]);

  const handleCameraToggle = useCallback(() => {
    if (cameraEnabled) {
      setCameraEnabled(false);
      clearFeedback();
    } else {
      setCameraEnabled(true);
      setCameraError(null);
    }
  }, [cameraEnabled, clearFeedback]);

  const handleCameraError = useCallback(() => {
    setCameraError('Unable to access camera. Please check permissions.');
    setCameraEnabled(false);
  }, []);

  const handleExerciseChange = useCallback((exercise: ExerciseType) => {
    setSelectedExercise(exercise);
    resetReps();
    clearFeedback();
  }, [resetReps, clearFeedback]);

  const getFeedbackIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <Info className="w-4 h-4 text-accent" />;
    }
  };

  // Get analyzable exercises from the rules library
  const exerciseOptions = getAnalyzableExercises();
  
  // Get current exercise config for angle display
  const currentConfig = exerciseRepConfigs[selectedExercise];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Form Analysis</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Exercise Selector */}
        <Card>
          <CardContent className="p-4">
            <label className="block text-sm font-medium mb-2">Select Exercise</label>
            <select
              value={selectedExercise}
              onChange={(e) => handleExerciseChange(e.target.value as ExerciseType)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
            >
              {exerciseOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Rep Counter Display */}
        <Card className={`transition-all duration-150 ${repFlash ? 'ring-4 ring-success bg-success/10' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="text-6xl font-bold text-primary">{repState.repCount}</div>
                <div className="text-sm text-muted-foreground mt-1">REPS</div>
              </div>
              <div className="border-l border-border pl-6 flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phase:</span>
                    <span className="font-medium capitalize">{repState.currentPhase}</span>
                  </div>
                  {repState.currentAngle !== null && currentConfig && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current Angle:</span>
                        <span className="font-medium">{repState.currentAngle}°</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Target Range:</span>
                        <span className="font-medium text-xs">
                          {currentConfig.bottomAngleRange[0]}° - {currentConfig.topAngleRange[1]}°
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAudioToggle}
                className="ml-2"
                title={audioEnabled ? 'Mute audio' : 'Enable audio'}
              >
                {audioEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetReps}
                className="ml-2"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Camera View */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Camera Feed</span>
              <Button
                variant={cameraEnabled ? 'destructive' : 'default'}
                size="sm"
                onClick={handleCameraToggle}
                disabled={isLoading}
              >
                {isLoading ? (
                  'Loading AI...'
                ) : cameraEnabled ? (
                  <>
                    <CameraOff className="w-4 h-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={containerRef}
              className="camera-container bg-muted rounded-lg overflow-hidden mx-auto"
            >
              {cameraEnabled ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored
                    onUserMediaError={handleCameraError}
                    className="w-full h-full object-cover"
                    videoConstraints={{
                      width: 640,
                      height: 480,
                      facingMode: 'user',
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="pose-canvas"
                  />
                  {isDetecting && (
                    <div className="absolute top-2 left-2 bg-success/90 text-success-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Detecting
                    </div>
                  )}
                  {repState.currentAngle !== null && (
                    <div className="absolute top-2 right-2 bg-accent/90 text-accent-foreground px-3 py-1 rounded text-sm font-bold">
                      {repState.currentAngle}°
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/3] flex flex-col items-center justify-center text-muted-foreground">
                  <Camera className="w-16 h-16 mb-4 opacity-50" />
                  <p>Click "Start" to enable camera</p>
                  <p className="text-sm mt-2">Position yourself so your full body is visible</p>
                </div>
              )}
            </div>

            {cameraError && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {cameraError}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Form Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {feedbackHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No corrections needed - great form!</p>
                <p className="text-sm mt-1">Feedback will appear here as you move</p>
              </div>
            ) : (
              <div className="space-y-2">
                {feedbackHistory.slice(-5).reverse().map((fb) => (
                  <div
                    key={fb.id}
                    className={`feedback-item p-3 rounded-lg flex items-start gap-3 ${
                      fb.severity === 'error'
                        ? 'bg-destructive/10'
                        : fb.severity === 'warning'
                        ? 'bg-warning/10'
                        : 'bg-accent/10'
                    }`}
                  >
                    {getFeedbackIcon(fb.severity)}
                    <div>
                      <p className="font-medium text-sm">{fb.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {fb.bodyPart} • {new Date(fb.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Tips for best results:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ensure good lighting in your space</li>
              <li>• Position camera so your full body is visible</li>
              <li>• Wear contrasting clothing against background</li>
              <li>• Perform movements at a moderate pace</li>
              <li>• Complete full range of motion for reps to count</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
