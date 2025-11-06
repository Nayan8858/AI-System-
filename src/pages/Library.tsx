import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Trash2, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { toast } from "@/hooks/use-toast";

interface SavedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

const Library = () => {
  const [images, setImages] = useState<SavedImage[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Load saved images from localStorage
    const loadImages = () => {
      try {
        const savedImages = localStorage.getItem('nayandeep_images');
        if (savedImages) {
          setImages(JSON.parse(savedImages));
        }
      } catch (error) {
        console.error('Error loading images:', error);
        toast({
          title: "Error",
          description: "Failed to load images from storage.",
          variant: "destructive",
        });
      }
    };
    
    loadImages();
    
    // Listen for storage changes (when images are added from other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nayandeep_images') {
        loadImages();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDownload = (url: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prompt.slice(0, 30)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Downloaded!",
      description: "Image saved to your downloads folder.",
    });
  };

  const handleDelete = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    localStorage.setItem('nayandeep_images', JSON.stringify(updatedImages));
    toast({
      title: "Deleted",
      description: "Image removed from library.",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-64px)] w-full">
          <AppSidebar />
          <main className="flex-1 p-6 animate-fade-in backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  🎨 Your Generated Images
                </h1>
                <p className="text-muted-foreground">
                  Browse and manage all your AI-generated artwork
                </p>
              </div>

              {images.length === 0 ? (
                <Card className="glass p-12 text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No images yet</h3>
                  <p className="text-muted-foreground mb-6">
                    No images yet — go create something beautiful 🎨!
                  </p>
                  <Button onClick={() => navigate("/home")} className="gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Create Image
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image) => (
                    <Card 
                      key={image.id}
                      className="glass group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <CardContent className="p-0 relative">
                        <img 
                          src={image.url} 
                          alt={image.prompt}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => handleDownload(image.url, image.prompt)}
                            className="bg-white/90 hover:bg-white"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(image.id)}
                            className="bg-destructive/90 hover:bg-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="p-4 bg-card">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {image.prompt}
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-2">
                            {new Date(image.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Library;
