import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Lightbulb } from "lucide-react";

interface ExampleIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'image' | 'code' | 'text';
  onSelectIdea: (idea: string) => void;
}

const ideas = {
  image: [
    "Create a sunset over mountains with vibrant colors",
    "Generate a futuristic city skyline at night",
    "Design a minimalist logo with geometric shapes",
    "Create a tropical beach scene with palm trees",
    "Generate a sci-fi space station wallpaper"
  ],
  code: [
    "Generate a responsive portfolio website with HTML, CSS, and JavaScript",
    "Create a Python calculator with a graphical interface",
    "Build a to-do list app with local storage",
    "Generate a weather dashboard using API",
    "Create an animated landing page with parallax effect"
  ],
  text: [
    "Summarize the benefits of AI in healthcare",
    "Explain quantum computing in simple terms",
    "Summarize the history of the internet",
    "Explain how blockchain technology works",
    "Summarize the key principles of machine learning"
  ]
};

export const ExampleIdeasModal = ({ isOpen, onClose, type, onSelectIdea }: ExampleIdeasModalProps) => {
  const currentIdeas = ideas[type];

  const handleSelectIdea = (idea: string) => {
    onSelectIdea(idea);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="w-5 h-5 text-primary" />
            Try one of these ideas
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 py-4">
          {currentIdeas.map((idea, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all"
              onClick={() => handleSelectIdea(idea)}
            >
              <span className="text-primary font-semibold mr-2">{index + 1}.</span>
              <span className="text-sm">{idea}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
