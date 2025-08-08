import { useState, useEffect } from "react";
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
  Calendar,
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

interface Task {
  id: number;
  task: string;
  completed: boolean;
  subject: string;
}

interface DashboardProps {
  timer: ReturnType<typeof useTimer>;
  onViewChange: (view: string) => void;
}

const Dashboard = ({ timer, onViewChange }: DashboardProps) => {
  const { isTimerRunning, currentSession, focusTime, toggleTimer, resetTimer, formatTime } = timer;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [focusTask, setFocusTask] = useLocalStorage("focusTask", "The core principles of Indian foreign policy.");
  const [isEditingFocus, setIsEditingFocus] = useState(false);
  const [editedFocusTask, setEditedFocusTask] = useState(focusTask);

  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", [
    { id: 1, task: "Complete NCERT Geography Ch. 5", completed: true, subject: "Geography" },
    { id: 2, task: "Review Polity: Fundamental Rights", completed: false, subject: "Polity" },
    { id: 3, task: "Current Affairs - PIB Summary", completed: false, subject: "Current Affairs" },
    { id: 4, task: "Essay Writing Practice", completed: false, subject: "Essay" },
    { id: 5, task: "Previous Year Questions - Set 2", completed: false, subject: "Practice" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("");

  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  const motivationalQuotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The civil service is about serving the people and making a positive impact.",
    "Every small step you take today brings you closer to your IAS dream.",
    "Consistency beats intensity. Keep moving forward.",
    "Your future self will thank you for the effort you put in today."
  ];

  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const syllabusProgress = {
    prelims: 68,
    mains: 45,
    overall: 56
  };

  const currentAffairs = [
    "India's G20 Presidency: Key Outcomes and Initiatives",
    "New Education Policy Implementation Progress",
    "Digital India Mission: Latest Developments",
    "Climate Change Action Plan Updates",
    "Economic Survey Highlights 2024"
  ];
  
  const handleFocusEdit = () => {
    if (isEditingFocus) {
      setFocusTask(editedFocusTask);
    }
    setIsEditingFocus(!isEditingFocus);
  };
  
  const addTask = () => {
    if (newTask.trim() !== "" && newTaskSubject.trim() !== "") {
      const newTaskObject: Task = {
        id: Date.now(),
        task: newTask,
        completed: false,
        subject: newTaskSubject,
      };
      setTasks([...tasks, newTaskObject]);
      setNewTask("");
      setNewTaskSubject("");
    }
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, Arjun! 🎯
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            {currentTime.toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Top Row - Quote and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-r from-upsc-primary/10 to-upsc-secondary/10 border-upsc-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Target className="w-8 h-8 text-upsc-primary mt-1" />
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Today's Focus</h3>
                  <Button variant="ghost" size="icon" onClick={handleFocusEdit} className="h-8 w-8">
                    {isEditingFocus ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </Button>
                </div>
                {isEditingFocus ? (
                  <Input 
                    type="text" 
                    value={editedFocusTask} 
                    onChange={(e) => setEditedFocusTask(e.target.value)} 
                    className="text-foreground/80 text-lg leading-relaxed italic"
                  />
                ) : (
                  <p className="text-foreground/80 text-lg leading-relaxed italic">
                    "{focusTask}"
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-upsc-progress" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tasks Completed</span>
                <span className="text-xl font-bold text-upsc-progress">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Study Hours</span>
                <span className="text-xl font-bold text-upsc-primary">3.5h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Streak</span>
                <span className="text-xl font-bold text-upsc-secondary">12 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-upsc-primary" />
              Today's Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all hover:bg-muted/50 ${
                    task.completed ? 'bg-success/10 border-success/30' : 'bg-card'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                    task.completed 
                      ? 'bg-success border-success' 
                      : 'border-muted-foreground hover:border-primary'
                  }`} onClick={() => toggleTaskCompletion(task.id)}>
                    {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.task}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {task.subject}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="h-8 w-8">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <Input 
                type="text" 
                placeholder="New task..." 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <Input 
                type="text" 
                placeholder="Subject..." 
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
              />
              <Button className="w-full" onClick={addTask}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Focus Timer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Timer className="w-5 h-5 mr-2 text-upsc-focus" />
              Focus Timer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-6xl font-mono font-bold text-upsc-focus mb-2">
                {formatTime(currentSession)}
              </div>
              <Progress 
                value={(1 - currentSession / focusTime) * 100} 
                className="h-2"
              />
            </div>
            <div className="flex justify-center space-x-2">
              <Button 
                onClick={toggleTimer}
                variant={isTimerRunning ? "secondary" : "default"}
                className="px-6"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="icon">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={() => onViewChange('focus')}>
              Full Screen Mode
            </Button>
          </CardContent>
        </Card>

        {/* Syllabus Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-upsc-progress" />
              Syllabus Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Prelims</span>
                  <span className="text-sm text-muted-foreground">{syllabusProgress.prelims}%</span>
                </div>
                <Progress value={syllabusProgress.prelims} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Mains</span>
                  <span className="text-sm text-muted-foreground">{syllabusProgress.mains}%</span>
                </div>
                <Progress value={syllabusProgress.mains} className="h-2" />
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Overall Progress</span>
                  <span className="text-lg font-bold text-upsc-progress">{syllabusProgress.overall}%</span>
                </div>
                <Progress value={syllabusProgress.overall} className="h-3" />
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Detailed Progress
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Affairs Ticker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="w-5 h-5 mr-2 text-upsc-news" />
            Today's Current Affairs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentAffairs.map((news, index) => (
              <div 
                key={index}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <p className="text-sm text-foreground hover:text-upsc-news transition-colors">
                  {news}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline">
              View All News
            </Button>
            <Badge variant="secondary">
              5 new articles today
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;