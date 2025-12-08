import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FolderPlus, 
  Folder, 
  FileText, 
  Code, 
  BookOpen, 
  FlaskConical,
  MoreHorizontal,
  Trash2,
  Edit2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Project {
  id: string;
  name: string;
  type: 'research' | 'coding' | 'notes' | 'science';
  createdAt: string;
  items: number;
}

const projectIcons = {
  research: BookOpen,
  coding: Code,
  notes: FileText,
  science: FlaskConical,
};

const projectColors = {
  research: 'text-blue-500 bg-blue-500/10',
  coding: 'text-green-500 bg-green-500/10',
  notes: 'text-yellow-500 bg-yellow-500/10',
  science: 'text-purple-500 bg-purple-500/10',
};

export const ProjectWorkspace: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('nayandeep_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState<Project['type']>('notes');

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('nayandeep_projects', JSON.stringify(updatedProjects));
  };

  const createProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      type: newProjectType,
      createdAt: new Date().toISOString(),
      items: 0,
    };

    saveProjects([...projects, newProject]);
    setNewProjectName('');
    setShowNewProject(false);
    toast({
      title: "Project Created",
      description: `${newProjectName} workspace is ready`,
    });
  };

  const deleteProject = (id: string) => {
    saveProjects(projects.filter(p => p.id !== id));
    toast({
      title: "Project Deleted",
      description: "Workspace removed successfully",
    });
  };

  const projectTypes: { type: Project['type']; label: string }[] = [
    { type: 'research', label: 'Research' },
    { type: 'coding', label: 'Coding' },
    { type: 'notes', label: 'Notes' },
    { type: 'science', label: 'Science' },
  ];

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Folder className="w-4 h-4" />
            <span>Project Workspaces</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowNewProject(true)}
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showNewProject && (
          <div className="mb-4 p-3 rounded-lg bg-muted/30 space-y-3">
            <Input
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {projectTypes.map((pt) => {
                const Icon = projectIcons[pt.type];
                return (
                  <Button
                    key={pt.type}
                    variant={newProjectType === pt.type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewProjectType(pt.type)}
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {pt.label}
                  </Button>
                );
              })}
            </div>
            <div className="flex space-x-2">
              <Button size="sm" onClick={createProject}>Create</Button>
              <Button size="sm" variant="outline" onClick={() => setShowNewProject(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No projects yet. Create one to organize your work.
          </p>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => {
              const Icon = projectIcons[project.type];
              const colorClass = projectColors[project.type];
              return (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.items} items
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
