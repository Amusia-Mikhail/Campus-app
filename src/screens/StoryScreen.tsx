/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCampus } from '../context/CampusContext';
import { playSound } from '../utils/soundEffects';
import { translations } from '../utils/translations';
import { saveUserNote } from '../utils/notes';
import { Chapter, ChapterType, SkillType, Question } from '../data/models';
import { DORM_DECOR_ITEMS } from '../data/dormDecor';
import { BiscuitIllustration } from '../components/BiscuitIllustration';
import { LocationIllustration } from '../components/LocationIllustration';
import { unlockBiscuitPose } from '../utils/biscuitAlbum';
import { EvaluationResult, evaluateDialogueTurn, evaluateEssay, evaluateWriting } from '../utils/evaluationEngine';
import { EvaluationResultCard } from '../components/EvaluationResultCard';
import jordanPortrait from '../assets/images/jordan_portrait.jpg';
import reyesPortrait from '../assets/images/reyes_portrait.jpg';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  BookOpen,
  Send,
  Timer,
  FileText,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  Award,
  ArrowLeft,
  Smile,
  Heart,
  WifiOff,
  Scroll,
  Sparkles
} from 'lucide-react';
import { AcademicTranscriptModal } from '../components/AcademicTranscriptModal';
import { InteractiveVocabularyText } from '../components/InteractiveVocabularyText';

interface BiscuitAppearance {
  show: boolean;
  pose: 'sleeping' | 'alert' | 'playful' | 'walking' | 'watching';
}

const getBiscuitAppearance = (chapterId: string, locationId: string, originalIllustration?: boolean): BiscuitAppearance => {
  const idNum = Number(chapterId) || 1;
  
  if (originalIllustration) {
    if (locationId === 'library') {
      return { show: true, pose: idNum % 2 === 0 ? 'watching' : 'sleeping' };
    }
    return { show: true, pose: 'sleeping' };
  }

  // Occasional: only show in approx ~28% of chapters
  const hash = (idNum * 13) % 100;
  const show = hash < 28;
  if (!show) {
    return { show: false, pose: 'watching' };
  }

  let pose: 'sleeping' | 'alert' | 'playful' | 'walking' | 'watching' = 'watching';
  switch (locationId) {
    case 'dorm':
      pose = idNum % 2 === 0 ? 'sleeping' : 'playful';
      break;
    case 'lecture_hall':
    case 'seminar_room':
      pose = 'watching';
      break;
    case 'writing_center':
    case 'science_lab':
      pose = 'alert';
      break;
    case 'dining_hall':
      pose = 'walking';
      break;
    case 'student_union':
      pose = idNum % 2 === 0 ? 'playful' : 'walking';
      break;
    case 'library':
      pose = idNum % 2 === 0 ? 'sleeping' : 'watching';
      break;
    case 'career_center':
      pose = 'watching';
      break;
    case 'quad':
      pose = idNum % 2 === 0 ? 'walking' : 'playful';
      break;
    default:
      pose = 'watching';
  }

  return { show, pose };
};

const locationDetails: Record<string, { name: string; summary: string }> = {
  dorm: {
    name: 'Elm Hall (Dorm)',
    summary: 'You practiced casual roommate conversation and residential agreement drafting.',
  },
  lecture_hall: {
    name: 'Lecture Hall',
    summary: 'You practiced note-taking during academic lectures.',
  },
  seminar_room: {
    name: 'Seminar Room',
    summary: 'You practiced academic seminar debates and scholarly speaking arguments.',
  },
  writing_center: {
    name: 'Writing Center',
    summary: 'You practiced peer-reviewing essays and constructive grammatical editing.',
  },
  library: {
    name: 'Campus Library',
    summary: 'You practiced textbook reading research and academic reading comprehension.',
  },
  dining_hall: {
    name: 'Dining Hall',
    summary: 'You practiced casual conversation over meals.',
  },
  student_union: {
    name: 'Student Union',
    summary: 'You practiced student club pitches and collaborative group discussions.',
  },
  science_lab: {
    name: 'Science Lab',
    summary: 'You practiced technical scientific reporting and experimental reading safety.',
  },
  career_center: {
    name: 'Career Center',
    summary: 'You practiced professional interview speaking and resume editing.',
  },
  quad: {
    name: 'University Quad',
    summary: 'You practiced public speaking, outdoor presentations, and active speaking tasks.',
  },
};

const LECTURE_FEEDBACK = [
  (title: string, skill: string) => ({
    title: 'Superb Listening!',
    text: `You caught the key points and completed the ${title} lecture. 15 ${skill} skill points have been added to your profile!`
  }),
  (title: string, skill: string) => ({
    title: 'Outstanding Attention!',
    text: `Fabulous focus! You successfully processed the core concepts of the ${title} lecture. Your profile has been updated with 15 ${skill} skill points!`
  }),
  (title: string, skill: string) => ({
    title: 'Lecture Mastered!',
    text: `Comprehension quiz passed! Your notes from the ${title} lecture served you well. Enjoy your 15 ${skill} skill points!`
  }),
  (title: string, skill: string) => ({
    title: 'Brilliant Retention!',
    text: `Superb active listening! You navigated the complex ideas of the ${title} lecture and earned 15 ${skill} skill points!`
  }),
  (title: string, skill: string) => ({
    title: 'Key Insights Captured!',
    text: `Key takeaways locked in! You completed the ${title} comprehension check. 15 ${skill} skill points are now yours.`
  }),
  (title: string, skill: string) => ({
    title: 'Academic Focus Unlocked!',
    text: `Outstanding academic attention! Your quiz performance on the ${title} lecture was top-tier. Adding 15 ${skill} skill points to your record.`
  })
];

const DISCUSSION_FEEDBACK = [
  () => ({
    title: 'Submission Received',
    text: `Your discussion reply has been added and transcribed. You successfully practiced high-register vocabulary, logical phrasing, and debate structure.`
  }),
  () => ({
    title: 'Brilliant Argumentation!',
    text: `Outstanding rhetoric! Your seminar response has been posted. You demonstrated critical reasoning, excellent transitions, and academic register.`
  }),
  () => ({
    title: 'Scholarly Insight!',
    text: `Scholarly perspective shared! Your peer-to-peer response was successfully transcribed. Excellent practice in synthesizing scholarly debate.`
  }),
  () => ({
    title: 'Eloquent Contribution!',
    text: `Stance posted! You contributed a well-constructed argument to the classroom seminar. Great job supporting your thesis under academic scrutiny.`
  }),
  () => ({
    title: 'Persuasive Reasoning!',
    text: `Eloquent contribution received! You analyzed classmate views with precision and articulated a clear, polite, and professional argument.`
  }),
  () => ({
    title: 'Critical Thinking Elite!',
    text: `Seminar debate practiced! Your transcription has been updated. You successfully used academic vocabulary and professional debate phrasing.`
  })
];

const ECONOMY_DISCUSSION_FEEDBACK_MESSAGES = [
  "Brilliant argumentation! You articulated your stance clearly with structured academic phrasing and sound logic.",
  "Great active engagement! Your response contributed meaningful perspective to the class seminar discussion.",
  "Well stated! You supported your thesis with relevant reasoning and appropriate formal register.",
  "Thoughtful response! You synthesized key points effectively while maintaining a polite, professional tone.",
  "Strong academic debate entry! Your argument shows solid critical thinking and clear sentence structure.",
  "Eloquent submission! You used expressive transitions and effectively addressed the core seminar question.",
  "Pragmatic and convincing! Your line of reasoning added valuable depth to the classroom discussion.",
  "Impressive clarity! You expressed your viewpoints concisely while adhering to proper academic tone.",
  "Superb reasoning! Your contribution demonstrates careful analysis and confidence in scholarly speech.",
  "Terrific effort! You presented a balanced perspective that enriches our ongoing campus seminar."
];

const ESSAY_FEEDBACK = [
  (wc: number) => ({
    title: 'Essay Submitted Successfully',
    text: `Fantastic discipline! You organized your paragraph under pressure and completed your reflection essay containing ${wc} words.`
  }),
  (wc: number) => ({
    title: 'Excellent Writing Endurance!',
    text: `Superb draft completion! You successfully timed your reflection and produced a robust piece of ${wc} words under pressure.`
  }),
  (wc: number) => ({
    title: 'Highly Analytical Writing!',
    text: `Writing stamina unlocked! Your ${wc}-word reflection has been registered. You paced yourself perfectly and crafted a coherent academic argument.`
  }),
  (wc: number) => ({
    title: 'Expressive & Coherent!',
    text: `Analytical writing practice completed! Your draft of ${wc} words is registered. Outstanding focus on vocabulary and paragraph unity.`
  }),
  (wc: number) => ({
    title: 'Pristine Rhetorical Structure!',
    text: `Reflection essay submitted! You managed your time expertly, creating a detailed draft containing ${wc} words of academic analysis.`
  }),
  (wc: number) => ({
    title: 'Academic Voice Unleashed!',
    text: `A highly focused effort! You successfully composed a coherent reflection containing ${wc} words before the clock ran down.`
  })
];

const LIBRARY_FEEDBACK = [
  (docTitle: string) => ({
    title: 'Correct Understanding!',
    text: `Wonderful reading comprehension! You successfully decoded and analyzed the core facts from the document: "${docTitle}".`
  }),
  (docTitle: string) => ({
    title: 'Expert Information Retrieval!',
    text: `Spot-on information retrieval! You meticulously reviewed "${docTitle}" and correctly extracted all the necessary details.`
  }),
  (docTitle: string) => ({
    title: 'Deep Textual Comprehension!',
    text: `Expert document analysis! You verified key requirements and successfully demonstrated high reading comprehension on "${docTitle}".`
  }),
  (docTitle: string) => ({
    title: 'Sovereign Document Scanning!',
    text: `Textual literacy mastered! You navigated "${docTitle}" with immense attention to detail and answered the check questions perfectly.`
  }),
  (docTitle: string) => ({
    title: 'Analytical Reading Mastered!',
    text: `Outstanding reading accuracy! You successfully processed the formal requirements stated in "${docTitle}".`
  }),
  (docTitle: string) => ({
    title: 'Literacy and Precision!',
    text: `A top-tier comprehension score! You scanned "${docTitle}" expertly and demonstrated robust academic research habits.`
  })
];

