/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RubricDimensionScore {
  score: number;
  maxScore: number;
  feedback: string;
}

export interface EvaluationRubricBreakdown {
  academicVocabulary: RubricDimensionScore;
  grammaticalAccuracy: RubricDimensionScore;
  coherenceFlow: RubricDimensionScore;
  topicRelevance: RubricDimensionScore;
}

export interface EvaluationResult {
  score: number; // Total score on a 0-100 scale
  letterGrade: string; // Academic letter grade (A+, A, A-, B+, B, C, D, F)
  skillPointsContribution: number; // Scaled skill point addition (5 to 20 points)
  feedback: string; // Constructive feedback detailing strengths and areas for growth
  suggestedCorrection: string; // Improved/polished academic version of the student's input
  rubricBreakdown: EvaluationRubricBreakdown;
  isMock?: boolean;
}

// List of academic word list (AWL) terms and connectors
const ACADEMIC_TERMS = new Set([
  'analyze', 'analysis', 'approach', 'area', 'assess', 'assessment', 'assume', 'assumption',
  'authority', 'available', 'benefit', 'concept', 'consistent', 'constitutional', 'context',
  'contract', 'create', 'data', 'definition', 'derived', 'distribution', 'economic', 'environment',
  'established', 'estimate', 'evidence', 'export', 'factors', 'financial', 'formula', 'function',
  'identified', 'income', 'indicate', 'individual', 'interpretation', 'involved', 'issues', 'labor',
  'legal', 'legislation', 'major', 'method', 'methodology', 'occur', 'percent', 'period', 'policy',
  'principle', 'procedure', 'process', 'required', 'research', 'response', 'role', 'section',
  'sector', 'significant', 'similar', 'source', 'specific', 'structure', 'theory', 'variables',
  'achieve', 'acquisition', 'administration', 'affect', 'appropriate', 'aspects', 'assistance',
  'categories', 'chapter', 'commission', 'community', 'complex', 'computer', 'conclusion',
  'conduct', 'consequence', 'consequently', 'construction', 'consumer', 'credit', 'cultural',
  'design', 'distinction', 'elements', 'equation', 'evaluation', 'evaluate', 'features', 'final',
  'focus', 'impact', 'injury', 'institute', 'investment', 'journal', 'maintenance', 'normal',
  'obtained', 'participation', 'perceive', 'positive', 'potential', 'previous', 'primary',
  'purchase', 'range', 'region', 'regulations', 'relevant', 'resident', 'resources', 'restricted',
  'security', 'sought', 'select', 'site', 'strategies', 'survey', 'text', 'traditional', 'transfer',
  'alternative', 'circumstances', 'comments', 'compensation', 'components', 'consent', 'considerable',
  'constant', 'constraints', 'contribution', 'convention', 'coordination', 'core', 'corporate',
  'corresponding', 'criteria', 'deduction', 'demonstrate', 'demonstrates', 'document', 'dominant',
  'emphasis', 'emphasize', 'ensure', 'fund', 'framework', 'illustrate', 'illustrates', 'implies',
  'imply', 'initial', 'instance', 'interaction', 'justification', 'layer', 'link', 'location',
  'maximum', 'minor', 'outcome', 'partner', 'philosophy', 'physical', 'proportion', 'published',
  'reaction', 'registered', 'reliance', 'scheme', 'sequence', 'shift', 'specified', 'sufficient',
  'technical', 'technology', 'validity', 'volume', 'however', 'therefore', 'furthermore',
  'moreover', 'nevertheless', 'consequently', 'accordingly', 'specifically', 'perspective'
]);

const INFORMAL_REPLACEMENTS: Record<string, string> = {
  'a lot of': 'a substantial amount of',
  'lots of': 'numerous',
  'good': 'effective',
  'bad': 'adverse',
  'thing': 'factor',
  'things': 'elements',
  'stuff': 'materials',
  'get': 'obtain',
  'got': 'acquired',
  'big': 'significant',
  'small': 'minor',
  'kind of': 'somewhat',
  'sort of': 'partially',
  'like': 'such as',
  'so': 'therefore',
  'but': 'however',
  'really': 'considerably',
};

