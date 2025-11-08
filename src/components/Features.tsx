import { MessageSquare, Image, Code, Search, FileText, Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Smart Conversations",
      description: "Engage in intelligent conversations with advanced AI. Get instant answers and creative solutions to any question."
    },
    {
      icon: Image,
      title: "Image Generation",
      description: "Transform your ideas into stunning visuals. Create high-quality images from simple text descriptions in seconds."
    },
    {
      icon: Code,
      title: "Code Assistant",
      description: "Write better code faster. Get help with debugging, code generation, and programming in multiple languages."
    },
    {
      icon: Search,
      title: "Research & Analysis",
      description: "Conduct deep research effortlessly. Synthesize information from multiple sources and explore complex topics."
    },
    {
      icon: FileText,
      title: "Document Summarization",
      description: "Save time with instant summaries. Condense long articles, reports, and documents into key insights."
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Lightning-fast responses with 99.9% uptime. Built on cutting-edge infrastructure for optimal performance."
    }
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 font-inter">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to boost productivity and creativity in one intelligent platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-8 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}
            >
              <div className="flex flex-col space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-foreground font-inter">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
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