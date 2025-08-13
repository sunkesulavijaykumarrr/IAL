import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { templateCategories, Paper } from "@/lib/syllabus-templates";
import { Rocket } from "lucide-react";

interface TemplateLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelect: (template: Paper[]) => void;
  onStartFromScratch: () => void;
}

export const TemplateLibraryDialog = ({
  open,
  onOpenChange,
  onTemplateSelect,
  onStartFromScratch,
}: TemplateLibraryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Rocket className="w-6 h-6 mr-2" />
            Choose Your Roadmap
          </DialogTitle>
          <DialogDescription>
            Select a pre-built template to get started, or build your own from scratch.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto p-4">
          {templateCategories.map((category) => (
            <div key={category.name}>
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.templates.map((template) => (
                  <Card
                    key={template.id}
                    className="hover:shadow-lg hover:border-primary transition-all cursor-pointer"
                    onClick={() => {
                      onTemplateSelect(template.data);
                      onOpenChange(false);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {template.data.reduce((acc, paper) => acc + paper.subjects.reduce((sAcc, sub) => sAcc + sub.topics.length, 0), 0)} topics
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Button
            variant="outline"
            onClick={() => {
              onStartFromScratch();
              onOpenChange(false);
            }}
          >
            Start with a Blank Roadmap
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};