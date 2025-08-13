import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Target, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Timer,
  Newspaper,
  Plus,
  Edit,
  Save,
  Trash2
} from "lucide-react";
import { useTimer } from "@/hooks/use-timer";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Paper as PaperData } from "@/lib/syllabus-templates";

interface TimeSlot {
  id: number;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  task: string;
  subject: string;
  completed: boolean;
}

interface DashboardProps {
  timer: ReturnType<typeof useTimer>;
  onViewChange: (view: string) => void;
  syllabusData: PaperData[];
  tasks: TimeSlot[];
  setTasks: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  streakCount: number;
  setStreakCount: (value: number) => void;
  setLastCompletedDate: (value: string) => void;
}

const Dashboard = ({ timer, onViewChange, syllabusData, tasks: timeSlots, setTasks: setTimeSlots, streakCount, setStreakCount, setLastCompletedDate }: DashboardProps) => {
  const { isTimerRunning, currentSession, focusTime, toggleTimer, resetTimer, formatTime } = timer;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [focusTask, setFocusTask] = useLocalStorage("focusTask", "The core principles of Indian foreign policy.");
  const [isEditingFocus, setIsEditingFocus] = useState(false);
  const [editedFocusTask, setEditedFocusTask] = useState(focusTask);
  const [editingSlotId, setEditingSlotId] = useState<number | null>(null);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const calculateProgress = (paperId: string) => {
    const paper = syllabusData.find(p => p.id === paperId);
    if (!paper) return 0;
    const allTopics = paper.subjects.flatMap(s => s.topics);
    if (allTopics.length === 0) return 0;
    const completedTopics = allTopics.filter(t => t.status === 'completed').length;
    return Math.round((completedTopics / allTopics.length) * 100);
  };

  const overallProgress = useMemo(() => {
    const allTopics = syllabusData.flatMap(p => p.subjects.flatMap(s => s.topics));
    if (allTopics.length === 0) return 0;
    const completedTopics = allTopics.filter(t => t.status === 'completed').length;
    return Math.round((completedTopics / allTopics.length) * 100);
  }, [syllabusData]);

  const syllabusProgress = {
    prelims: calculateProgress('prelims'),
    mains: calculateProgress('mains'),
    overall: overallProgress,
  };

  const currentAffairs = [
    "India's G20 Presidency: Key Outcomes and Initiatives",
    "New Education Policy Implementation Progress",
    "Digital India Mission: Latest Developments",
    "Climate Change Action Plan Updates",
    "Economic Survey Highlights 2024"
  ];
  
  const handleFocusEdit = () => {
    if (isEditingFocus) setFocusTask(editedFocusTask);
    setIsEditingFocus(!isEditingFocus);
  };
  
  const addTimeSlot = () => {
    setTimeSlots(prevSlots => {
      const lastSlot = prevSlots[prevSlots.length - 1];
      const newStartTime = lastSlot ? lastSlot.endTime : "09:00";
      const [h, m] = newStartTime.split(':').map(Number);
      const newEndTime = `${(h + 1).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  
      const newSlot: TimeSlot = {
        id: Date.now(),
        startTime: newStartTime,
        endTime: newEndTime,
        task: "New Task",
        subject: "Subject",
        completed: false,
      };
      setEditingSlotId(newSlot.id);
      return [...prevSlots, newSlot];
    });
  };

  const updateSlot = (id: number, updatedData: Partial<TimeSlot>) => {
    setTimeSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.id === id ? { ...slot, ...updatedData } : slot
      )
    );
  };
  
  const deleteSlot = (id: number) => {
    setTimeSlots(prevSlots => prevSlots.filter(slot => slot.id !== id));
  };

  const handleResetStreak = () => {
    setStreakCount(0);
    setLastCompletedDate("");
  };

  const TimeSlotCard = ({ slot }: { slot: TimeSlot }) => {
    const isEditing = editingSlotId === slot.id;

    if (isEditing) {
      return (
        <div className="bg-card p-3 rounded-lg border-2 border-primary space-y-2">
          <Input 
            value={slot.task} 
            onChange={(e) => updateSlot(slot.id, { task: e.target.value })}
            className="text-sm font-bold h-8"
            placeholder="Task Name"
          />
          <Input 
            value={slot.subject} 
            onChange={(e) => updateSlot(slot.id, { subject: e.target.value })}
            className="text-xs h-7"
            placeholder="Subject"
          />
          <div className="flex items-center space-x-2">
            <Input type="time" value={slot.startTime} onChange={(e) => updateSlot(slot.id, { startTime: e.target.value })} className="h-8"/>
            <span className="text-muted-foreground">-</span>
            <Input type="time" value={slot.endTime} onChange={(e) => updateSlot(slot.id, { endTime: e.target.value })} className="h-8"/>
          </div>
          <Button onClick={() => setEditingSlotId(null)} size="sm" className="w-full"><Save className="w-4 h-4 mr-2" /> Save</Button>
        </div>
      );
    }

    return (
      <div 
        className={`p-3 rounded-lg flex items-center space-x-3 transition-all ${slot.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/50'}`}
      >
        <div className="flex-1 cursor-pointer" onClick={() => updateSlot(slot.id, { completed: !slot.completed })}>
          <div className="flex items-center space-x-2">
             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer flex-shrink-0 ${slot.completed ? 'bg-progress border-progress' : 'border-muted-foreground hover:border-primary'}`} >
              {slot.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            <p className={`font-semibold text-sm ${slot.completed ? 'line-through text-muted-foreground' : ''}`}>{slot.task}</p>
          </div>
          <div className="pl-7">
            <p className={`text-xs text-muted-foreground ${slot.completed ? 'line-through' : ''}`}>{slot.subject}</p>
            <p className="text-xs text-muted-foreground mt-1">{slot.startTime} - {slot.endTime}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingSlotId(slot.id)}><Edit className="w-4 h-4"/></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteSlot(slot.id)}><Trash2 className="w-4 h-4"/></Button>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, Arjun! 🎯
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-1">
            {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start space-x-4">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-md sm:text-lg font-semibold text-foreground mb-2">Today's Focus</h3>
                  <Button variant="ghost" size="icon" onClick={handleFocusEdit} className="h-8 w-8">
                    {isEditingFocus ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </Button>
                </div>
                {isEditingFocus ? (
                  <Input 
                    type="text" 
                    value={editedFocusTask} 
                    onChange={(e) => setEditedFocusTask(e.target.value)} 
                    className="text-foreground/80 text-base sm:text-lg leading-relaxed italic"
                  />
                ) : (
                  <p className="text-foreground/80 text-base sm:text-lg leading-relaxed italic">
                    "{focusTask}"
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 pt-4 sm:pt-5">
            <CardTitle className="text-md sm:text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-progress" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 sm:pb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Tasks Completed</span>
                <span className="text-lg sm:text-xl font-bold text-progress">{timeSlots.filter(t => t.completed).length}/{timeSlots.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Study Hours</span>
                <span className="text-lg sm:text-xl font-bold text-primary">3.5h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Current Streak</span>
                <span className="text-lg sm:text-xl font-bold text-warning">{streakCount} days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-md sm:text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Today's Plan
            </CardTitle>
            <Button onClick={addTimeSlot} size="sm"><Plus className="w-4 h-4 mr-2"/>Add Slot</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeSlots.map(slot => <TimeSlotCard key={slot.id} slot={slot} />)}
               {timeSlots.length === 0 && (
                <div className="text-center text-muted-foreground py-10 border-dashed border-2 rounded-lg">
                  <p>No tasks planned.</p>
                  <p className="text-sm">Click "Add Slot" to begin.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-md sm:text-lg flex items-center"><Timer className="w-5 h-5 mr-2 text-focus" />Focus Timer</CardTitle></CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-5xl sm:text-6xl font-mono font-bold text-focus mb-2">{formatTime(currentSession)}</div>
              <Progress value={(1 - currentSession / focusTime) * 100} className="h-2" />
            </div>
            <div className="flex justify-center space-x-2">
              <Button onClick={toggleTimer} variant={isTimerRunning ? "secondary" : "default"} className="px-6">{isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</Button>
              <Button onClick={resetTimer} variant="outline" size="icon"><RotateCcw className="w-4 h-4" /></Button>
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={() => onViewChange('focus')}>Full Screen Mode</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-md sm:text-lg flex items-center"><BookOpen className="w-5 h-5 mr-2 text-info" />Syllabus Progress</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium">Prelims</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{syllabusProgress.prelims}%</span>
                </div>
                <Progress value={syllabusProgress.prelims} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium">Mains</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{syllabusProgress.mains}%</span>
                </div>
                <Progress value={syllabusProgress.mains} className="h-2" />
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base sm:text-lg font-semibold">Overall Progress</span>
                  <span className="text-base sm:text-lg font-bold text-info">{syllabusProgress.overall}%</span>
                </div>
                <Progress value={syllabusProgress.overall} className="h-3" />
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={() => onViewChange('syllabus')}>View Detailed Progress</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-md sm:text-lg flex items-center"><Newspaper className="w-5 h-5 mr-2 text-warning" />Today's Current Affairs</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentAffairs.map((news, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <p className="text-sm text-foreground hover:text-warning transition-colors">{news}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
            <Button variant="outline">View All News</Button>
            <Badge variant="secondary">5 new articles today</Badge>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button variant="destructive" onClick={handleResetStreak}>Reset Streak</Button>
      </div>
    </div>
  );
};

export default Dashboard;