import { useState, useMemo, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import SyllabusNavigator from "@/components/SyllabusNavigator";
import FocusMode from "@/components/FocusMode";
import { useTimer } from "@/hooks/use-timer";
import { upscTemplate } from "@/lib/syllabus-templates";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Topic {
  id: string;
  name: string;
  status: 'completed' | 'not-started';
  estimatedHours?: number;
  completedHours?: number;
}

interface Subject {
  id: string;
  name:string;
  topics: Topic[];
  isOpen?: boolean;
}

interface Paper {
  id: string;
  name: string;
  subjects: Subject[];
  isOpen?: boolean;
}

interface Task {
  id: number;
  task: string;
  completed: boolean;
  subject: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [syllabusData, setSyllabusData] = useState<Paper[]>(upscTemplate);
  const [tasks, setTasks] = useLocalStorage<Task[]>("dailyTasks", []);
  const [streakCount, setStreakCount] = useLocalStorage("streakCount", 0);
  const [lastCompletedDate, setLastCompletedDate] = useLocalStorage("lastCompletedDate", "");

  const timer = useTimer();

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = lastCompletedDate || today;

    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const allTasksCompleted = tasks.every(task => task.completed);

      if (allTasksCompleted && tasks.length > 0 && lastDate === yesterday.toISOString().slice(0, 10)) {
        // We don't do anything here, the streak is maintained
      } else if (lastDate !== yesterday.toISOString().slice(0, 10)) {
        setStreakCount(0);
      }
      setTasks(tasks.map(task => ({ ...task, completed: false })));
    }
  }, []);

  useEffect(() => {
    const allTasksCompleted = tasks.every(task => task.completed);
    const today = new Date().toISOString().slice(0, 10);

    if (allTasksCompleted && tasks.length > 0 && lastCompletedDate !== today) {
      setStreakCount(prev => prev + 1);
      setLastCompletedDate(today);
    }
  }, [tasks, lastCompletedDate, streakCount, setStreakCount, setLastCompletedDate]);

  const allTopics = useMemo(() => {
    return syllabusData.flatMap(paper => 
      paper.subjects.flatMap(subject => 
        subject.topics.map(topic => ({
          id: topic.id,
          completed: topic.status === 'completed'
        }))
      )
    );
  }, [syllabusData]);

  const calculateOverallProgress = () => {
    if (allTopics.length === 0) return 0;
    const completedTopics = allTopics.filter(topic => topic.completed);
    return Math.round((completedTopics.length / allTopics.length) * 100);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard timer={timer} onViewChange={setCurrentView} syllabusData={syllabusData} tasks={tasks} setTasks={setTasks} streakCount={streakCount} setStreakCount={setStreakCount} setLastCompletedDate={setLastCompletedDate} />;
      case 'syllabus':
        return <SyllabusNavigator syllabusData={syllabusData} setSyllabusData={setSyllabusData} />;
      case 'focus':
        return <FocusMode timer={timer} />;
      default:
        return <Dashboard timer={timer} onViewChange={setCurrentView} syllabusData={syllabusData} tasks={tasks} setTasks={setTasks} streakCount={streakCount} setStreakCount={setStreakCount} setLastCompletedDate={setLastCompletedDate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView}
          syllabusProgress={calculateOverallProgress()}
          streakCount={streakCount}
        />
      </div>
      
      <div className="pt-32 animate-fade-in">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default Index;