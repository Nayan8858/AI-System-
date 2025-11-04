// Utility functions for text processing

/**
 * Removes markdown syntax from text while preserving formatting intent
 */
export const stripMarkdown = (text: string): string => {
  if (!text) return '';
  
  return text
    // Remove headers (##, ###, etc.)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers but keep the text
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove code blocks but keep content
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```\w*\n?/g, '').trim())
    .replace(/`(.+?)`/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove remaining markdown symbols
    .replace(/[*_~`]/g, '')
    .trim();
};

/**
 * Converts number words to digits (up to 5 digits)
 */
export const convertNumberWordsToDigits = (text: string): string => {
  if (!text) return '';

  const numberWords: { [key: string]: number } = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
    'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
    'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
    'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000, 'million': 1000000
  };

  let result = text;

  // Handle compound numbers like "twenty three" -> "23"
  const compoundPattern = /(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[\s-]+(one|two|three|four|five|six|seven|eight|nine)/gi;
  result = result.replace(compoundPattern, (match, tens, ones) => {
    return String(numberWords[tens.toLowerCase()] + numberWords[ones.toLowerCase()]);
  });

  // Handle simple number words
  Object.keys(numberWords).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, String(numberWords[word]));
  });

  // Handle "X hundred Y" patterns
  result = result.replace(/(\d+)\s*hundred\s*(?:and\s*)?(\d+)?/gi, (match, hundreds, remainder) => {
    const base = parseInt(hundreds) * 100;
    const extra = remainder ? parseInt(remainder) : 0;
    return String(base + extra);
  });

  // Handle "X thousand Y" patterns
  result = result.replace(/(\d+)\s*thousand\s*(?:and\s*)?(\d+)?/gi, (match, thousands, remainder) => {
    const base = parseInt(thousands) * 1000;
    const extra = remainder ? parseInt(remainder) : 0;
    return String(base + extra);
  });

  return result;
};

/**
 * Detects the type of user query
 */
export const detectQueryType = (text: string): 'code' | 'image' | 'search' | 'normal' => {
  const lowerText = text.toLowerCase();
  
  // Code detection
  const codeKeywords = ['code', 'program', 'function', 'script', 'html', 'css', 'javascript', 'python', 'java', 'c++', 'react', 'debug', 'syntax'];
  if (codeKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'code';
  }
  
  // Image detection
  const imageKeywords = ['image', 'picture', 'draw', 'generate', 'create a visual', 'design', 'illustration', 'photo'];
  if (imageKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'image';
  }
  
  // Search detection
  const searchKeywords = ['search', 'find', 'look up', 'research', 'latest', 'current'];
  if (searchKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'search';
  }
  
  return 'normal';
};

/**
 * Formats text for display (applies all processing)
 */
export const formatTextForDisplay = (text: string): string => {
  let formatted = text;
  formatted = stripMarkdown(formatted);
  formatted = convertNumberWordsToDigits(formatted);
  return formatted;
};
