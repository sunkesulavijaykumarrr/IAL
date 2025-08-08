import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import SyllabusNavigator from "@/components/SyllabusNavigator";
import FocusMode from "@/components/FocusMode";
import { useTimer } from "@/hooks/use-timer";

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

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [syllabusData, setSyllabusData] = useState<Paper[]>([]);
  
  const timer = useTimer();

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
        return <Dashboard timer={timer} onViewChange={setCurrentView} />;
      case 'syllabus':
        return <SyllabusNavigator syllabusData={syllabusData} setSyllabusData={setSyllabusData} />;
      case 'focus':
        return <FocusMode timer={timer} />;
      default:
        return <Dashboard timer={timer} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView}
          syllabusProgress={calculateOverallProgress()}
        />
      </div>
      
      <div className="pt-32 animate-fade-in">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default Index;
