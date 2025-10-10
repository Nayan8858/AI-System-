import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WebSearchResultsProps {
  results: {
    summary: string;
    sources: Array<{
      title: string;
      url: string;
      note: string;
    }>;
  };
}

const WebSearchResults: React.FC<WebSearchResultsProps> = ({ results }) => {
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  if (!results?.sources || results.sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="text-sm text-muted-foreground">
        <strong>Sources used:</strong>
      </div>
      
      <div className="grid gap-3">
        {results.sources.map((source, index) => (
          <Card
            key={index}
            className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => window.open(source.url, '_blank', 'noopener,noreferrer')}
          >
            <div className="flex items-start gap-3">
              {/* Website Favicon/Logo */}
              <div className="flex-shrink-0 mt-1">
                {getFaviconUrl(source.url) ? (
                  <img
                    src={getFaviconUrl(source.url)!}
                    alt={`${source.title} favicon`}
                    className="w-6 h-6 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <ExternalLink className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              {/* Source Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2 mb-1">
                      {source.title}
                    </h4>
                    {source.note && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {source.note}
                      </p>
                    )}
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {source.url}
                    </a>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground italic">
        💡 Click on any source card or logo to visit the website
      </div>
    </div>
  );
};

export default WebSearchResults;