const CAMPUS_LIFE_FEEDBACK = [
  (npcName: string) => ({
    title: 'Social Interaction Unlocked',
    text: `Outstanding conversation! You successfully chatted with your peer ${npcName}, strengthening your social connection and building trust.`
  }),
  (npcName: string) => ({
    title: 'Wonderful Peer Bonding!',
    text: `Wonderful peer bonding! Your dialogue with ${npcName} was warm, collaborative, and perfectly suited for community life.`
  }),
  (npcName: string) => ({
    title: 'Superb Empathy & Rapport!',
    text: `Superb communication! You balanced active listening with expressive dialogue, fostering high rapport with ${npcName}.`
  }),
  (npcName: string) => ({
    title: 'Amiable Social Mastery!',
    text: `Social milestone unlocked! You navigated this real-life interaction with ${npcName} with great ease and mutual respect.`
  }),
  (npcName: string) => ({
    title: 'Eloquent Casual Dialogue!',
    text: `Encouraging conversation completed! Your friendly presence and thoughtful replies with ${npcName} made for a lovely encounter.`
  }),
  (npcName: string) => ({
    title: 'Friendship & Community Strong!',
    text: `Eloquent rapport building! You chatted with ${npcName} and successfully practiced natural, supportive social communication.`
  })
];

function shuffleQuestion(q: Question): Question {
  const shuffledWithOriginalIdx = q.options.map((opt, originalIdx) => ({
    opt,
    originalIdx
  }));
  
  for (let i = shuffledWithOriginalIdx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledWithOriginalIdx[i];
    shuffledWithOriginalIdx[i] = shuffledWithOriginalIdx[j];
    shuffledWithOriginalIdx[j] = temp;
  }
  
  const shuffledOptions = shuffledWithOriginalIdx.map(x => x.opt);
  const newCorrectIndex = shuffledWithOriginalIdx.findIndex(x => x.originalIdx === q.correctIndex);
  
  return {
    ...q,
    options: shuffledOptions,
    correctIndex: newCorrectIndex
  };
}

