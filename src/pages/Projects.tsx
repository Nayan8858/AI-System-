import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Folder, Download, Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

interface Project {
  id: string;
  name: string;
  description: string;
  created: string;
  chats: number;
  images: number;
  files: number;
  progress: number;
}

const Projects = () => {
  const isMobile = useIsMobile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nayandeep_projects');
    if (stored) {
      setProjects(JSON.parse(stored));
    }
  }, []);

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem('nayandeep_projects', JSON.stringify(updated));
  };

  const createProject = () => {
    if (!newProject.name.trim()) {
      toast({ title: "Error", description: "Project name is required", variant: "destructive" });
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      created: new Date().toISOString(),
      chats: 0,
      images: 0,
      files: 0,
      progress: 0
    };

    saveProjects([...projects, project]);
    setNewProject({ name: '', description: '' });
    setDialogOpen(false);
    toast({ title: "Success", description: "Project created successfully!" });
  };

  const deleteProject = (id: string) => {
    saveProjects(projects.filter(p => p.id !== id));
    toast({ title: "Deleted", description: "Project removed" });
  };

  const exportProject = (project: Project) => {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}.json`;
    a.click();
    toast({ title: "Exported", description: `${project.name} exported successfully` });
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border h-14 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
            <span className="font-semibold">Projects</span>
          </div>
        </div>

        <AppSidebar />

        <div className="flex-1 pt-14 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">My Projects</h1>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Project Name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                    <Button onClick={createProject} className="w-full">Create</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {projects.length === 0 ? (
              <Card className="glass p-12 text-center">
                <Folder className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first project to organize your work</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="truncate">{project.name}</span>
                          <Folder className="w-5 h-5 text-primary" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description || 'No description'}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{project.chats}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-4 h-4" />
                            <span>{project.images}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{project.files}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => exportProject(project)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteProject(project.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Projects;
