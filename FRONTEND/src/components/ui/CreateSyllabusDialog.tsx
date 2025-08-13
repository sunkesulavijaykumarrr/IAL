import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Topic {
  id: string;
  name: string;
  estimatedHours: number;
}

interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

interface Paper {
  id: string;
  name: string;
  subjects: Subject[];
}

interface CreateSyllabusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSyllabusCreate: (papers: Paper[]) => void;
}

export const CreateSyllabusDialog = ({ open, onOpenChange, onSyllabusCreate }: CreateSyllabusDialogProps) => {
  const [papers, setPapers] = useState<Paper[]>([]);

  const handleAddPaper = () => {
    setPapers([...papers, { id: `paper-${Date.now()}`, name: "", subjects: [] }]);
  };

  const handleRemovePaper = (paperId: string) => {
    setPapers(papers.filter((p) => p.id !== paperId));
  };

  const handleAddSubject = (paperId: string) => {
    setPapers(
      papers.map((p) =>
        p.id === paperId ? { ...p, subjects: [...p.subjects, { id: `subject-${Date.now()}`, name: "", topics: [] }] } : p
      )
    );
  };

  const handleRemoveSubject = (paperId: string, subjectId: string) => {
    setPapers(
      papers.map((p) =>
        p.id === paperId ? { ...p, subjects: p.subjects.filter((s) => s.id !== subjectId) } : p
      )
    );
  };

  const handleAddTopic = (paperId: string, subjectId: string) => {
    setPapers(
      papers.map((p) =>
        p.id === paperId
          ? {
              ...p,
              subjects: p.subjects.map((s) =>
                s.id === subjectId
                  ? { ...s, topics: [...s.topics, { id: `topic-${Date.now()}`, name: "", estimatedHours: 0 }] }
                  : s
              ),
            }
          : p
      )
    );
  };

  const handleRemoveTopic = (paperId: string, subjectId: string, topicId: string) => {
    setPapers(
      papers.map((p) =>
        p.id === paperId
          ? {
              ...p,
              subjects: p.subjects.map((s) =>
                s.id === subjectId ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) } : s
              ),
            }
          : p
      )
    );
  };

  const handlePaperChange = (paperId: string, name: string) => {
    setPapers(papers.map((p) => (p.id === paperId ? { ...p, name } : p)));
  };

  const handleSubjectChange = (paperId: string, subjectId: string, name: string) => {
    setPapers(
      papers.map((p) =>
        p.id === paperId
          ? {
              ...p,
              subjects: p.subjects.map((s) => (s.id === subjectId ? { ...s, name } : s)),
            }
          : p
      )
    );
  };

  const handleTopicChange = (paperId: string, subjectId: string, topicId: string, name: string, estimatedHours: number) => {
    setPapers(
      papers.map((p) =>
        p.id === paperId
          ? {
              ...p,
              subjects: p.subjects.map((s) =>
                s.id === subjectId
                  ? {
                      ...s,
                      topics: s.topics.map((t) => (t.id === topicId ? { ...t, name, estimatedHours } : t)),
                    }
                  : s
              ),
            }
          : p
      )
    );
  };

  const handleSave = () => {
    onSyllabusCreate(papers);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Custom Syllabus</DialogTitle>
          <DialogDescription>
            Build your own syllabus structure by adding papers, subjects, and topics.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
          {papers.map((paper) => (
            <div key={paper.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center gap-2">
                <Label htmlFor={`paper-${paper.id}`} className="text-lg font-semibold">
                  Paper
                </Label>
                <Input
                  id={`paper-${paper.id}`}
                  value={paper.name}
                  onChange={(e) => handlePaperChange(paper.id, e.target.value)}
                  placeholder="e.g., General Studies 1"
                  className="flex-grow"
                />
                <Button variant="outline" size="icon" onClick={() => handleRemovePaper(paper.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="ml-6 space-y-4">
                {paper.subjects.map((subject) => (
                  <div key={subject.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`subject-${subject.id}`} className="font-semibold">
                        Subject
                      </Label>
                      <Input
                        id={`subject-${subject.id}`}
                        value={subject.name}
                        onChange={(e) => handleSubjectChange(paper.id, subject.id, e.target.value)}
                        placeholder="e.g., Indian History"
                        className="flex-grow"
                      />
                      <Button variant="outline" size="icon" onClick={() => handleRemoveSubject(paper.id, subject.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="ml-6 space-y-2">
                      {subject.topics.map((topic) => (
                        <div key={topic.id} className="flex items-center gap-2">
                          <Input
                            value={topic.name}
                            onChange={(e) =>
                              handleTopicChange(paper.id, subject.id, topic.id, e.target.value, topic.estimatedHours)
                            }
                            placeholder="e.g., Ancient History"
                            className="flex-grow"
                          />
                          <Input
                            type="number"
                            value={topic.estimatedHours}
                            onChange={(e) =>
                              handleTopicChange(
                                paper.id,
                                subject.id,
                                topic.id,
                                topic.name,
                                parseInt(e.target.value, 10)
                              )
                            }
                            placeholder="Hours"
                            className="w-24"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveTopic(paper.id, subject.id, topic.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => handleAddTopic(paper.id, subject.id)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Topic
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => handleAddSubject(paper.id)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subject
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddPaper}>
            <Plus className="w-4 h-4 mr-2" />
            Add Paper
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Syllabus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};