const COMMON_TYPO_FIXES: Record<string, string> = {
  'teh': 'the',
  'becuase': 'because',
  'recieve': 'receive',
  'seperate': 'separate',
  'untill': 'until',
  'definately': 'definitely',
  'dont': "don't",
  'cant': "can't",
  'wont': "won't",
  'isnt': "isn't",
  'arent': "aren't",
  'didnt': "didn't",
  'couldnt': "couldn't",
  'shouldnt': "shouldn't",
  'wouldnt': "wouldn't",
  'i': 'I',
};

/**
 * Calculates letter grade from numeric score (0-100)
 */
export function calculateLetterGrade(score: number): string {
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Converts a 100-point score to a 5-20 skill points contribution
 */
export function calculateSkillPoints(score: number): number {
  const scaled = Math.round(5 + (score / 100) * 15);
  return Math.min(20, Math.max(5, scaled));
}

/**
 * Generates an improved, polished academic version of the student's input
 */
export function generateSuggestedCorrection(text: string): string {
  if (!text || !text.trim()) return '';

  let polished = text.trim();

  // 1. Fix common typos word by word
  const words = polished.split(/(\s+|[.,!?;:()])/);
  const fixedWords = words.map((w) => {
    const lower = w.toLowerCase();
    if (COMMON_TYPO_FIXES[lower]) {
      // Preserve capitalization if needed
      if (w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase()) {
        const fix = COMMON_TYPO_FIXES[lower];
        return fix.charAt(0).toUpperCase() + fix.slice(1);
      }
      return COMMON_TYPO_FIXES[lower];
    }
    return w;
  });
  polished = fixedWords.join('');

  // 2. Capitalize 'i' standalone
  polished = polished.replace(/\bi\b/g, 'I');

  // 3. Fix capitalization at start of sentences
  polished = polished.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, prefix, letter) => {
    return prefix + letter.toUpperCase();
  });

  // 4. Ensure ending punctuation
  if (!/[.!?]$/.test(polished)) {
    polished += '.';
  }

  // 5. Replace informal terms with academic alternatives where clean
  Object.entries(INFORMAL_REPLACEMENTS).forEach(([informal, academic]) => {
    const regex = new RegExp(`\\b${informal}\\b`, 'gi');
    polished = polished.replace(regex, (match) => {
      if (match[0] === match[0].toUpperCase()) {
        return academic.charAt(0).toUpperCase() + academic.slice(1);
      }
      return academic;
    });
  });

  return polished;
}

/**
 * Core Rubric Evaluation Engine for Open-Ended Student Submissions
 * Evaluates inputs against 4 weighted dimensions:
 * 1. Academic Vocabulary & Lexical Diversity (30%)
 * 2. Grammatical Accuracy & Syntax Structure (30%)
 * 3. Coherence & Logical Flow (20%)
 * 4. Topic Relevance & Task Completion (20%)
 */
