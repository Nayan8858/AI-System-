import React, { useState, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Camera, 
  Upload, 
  Pencil, 
  X,
  ImageIcon,
  FileText,
  Scan
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VisionModePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onImageCapture: (imageData: string) => void;
  onFileUpload: (file: File, type: 'image' | 'pdf') => void;
  onDrawSubmit: (drawingData: string) => void;
}

export const VisionModePanel: React.FC<VisionModePanelProps> = ({
  isOpen,
  onClose,
  onImageCapture,
  onFileUpload,
  onDrawSubmit,
}) => {
  const [activeTab, setActiveTab] = useState('camera');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      onImageCapture(imageData);
      stopCamera();
      onClose();
      toast({
        title: "Photo Captured",
        description: "Analyzing your image...",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file, type);
      onClose();
      toast({
        title: type === 'pdf' ? "PDF Uploaded" : "Image Uploaded",
        description: "Processing your file...",
      });
    }
  };

  const handleDrawStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = 'hsl(var(--primary))';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const submitDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const drawingData = canvas.toDataURL('image/png');
      onDrawSubmit(drawingData);
      onClose();
      toast({
        title: "Drawing Submitted",
        description: "AI is interpreting your sketch...",
      });
    }
  };

  React.useEffect(() => {
    if (activeTab === 'camera' && isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl border-t border-border bg-card/95 backdrop-blur-xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <Scan className="w-5 h-5 text-primary" />
              <span>Vision Mode</span>
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="camera" className="flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="draw" className="flex items-center space-x-2">
              <Pencil className="w-4 h-4" />
              <span>Draw</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="h-[60%]">
            <div className="relative h-full rounded-xl overflow-hidden bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button 
                  size="lg" 
                  className="rounded-full w-16 h-16 bg-white hover:bg-gray-100"
                  onClick={capturePhoto}
                >
                  <Camera className="w-8 h-8 text-black" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'image')}
              className="hidden"
            />
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, 'pdf')}
              className="hidden"
            />
            
            <Button 
              variant="outline" 
              className="w-full h-32 flex flex-col items-center justify-center space-y-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-8 h-8 text-blue-500" />
              <span>Upload Image</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-32 flex flex-col items-center justify-center space-y-2"
              onClick={() => pdfInputRef.current?.click()}
            >
              <FileText className="w-8 h-8 text-orange-500" />
              <span>Upload PDF</span>
            </Button>
          </TabsContent>

          <TabsContent value="draw" className="h-[60%]">
            <div className="h-full flex flex-col">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="flex-1 border-2 border-dashed border-border rounded-xl bg-card cursor-crosshair"
                onMouseDown={handleDrawStart}
                onMouseMove={handleDrawMove}
                onMouseUp={handleDrawEnd}
                onMouseLeave={handleDrawEnd}
              />
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" className="flex-1" onClick={clearCanvas}>
                  Clear
                </Button>
                <Button className="flex-1" onClick={submitDrawing}>
                  Analyze Drawing
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
