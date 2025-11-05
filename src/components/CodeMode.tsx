import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Play, Copy, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CodeModeProps {
  initialCode?: string;
  onClose: () => void;
}

export const CodeMode = ({ initialCode = '', onClose }: CodeModeProps) => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [pythonCode, setPythonCode] = useState('');
  const [activeTab, setActiveTab] = useState('html');
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    // Parse initial code if provided
    if (initialCode) {
      if (initialCode.includes('<!DOCTYPE') || initialCode.includes('<html')) {
        setHtmlCode(initialCode);
        setActiveTab('html');
      } else if (initialCode.includes('def ') || initialCode.includes('import ')) {
        setPythonCode(initialCode);
        setActiveTab('python');
      } else {
        setJsCode(initialCode);
        setActiveTab('javascript');
      }
    }
  }, [initialCode]);

  const runCode = () => {
    setPreviewKey(prev => prev + 1);
    toast({
      title: "Code Running",
      description: "Your code is now executing in the preview pane",
    });
  };

  const copyCode = () => {
    let codeToCopy = '';
    switch (activeTab) {
      case 'html': codeToCopy = htmlCode; break;
      case 'css': codeToCopy = cssCode; break;
      case 'javascript': codeToCopy = jsCode; break;
      case 'python': codeToCopy = pythonCode; break;
    }
    navigator.clipboard.writeText(codeToCopy);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const getPreviewContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        {/* Ribbon */}
        <div className="h-10 bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-sm font-medium">
          🌐 This website is made by NayandeepGPT
        </div>
        
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground">Code Editor</h2>
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={runCode} className="bg-primary hover:bg-primary/90">
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </Button>
              <Button size="sm" variant="outline" onClick={copyCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Side */}
          <div className="w-1/2 border-r border-border bg-muted/30">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-card px-4">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-auto p-4">
                <TabsContent value="html" className="h-full m-0">
                  <Textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    placeholder="Write your HTML code here..."
                    className="h-full font-mono text-sm resize-none bg-background border-border"
                  />
                </TabsContent>
                
                <TabsContent value="css" className="h-full m-0">
                  <Textarea
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    placeholder="Write your CSS code here..."
                    className="h-full font-mono text-sm resize-none bg-background border-border"
                  />
                </TabsContent>
                
                <TabsContent value="javascript" className="h-full m-0">
                  <Textarea
                    value={jsCode}
                    onChange={(e) => setJsCode(e.target.value)}
                    placeholder="Write your JavaScript code here..."
                    className="h-full font-mono text-sm resize-none bg-background border-border"
                  />
                </TabsContent>
                
                <TabsContent value="python" className="h-full m-0">
                  <Textarea
                    value={pythonCode}
                    onChange={(e) => setPythonCode(e.target.value)}
                    placeholder="Write your Python code here... (Note: Python execution requires backend support)"
                    className="h-full font-mono text-sm resize-none bg-background border-border"
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Preview Side */}
          <div className="w-1/2 bg-background">
            <div className="h-full flex flex-col">
              <div className="h-12 border-b border-border flex items-center px-4 bg-card">
                <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
              </div>
              <div className="flex-1 overflow-auto">
                {activeTab === 'python' ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground p-8 text-center">
                    <div>
                      <p className="mb-2">Python execution requires backend support.</p>
                      <p className="text-sm">Use HTML, CSS, and JavaScript for live preview.</p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    key={previewKey}
                    srcDoc={getPreviewContent()}
                    title="Code Preview"
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
