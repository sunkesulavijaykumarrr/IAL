import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Target,
  Plus,
  Rocket,
  ClipboardList,
  Trash2,
  Edit
} from "lucide-react";
import { CreateSyllabusDialog } from "@/components/ui/CreateSyllabusDialog";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { TemplateLibraryDialog } from "@/components/ui/TemplateLibraryDialog";
import { Paper as PaperData } from "@/lib/syllabus-templates";

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

interface SyllabusNavigatorProps {
    syllabusData: Paper[];
    setSyllabusData: React.Dispatch<React.SetStateAction<Paper[]>>;
}

const SyllabusNavigator = ({ syllabusData, setSyllabusData }: SyllabusNavigatorProps) => {
  const [isCreateSyllabusOpen, setIsCreateSyllabusOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const calculateProgress = (topics: Topic[]) => {
    if (topics.length === 0) return 0;
    const completed = topics.filter(t => t.status === 'completed').length;
    return Math.round((completed / topics.length) * 100);
  };

  const togglePaper = (paperId: string) => {
    setSyllabusData(prev => prev.map(paper => 
      paper.id === paperId ? { ...paper, isOpen: !paper.isOpen } : paper
    ));
  };

  const toggleSubject = (paperId: string, subjectId: string) => {
    setSyllabusData(prev => prev.map(paper => 
      paper.id === paperId 
        ? {
            ...paper,
            subjects: paper.subjects.map(subject =>
              subject.id === subjectId ? { ...subject, isOpen: !subject.isOpen } : subject
            )
          }
        : paper
    ));
  };

  const toggleTopicStatus = (paperId: string, subjectId: string, topicId: string) => {
    setSyllabusData(prev => prev.map(paper => 
      paper.id === paperId 
        ? {
            ...paper,
            subjects: paper.subjects.map(subject =>
              subject.id === subjectId 
                ? {
                    ...subject,
                    topics: subject.topics.map(topic =>
                      topic.id === topicId 
                        ? { ...topic, status: topic.status === 'completed' ? 'not-started' : 'completed' } 
                        : topic
                    )
                  }
                : subject
            )
          }
        : paper
    ));
  };

  const handleSyllabusCreate = (newSyllabus: Paper[]) => {
    const formattedSyllabus = newSyllabus.map(paper => ({
      ...paper,
      isOpen: true,
      subjects: paper.subjects.map(subject => ({
        ...subject,
        isOpen: true,
        topics: subject.topics.map(topic => ({
          ...topic,
          status: 'not-started' as const,
          completedHours: 0,
        })),
      })),
    }));
    setSyllabusData(formattedSyllabus);
    setIsEditing(false);
  };
  
  const handleDeleteRoadmap = () => {
    setSyllabusData([]);
    setIsDeleteConfirmOpen(false);
  }

  const handleEdit = () => {
    setIsEditing(true);
    setIsCreateSyllabusOpen(true);
  }

  const handleTemplateSelect = (template: PaperData[]) => {
    const formattedTemplate = template.map(paper => ({
      ...paper,
      subjects: paper.subjects.map(subject => ({
        ...subject,
        topics: subject.topics.map(topic => ({
          ...topic,
          status: 'not-started' as const,
          completedHours: 0
        }))
      }))
    }));
    handleSyllabusCreate(formattedTemplate as Paper[]);
  }

  const handleStartFromScratch = () => {
    setIsEditing(false);
    setIsCreateSyllabusOpen(true);
  }

  const overallStats = syllabusData.reduce((acc, paper) => {
    const allTopics = paper.subjects.flatMap(s => s.topics);
    acc.total += allTopics.length;
    acc.completed += allTopics.filter(t => t.status === 'completed').length;
    return acc;
  }, { total: 0, completed: 0 });

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      <TemplateLibraryDialog
        open={isTemplateLibraryOpen}
        onOpenChange={setIsTemplateLibraryOpen}
        onTemplateSelect={handleTemplateSelect}
        onStartFromScratch={handleStartFromScratch}
      />
      <CreateSyllabusDialog 
        open={isCreateSyllabusOpen} 
        onOpenChange={setIsCreateSyllabusOpen}
        onSyllabusCreate={handleSyllabusCreate}
        initialData={isEditing ? syllabusData : undefined}
      />
      <ConfirmationDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleDeleteRoadmap}
        title="Are you sure?"
        description="This will permanently delete your entire roadmap. This action cannot be undone."
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Rocket className="w-8 h-8 mr-3 text-blue-500" />
            Your Roadmap to Success
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and track custom learning paths for any goal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {syllabusData.length > 0 && (
             <Button variant="outline" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Roadmap
            </Button>
          )}
          <Button onClick={() => setIsTemplateLibraryOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Roadmap
          </Button>
           {syllabusData.length > 0 && (
            <Button variant="destructive" onClick={() => setIsDeleteConfirmOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Roadmap
            </Button>
          )}
        </div>
      </div>

      {syllabusData.length === 0 ? (
        <div className="text-center py-20">
          <Card className="max-w-lg mx-auto p-8 border-2 border-dashed">
            <Rocket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground">Start Your Journey</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              You haven't created a roadmap yet. Build your personalized plan to achieve your goals, one step at a time.
            </p>
            <Button size="lg" onClick={() => setIsTemplateLibraryOpen(true) }>
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Roadmap
            </Button>
          </Card>
        </div>
      ) : (
        <>
          {/* Overall Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Topics</p>
                    <p className="text-2xl font-bold text-foreground">{overallStats.total}</p>
                  </div>
                  <ClipboardList className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-500">{overallStats.completed}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Syllabus Structure */}
          <div className="space-y-4">
            {syllabusData.map((paper) => {
              const paperProgress = calculateProgress(paper.subjects.flatMap(s => s.topics));
              
              return (
                <Card key={paper.id}>
                  <Collapsible open={paper.isOpen} onOpenChange={() => togglePaper(paper.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center text-xl">
                            {paper.isOpen ? <ChevronDown className="w-5 h-5 mr-2" /> : <ChevronRight className="w-5 h-5 mr-2" />}
                            {paper.name}
                            <Badge variant="outline" className="ml-3">
                              {paper.subjects.flatMap(s => s.topics).length} topics
                            </Badge>
                          </CardTitle>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-muted-foreground">{paperProgress}%</span>
                            <Progress value={paperProgress} className="w-24 h-2" />
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {paper.subjects.map((subject) => {
                            const subjectProgress = calculateProgress(subject.topics);
                            
                            return (
                              <Card key={subject.id} className="border-l-4 border-l-blue-500/30">
                                <Collapsible open={subject.isOpen} onOpenChange={() => toggleSubject(paper.id, subject.id)}>
                                  <CollapsibleTrigger asChild>
                                    <CardHeader className="hover:bg-muted/50 transition-colors cursor-pointer py-3">
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center text-lg">
                                          {subject.isOpen ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                                          {subject.name}
                                          <Badge variant="secondary" className="ml-2 text-xs">
                                            {subject.topics.length} topics
                                          </Badge>
                                        </CardTitle>
                                        <div className="flex items-center space-x-3">
                                          <span className="text-sm text-muted-foreground">{subjectProgress}%</span>
                                          <Progress value={subjectProgress} className="w-20 h-2" />
                                        </div>
                                      </div>
                                    </CardHeader>
                                  </CollapsibleTrigger>
                                  
                                  <CollapsibleContent>
                                    <CardContent className="pt-0">
                                      <div className="space-y-2">
                                        {subject.topics.map((topic) => (
                                          <div 
                                            key={topic.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                                          >
                                            <div className="flex items-center space-x-3">
                                               <Checkbox
                                                id={topic.id}
                                                checked={topic.status === 'completed'}
                                                onCheckedChange={() => toggleTopicStatus(paper.id, subject.id, topic.id)}
                                              />
                                              <label
                                                htmlFor={topic.id}
                                                className={`font-medium text-sm transition-colors ${
                                                  topic.status === 'completed' ? 'text-muted-foreground line-through' : ''
                                                }`}
                                              >
                                                {topic.name}
                                              </label>
                                            </div>
                                            {topic.estimatedHours && (
                                              <p className="text-xs text-muted-foreground">
                                                {topic.estimatedHours} hours
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </CollapsibleContent>
                                </Collapsible>
                              </Card>
                            );
                          })}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SyllabusNavigator;