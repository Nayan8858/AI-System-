import { motion } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
  favicon: string;
}

interface GoogleSearchResultsProps {
  results: SearchResult[];
}

export const GoogleSearchResults = ({ results }: GoogleSearchResultsProps) => {
  if (!results || results.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
        <Globe className="w-4 h-4" />
        <span>Google Search Results</span>
      </div>
      
      {results.map((result, index) => (
        <motion.div
          key={result.link}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-4">
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={result.favicon}
                    alt=""
                    className="w-4 h-4 mt-1"
                    onError={(e) => {
                      e.currentTarget.src = "https://www.google.com/favicon.ico";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary group-hover:underline flex items-center gap-2 mb-1">
                      {result.title}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {result.displayLink}
                    </p>
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {result.snippet}
                    </p>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
