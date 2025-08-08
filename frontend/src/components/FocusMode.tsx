import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX,
  Settings,
  BookOpen,
  Target,
  X,
  CheckCircle2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTimer } from "@/hooks/use-timer";

interface SessionLog {
  id: string;
  duration: number;
  subject: string;
  topic: string;
  date: Date;
  completed: boolean;
}

interface FocusModeProps {
  timer: ReturnType<typeof useTimer>;
}

const FocusMode = ({ timer }: FocusModeProps) => {
  const { isTimerRunning, currentSession, focusTime, toggleTimer, resetTimer, formatTime, setFocusTime, setIsTimerRunning } = timer;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedAmbient, setSelectedAmbient] = useState('none');
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  const durations = [
    { value: 15, label: '15 minutes', seconds: 15 * 60 },
    { value: 25, label: '25 minutes (Pomodoro)', seconds: 25 * 60 },
    { value: 30, label: '30 minutes', seconds: 30 * 60 },
    { value: 45, label: '45 minutes', seconds: 45 * 60 },
    { value: 60, label: '1 hour', seconds: 60 * 60 },
    { value: 90, label: '1.5 hours', seconds: 90 * 60 },
    { value: 120, label: '2 hours', seconds: 120 * 60 }
  ];

  const ambientSounds = [
    { value: 'none', label: 'No Sound' },
    { value: 'rain', label: 'Rain Sounds' },
    { value: 'forest', label: 'Forest Ambience' },
    { value: 'cafe', label: 'Coffee Shop' },
    { value: 'library', label: 'Library Whispers' },
    { value: 'ocean', label: 'Ocean Waves' }
  ];

  const subjects = [
    'History', 'Geography', 'Polity', 'Economics', 'Science & Technology',
    'Environment', 'Current Affairs', 'Essay Writing', 'Ethics', 'Public Administration'
  ];

  const handleSessionComplete = () => {
    setIsTimerRunning(false);
    setShowSessionComplete(true);
    
    if (soundEnabled) {
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(() => {});
    }

    const newSession: SessionLog = {
      id: Date.now().toString(),
      duration: focusTime,
      subject: currentSubject,
      topic: currentTopic,
      date: new Date(),
      completed: true
    };
    setSessions(prev => [newSession, ...prev.slice(0, 9)]);
  };
  
  useEffect(() => {
    if(isTimerRunning && currentSession <= 0) {
      handleSessionComplete();
    }
  }, [currentSession, isTimerRunning])


  const changeDuration = (newDurationValue: string) => {
    const newDurationInSeconds = parseInt(newDurationValue, 10);
    setFocusTime(newDurationInSeconds);
    setIsTimerRunning(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const completeSession = () => {
    setShowSessionComplete(false);
    resetTimer();
  };

  const progress = ((focusTime - currentSession) / focusTime) * 100;

  const FocusContent = () => (
    <div className={`${isFullscreen ? 'min-h-screen bg-gradient-to-br from-upsc-focus/20 to-upsc-primary/20' : ''} flex flex-col justify-center items-center p-8`}>
      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className={`font-mono font-bold mb-4 ${isFullscreen ? 'text-8xl md:text-9xl' : 'text-6xl md:text-7xl'} text-upsc-focus`}>
          {formatTime(currentSession)}
        </div>
        <Progress 
          value={progress} 
          className={`${isFullscreen ? 'w-96 h-4' : 'w-64 h-3'} mx-auto mb-4`}
        />
        <div className="flex items-center justify-center space-x-4 text-muted-foreground">
          <span>{focusTime/60} min session</span>
          {currentSubject && (
            <>
              <span>•</span>
              <span>{currentSubject}</span>
            </>
          )}
          {currentTopic && (
            <>
              <span>•</span>
              <span>{currentTopic}</span>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 mb-8">
        <Button 
          onClick={toggleTimer}
          size={isFullscreen ? "lg" : "default"}
          className={`${isFullscreen ? 'px-8 py-4 text-lg' : 'px-6'} ${isTimerRunning ? 'bg-warning hover:bg-warning/90' : 'bg-upsc-focus hover:bg-upsc-focus/90'}`}
        >
          {isTimerRunning ? (
            <>
              <Pause className={`${isFullscreen ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
              Pause
            </>
          ) : (
            <>
              <Play className={`${isFullscreen ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
              {currentSession === focusTime ? 'Start' : 'Resume'}
            </>
          )}
        </Button>
        
        <Button onClick={resetTimer} variant="outline" size={isFullscreen ? "lg" : "default"}>
          <RotateCcw className={`${isFullscreen ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
          Reset
        </Button>

        {!isFullscreen && (
          <Button onClick={toggleFullscreen} variant="outline">
            <Maximize className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
        )}

        {isFullscreen && (
          <Button onClick={toggleFullscreen} variant="outline" size="lg">
            <Minimize className="w-6 h-6 mr-2" />
            Exit Fullscreen
          </Button>
        )}
      </div>

      {/* Motivational Message */}
      {isTimerRunning && (
        <div className="text-center max-w-md mx-auto">
          <p className={`${isFullscreen ? 'text-xl' : 'text-lg'} text-muted-foreground italic`}>
            "Deep work is like a superpower in our increasingly competitive economy."
          </p>
          <p className={`${isFullscreen ? 'text-base' : 'text-sm'} text-muted-foreground mt-2`}>
            Stay focused. Every minute counts towards your IAS dream.
          </p>
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div ref={fullscreenRef} className="relative min-h-screen bg-background">
        <Button 
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-10"
          variant="outline"
          size="icon"
        >
          <X className="w-4 h-4" />
        </Button>
        <FocusContent />
        
        {/* Session Complete Modal */}
        {showSessionComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Session Complete! 🎉</h3>
                <p className="text-muted-foreground mb-4">
                  Great job! You completed a {focusTime/60}-minute focus session.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm"><strong>Subject:</strong> {currentSubject || 'Not specified'}</p>
                  <p className="text-sm"><strong>Topic:</strong> {currentTopic || 'Not specified'}</p>
                </div>
                <Button onClick={completeSession} className="w-full">
                  Start New Session
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Target className="w-8 h-8 mr-3 text-upsc-focus" />
            Focus Mode
          </h1>
          <p className="text-muted-foreground mt-1">
            Deep work sessions for maximum productivity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Focus Timer */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <FocusContent />
          </Card>
        </div>

        {/* Settings and Session Log */}
        <div className="space-y-6">
          {/* Settings */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Session Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration</label>
                  <Select value={focusTime.toString()} onValueChange={changeDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map(duration => (
                        <SelectItem key={duration.value} value={duration.seconds.toString()}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Select value={currentSubject} onValueChange={setCurrentSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Topic (Optional)</label>
                  <input
                    type="text"
                    value={currentTopic}
                    onChange={(e) => setCurrentTopic(e.target.value)}
                    placeholder="e.g., Medieval Architecture"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Ambient Sound</label>
                  <Select value={selectedAmbient} onValueChange={setSelectedAmbient}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ambientSounds.map(sound => (
                        <SelectItem key={sound.value} value={sound.value}>
                          {sound.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notifications</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Recent Sessions
              </h3>
              
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sessions completed yet. Start your first focus session!
                </p>
              ) : (
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((session) => (
                    <div 
                      key={session.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {session.subject || 'General Study'}
                        </p>
                        {session.topic && (
                          <p className="text-xs text-muted-foreground">{session.topic}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {Math.round(session.duration / 60)} min • {session.date.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-success border-success">
                        ✓ Done
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;