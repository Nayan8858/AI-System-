import { MessageSquare, Image, Code, Search, FileText } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Chat Smartly",
      description: "Engage in intelligent conversations, get instant answers, and generate creative text with ease."
    },
    {
      icon: Image,
      title: "Create Images",
      description: "Transform your ideas into stunning visuals. Generate high-quality images from simple text prompts."
    },
    {
      icon: Code,
      title: "Code Helper",
      description: "Get assistance with coding tasks, debug issues, and generate code snippets in various programming languages."
    },
    {
      icon: Search,
      title: "Deep Research",
      description: "Conduct thorough research, synthesize information, and explore complex topics efficiently."
    },
    {
      icon: FileText,
      title: "Summarize Text",
      description: "Quickly condense long articles, documents, or reports into concise summaries for quick understanding."
    }
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Powerful Features at Your Fingertips
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Unlock a new level of productivity and creativity with Nayandeep GPT's advanced capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.slice(0, 3).map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
          {features.slice(3).map((feature, index) => (
            <div 
              key={index + 3}
              className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;