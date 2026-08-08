/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  cefr: 'B2' | 'C1' | 'C2';
  example: string;
  synonyms: string[];
}

export const VOCABULARY_DATASET: VocabularyItem[] = [
  {
    id: 'substantiate',
    word: 'Substantiate',
    definition: 'To provide evidence to support or prove the truth of a claim or hypothesis.',
    cefr: 'C1',
    example: 'The researcher presented statistical data to substantiate her hypothesis.',
    synonyms: ['validate', 'corroborate', 'verify', 'authenticate']
  },
  {
    id: 'analyze',
    word: 'Analyze',
    definition: 'To examine methodically and in detail the structure or constitution of something.',
    cefr: 'B2',
    example: 'Students were asked to analyze the psychological factors behind conformity.',
    synonyms: ['examine', 'inspect', 'evaluate', 'scrutinize']
  },
  {
    id: 'synthesize',
    word: 'Synthesize',
    definition: 'To combine a range of information or ideas into a coherent whole.',
    cefr: 'C1',
    example: 'The Literature Synthesis paper required students to synthesize conflicting academic sources.',
    synonyms: ['integrate', 'combine', 'amalgamate', 'blend']
  },
  {
    id: 'empirical',
    word: 'Empirical',
    definition: 'Based on, concerned with, or verifiable by observation or experience rather than theory.',
    cefr: 'C1',
    example: 'The study relies on empirical evidence gathered from over five hundred participants.',
    synonyms: ['observational', 'experimental', 'factual', 'verifiable']
  },
  {
    id: 'hypothesis',
    word: 'Hypothesis',
    definition: 'A proposed explanation made on the basis of limited evidence as a starting point for further investigation.',
    cefr: 'B2',
    example: 'Her initial hypothesis was confirmed after several controlled experiments.',
    synonyms: ['proposition', 'premise', 'supposition', 'theory']
  },
  {
    id: 'articulate',
    word: 'Articulate',
    definition: 'To express an idea or feeling fluently and coherently in speech or writing.',
    cefr: 'C1',
    example: 'The speaker was able to articulate complex economic theories in simple terms.',
    synonyms: ['express', 'convey', 'voice', 'enunciate']
  },
  {
    id: 'facilitate',
    word: 'Facilitate',
    definition: 'To make an action or process easier or smoother.',
    cefr: 'C1',
    example: 'Small group seminars facilitate active discussion and peer collaboration.',
    synonyms: ['ease', 'expedite', 'promote', 'foster']
  },
  {
    id: 'precedent',
    word: 'Precedent',
    definition: 'An earlier event or action that is regarded as an example or guide in similar circumstances.',
    cefr: 'C1',
    example: 'This landmark court ruling set a clear legal precedent for future digital copyright cases.',
    synonyms: ['model', 'exemplar', 'benchmark', 'standard']
  },
  {
    id: 'methodology',
    word: 'Methodology',
    definition: 'A system of methods used in a particular area of study or activity.',
    cefr: 'C1',
    example: 'The peer reviewer evaluated the scientific methodology used during data collection.',
    synonyms: ['approach', 'procedure', 'system', 'framework']
  },
  {
    id: 'framework',
    word: 'Framework',
    definition: 'A basic structure underlying a system, concept, or text.',
    cefr: 'B2',
    example: 'The SWOT analysis provides a strategic framework for business decisions.',
    synonyms: ['structure', 'schema', 'architecture', 'model']
  },
  {
    id: 'parameter',
    word: 'Parameter',
    definition: 'A numerical or other measurable factor forming one of a set that defines a system or sets conditions.',
    cefr: 'C1',
    example: 'The algorithm operates within strictly defined financial parameters.',
    synonyms: ['criterion', 'specification', 'guideline', 'boundary']
  },
  {
    id: 'paradigm',
    word: 'Paradigm',
    definition: 'A typical example or pattern of something; an overarching model or worldview.',
    cefr: 'C2',
    example: 'Epigenetics introduced a new paradigm in understanding human development.',
    synonyms: ['archetype', 'prototype', 'model', 'pattern']
  },
  {
    id: 'ambiguous',
    word: 'Ambiguous',
    definition: 'Open to more than one interpretation; having a double or uncertain meaning.',
    cefr: 'C1',
    example: 'The survey question was ambiguous, leading to conflicting responses.',
    synonyms: ['equivocal', 'unclear', 'vague', 'indeterminate']
  },
  {
    id: 'derive',
    word: 'Derive',
    definition: 'To obtain or deduce something from a specified source or origin.',
    cefr: 'B2',
    example: 'Economists derive market trends by evaluating consumer price indices.',
    synonyms: ['deduce', 'infer', 'extract', 'obtain']
  },
  {
    id: 'allocate',
    word: 'Allocate',
    definition: 'To distribute resources or duties for a specific purpose.',
    cefr: 'B2',
    example: 'The university decided to allocate additional grant funding to undergraduate research.',
    synonyms: ['assign', 'apportion', 'designate', 'allot']
  },
  {
    id: 'establish',
    word: 'Establish',
    definition: 'To set up or lay the groundwork for a system, principle, or organization.',
    cefr: 'B2',
    example: 'The professor sought to establish clear guidelines for academic integrity.',
    synonyms: ['institute', 'found', 'constitute', 'formulate']
  },
  {
    id: 'evaluate',
    word: 'Evaluate',
    definition: 'To judge or calculate the quality, importance, amount, or value of something.',
    cefr: 'B2',
    example: 'Students must evaluate the logical fallacies within the argumentative essay.',
    synonyms: ['assess', 'appraise', 'gauge', 'judge']
  },
  {
    id: 'demonstrate',
    word: 'Demonstrate',
    definition: 'To clearly show the existence or truth of something by giving proof or evidence.',
    cefr: 'B2',
    example: 'Solomon Asch\'s experiment demonstrated the powerful influence of social conformity.',
    synonyms: ['prove', 'exhibit', 'manifest', 'substantiate']
  },
  {
    id: 'indicate',
    word: 'Indicate',
    definition: 'To point out, show, or serve as a sign or symptom of.',
    cefr: 'B2',
    example: 'The research data indicate a strong positive correlation between sleep and retention.',
    synonyms: ['signify', 'denote', 'reflect', 'reveal']
  },
  {
    id: 'advocate',
    word: 'Advocate',
    definition: 'To publicly recommend or support a particular cause or policy.',
    cefr: 'C1',
    example: 'Many public health experts advocate for mandatory wellness screenings.',
    synonyms: ['champion', 'endorse', 'support', 'promote']
  },
  {
    id: 'consecutive',
    word: 'Consecutive',
    definition: 'Following continuously; in unbroken or uninterrupted sequence.',
    cefr: 'B2',
    example: 'Maintaining a three-day consecutive coffee streak unlocks campus badges.',
    synonyms: ['sequential', 'successive', 'uninterrupted', 'continuous']
  },
  {
    id: 'implicit',
    word: 'Implicit',
    definition: 'Implied though not plainly expressed; inherent in the nature of something.',
    cefr: 'C1',
    example: 'There was an implicit agreement among team members to share the research workload.',
    synonyms: ['tacit', 'implied', 'unspoken', 'inferred']
  },
  {
    id: 'comprehensive',
    word: 'Comprehensive',
    definition: 'Complete; including or dealing with all or nearly all elements or aspects of something.',
    cefr: 'C1',
    example: 'The advisor scheduled a comprehensive degree planning session with the student.',
    synonyms: ['thorough', 'exhaustive', 'all-inclusive', 'extensive']
  },
  {
    id: 'valid',
    word: 'Valid',
    definition: 'Having a sound basis in logic or fact; reasonable or cogent.',
    cefr: 'B2',
    example: 'A logical fallacy renders an argument structurally invalid.',
    synonyms: ['legitimate', 'sound', 'cogent', 'substantiated']
  },
  {
    id: 'preliminary',
    word: 'Preliminary',
    definition: 'Denoting an action or event done in preparation for something fuller or more important.',
    cefr: 'B2',
    example: 'Preliminary findings suggest that background music improves math test concentration.',
    synonyms: ['introductory', 'exploratory', 'preparatory', 'initial']
  },
  {
    id: 'epigenetics',
    word: 'Epigenetics',
    definition: 'The study of how environmental factors alter gene expression without changing the DNA sequence.',
    cefr: 'C2',
    example: 'Epigenetics bridges the gap between biological nature and environmental nurture.',
    synonyms: ['gene regulation', 'molecular genetics']
  },
  {
    id: 'dissonance',
    word: 'Dissonance',
    definition: 'A lack of agreement or harmony between people, things, or contradictory beliefs.',
    cefr: 'C1',
    example: 'Cognitive dissonance creates psychological tension when beliefs contradict actions.',
    synonyms: ['discord', 'inconsistency', 'discrepancy', 'incongruity']
  },
  {
    id: 'conformity',
    word: 'Conformity',
    definition: 'Compliance with standards, rules, laws, or prevailing group behaviors.',
    cefr: 'B2',
    example: 'Social conformity often leads individuals to agree with an incorrect group consensus.',
    synonyms: ['compliance', 'acquiescence', 'alignment', 'adherence']
  }
];

export const getVocabularyMap = (): Map<string, VocabularyItem> => {
  const map = new Map<string, VocabularyItem>();
  VOCABULARY_DATASET.forEach((item) => {
    map.set(item.id.toLowerCase(), item);
    map.set(item.word.toLowerCase(), item);
  });
  return map;
};
