// Smart Memory System for NayandeepGPT v2.3
export interface MemoryData {
  lastActivity: string;
  userName: string;
  conversationsSummary: string[];
  preferredTheme: string;
  preferredTone: string;
  projectsCount: number;
  lastProject: string;
}

const MEMORY_KEY = 'nayandeep_memory';
const CONVERSATIONS_KEY = 'nayandeep_chats';

export const saveMemory = (data: Partial<MemoryData>) => {
  const existing = getMemory();
  const updated = { ...existing, ...data, lastActivity: new Date().toISOString() };
  localStorage.setItem(MEMORY_KEY, JSON.stringify(updated));
};

export const getMemory = (): MemoryData => {
  const data = localStorage.getItem(MEMORY_KEY);
  if (!data) {
    return {
      lastActivity: new Date().toISOString(),
      userName: 'User',
      conversationsSummary: [],
      preferredTheme: 'light',
      preferredTone: 'friendly',
      projectsCount: 0,
      lastProject: '',
    };
  }
  return JSON.parse(data);
};

export const clearMemory = () => {
  localStorage.removeItem(MEMORY_KEY);
};

export const getWelcomeMessage = (): string => {
  const memory = getMemory();
  const lastActivity = new Date(memory.lastActivity);
  const daysSince = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSince === 0) {
    return `Welcome back ${memory.userName} 👋, ready to continue working?`;
  } else if (daysSince === 1) {
    return `Welcome back ${memory.userName} 👋, yesterday we ${memory.lastProject || 'were working together'}. Continue?`;
  } else if (daysSince > 1 && memory.lastProject) {
    return `Welcome back ${memory.userName} 👋, last time we ${memory.lastProject}. What's next?`;
  }
  
  return `Hello ${memory.userName} 👋, what would you like to create today?`;
};

export const saveConversationSummary = (summary: string) => {
  const memory = getMemory();
  const summaries = [...memory.conversationsSummary, summary].slice(-5); // Keep last 5
  saveMemory({ conversationsSummary: summaries });
};
