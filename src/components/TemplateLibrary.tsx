import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface Template {
  icon: string;
  title: string;
  prompt: string;
  gradient: string;
}

const templates: Template[] = [
  { icon: '💼', title: 'Create Resume', prompt: 'Help me create a professional resume', gradient: 'from-blue-500/20 to-cyan-500/20' },
  { icon: '🎥', title: 'YouTube Script', prompt: 'Write a YouTube video script about', gradient: 'from-red-500/20 to-pink-500/20' },
  { icon: '🌐', title: 'Landing Page', prompt: 'Build a landing page with HTML, CSS for', gradient: 'from-purple-500/20 to-indigo-500/20' },
  { icon: '🎨', title: 'Logo Design', prompt: 'Design a logo concept for', gradient: 'from-yellow-500/20 to-orange-500/20' },
  { icon: '🧠', title: 'Science Report', prompt: 'Write a science project report on', gradient: 'from-green-500/20 to-teal-500/20' },
  { icon: '📧', title: 'Email Writer', prompt: 'Write a professional email about', gradient: 'from-pink-500/20 to-rose-500/20' },
];

interface TemplateLibraryProps {
  onSelectTemplate: (prompt: string) => void;
}

export const TemplateLibrary = ({ onSelectTemplate }: TemplateLibraryProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">AI Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Card
              className={`glass cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${template.gradient}`}
              onClick={() => onSelectTemplate(template.prompt)}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className="text-4xl">{template.icon}</div>
                <h3 className="font-semibold">{template.title}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
