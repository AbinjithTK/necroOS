// Zalgo text transformation utility
// Adds diacritical marks to create glitched/corrupted text effect

// Unicode combining diacritical marks
const ZALGO_UP = [
  '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306',
  '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a',
  '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0303',
  '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f',
  '\u0312', '\u0313', '\u0314', '\u033d', '\u0309', '\u0363', '\u0364',
  '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036a', '\u036b',
  '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b', '\u0346',
  '\u031a'
];

const ZALGO_MID = [
  '\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322',
  '\u0327', '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c',
  '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0338', '\u0337',
  '\u0361', '\u0489'
];

const ZALGO_DOWN = [
  '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e',
  '\u031f', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a',
  '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331',
  '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345',
  '\u0347', '\u0348', '\u0349', '\u034d', '\u034e', '\u0353', '\u0354',
  '\u0355', '\u0356', '\u0359', '\u035a', '\u0323'
];

/**
 * Transform text into Zalgo-style glitched text by adding diacritical marks
 * @param text - The input text to transform
 * @param intensity - How many diacritical marks to add per character (0-1, default 0.5)
 * @returns The transformed text with diacritical marks
 */
export function zalgoTransform(text: string, intensity: number = 0.5): string {
  // Clamp intensity between 0 and 1
  const clampedIntensity = Math.max(0, Math.min(1, intensity));
  
  // Calculate how many marks to add based on intensity
  const maxMarks = Math.ceil(clampedIntensity * 8);
  
  return text
    .split('')
    .map((char) => {
      // Don't transform whitespace
      if (char.trim() === '') {
        return char;
      }
      
      let result = char;
      
      // Add random number of marks based on intensity
      const numMarks = Math.floor(Math.random() * maxMarks);
      
      for (let i = 0; i < numMarks; i++) {
        // Randomly choose which type of mark to add
        const markType = Math.random();
        
        if (markType < 0.33) {
          // Add mark above
          const mark = ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)];
          result += mark;
        } else if (markType < 0.66) {
          // Add mark in middle
          const mark = ZALGO_MID[Math.floor(Math.random() * ZALGO_MID.length)];
          result += mark;
        } else {
          // Add mark below
          const mark = ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)];
          result += mark;
        }
      }
      
      return result;
    })
    .join('');
}

/**
 * Check if text contains Zalgo diacritical marks
 * @param text - The text to check
 * @returns True if the text contains diacritical marks
 */
export function hasZalgoMarks(text: string): boolean {
  const allMarks = [...ZALGO_UP, ...ZALGO_MID, ...ZALGO_DOWN];
  return allMarks.some(mark => text.includes(mark));
}

/**
 * Remove Zalgo diacritical marks from text
 * @param text - The text to clean
 * @returns The text with diacritical marks removed
 */
export function removeZalgoMarks(text: string): string {
  const allMarks = [...ZALGO_UP, ...ZALGO_MID, ...ZALGO_DOWN];
  let result = text;
  
  allMarks.forEach(mark => {
    result = result.replaceAll(mark, '');
  });
  
  return result;
}