export const StoryScreen: React.FC = () => {
  const {
    selectedChapterId,
    setSelectedChapterId,
    storyRepository,
    completeChapter,
    incrementSkill,
    incrementFriendship,
    setActiveTab,
    toggleEquipDecor,
    unlockAndEquipDecor,
    setAutoOpenDecorId,
    profile,
    progress,
    isOnline,
    isPracticeMode,
    setIsPracticeMode,
    practiceChapterId,
    mainStoryCurrentChapter,
    uiLanguage,
    soundEnabled,
    canUseRealAiGrade,
    recordAiGradeUsed,
    isCampusPlus,
    setActiveSubscreenRequest
  } = useCampus();

  const t = translations[uiLanguage] || translations.EN;

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chaptersList, setChaptersList] = useState<Chapter[]>([]);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [showPracticeCelebration, setShowPracticeCelebration] = useState(false);
  const [practiceEarnedPoints, setPracticeEarnedPoints] = useState(0);
  const [completedLocationInfo, setCompletedLocationInfo] = useState<{ id: string; name: string; summary: string } | null>(null);

  // Speech states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  
  // Chapter-specific states
  // Narrative
  const [narrativeIndex, setNarrativeIndex] = useState(0);

  // Lecture & Library Quiz
  const [lectureStage, setLectureStage] = useState<'listening' | 'quiz' | 'results'>('listening');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [notesText, setNotesText] = useState('');

  // Discussion
  const [discussionInput, setDiscussionInput] = useState('');
  const [discussionChats, setDiscussionChats] = useState<{ sender: string; text: string; isUser: boolean }[]>([]);
  const [discussionSubmitted, setDiscussionSubmitted] = useState(false);

  // Independent Work
  const [essayText, setEssayText] = useState('');
  const [countdownTime, setCountdownTime] = useState(600); // 10 minutes in seconds
  const [essaySubmitted, setEssaySubmitted] = useState(false);
  const essayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const contentBodyRef = useRef<HTMLDivElement>(null);

  // Library
  const [libraryStage, setLibraryStage] = useState<'reading' | 'quiz' | 'results'>('reading');

  // Campus Life (NPC dialogue)
  const [npcChats, setNpcChats] = useState<{ sender: string; text: string; isUser: boolean }[]>([]);
  const [npcInput, setNpcInput] = useState('');
  const [npcLineIndex, setNpcLineIndex] = useState(0);
  const [friendshipScore, setFriendshipScore] = useState(0);
  const [npcChatsCompleted, setNpcChatsCompleted] = useState(false);

  // Effort gate states
  const [isEffortApproved, setIsEffortApproved] = useState<boolean>(true);
  const [feedbackIndex, setFeedbackIndex] = useState<number>(0);

  // Shuffled questions & AI grading states
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [gradingResult, setGradingResult] = useState<EvaluationResult | { feedback: string; score: number; [key: string]: any } | null>(null);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingNote, setGradingNote] = useState<string>('');

  const [gradingError, setGradingError] = useState<string | null>(null);
  const [submittedDiscussionText, setSubmittedDiscussionText] = useState<string>('');
  const [chapterCompletionError, setChapterCompletionError] = useState<{ message: string; chapter: Chapter } | null>(null);
  const [isCompletingChapter, setIsCompletingChapter] = useState<boolean>(false);



  const isInputHighEffort = (text: string): boolean => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    const words = trimmed.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 3) return false; // Allow standard concise discussion responses (3+ words)
    
    const lower = trimmed.toLowerCase();
    const lowEffortKeywords = ['idk', 'dunno', 'okay', 'test', 'asd', 'qwe', 'stuff', 'nothing', 'something', 'testing'];
    if (lowEffortKeywords.includes(lower) || words.every(w => lowEffortKeywords.includes(w.toLowerCase()))) {
      return false;
    }
    return true;
  };

  // Speech Recognition Instantiation
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check speech synthesis support
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSupported(true);
    }
    // Check speech recognition support
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      setSttSupported(true);
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      recognitionRef.current = rec;
    }

    // Clean up TTS
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Scroll to bottom on narrative index changes to keep button visible and stable
  useEffect(() => {
    if (contentBodyRef.current) {
      contentBodyRef.current.scrollTo({
        top: contentBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [narrativeIndex]);

  // Fetch Chapter Details
  useEffect(() => {
    const fetchChapter = async () => {
      const all = await storyRepository.getChapters();
      setChaptersList(all);
      
      const activeId = isPracticeMode
        ? (practiceChapterId || selectedChapterId || '1')
        : (selectedChapterId || mainStoryCurrentChapter || progress.currentChapterId || '1');
      const active = all.find((c) => c.id === activeId);
      setChapter(active || null);

      // Reset states on chapter change
      setNarrativeIndex(0);
      setLectureStage('listening');
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setNotesText('');
      setDiscussionInput('');
      setDiscussionChats([]);
      setDiscussionSubmitted(false);
      setIsEffortApproved(true);
      setEssayText('');
      setCountdownTime(600);
      setEssaySubmitted(false);
      setLibraryStage('reading');
      setNpcChats([]);
      setNpcInput('');
      setNpcLineIndex(0);
      setNpcChatsCompleted(false);
      setFeedbackIndex(Math.floor(Math.random() * 6));
      setGradingResult(null);
      setIsGrading(false);
      setGradingNote('');
      setGradingError(null);
      setSubmittedDiscussionText('');
      setChapterCompletionError(null);
      setIsCompletingChapter(false);

      if (active) {
        // Shuffle questions client-side
        if (active.questions && active.questions.length > 0) {
          setShuffledQuestions(active.questions.map(q => shuffleQuestion(q)));
        } else {
          setShuffledQuestions([]);
        }

        // Initialize npc chats
        if (active.type === ChapterType.CAMPUS_LIFE && active.npcName) {
          setNpcChats([{ sender: active.npcName, text: active.initialGreeting || '', isUser: false }]);
          // Get saved friendship score
          setFriendshipScore(progress.friendshipPoints[active.npcName] || 0);
        }
        // Initialize discussion chats
        if (active.type === ChapterType.DISCUSSION && active.discussionPrompt) {
          const chats = [
            { sender: 'Professor Reyes', text: active.discussionPrompt, isUser: false }
          ];
          if (active.classmateReplies) {
            active.classmateReplies.forEach(reply => {
              chats.push({ sender: reply.name, text: reply.text, isUser: false });
            });
          }
          setDiscussionChats(chats);
        }
      }
    };
    fetchChapter();
  }, [selectedChapterId, practiceChapterId, isPracticeMode, mainStoryCurrentChapter, progress.currentChapterId, storyRepository]);

  // Handle Independent Work countdown timer
  useEffect(() => {
    if (chapter?.type === ChapterType.INDEPENDENT_WORK && !essaySubmitted) {
      essayTimerRef.current = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1) {
            clearInterval(essayTimerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (essayTimerRef.current) {
        clearInterval(essayTimerRef.current);
      }
    };
  }, [chapter, essaySubmitted]);

  // Speech Synthesis speak trigger
  const speakText = (text: string) => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel(); // cancel current speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // slightly slower for language learning clarity

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleSpeech = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(text);
    }
  };

  // Speech Recognition (STT) Trigger
  const startListening = (onTranscript: (text: string) => void) => {
    if (!sttSupported || !recognitionRef.current) return;

    setIsListening(true);
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onerror = (e: any) => {
      console.error('STT Error', e);
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Helper to determine if speech synthesis or mic recording is active
  const isRecordingOrSpeaking = isListening || isSpeaking;

  // Unified Chapter Completion logic to support location chaining and celebrations
  const handleChapterCompletion = async (currentCh: Chapter) => {
    stopSpeaking();
    if (currentCh.type === ChapterType.LECTURE && notesText.trim()) {
      saveUserNote(currentCh.id, notesText);
    }
    setChapterCompletionError(null);
    setIsCompletingChapter(true);
    playSound('chime', soundEnabled);
    try {
      if (isPracticeMode) {
        console.log('Completing practice attempt for chapter:', currentCh.id);
        
        // Mark practice chapter without overwriting or downgrading main story currentChapter
        await completeChapter(currentCh.id, true);

        // 1. Calculate and award half skill points
        const needsEffortCheck = currentCh.type === ChapterType.DISCUSSION || 
                                 currentCh.type === ChapterType.INDEPENDENT_WORK || 
                                 currentCh.type === ChapterType.CAMPUS_LIFE;
        const shouldAward = !needsEffortCheck || isEffortApproved;
        let scoreToAward = 0;
        if (shouldAward) {
          const rawScore = (gradingResult as any)?.skillPointsContribution ?? (gradingResult ? (gradingResult.score <= 20 ? gradingResult.score : Math.round(5 + (gradingResult.score / 100) * 15)) : 15);
          scoreToAward = Math.max(1, Math.round(rawScore / 2));
          await incrementSkill(currentCh.skill, scoreToAward);
          console.log('Practice skill score updated successfully with', scoreToAward, 'points.');
        }
        setPracticeEarnedPoints(scoreToAward);
        setShowPracticeCelebration(true);
      } else {
        console.log('Completing chapter:', currentCh.id);
        // 1. Mark completed
        await completeChapter(currentCh.id);
        console.log('Chapter completed successfully in repository.');
        
        // 2. Increment skill if appropriate
        const needsEffortCheck = currentCh.type === ChapterType.DISCUSSION || 
                                 currentCh.type === ChapterType.INDEPENDENT_WORK || 
                                 currentCh.type === ChapterType.CAMPUS_LIFE;
        const shouldAward = !needsEffortCheck || isEffortApproved;
        if (shouldAward) {
          const scoreToAward = (gradingResult as any)?.skillPointsContribution ?? (gradingResult ? (gradingResult.score <= 20 ? gradingResult.score : Math.round(5 + (gradingResult.score / 100) * 15)) : 15);
          await incrementSkill(currentCh.skill, scoreToAward);
          console.log('Skill score updated successfully.');
        }

        // 3. Check if it's the last chapter in this location
        const locationChapters = chaptersList.filter((c) => c.locationId === currentCh.locationId);
        const sorted = [...locationChapters].sort((a, b) => Number(a.id) - Number(b.id));
        const lastInLocation = sorted[sorted.length - 1];
        const isLast = (lastInLocation && lastInLocation.id === currentCh.id) || (Number(currentCh.id) % 5 === 0);

        if (isLast) {
          const info = locationDetails[currentCh.locationId] || {
            name: currentCh.locationId.replace('_', ' '),
            summary: `You practiced ${currentCh.skill.toLowerCase()} materials in this campus scene.`
          };
          setCompletedLocationInfo({
            id: currentCh.locationId,
            name: info.name,
            summary: info.summary
          });
          setShowCelebrationModal(true);

          if (currentCh.locationId === 'quad' || String(currentCh.id) === '50' || Number(currentCh.id) === 50) {
            setTimeout(() => {
              setShowTranscriptModal(true);
            }, 600);
          }
        }
      }
    } catch (err: any) {
      console.error('CRITICAL: Error during chapter completion:', err);
      if (err.message !== 'STALE_SESSION') {
        setChapterCompletionError({
          message: err.message || 'Failed to sync your progression. Please check your internet connection and try again.',
          chapter: currentCh
        });
      }
    } finally {
      setIsCompletingChapter(false);
    }
  };

  // Chapter submission triggers
  const handleNarrativeContinue = async () => {
    if (!chapter) return;
    stopSpeaking();
    const prose = chapter.prose || [];
    if (narrativeIndex < prose.length - 1) {
      playSound('pageTurn', soundEnabled);
      setNarrativeIndex((prev) => prev + 1);
    } else {
      await handleChapterCompletion(chapter);
    }
  };

  const handleQuizAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleQuizSubmit = async () => {
    if (!chapter || !chapter.questions) return;
    setQuizSubmitted(true);
    if (chapter.type === ChapterType.LECTURE) {
      setLectureStage('results');
    } else {
      setLibraryStage('results');
    }
  };

  const handleQuizComplete = async () => {
    if (!chapter) return;
    await handleChapterCompletion(chapter);
  };

  const executeDiscussionGrading = async (textToGrade: string) => {
    if (!chapter) return;
    setIsGrading(true);
    setGradingError(null);
    setGradingResult(null);
    setGradingNote('');

    if (canUseRealAiGrade) {
      try {
        const token = localStorage.getItem('campus_auth_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/grade', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            text: textToGrade.trim(),
            prompt: chapter.discussionPrompt || chapter.title,
            type: chapter.type,
            chapterTitle: chapter.title,
            skill: chapter.skill,
            chapterId: chapter.id
          })
        });
        if (response.status === 401) {
          throw new Error('STALE_SESSION');
        }
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        setGradingResult(data);
        recordAiGradeUsed();
      } catch (err: any) {
        console.error('AI discussion grading error, executing local fair evaluation:', err);
        const localResult = evaluateDialogueTurn(textToGrade.trim(), chapter.discussionPrompt, chapter.title);
        setGradingResult(localResult);
      } finally {
        setIsGrading(false);
      }
    } else {
      setTimeout(() => {
        const localResult = evaluateDialogueTurn(textToGrade.trim(), chapter.discussionPrompt, chapter.title);
        setGradingResult(localResult);
        setGradingNote('Weekly free Gemini AI grading limit reached (5/5). Showing fair local rubric feedback.');
        setIsGrading(false);
      }, 350);
    }

    // Speak a professor confirmation response in discussion thread
    setTimeout(() => {
      const profReply = {
        sender: 'Professor Reyes',
        text: `Excellent point, ${profile.name || 'Alex'}. Your response demonstrates strong engagement with our seminar topic.`,
        isUser: false
      };
      setDiscussionChats((prev) => [
        ...prev.filter(m => m.sender !== 'Professor Reyes'),
        profReply
      ]);
      speakText(profReply.text);
    }, 400);
  };

  const handleDiscussionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim() || !chapter) return;

    const userInputText = discussionInput.trim();
    setSubmittedDiscussionText(userInputText);

    // Evaluate effort level of user text or dictation response
    const approved = isInputHighEffort(userInputText);
    setIsEffortApproved(approved);

    const userMessage = { sender: profile.name || 'You', text: userInputText, isUser: true };
    setDiscussionChats((prev) => [...prev, userMessage]);
    setDiscussionInput('');
    setDiscussionSubmitted(true);

    await executeDiscussionGrading(userInputText);
  };

  const handleDiscussionComplete = async () => {
    if (!chapter) return;
    await handleChapterCompletion(chapter);
  };

  const executeEssayGrading = async (textToGrade: string) => {
    if (!chapter) return;
    setIsGrading(true);
    setGradingError(null);
    setGradingResult(null);
    setGradingNote('');

    if (canUseRealAiGrade) {
      try {
        const token = localStorage.getItem('campus_auth_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/grade', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            text: textToGrade.trim(),
            prompt: chapter.essayPrompt || chapter.title,
            type: chapter.type,
            chapterTitle: chapter.title,
            skill: chapter.skill,
            chapterId: chapter.id
          })
        });
        if (response.status === 401) {
          throw new Error('STALE_SESSION');
        }
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        setGradingResult(data);
        recordAiGradeUsed();
      } catch (err: any) {
        console.error('AI grading error, executing local fair evaluation:', err);
        const localResult = evaluateEssay(textToGrade.trim(), chapter.essayPrompt, chapter.title);
        setGradingResult(localResult);
      } finally {
        setIsGrading(false);
      }
    } else {
      setTimeout(() => {
        const localResult = evaluateEssay(textToGrade.trim(), chapter.essayPrompt, chapter.title);
        setGradingResult(localResult);
        setGradingNote('Weekly free Gemini AI grading limit reached (5/5). Showing fair local rubric feedback. Upgrade to Campus Plus for unlimited Gemini AI grading!');
        setIsGrading(false);
      }, 500);
    }
  };

  const handleEssaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter) return;
    const wordCount = essayText.trim() === '' ? 0 : essayText.trim().split(/\s+/).length;
    const min = chapter.minWords || 40;
    if (wordCount < min) {
      alert(`Please write at least ${min} words to complete this reflection (Current word count: ${wordCount}).`);
      return;
    }

    // Evaluate effort level of essay response
    const approved = isInputHighEffort(essayText);
    setIsEffortApproved(approved);

    setEssaySubmitted(true);
    if (essayTimerRef.current) {
      clearInterval(essayTimerRef.current);
    }

    await executeEssayGrading(essayText);
  };

  const handleEssayComplete = async () => {
    if (!chapter) return;
    await handleChapterCompletion(chapter);
  };

  const handleNpcChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!npcInput.trim() || !chapter || !chapter.npcLines || !chapter.npcName) return;

    // Evaluate effort level of chat response
    const approved = isInputHighEffort(npcInput);
    setIsEffortApproved(approved);

    const userMsg = { sender: profile.name || 'You', text: npcInput, isUser: true };
    setNpcChats((prev) => [...prev, userMsg]);
    setNpcInput('');

    // Increment local friendship score
    incrementFriendship(chapter.npcName, 5).then((newScore) => {
      setFriendshipScore(newScore);
    });

    const lines = chapter.npcLines;
    const npcReplyText = lines[npcLineIndex % lines.length];
    
    setTimeout(() => {
      const npcMsg = { sender: chapter.npcName!, text: npcReplyText, isUser: false };
      setNpcChats((prev) => [...prev, npcMsg]);
      setNpcLineIndex((prev) => prev + 1);

      if (npcChats.length >= 4) {
        setNpcChatsCompleted(true);
      }

      // Speak NPC reply
      speakText(npcReplyText);
    }, 1000);
  };

  const handleNpcChatComplete = async () => {
    if (!chapter) return;
    await handleChapterCompletion(chapter);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const biscuitAppearance = chapter
    ? getBiscuitAppearance(chapter.id, chapter.locationId, chapter.biscuitCatIllustration)
    : { show: false, pose: 'watching' as const };

  useEffect(() => {
    if (chapter && biscuitAppearance.show) {
      unlockBiscuitPose(biscuitAppearance.pose);
    }
  }, [chapter, biscuitAppearance.show, biscuitAppearance.pose]);

  if (!chapter) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 text-center" id="no-chapter-selected">
        <BookOpen className="w-16 h-16 text-terracotta/30 dark:text-terracotta/20 mb-4 stroke-[1.5]" />
        <h2 className="font-serif text-2xl font-semibold text-burgundy dark:text-rose-400">No active situation</h2>
        <p className="text-sm text-navy/60 dark:text-slate-400 mt-1 max-w-xs">
          Visit the Campus Map tab and click on an unlocked school building to start a scene!
        </p>
        <button
          onClick={() => setActiveTab('map')}
          className="mt-6 bg-terracotta hover:bg-terracotta-dark text-white text-sm font-semibold py-3 px-6 rounded-2xl cursor-pointer"
        >
          Open Campus Map
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 overflow-hidden font-sans relative" id="story-screen">
      
      {/* Immersive Full-Screen/Full-Width Location Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" id="story-immersive-backdrop">
        <div className="absolute inset-0 opacity-80 dark:opacity-65 scale-105 transform transition-transform duration-700 ease-out">
          <LocationIllustration locationId={chapter.locationId} className="w-full h-full object-cover" />
        </div>
        {/* Soft atmospheric gradient/mask for pristine contrast readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream/30 via-cream/50 to-cream dark:from-slate-950/45 dark:via-slate-950/60 dark:to-slate-950 pointer-events-none" />
      </div>

      {/* Chapter Top Bar - styled with subtle glassmorphism to blend with backdrop */}
      <div
        className="px-4 pb-3 border-b border-navy/5 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center z-10"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={() => {
            if (isPracticeMode) {
              setIsPracticeMode(false);
              setActiveTab('progress');
            } else {
              setActiveTab('map');
            }
          }}
          className="flex items-center gap-1.5 text-xs text-navy/50 dark:text-slate-400 font-medium hover:text-navy dark:hover:text-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {isPracticeMode ? 'Practice' : 'Map'}
        </button>
        <div className="text-center">
          <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">
            {isPracticeMode
              ? 'Practice Session'
              : (isNaN(Number(chapter.id)) || chapter.id.includes('milestone'))
              ? `SPECIAL TALK • ${chapter.skill}`
              : `CHAPTER ${chapter.id} • ${chapter.skill}`}
          </span>
          <h2 className="text-sm font-serif font-bold text-burgundy dark:text-rose-400 truncate max-w-[200px]" title={chapter.title}>
            {chapter.title}
          </h2>
        </div>
        <div className="w-12"></div> {/* spacing placeholder */}
      </div>

      {isPracticeMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/25 text-amber-600 dark:text-amber-400 text-[10px] md:text-xs px-4 py-2 font-mono font-bold flex items-center justify-between z-10 shadow-sm">
          <span>⚠️ PRACTICE ATTEMPT</span>
          <span>Earn 50% Skill Points • No Main Progress</span>
        </div>
      )}

      {/* Main Chapter Content Body */}
      <div ref={contentBodyRef} className="flex-1 overflow-y-auto p-5 space-y-5 z-10 relative" id="story-content-body">
        
        {/* Immersive Location Title Badge */}
        <div className="flex items-center justify-between pb-1" id="story-location-badge-container">
          <span className="text-xs font-mono font-bold text-burgundy dark:text-rose-400 uppercase tracking-widest bg-burgundy/10 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-burgundy/15 dark:border-rose-900/30 shadow-sm backdrop-blur-sm">
            📍 {chapter.locationId.replace('_', ' ')}
          </span>
          <span className="text-[10px] font-mono font-bold text-navy/50 dark:text-slate-400 uppercase tracking-wider bg-navy/5 dark:bg-slate-800/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {isPracticeMode ? 'Practice Attempt' : progress.completedChapterIds.includes(chapter.id) ? '✓ Visited' : '• Active Scene'}
          </span>
        </div>
        
        {/* ==================== 1. NARRATIVE LAYOUT ==================== */}
        {chapter.type === ChapterType.NARRATIVE && (
          <div className="space-y-6 max-w-md mx-auto" id="narrative-layout">
            {biscuitAppearance.show && (
              <div className="flex justify-center my-2">
                <BiscuitIllustration pose={biscuitAppearance.pose} className="w-80 md:w-96 shadow-lg hover:scale-[1.02] transition-all duration-300" />
              </div>
            )}
            
            <div className="space-y-4 font-serif text-lg leading-relaxed text-navy dark:text-slate-100 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-navy/5 dark:border-slate-800 p-6 rounded-3xl shadow-sm" id="narrative-prose-container">
              {chapter.prose?.slice(0, narrativeIndex + 1).map((p, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="first-letter:text-3xl first-letter:font-bold first-letter:text-terracotta first-letter:mr-1 first-letter:float-left text-navy/90 dark:text-slate-200"
                >
                  <InteractiveVocabularyText text={p} />
                </motion.p>
              ))}
            </div>

            <div className="pt-6">
              {!isOnline && narrativeIndex === (chapter.prose?.length || 0) - 1 && (
                <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl mb-3 font-medium shadow-sm">
                  <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Connect to the internet to submit and save your progress</span>
                </div>
              )}
              <button
                id="narrative-continue-btn"
                onClick={handleNarrativeContinue}
                disabled={!isOnline && narrativeIndex === (chapter.prose?.length || 0) - 1}
                className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {narrativeIndex < (chapter.prose?.length || 0) - 1 ? (
                  <>
                    Continue reading <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Finish Chapter & Learn Reading <Award className="w-4 h-4" />
                  </>
                )}
              </button>
              <div className="text-center mt-2 font-mono text-[11px] text-navy/40 dark:text-slate-500 font-semibold">
                Page {narrativeIndex + 1} of {chapter.prose?.length}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. LECTURE LAYOUT ==================== */}
        {chapter.type === ChapterType.LECTURE && (
          <div className="space-y-6 max-w-md mx-auto" id="lecture-layout">
            {lectureStage === 'listening' ? (
              <div className="space-y-5" id="lecture-listening-stage">
                {biscuitAppearance.show && (
                  <div className="flex justify-center mb-1">
                    <BiscuitIllustration pose={biscuitAppearance.pose} className="w-80 md:w-96 shadow-lg hover:scale-[1.02] transition-all duration-300" />
                  </div>
                )}
                <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 p-5 rounded-3xl shadow-sm text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta mx-auto border border-terracotta/20">
                    <Volume2 className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-burgundy dark:text-rose-400">Interactive Audio Lecture</h3>
                    <p className="text-xs text-navy/60 dark:text-slate-300">
                      Listen to Professor Sterling discuss cognitive short-term memory schemas. Take careful notes while listening to prepare for the comprehension quiz!
                    </p>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      id="lecture-audio-play-btn"
                      onClick={() => toggleSpeech(chapter.transcript || '')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-semibold shadow-sm cursor-pointer transition-all ${
                        isSpeaking
                          ? 'bg-burgundy text-white hover:bg-burgundy/90 dark:bg-rose-900 dark:hover:bg-rose-900/95'
                          : 'bg-terracotta text-white hover:bg-terracotta-dark'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-4 h-4" /> Pause Lecture
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" /> Play Lecture (TTS)
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Notes Input Area */}
                <div className="space-y-2">
                  <label htmlFor="lecture-notes" className="text-sm font-semibold text-navy dark:text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-terracotta" />
                    Lecture Notebook (Editable Notes)
                  </label>
                  <textarea
                    id="lecture-notes"
                    placeholder="Type key vocabulary, dates, and ideas here as you listen..."
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="w-full h-32 bg-white dark:bg-slate-950 text-navy dark:text-slate-100 placeholder-navy/40 dark:placeholder-slate-500 border border-navy/10 dark:border-slate-800 rounded-2xl p-4 text-xs shadow-inner focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all"
                  />
                  <p className="text-[10px] text-navy/40 dark:text-slate-500 italic">Notes are purely for your learning and won't be graded.</p>
                </div>

                <div className="pt-2">
                  <button
                    id="lecture-done-listening-btn"
                    onClick={() => {
                      stopSpeaking();
                      if (chapter && notesText.trim()) {
                        saveUserNote(chapter.id, notesText);
                      }
                      setLectureStage('quiz');
                    }}
                    className="w-full bg-navy hover:bg-navy-light dark:bg-slate-850 dark:hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Done Listening & Start Quiz <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              // Quiz & Results Stages
              <div className="space-y-5" id="lecture-quiz-stage">
                <div className="bg-cream-card dark:bg-slate-900 border border-navy/5 dark:border-slate-800 p-4 rounded-2xl space-y-1">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-burgundy dark:text-rose-400">Lecture Notebook (Your Notes)</h4>
                  <p className="text-xs text-navy/80 dark:text-slate-300 whitespace-pre-line italic font-serif">
                    {notesText.trim() ? `"${notesText}"` : "(No notes taken during lecture)"}
                  </p>
                </div>

                <h3 className="font-serif text-lg font-bold text-burgundy dark:text-rose-400">Comprehension Check</h3>
                
                <div className="space-y-6" id="questions-list">
                  {shuffledQuestions.map((q) => (
                    <div key={q.id} className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
                      <p className="text-xs font-semibold text-navy dark:text-slate-200 flex gap-1.5">
                        <HelpCircle className="w-4 h-4 text-terracotta shrink-0" />
                        <InteractiveVocabularyText text={q.questionText} />
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = selectedAnswers[q.id] === oIdx;
                          const isCorrect = q.correctIndex === oIdx;
                          const showResults = lectureStage === 'results';

                          let buttonStyle = 'bg-cream dark:bg-slate-950 hover:bg-navy/5 dark:hover:bg-slate-800 text-navy dark:text-slate-200 border-navy/5 dark:border-slate-850';
                          if (isSelected) {
                            buttonStyle = 'bg-terracotta/10 dark:bg-terracotta/20 border-terracotta text-terracotta dark:text-rose-400';
                          }
                          if (showResults) {
                            if (isCorrect) {
                              buttonStyle = 'bg-sage-light dark:bg-emerald-950/20 border-sage dark:border-emerald-800 text-sage dark:text-emerald-400 font-medium';
                            } else if (isSelected) {
                              buttonStyle = 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-900/40 text-red-700 dark:text-red-400';
                            } else {
                              buttonStyle = 'bg-cream dark:bg-slate-950 text-navy/40 dark:text-slate-600 border-navy/5 dark:border-slate-850 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={showResults}
                              onClick={() => handleQuizAnswer(q.id, oIdx)}
                              className={`w-full text-left p-3 rounded-xl text-xs border transition-all flex justify-between items-center cursor-pointer ${buttonStyle}`}
                            >
                              <span><InteractiveVocabularyText text={opt} /></span>
                              {showResults && isCorrect && <CheckCircle className="w-4 h-4 text-sage" />}
                              {showResults && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-red-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {lectureStage === 'quiz' ? (
                  <div className="space-y-3">
                    {!isOnline && (
                      <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl font-medium shadow-sm">
                        <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Connect to the internet to submit and save your progress</span>
                      </div>
                    )}
                    <button
                      id="submit-lecture-quiz-btn"
                      onClick={handleQuizSubmit}
                      disabled={!isOnline || Object.keys(selectedAnswers).length < (shuffledQuestions.length || 0)}
                      className="w-full bg-terracotta hover:bg-terracotta-dark disabled:bg-navy/10 disabled:text-navy/30 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Submit Answers
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      const f = LECTURE_FEEDBACK[feedbackIndex](chapter.title, chapter.skill);
                      return (
                        <div className="bg-sage-light dark:bg-emerald-950/20 border border-sage/20 dark:border-emerald-800/40 p-4 rounded-2xl flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-sage shrink-0" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-sage dark:text-emerald-400 uppercase tracking-wider">{f.title}</h4>
                            <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed">
                              {f.text}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {!isOnline && (
                      <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl font-medium shadow-sm">
                        <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Connect to the internet to submit and save your progress</span>
                      </div>
                    )}
                    <button
                      id="complete-lecture-btn"
                      onClick={handleQuizComplete}
                      disabled={!isOnline}
                      className="w-full bg-navy hover:bg-navy-light dark:bg-slate-850 dark:hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                    >
                      Complete Lecture Practice <Award className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. DISCUSSION LAYOUT ==================== */}
        {chapter.type === ChapterType.DISCUSSION && (
          <div className="space-y-5 max-w-md mx-auto flex flex-col h-full" id="discussion-layout">
            {biscuitAppearance.show && (
              <div className="flex justify-center mb-1">
                <BiscuitIllustration pose={biscuitAppearance.pose} className="w-80 md:w-96 shadow-lg hover:scale-[1.02] transition-all duration-300" />
              </div>
            )}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[55vh]" id="discussion-chat-bubbles">
              {discussionChats.map((chat, idx) => {
                const isProf = chat.sender.startsWith('Prof');
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: chat.isUser ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex flex-col ${chat.isUser ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] font-mono font-semibold text-navy/40 dark:text-slate-500 mb-0.5 px-1">{chat.sender}</span>
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-xs leading-relaxed ${
                        chat.isUser
                          ? 'bg-terracotta text-white rounded-tr-none'
                          : isProf
                          ? 'bg-burgundy/10 dark:bg-rose-950/20 text-burgundy dark:text-rose-400 border border-burgundy/10 dark:border-rose-900/30 rounded-tl-none font-serif text-sm'
                          : 'bg-white dark:bg-slate-900 text-navy dark:text-slate-200 border border-navy/5 dark:border-slate-800 rounded-tl-none'
                      }`}
                    >
                      {chat.isUser ? (
                        chat.text
                      ) : (
                        <InteractiveVocabularyText text={chat.text} />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {!discussionSubmitted ? (
              <div className="space-y-3 pt-2">
                {!isOnline && (
                  <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl font-medium shadow-sm">
                    <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Connect to the internet to submit and save your progress</span>
                  </div>
                )}
                <form onSubmit={handleDiscussionSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="discussion-response" className="text-xs font-semibold text-navy/70 dark:text-slate-300 uppercase tracking-wider block">
                      Your Response
                    </label>
                    <p className="text-xs text-navy/50 dark:text-slate-400">Draft your stance (Agree or Disagree with classmate rationales) or click the Mic to dictate.</p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      id="discussion-response"
                      type="text"
                      placeholder={isListening ? "Listening... Speak now..." : "Type or dictate academic argument..."}
                      value={discussionInput}
                      onChange={(e) => setDiscussionInput(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-950 text-navy dark:text-slate-100 placeholder-navy/40 dark:placeholder-slate-500 border border-navy/10 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent"
                      disabled={isListening || !isOnline}
                    />

                    {/* STT Microphone button */}
                    {sttSupported ? (
                      <button
                        type="button"
                        id="discussion-mic-btn"
                        onClick={() => {
                          if (isListening) {
                            stopListening();
                          } else {
                            startListening((text) => setDiscussionInput((prev) => prev + ' ' + text));
                          }
                        }}
                        disabled={!isOnline}
                        className={`p-3 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          isListening
                            ? 'bg-red-500 border-red-600 text-white animate-pulse'
                            : 'bg-white dark:bg-slate-900 border-navy/10 dark:border-slate-800 text-terracotta hover:bg-navy/5 dark:hover:bg-slate-800'
                        }`}
                        title="Toggle Speech to Text Dictation"
                      >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="p-3 bg-navy/5 dark:bg-slate-800/50 border border-navy/5 dark:border-slate-800 rounded-2xl text-navy/30 dark:text-slate-600 cursor-not-allowed"
                        title="Microphone input only available on supported browsers"
                      >
                        <MicOff className="w-5 h-5" />
                      </button>
                    )}

                    <button
                      type="submit"
                      id="submit-discussion-btn"
                      disabled={!isOnline || !discussionInput.trim()}
                      className="p-3 bg-terracotta hover:bg-terracotta-dark text-white rounded-2xl flex items-center justify-center shadow-sm disabled:bg-navy/5 dark:disabled:bg-slate-800/50 disabled:text-navy/20 dark:disabled:text-slate-600 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-navy/5 dark:border-slate-800">
                {isGrading ? (
                  <div className="bg-navy/5 dark:bg-slate-800/40 p-4 rounded-2xl flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-navy dark:border-slate-300 border-t-transparent rounded-full animate-spin"></span>
                    <span className="text-xs text-navy/70 dark:text-slate-300">Evaluating your response with AI...</span>
                  </div>
                ) : gradingError ? (
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl space-y-3" id="discussion-grading-error">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Grading Failed</h4>
                        <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed">
                          {gradingError}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => executeDiscussionGrading(submittedDiscussionText)}
                        className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all cursor-pointer active:scale-95 text-center"
                        type="button"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => {
                          setGradingError(null);
                          const f = DISCUSSION_FEEDBACK[feedbackIndex]();
                          setGradingResult({ feedback: f.text, score: 15 });
                          setGradingNote('Detailed feedback will appear soon');
                        }}
                        className="flex-1 bg-navy/10 hover:bg-navy/20 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy dark:text-slate-200 text-xs font-medium py-2 px-3 rounded-xl transition-all cursor-pointer active:scale-95 text-center"
                        type="button"
                      >
                        Standard Grade
                      </button>
                    </div>
                  </div>
                ) : !isEffortApproved ? (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Minimal Effort Detected</h4>
                      <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed">
                        Your response was extremely short or lacked standard college-level academic substance. The chapter can be completed, but **0 skill points** will be awarded for this practice.
                      </p>
                    </div>
                  </div>
                ) : gradingResult ? (
                  <EvaluationResultCard
                    result={gradingResult}
                    skillName={chapter.skill}
                    note={gradingNote}
                    submittedText={submittedDiscussionText}
                  />
                ) : (
                  (() => {
                    const f = DISCUSSION_FEEDBACK[feedbackIndex]();
                    return (
                      <div className="bg-sage-light dark:bg-emerald-950/20 border border-sage/20 dark:border-emerald-800/40 p-4 rounded-2xl flex items-start gap-2.5">
                        <CheckCircle className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-sage dark:text-emerald-400 uppercase tracking-wider">{f.title}</h4>
                            <span className="px-2.5 py-0.5 bg-sage/20 dark:bg-emerald-900/40 text-sage dark:text-emerald-300 font-mono text-xs font-bold rounded-full shrink-0">
                              +15 {chapter.skill} Points
                            </span>
                          </div>
                          <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed">
                            {f.text}
                          </p>
                          <p className="text-[11px] font-bold text-terracotta dark:text-rose-400 mt-1">
                            Score Contribution: +15 {chapter.skill} Skill Points
                          </p>
                        </div>
                      </div>
                    );
                  })()
                )}

                {!isOnline && (
                  <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl font-medium shadow-sm">
                    <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Connect to the internet to submit and save your progress</span>
                  </div>
                )}
                <button
                  id="complete-discussion-btn"
                  onClick={handleDiscussionComplete}
                  disabled={isGrading || !isOnline}
                  className="w-full bg-navy hover:bg-navy-light dark:bg-slate-850 dark:hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  Complete Seminar Practice <Award className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== 4. INDEPENDENT WORK LAYOUT ==================== */}
        {chapter.type === ChapterType.INDEPENDENT_WORK && (
          <div className="space-y-5 max-w-md mx-auto" id="independent-work-layout">
            {biscuitAppearance.show && (
              <div className="flex justify-center mb-1">
                <BiscuitIllustration pose={biscuitAppearance.pose} className="w-80 md:w-96 shadow-lg hover:scale-[1.02] transition-all duration-300" />
              </div>
            )}
            <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider px-2 py-0.5 bg-terracotta/5 dark:bg-terracotta/10 rounded border border-terracotta/10 dark:border-terracotta/20">
                  Timed Assignment
                </span>
                <div className="flex items-center gap-1 text-xs font-mono font-semibold text-burgundy dark:text-rose-400" id="cosmetic-timer">
                  <Timer className="w-4 h-4 text-terracotta" />
                  {formatTime(countdownTime)}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-burgundy dark:text-rose-400">Academic Reflection Prompt</h3>
                <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed font-serif italic">
                  "{chapter.essayPrompt}"
                </p>
              </div>
            </div>

            {!essaySubmitted ? (
              <div className="space-y-4">
                {!isOnline && (
                  <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl font-medium shadow-sm">
                    <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Connect to the internet to submit and save your progress</span>
                  </div>
                )}
                <form onSubmit={handleEssaySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <label htmlFor="essay-text" className="text-xs font-semibold text-navy/70 dark:text-slate-300 uppercase tracking-wider">
                        Write Paragraph Here
                      </label>
                      <span className="font-mono text-xs font-semibold text-navy/50 dark:text-slate-400">
                        Words: <span className="text-burgundy dark:text-rose-400 font-bold">{essayText.trim() === '' ? 0 : essayText.trim().split(/\s+/).length}</span> / {chapter.minWords || 40} min
                      </span>
                    </div>

                    <textarea
                      id="essay-text"
                      placeholder="Draft your response here. Take your time to write coherent academic paragraphs..."
                      value={essayText}
                      onChange={(e) => setEssayText(e.target.value)}
                      disabled={!isOnline}
                      className="w-full h-48 bg-white dark:bg-slate-950 text-navy dark:text-slate-100 placeholder-navy/40 dark:placeholder-slate-500 border border-navy/10 dark:border-slate-800 rounded-2xl p-4 text-xs shadow-inner focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <button
                    id="submit-essay-btn"
                    type="submit"
                    disabled={!isOnline}
                    className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Final Essay
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {!isEffortApproved ? (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Minimal Effort Detected</h4>
                        <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed">
                          Your response was short or repetitive. The chapter can be completed, but **0 skill points** will be awarded for this practice.
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-950/60 p-3 rounded-xl border border-navy/5 dark:border-slate-800 font-serif text-xs leading-relaxed text-navy/80 dark:text-slate-300 italic">
                      "{essayText}"
                    </div>
                  </div>
                ) : gradingError ? (
                  <div className="space-y-3">
                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl space-y-3">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Grading Failed</h4>
                          <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed">
                            {gradingError}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => executeEssayGrading(essayText)}
                          className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all cursor-pointer active:scale-95 text-center"
                          type="button"
                        >
                          Try Again
                        </button>
                        <button
                          onClick={() => {
                            setGradingError(null);
                            const wc = essayText.trim() === '' ? 0 : essayText.trim().split(/\s+/).length;
                            const f = ESSAY_FEEDBACK[feedbackIndex](wc);
                            setGradingResult({ feedback: f.text, score: 15 });
                            setGradingNote('Detailed feedback will appear soon');
                          }}
                          className="flex-1 bg-navy/10 hover:bg-navy/20 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy dark:text-slate-200 text-xs font-medium py-2 px-3 rounded-xl transition-all cursor-pointer active:scale-95 text-center"
                          type="button"
                        >
                          Standard Grade
                        </button>
                      </div>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-950/60 p-3 rounded-xl border border-navy/5 dark:border-slate-800 font-serif text-xs leading-relaxed text-navy/80 dark:text-slate-300 italic">
                      "{essayText}"
                    </div>
                  </div>
                ) : isGrading ? (
                  <div className="space-y-3">
                    <div className="bg-navy/5 dark:bg-slate-800/40 p-4 rounded-2xl flex items-center gap-3 animate-pulse border border-navy/5 dark:border-slate-800">
                      <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-terracotta animate-spin shrink-0"></div>
                      <div className="space-y-1.5 flex-1">
                        <h4 className="text-xs font-semibold text-terracotta uppercase tracking-wider">AI Essay Grading In Progress</h4>
                        <p className="text-[11px] text-navy/60 dark:text-slate-400">Analyzing paragraph structure, vocabulary richness, and key points...</p>
                      </div>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-950/60 p-3 rounded-xl border border-navy/5 dark:border-slate-800 font-serif text-xs leading-relaxed text-navy/80 dark:text-slate-300 italic">
                      "{essayText}"
                    </div>
                  </div>
                ) : gradingResult ? (
                  <EvaluationResultCard
                    result={gradingResult}
                    skillName="Writing"
                    note={gradingNote}
                    submittedText={essayText}
                  />
                ) : (
                  (() => {
                    const wc = essayText.trim() === '' ? 0 : essayText.trim().split(/\s+/).length;
                    const f = ESSAY_FEEDBACK[feedbackIndex](wc);
                    return (
                      <div className="bg-sage-light dark:bg-emerald-950/20 border border-sage/20 dark:border-emerald-800/40 p-4 rounded-2xl space-y-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-sage shrink-0" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-sage dark:text-emerald-400 uppercase tracking-wider">{f.title}</h4>
                            <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed">
                              {f.text}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/60 dark:bg-slate-950/60 p-3 rounded-xl border border-navy/5 dark:border-slate-800 font-serif text-xs leading-relaxed text-navy/80 dark:text-slate-300 italic">
                          "{essayText}"
                        </div>
                      </div>
                    );
                  })()
                )}

                {!isOnline && (
                  <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl font-medium shadow-sm">
                    <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Connect to the internet to submit and save your progress</span>
                  </div>
                )}
                <button
                  id="complete-essay-btn"
                  onClick={handleEssayComplete}
                  disabled={isGrading || !isOnline}
                  className="w-full bg-navy hover:bg-navy-light dark:bg-slate-850 dark:hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  Complete Writing Practice <Award className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}        {/* ==================== 5. LIBRARY LAYOUT ==================== */}
        {chapter.type === ChapterType.LIBRARY && (
          <div className="space-y-5 max-w-md mx-auto" id="library-layout">
            {libraryStage === 'reading' ? (
              <div className="space-y-5" id="library-reading-stage">
                {biscuitAppearance.show && (
                  <div className="flex justify-center mb-1">
                    <BiscuitIllustration pose={biscuitAppearance.pose} className="w-80 md:w-96 shadow-lg hover:scale-[1.02] transition-all duration-300" />
                  </div>
                )}
                
                {/* Document Card */}
                <div className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden font-serif">
                  {/* Decorative stamp */}
                  <div className="absolute right-4 top-4 w-12 h-12 rounded-full border-2 border-dashed border-terracotta/20 flex items-center justify-center text-terracotta/20 dark:text-terracotta/10 font-bold font-sans text-[9px] uppercase tracking-wider rotate-12 select-none">
                    Library
                  </div>

                  <div className="border-b border-navy/5 dark:border-slate-800 pb-3 space-y-1 font-sans">
                    <span className="text-[10px] font-mono font-bold text-terracotta uppercase">Inbox Letter / Document</span>
                    <h3 className="text-md font-bold text-burgundy dark:text-rose-400 leading-snug">{chapter.documentTitle}</h3>
                  </div>

                  <div className="text-xs text-navy/90 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3 font-serif">
                    <InteractiveVocabularyText text={chapter.documentBody || ''} />
                  </div>
                </div>

                <button
                  id="library-start-quiz-btn"
                  onClick={() => setLibraryStage('quiz')}
                  className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Answer Letter Questions <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // Quiz & Results Stages
              <div className="space-y-5" id="library-quiz-stage">
                <div className="flex justify-between items-center pb-2">
                  <h3 className="font-serif text-lg font-bold text-burgundy dark:text-rose-400">Reading Comprehension</h3>
                  <button
                    onClick={() => setLibraryStage('reading')}
                    className="text-xs text-terracotta font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> View Letter
                  </button>
                </div>
                
                <div className="space-y-6" id="library-questions">
                  {shuffledQuestions.map((q) => (
                    <div key={q.id} className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
                      <p className="text-xs font-semibold text-navy dark:text-slate-200 flex gap-1.5">
                        <HelpCircle className="w-4 h-4 text-terracotta shrink-0" />
                        <InteractiveVocabularyText text={q.questionText} />
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = selectedAnswers[q.id] === oIdx;
                          const isCorrect = q.correctIndex === oIdx;
                          const showResults = libraryStage === 'results';

                          let buttonStyle = 'bg-cream dark:bg-slate-950 hover:bg-navy/5 dark:hover:bg-slate-800 text-navy dark:text-slate-200 border-navy/5 dark:border-slate-850';
                          if (isSelected) {
                            buttonStyle = 'bg-terracotta/10 dark:bg-terracotta/20 border-terracotta text-terracotta dark:text-rose-400';
                          }
                          if (showResults) {
                            if (isCorrect) {
                              buttonStyle = 'bg-sage-light dark:bg-emerald-950/20 border-sage dark:border-emerald-800 text-sage dark:text-emerald-400 font-medium';
                            } else if (isSelected) {
                              buttonStyle = 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-900/40 text-red-700 dark:text-red-400';
                            } else {
                              buttonStyle = 'bg-cream dark:bg-slate-950 text-navy/40 dark:text-slate-600 border-navy/5 dark:border-slate-850 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={showResults}
                              onClick={() => handleQuizAnswer(q.id, oIdx)}
                              className={`w-full text-left p-3 rounded-xl text-xs border transition-all flex justify-between items-center cursor-pointer ${buttonStyle}`}
                            >
                              <span><InteractiveVocabularyText text={opt} /></span>
                              {showResults && isCorrect && <CheckCircle className="w-4 h-4 text-sage" />}
                              {showResults && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-red-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {libraryStage === 'quiz' ? (
                  <div className="space-y-3">
                    {!isOnline && (
                      <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl font-medium shadow-sm">
                        <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Connect to the internet to submit and save your progress</span>
                      </div>
                    )}
                    <button
                      id="submit-library-quiz-btn"
                      onClick={handleQuizSubmit}
                      disabled={!isOnline || Object.keys(selectedAnswers).length < (shuffledQuestions.length || 0)}
                      className="w-full bg-terracotta hover:bg-terracotta-dark disabled:bg-navy/10 disabled:text-navy/30 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Submit Quiz Answers
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      const f = LIBRARY_FEEDBACK[feedbackIndex](chapter.documentTitle || 'the assigned letter');
                      return (
                        <div className="bg-sage-light dark:bg-emerald-950/20 border border-sage/20 dark:border-emerald-800/40 p-4 rounded-2xl flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-sage shrink-0" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-sage dark:text-emerald-400 uppercase tracking-wider">{f.title}</h4>
                            <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed">
                              {f.text}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {!isOnline && (
                      <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl font-medium shadow-sm">
                        <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Connect to the internet to submit and save your progress</span>
                      </div>
                    )}
                    <button
                      id="complete-library-btn"
                      onClick={handleQuizComplete}
                      disabled={!isOnline}
                      className="w-full bg-navy hover:bg-navy-light dark:bg-slate-850 dark:hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                    >
                      Complete Library Practice <Award className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== 6. CAMPUS LIFE LAYOUT ==================== */}
        {chapter.type === ChapterType.CAMPUS_LIFE && (
          <div className="space-y-5 max-w-md mx-auto flex flex-col h-full" id="campus-life-layout">
            {biscuitAppearance.show && (
              <div className="flex justify-center mb-1">
                <BiscuitIllustration pose={biscuitAppearance.pose} className="w-80 md:w-96 shadow-lg hover:scale-[1.02] transition-all duration-300" />
              </div>
            )}
            {/* NPC Friendship Counter Banner */}
            <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 p-3 rounded-2xl shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-navy/10 flex items-center justify-center bg-cream shrink-0">
                  <img
                    src={chapter.npcName?.toLowerCase().includes('reyes') ? reyesPortrait : jordanPortrait}
                    alt={chapter.npcName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-navy dark:text-slate-200">{chapter.npcName}</h4>
                  <p className="text-[10px] text-navy/50 dark:text-slate-400 font-medium">Roommate & Friend</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold font-mono text-burgundy dark:text-rose-400 bg-burgundy/5 dark:bg-rose-950/20 px-2.5 py-1 rounded-lg border border-burgundy/10 dark:border-rose-900/30">
                <Heart className="w-3.5 h-3.5 text-terracotta fill-current" />
                {friendshipScore} pts
              </div>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[50vh]" id="campus-life-chats">
              {npcChats.map((chat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: chat.isUser ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex flex-col ${chat.isUser ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] font-mono font-semibold text-navy/40 dark:text-slate-500 mb-0.5 px-1">{chat.sender}</span>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      chat.isUser
                        ? 'bg-terracotta text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-900 text-navy dark:text-slate-200 border border-navy/5 dark:border-slate-800 rounded-tl-none font-serif text-sm italic'
                    }`}
                  >
                    {chat.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input / controls */}
            {!npcChatsCompleted ? (
              <div className="space-y-3 pt-2">
                {!isOnline && (
                  <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl font-medium shadow-sm">
                    <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{t.storyInternetRequired || 'Connect to the internet to submit and save your progress'}</span>
                  </div>
                )}
                <form onSubmit={handleNpcChatSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      id="campus-life-response"
                      type="text"
                      placeholder={isListening ? (t.storyListening || "Listening...") : `${t.storyMessageNPC || "Message"} ${chapter?.npcName || ''}...`}
                      value={npcInput}
                      onChange={(e) => setNpcInput(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-950 text-navy dark:text-slate-100 placeholder-navy/40 dark:placeholder-slate-500 border border-navy/10 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent"
                      disabled={isListening || !isOnline}
                    />

                    {/* STT Microphone button */}
                    {sttSupported ? (
                      <button
                        type="button"
                        id="campus-life-mic-btn"
                        onClick={() => {
                          if (isListening) {
                            stopListening();
                          } else {
                            startListening((text) => setNpcInput((prev) => prev + ' ' + text));
                          }
                        }}
                        disabled={!isOnline}
                        className={`p-3 rounded-2xl flex items-center justify-center shadow-sm border cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          isListening
                            ? 'bg-red-500 border-red-600 text-white animate-pulse'
                            : 'bg-white dark:bg-slate-900 border-navy/10 dark:border-slate-800 text-terracotta hover:bg-navy/5 dark:hover:bg-slate-800'
                        }`}
                        title="Toggle Speech to Text Dictation"
                      >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="p-3 bg-navy/5 dark:bg-slate-800/50 border border-navy/5 dark:border-slate-800 rounded-2xl text-navy/30 dark:text-slate-600 cursor-not-allowed"
                      >
                        <MicOff className="w-5 h-5" />
                      </button>
                    )}

                    <button
                      type="submit"
                      id="submit-npc-chat-btn"
                      disabled={!isOnline || !npcInput.trim()}
                      className="p-3 bg-terracotta hover:bg-terracotta-dark text-white rounded-2xl flex items-center justify-center shadow-sm disabled:bg-navy/5 dark:disabled:bg-slate-800/50 disabled:text-navy/20 dark:disabled:text-slate-600 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-center font-mono text-[10px] text-navy/40 dark:text-slate-500 font-semibold">
                    {(t.storyReplyCountToUnlock || 'Reply {index} / 3 to unlock complete button').replace('{index}', String(npcLineIndex))}
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-navy/5 dark:border-slate-800">
                {!isEffortApproved ? (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{t.storyMinimalEffortTitle || 'Minimal Effort Detected'}</h4>
                      <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed">
                        {t.storyMinimalEffortDesc ? (
                          <span>{t.storyMinimalEffortDesc.replace('**0 skill points**', '0 skill points')}</span>
                        ) : (
                          <span>Your response was short or repetitive. The chapter can be completed, but <strong>0 skill points</strong> will be awarded for this practice.</span>
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const f = CAMPUS_LIFE_FEEDBACK[feedbackIndex](chapter?.npcName || 'your peer');
                    return (
                      <div className="bg-sage-light dark:bg-emerald-950/20 border border-sage/20 dark:border-emerald-800/40 p-4 rounded-2xl flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-sage shrink-0" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-sage dark:text-emerald-400 uppercase tracking-wider">{f.title}</h4>
                          <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed">
                            {f.text}
                          </p>
                        </div>
                      </div>
                    );
                  })()
                )}

                {!isOnline && (
                  <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl font-medium shadow-sm">
                    <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{t.storyInternetRequired || 'Connect to the internet to submit and save your progress'}</span>
                  </div>
                )}
                <button
                  id="complete-campus-life-btn"
                  onClick={handleNpcChatComplete}
                  disabled={!isOnline}
                  className="w-full bg-navy hover:bg-navy-light dark:bg-slate-850 dark:hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  {t.storyCompleteSocialBtn || 'Complete Social Chat'} <Award className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Celebratory Location Completion Modal */}
      <AnimatePresence>
        {showCelebrationModal && completedLocationInfo && (() => {
          const defaultLocName = completedLocationInfo.name;
          const defaultLocSummary = completedLocationInfo.summary;
          const locId = completedLocationInfo.id;

          let locName = defaultLocName;
          let locSummary = defaultLocSummary;

          if (locId) {
            switch (locId) {
              case 'dorm':
                locName = profile.dorm || t.buildingDormName || defaultLocName;
                locSummary = t.summaryDorm || defaultLocSummary;
                break;
              case 'lecture_hall':
                locName = t.buildingLectureName || defaultLocName;
                locSummary = t.summaryLectureHall || defaultLocSummary;
                break;
              case 'seminar_room':
                locName = t.buildingSeminarName || defaultLocName;
                locSummary = t.summarySeminarRoom || defaultLocSummary;
                break;
              case 'writing_center':
                locName = t.buildingWritingName || defaultLocName;
                locSummary = t.summaryWritingCenter || defaultLocSummary;
                break;
              case 'library':
                locName = t.buildingLibraryName || defaultLocName;
                locSummary = t.summaryLibrary || defaultLocSummary;
                break;
              case 'dining_hall':
                locName = t.buildingDiningName || defaultLocName;
                locSummary = t.summaryDiningHall || defaultLocSummary;
                break;
              case 'student_union':
                locName = t.buildingUnionName || defaultLocName;
                locSummary = t.summaryStudentUnion || defaultLocSummary;
                break;
              case 'science_lab':
                locName = t.buildingLabName || defaultLocName;
                locSummary = t.summaryScienceLab || defaultLocSummary;
                break;
              case 'career_center':
                locName = t.buildingCareerName || defaultLocName;
                locSummary = t.summaryCareerCenter || defaultLocSummary;
                break;
              case 'quad':
                locName = t.buildingQuadName || defaultLocName;
                locSummary = t.summaryQuad || defaultLocSummary;
                break;
            }
          }

          const decorMap: Record<string, string> = {
            dorm: 'backpack',
            lecture_hall: 'mug',
            seminar_room: 'corkboard',
            writing_center: 'owl',
            library: 'monstera',
            dining_hall: 'mountain_frame',
            student_union: 'edinburgh_poster'
          };
          const unlockedDecorId = decorMap[locId];
          const unlockedDecor = unlockedDecorId ? DORM_DECOR_ITEMS.find((d) => d.id === unlockedDecorId) : null;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-navy/60 dark:bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-3xl p-6 shadow-xl max-w-md w-full text-center space-y-5"
                id="location-completion-modal"
              >
                <div className="w-16 h-16 rounded-full bg-terracotta/10 dark:bg-terracotta/20 flex items-center justify-center text-terracotta mx-auto border border-terracotta/20">
                  <Award className="w-8 h-8 stroke-[1.5]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-widest block">{t.storyLocationMastered || 'Location Completed!'}</span>
                  <h2 className="text-2xl font-serif font-bold text-burgundy dark:text-rose-400">
                    {t.storyCongratulations || 'Congratulations'}, {profile.name}!
                  </h2>
                  <p className="text-sm font-semibold text-navy/80 dark:text-slate-200">
                    {t.storyCompletedAllChapters || 'You completed all chapters in'} {locName}!
                  </p>
                </div>

                {/* 🎉 New Room Decor Unlocked Badge */}
                {unlockedDecor && (
                  <div className="bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 rounded-2xl p-3.5 flex items-center gap-3 text-left shadow-xs">
                    <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shrink-0 border border-amber-500/30 overflow-hidden">
                      <img src={unlockedDecor.image} alt={unlockedDecor.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                        🎉 New Room Decor Unlocked!
                      </span>
                      <h4 className="text-sm font-bold text-navy dark:text-slate-100 truncate">{unlockedDecor.name}</h4>
                      <p className="text-[11px] text-navy/70 dark:text-slate-300 line-clamp-2 leading-tight">{unlockedDecor.description}</p>
                    </div>
                  </div>
                )}

                <div className="bg-cream-card dark:bg-slate-950 p-4 rounded-2xl border border-navy/5 dark:border-slate-800 text-left">
                  <p className="text-[9px] text-navy/40 dark:text-slate-500 font-bold uppercase tracking-wider mb-1 font-mono">{t.storyAcademicPracticeSummary || 'Academic Practice Summary'}</p>
                  <p className="text-xs text-navy/70 dark:text-slate-300 leading-relaxed font-medium">
                    {locSummary}
                  </p>
                </div>

                {(locId === 'quad' || progress.completedChapterIds.length >= 50) && (
                  <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-yellow-500/25 to-amber-500/15 rounded-2xl border border-amber-400/50 text-center space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Semester 1 Graduation Achieved!</span>
                    </div>
                    <button
                      onClick={() => {
                        playSound('click', soundEnabled, isRecordingOrSpeaking);
                        setShowCelebrationModal(false);
                        setCompletedLocationInfo(null);
                        setShowTranscriptModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-slate-950 font-bold text-xs py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-amber-300"
                      id="view-transcript-from-celebration-btn"
                    >
                      <Scroll className="w-4 h-4 text-slate-950" />
                      <span>📜 View Your Official Academic Transcript</span>
                    </button>
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  {unlockedDecor && (
                    <button
                      onClick={() => {
                        playSound('click', soundEnabled, isRecordingOrSpeaking);
                        unlockAndEquipDecor(unlockedDecor.id);
                        setAutoOpenDecorId(unlockedDecor.id);
                        setShowCelebrationModal(false);
                        setCompletedLocationInfo(null);
                        setActiveTab('home');
                      }}
                      className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-xs md:text-sm"
                      id="equip-decor-from-celebration-btn"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Go to Room & Equip</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      playSound('click', soundEnabled, isRecordingOrSpeaking);
                      setShowCelebrationModal(false);
                      setCompletedLocationInfo(null);
                      setActiveTab('map');
                    }}
                    className={`w-full font-semibold py-3 px-6 rounded-2xl transition-all cursor-pointer active:scale-95 text-xs md:text-sm ${
                      unlockedDecor
                        ? 'bg-cream-card dark:bg-slate-800 border border-navy/10 dark:border-slate-700 text-navy dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                        : 'bg-terracotta hover:bg-terracotta-dark text-white shadow-md'
                    }`}
                    id="close-celebration-btn"
                  >
                    {t.storyReturnToMap || 'Continue'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Celebratory Practice Completion Modal */}
      <AnimatePresence>
        {showPracticeCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-navy/60 dark:bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-3xl p-6 shadow-xl max-w-md w-full text-center space-y-5"
              id="practice-completion-modal"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 mx-auto border border-amber-500/20">
                <CheckCircle className="w-8 h-8 stroke-[1.5]" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">{t.storyPracticeCompleted || 'Practice Completed'}</span>
                <h2 className="text-2xl font-serif font-bold text-burgundy dark:text-rose-400">
                  {t.storyGreatPractice || 'Great Practice'}, {profile.name}!
                </h2>
                <p className="text-xs md:text-sm font-semibold text-navy/80 dark:text-slate-200">
                  {(t.storySuccessfullyCompletedPractice || 'You successfully completed "{title}" as a Practice Attempt.').replace('{title}', chapter?.title || '')}
                </p>
              </div>

              <div className="bg-cream-card dark:bg-slate-950 p-4 rounded-2xl border border-navy/5 dark:border-slate-800 text-left space-y-2">
                <p className="text-[9px] text-navy/40 dark:text-slate-500 font-bold uppercase tracking-wider font-mono">{t.storyAcademicAchievementSummary || 'Academic Achievement Summary'}</p>
                <div className="text-xs text-navy/70 dark:text-slate-300 leading-relaxed font-medium">
                  {practiceEarnedPoints > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 dark:text-emerald-400 font-bold">+{practiceEarnedPoints}</span>
                      <span>{chapter?.skill} {uiLanguage === 'RU' ? 'очков навыков начислено (50% бонусных очков за практику)' : (uiLanguage === 'ES' ? 'puntos otorgados (50% de bonificación por práctica)' : 'Skill Points awarded (50% bonus points for practice)')}</span>
                    </div>
                  ) : (
                    <span>{uiLanguage === 'RU' ? 'За эту попытку не начислено очков из-за гейта минимальных усилий. Продолжайте тренироваться с содержательными ответами!' : (uiLanguage === 'ES' ? 'No se otorgaron puntos por esta práctica debido al filtro de esfuerzo mínimo.' : 'No skill points were awarded for this attempt due to the minimal effort gate. Keep practicing with high-effort responses!')}</span>
                  )}
                </div>
                <div className="border-t border-navy/5 dark:border-slate-800/60 pt-2 text-[10px] text-navy/50 dark:text-slate-400 italic leading-relaxed">
                  {uiLanguage === 'RU' ? 'Прохождение практических заданий не продвигает основной сюжет кампуса, но служит отличным способом подготовиться к экзаменам.' : (uiLanguage === 'ES' ? 'Completar intentos de práctica no avanza la historia del campus, pero sirve para prepararse.' : 'Completing practice attempts does not advance your core story progression or alter your completed chapter count, but serves as an excellent way to prepare for your exams.')}
                </div>
              </div>

              <button
                onClick={() => {
                  playSound('click', soundEnabled, isRecordingOrSpeaking);
                  setShowPracticeCelebration(false);
                  setIsPracticeMode(false);
                  setActiveTab('progress');
                }}
                className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer active:scale-95 text-xs md:text-sm"
                id="close-practice-celebration-btn"
              >
                {t.storyReturnToProgress || 'Return to Progress Screen'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Completion Spinner Overlay */}
      {isCompletingChapter && (
        <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in" id="chapter-completion-loading">
          <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-xs space-y-4 flex flex-col items-center">
            <span className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></span>
            <div className="space-y-1">
              <h3 className="font-serif text-sm font-bold text-burgundy dark:text-rose-400">{t.storySavingRecords || 'Saving Academy Records'}</h3>
              <p className="text-[11px] text-navy/60 dark:text-slate-400 leading-relaxed">
                {t.storySyncingProgress || 'Syncing your progress securely with Supabase. Please do not close the app.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Completion Error Overlay */}
      {chapterCompletionError && (
        <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in" id="chapter-completion-error">
          <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-sm space-y-5 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-base font-bold text-red-600 dark:text-red-400">{t.storyProgressSyncBlocked || 'Progress Sync Blocked'}</h3>
              <p className="text-xs text-navy/70 dark:text-slate-300 leading-relaxed">
                {chapterCompletionError.message}
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  const ch = chapterCompletionError.chapter;
                  setChapterCompletionError(null);
                  handleChapterCompletion(ch);
                }}
                className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                {uiLanguage === 'RU' ? 'Попробовать снова' : (uiLanguage === 'ES' ? 'Intentar de Nuevo' : 'Try Again')}
              </button>
              <button
                onClick={() => setChapterCompletionError(null)}
                className="flex-1 bg-navy/5 hover:bg-navy/10 dark:bg-slate-850 dark:hover:bg-slate-800 text-navy dark:text-slate-300 text-xs font-medium py-3 px-4 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                {uiLanguage === 'RU' ? 'Отмена' : (uiLanguage === 'ES' ? 'Cancelar' : 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Academic Transcript Modal */}
      <AcademicTranscriptModal
        isOpen={showTranscriptModal}
        onClose={() => setShowTranscriptModal(false)}
      />
    </div>
  );
};