export function evaluateOpenEndedInput(
  text: string,
  type: 'essay' | 'dialogue' | 'writing' | 'general' = 'general',
  prompt?: string,
  context?: string
): EvaluationResult {
  const trimmed = (text || '').trim();

  // Minimal input protection
  if (!trimmed || trimmed.length < 3) {
    return {
      score: 30,
      letterGrade: 'F',
      skillPointsContribution: 5,
      feedback: 'The submission is incomplete or contains insufficient text for academic evaluation. Please write a complete response.',
      suggestedCorrection: 'Please provide a complete academic response addressing the prompt directly.',
      rubricBreakdown: {
        academicVocabulary: { score: 8, maxScore: 30, feedback: 'Insufficient vocabulary sample.' },
        grammaticalAccuracy: { score: 8, maxScore: 30, feedback: 'Incomplete sentence structure.' },
        coherenceFlow: { score: 7, maxScore: 20, feedback: 'Missing coherent structure.' },
        topicRelevance: { score: 7, maxScore: 20, feedback: 'Did not fulfill task requirements.' }
      },
      isMock: true
    };
  }

  const rawWords = trimmed.split(/\s+/).filter(w => w.length > 0);
  const totalWords = rawWords.length;
  const cleanWords = rawWords.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
  const uniqueWords = new Set(cleanWords);
  const ttr = totalWords > 0 ? uniqueWords.size / totalWords : 0;

  // ---------------------------------------------------------
  // 1. ACADEMIC VOCABULARY & LEXICAL DIVERSITY (Max 30 Pts)
  // ---------------------------------------------------------
  let vocabScore = 20; // Default base score
  const academicWordHits = cleanWords.filter(w => ACADEMIC_TERMS.has(w));

  // Reward high lexical diversity (TTR) and academic words
  if (ttr >= 0.7 && totalWords >= 10) vocabScore += 5;
  else if (ttr >= 0.55) vocabScore += 3;
  else if (ttr < 0.35 && totalWords > 15) vocabScore -= 6; // Penalize word repetition

  if (academicWordHits.length >= 4) vocabScore += 5;
  else if (academicWordHits.length >= 2) vocabScore += 3;
  else if (academicWordHits.length >= 1) vocabScore += 1;

  // ANTI-EXPLOITATION GUARANTEE: Check for repeated word patterns (e.g. "good good good" or filler n-grams)
  let maxRepeatedNgram = 0;
  for (let i = 0; i < cleanWords.length - 2; i++) {
    const ngram = cleanWords.slice(i, i + 3).join(' ');
    let count = 0;
    for (let j = 0; j < cleanWords.length - 2; j++) {
      if (cleanWords.slice(j, j + 3).join(' ') === ngram) count++;
    }
    if (count > maxRepeatedNgram) maxRepeatedNgram = count;
  }

  if (maxRepeatedNgram >= 3 && totalWords < 50) {
    vocabScore -= 8; // Heavy penalty for repetitive filler manipulation
  } else if (maxRepeatedNgram >= 4) {
    vocabScore -= 6;
  }

  vocabScore = Math.min(30, Math.max(8, Math.round(vocabScore)));

  const vocabFeedback = vocabScore >= 26
    ? 'Outstanding lexical diversity and precise usage of academic terminology.'
    : vocabScore >= 20
    ? 'Effective general vocabulary range with clear expression.'
    : 'Incorporate more formal academic vocabulary terms to avoid repetition.';

  // ---------------------------------------------------------
  // 2. GRAMMATICAL ACCURACY & SYNTAX STRUCTURE (Max 30 Pts)
  // ---------------------------------------------------------
  let grammarScore = 24; // Default solid base (fair tolerance for student-level writing)

  // Capitalization check
  const startsWithCap = /^[A-Z0-9]/.test(trimmed);
  if (!startsWithCap) grammarScore -= 2; // Minor 2-point drop (NO over-penalization)

  // Terminal punctuation check
  const hasTerminalPunctuation = /[.!?]$/.test(trimmed);
  if (!hasTerminalPunctuation) grammarScore -= 2; // Minor 2-point drop

  // Typo check (fair tolerance)
  const typoCount = cleanWords.filter(w => COMMON_TYPO_FIXES[w]).length;
  if (typoCount === 1) grammarScore -= 1;
  else if (typoCount === 2) grammarScore -= 2;
  else if (typoCount >= 3) grammarScore -= 4;

  // Complex sentence structure bonus (use of subordinate clauses/connectors)
  const complexConnectors = ['because', 'although', 'whereas', 'since', 'if', 'while', 'provided', 'furthermore', 'therefore'];
  const hasComplexStructure = cleanWords.some(w => complexConnectors.includes(w));
  if (hasComplexStructure && totalWords >= 12) {
    grammarScore += 4;
  }

  grammarScore = Math.min(30, Math.max(10, Math.round(grammarScore)));

  const grammarFeedback = grammarScore >= 26
    ? 'Precise syntactic construction and excellent grammatical accuracy throughout.'
    : grammarScore >= 20
    ? 'Solid sentence structure with minor capitalization or punctuation refinements.'
    : 'Focus on consistent sentence boundary punctuation and subject-verb agreement.';

  // ---------------------------------------------------------
  // 3. COHERENCE & LOGICAL FLOW (Max 20 Pts)
  // ---------------------------------------------------------
  let coherenceScore = 15; // Default base

  // Sentences count and length balance
  const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? totalWords / sentences.length : totalWords;

  if (sentences.length >= 2 && avgWordsPerSentence >= 7 && avgWordsPerSentence <= 28) {
    coherenceScore += 3;
  } else if (sentences.length === 1 && totalWords > 40) {
    coherenceScore -= 3; // Run-on sentence penalty
  }

  const transitionWords = ['however', 'therefore', 'furthermore', 'moreover', 'in addition', 'consequently', 'for instance', 'overall', 'in conclusion', 'firstly', 'secondly'];
  const hasTransitions = transitionWords.some(tw => trimmed.toLowerCase().includes(tw));
  if (hasTransitions) coherenceScore += 2;

  coherenceScore = Math.min(20, Math.max(6, Math.round(coherenceScore)));

  const coherenceFeedback = coherenceScore >= 17
    ? 'Logical argument progression with clear transitional connections between ideas.'
    : coherenceScore >= 13
    ? 'Coherent thought structure; use transition words for smoother flow.'
    : 'Break long ideas into separate sentences connected by transitions.';

  // ---------------------------------------------------------
  // 4. TOPIC RELEVANCE & TASK COMPLETION (Max 20 Pts)
  // ---------------------------------------------------------
  let relevanceScore = 14; // Default base

  // Target word count expectations by assignment type
  let minTargetWords = 15;
  if (type === 'essay') minTargetWords = 35;
  if (type === 'dialogue') minTargetWords = 8;

  if (totalWords >= minTargetWords * 1.5) relevanceScore += 4;
  else if (totalWords >= minTargetWords) relevanceScore += 2;
  else relevanceScore -= 3;

  // Prompt keyword matching if prompt is present
  if (prompt) {
    const promptKeywords = prompt.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const textLower = trimmed.toLowerCase();
    const matchedPromptKeywords = promptKeywords.filter(pk => textLower.includes(pk));
    if (matchedPromptKeywords.length >= 2) relevanceScore += 2;
    else if (matchedPromptKeywords.length === 1) relevanceScore += 1;
  }

  relevanceScore = Math.min(20, Math.max(5, Math.round(relevanceScore)));

  const relevanceFeedback = relevanceScore >= 17
    ? 'Thoroughly answers all prompt requirements with relevant academic support.'
    : relevanceScore >= 13
    ? 'Adequately addresses the main topic prompt with clear focus.'
    : 'Directly answer all parts of the assigned prompt with specific detail.';

  // ---------------------------------------------------------
  // FINAL SCORE & SYNTHESIS
  // ---------------------------------------------------------
  const totalScore = Math.min(100, Math.max(30, vocabScore + grammarScore + coherenceScore + relevanceScore));
  const letterGrade = calculateLetterGrade(totalScore);
  const skillPointsContribution = calculateSkillPoints(totalScore);
  const suggestedCorrection = generateSuggestedCorrection(trimmed);

  const strengthBullet = relevanceScore >= 13
    ? '• Strength: Directly addresses prompt requirements with clear engagement.'
    : '• Strength: Good effort attempting the academic prompt.';

  const growthBullet = vocabScore < 25
    ? '• Growth: Expand usage of formal academic vocabulary terms.'
    : grammarScore < 25
    ? '• Growth: Refine sentence punctuation and syntactic structure.'
    : '• Growth: Use transition words to connect arguments smoothly.';

  const overallFeedback = `${strengthBullet}\n${growthBullet}`;

  return {
    score: totalScore,
    letterGrade,
    skillPointsContribution,
    feedback: overallFeedback.trim(),
    suggestedCorrection,
    rubricBreakdown: {
      academicVocabulary: {
        score: vocabScore,
        maxScore: 30,
        feedback: vocabFeedback
      },
      grammaticalAccuracy: {
        score: grammarScore,
        maxScore: 30,
        feedback: grammarFeedback
      },
      coherenceFlow: {
        score: coherenceScore,
        maxScore: 20,
        feedback: coherenceFeedback
      },
      topicRelevance: {
        score: relevanceScore,
        maxScore: 20,
        feedback: relevanceFeedback
      }
    },
    isMock: true
  };
}

/**
 * Convenience wrappers for specific input categories
 */
export function evaluateWriting(text: string, prompt?: string, context?: string): EvaluationResult {
  return evaluateOpenEndedInput(text, 'writing', prompt, context);
}

export function evaluateDialogueTurn(text: string, prompt?: string, context?: string): EvaluationResult {
  return evaluateOpenEndedInput(text, 'dialogue', prompt, context);
}

export function evaluateEssay(text: string, prompt?: string, context?: string): EvaluationResult {
  return evaluateOpenEndedInput(text, 'essay', prompt, context);
}
