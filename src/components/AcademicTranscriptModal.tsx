import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCampus } from '../context/CampusContext';
import { SkillType } from '../data/models';
import * as htmlToImage from 'html-to-image';
import {
  GraduationCap,
  Award,
  Share2,
  X,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Scroll,
  Image as ImageIcon
} from 'lucide-react';

interface AcademicTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getSkillGrade(score: number) {
  const rounded = Math.round(score);
  if (rounded >= 90) return { grade: 'A+', cefr: 'C1 Advanced Academic', label: 'Exemplary' };
  if (rounded >= 80) return { grade: 'A', cefr: 'C1 Advanced', label: 'Proficient' };
  if (rounded >= 70) return { grade: 'B+', cefr: 'B2 Upper Intermediate', label: 'High Competency' };
  if (rounded >= 60) return { grade: 'B', cefr: 'B2 Intermediate', label: 'Competent' };
  if (rounded >= 45) return { grade: 'C+', cefr: 'B1 Intermediate', label: 'Developing' };
  return { grade: 'C', cefr: 'A2 Elementary', label: 'Foundational' };
}

export const AcademicTranscriptModal: React.FC<AcademicTranscriptModalProps> = ({ isOpen, onClose }) => {
  const { profile, progress } = useCampus();
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportToast, setExportToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const completedCount = progress.completedChapterIds?.length || 0;
  const isCompleted50 = completedCount >= 50 || (progress.completedChapterIds || []).some((id: any) => String(id) === '50' || id === 50);

  // Wrap all raw skill scores in Math.round to strictly prevent decimal floats
  const readingScore = Math.round(Math.min(100, Math.max(0, progress.skills?.[SkillType.READING] || 0)));
  const listeningScore = Math.round(Math.min(100, Math.max(0, progress.skills?.[SkillType.LISTENING] || 0)));
  const speakingScore = Math.round(Math.min(100, Math.max(0, progress.skills?.[SkillType.SPEAKING] || 0)));
  const writingScore = Math.round(Math.min(100, Math.max(0, progress.skills?.[SkillType.WRITING] || 0)));

  const readingGrade = getSkillGrade(readingScore);
  const listeningGrade = getSkillGrade(listeningScore);
  const speakingGrade = getSkillGrade(speakingScore);
  const writingGrade = getSkillGrade(writingScore);

  const averageScore = Math.round((readingScore + listeningScore + speakingScore + writingScore) / 4);

  const toeflCenter = (averageScore / 100) * 120;
  const toeflEst = Math.max(0, Math.min(120, Math.round(toeflCenter)));
  const toeflLow = Math.max(0, Math.round(toeflEst - 5));
  const toeflHigh = Math.min(120, Math.round(toeflEst + 5));

  const ieltsCenter = (averageScore / 100) * 9;
  const ieltsEst = Math.max(0, Math.min(9, Math.round(ieltsCenter * 2) / 2));
  const ieltsLow = Math.max(0, Math.round((ieltsEst - 0.5) * 2) / 2);
  const ieltsHigh = Math.min(9, Math.round((ieltsEst + 0.5) * 2) / 2);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const studentName = profile.name && profile.name.trim() !== '' ? profile.name : 'Campus Student';

  // Deterministic student ID based on name or fallback
  const studentIdNumber = Math.abs(
    studentName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000)
  ) % 9000 + 1000;
  const studentId = `#CMP-2026-${studentIdNumber}`;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setExportToast({ message, type });
    setTimeout(() => {
      setExportToast(null);
    }, 4000);
  };

  const triggerDownload = (dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `Campus_Academic_Transcript_${studentName.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAndShare = () => {
    console.log('[AcademicTranscript] Initiating export and share handler...');
    if (!transcriptRef.current) {
      console.error('[AcademicTranscript] transcriptRef.current not mounted');
      showToast('Error: Transcript element not found', 'error');
      return;
    }

    setIsExporting(true);

    htmlToImage.toPng(transcriptRef.current, {
      cacheBust: true,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
        backgroundColor: '#FFFDF9'
      }
    })
    .then(async (dataUrl) => {
      setPreviewImageUrl(dataUrl);
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `Campus_Academic_Transcript_${studentName.replace(/\s+/g, '_')}.png`, {
          type: 'image/png',
        });

        const nav = navigator as any;
        if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
          console.log('[AcademicTranscript] Triggering navigator.share with file...');
          await nav.share({
            files: [file],
            title: 'University of Campus — Official Academic Transcript',
            text: `Official Semester 1 Academic Transcript for ${studentName}`,
          });
          showToast('📜 Transcript image saved to gallery!', 'success');
        } else {
          triggerDownload(dataUrl);
          showToast('📜 Transcript image saved to gallery!', 'success');
        }
      } catch (err: any) {
        if (err && err.name === 'AbortError') {
          console.log('[AcademicTranscript] Share canceled by user.');
          setIsExporting(false);
          return;
        }
        console.error('[AcademicTranscript] Share API not supported or failed, falling back to download:', err);
        triggerDownload(dataUrl);
        showToast('📜 Transcript image saved to gallery!', 'success');
      }
    })
    .catch((err) => {
      console.error('[AcademicTranscript] Failed to export image:', err);
      showToast('Error generating transcript image. Press & hold preview below.', 'error');
    })
    .finally(() => {
      setIsExporting(false);
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 overflow-y-auto bg-navy/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative max-w-xl w-full my-auto flex flex-col items-center max-h-[92vh]"
        >
          {/* Top Control Bar */}
          <div className="w-full flex items-center justify-between mb-2 text-white px-1 shrink-0">
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-amber-300" />
              <span className="font-serif font-bold text-sm tracking-wide text-amber-100">
                Official Academic Transcript
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SCROLLABLE INNER MODAL WRAPPER */}
          <div className="w-full overflow-y-auto space-y-4 pr-0.5">
            {/* TRANSCRIPT DOCUMENT CONTAINER */}
            <div
              ref={transcriptRef}
              id="official-academic-transcript"
              className="w-full bg-[#FFFDF9] text-[#2c1d11] rounded-2xl border-4 border-double border-amber-800/40 shadow-2xl p-4 sm:p-7 relative overflow-hidden font-serif select-text"
            >
              {/* Subtle Watermark Stamp */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                <GraduationCap className="w-80 h-80 text-amber-900" />
              </div>

              {/* HEADER SECTION */}
              <div className="text-center relative z-10 mb-4">
                {/* Crest Icon with Gold Foil Border */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 rounded-full bg-gradient-to-tr from-amber-700 via-amber-500 to-amber-800 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#2c1d11] flex items-center justify-center text-amber-300">
                    <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                </div>

                <h1 className="text-lg sm:text-2xl font-black font-serif text-amber-950 tracking-widest uppercase">
                  University of Campus
                </h1>
                <p className="text-[9px] sm:text-xs font-mono font-bold tracking-wider text-amber-900/80 uppercase border-b-2 border-amber-800/30 pb-2.5 mt-1">
                  Office of the Registrar — Official Academic Transcript
                </p>
              </div>

              {/* STUDENT DETAILS GRID */}
              <div className="bg-amber-100/50 border border-amber-900/20 rounded-xl p-3 sm:p-4 text-xs font-sans grid grid-cols-2 gap-x-3 gap-y-2 mb-4 relative z-10">
                <div>
                  <span className="text-[9px] sm:text-[10px] text-amber-900/60 uppercase font-mono font-bold block">
                    Student Name
                  </span>
                  <span className="font-serif font-bold text-amber-950 text-xs sm:text-sm block truncate">
                    {studentName}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] sm:text-[10px] text-amber-900/60 uppercase font-mono font-bold block">
                    Student ID
                  </span>
                  <span className="font-mono font-semibold text-amber-900 text-xs block">
                    {studentId}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] sm:text-[10px] text-amber-900/60 uppercase font-mono font-bold block">
                    Enrolled Residence
                  </span>
                  <span className="font-sans font-semibold text-amber-900 text-xs block truncate">
                    {profile.dorm || 'Elm Hall'}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] sm:text-[10px] text-amber-900/60 uppercase font-mono font-bold block">
                    Academic Term
                  </span>
                  <span className="font-sans font-semibold text-amber-900 text-xs block">
                    Semester 1 (Fall 2026)
                  </span>
                </div>

                <div className="col-span-2 pt-1.5 border-t border-amber-900/15 flex flex-wrap items-center justify-between gap-1">
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-amber-900/60 uppercase font-mono font-bold block">
                      Status
                    </span>
                    <span className={`font-sans font-bold text-xs flex items-center gap-1 ${isCompleted50 ? 'text-amber-800' : 'text-amber-900'}`}>
                      {isCompleted50 ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 inline shrink-0" />
                          <span>Semester Completed / Honors Distinction</span>
                        </>
                      ) : (
                        <span>In Progress ({completedCount}/50 Chapters)</span>
                      )}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] sm:text-[10px] text-amber-900/60 uppercase font-mono font-bold block">
                      Date Issued
                    </span>
                    <span className="font-mono text-[10px] sm:text-[11px] text-amber-900">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* PERFORMANCE TABLE */}
              <div className="relative z-10 my-3 overflow-x-auto">
                <p className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900/70 mb-1.5">
                  Core Academic Skill Evaluation
                </p>
                <table className="w-full border-collapse text-xs font-sans min-w-[300px]">
                  <thead>
                    <tr className="bg-amber-900/10 text-amber-950 font-serif font-bold text-[9px] sm:text-[10px] uppercase border-b-2 border-amber-900/30">
                      <th className="py-1.5 sm:py-2 px-2 text-left">Skill Module</th>
                      <th className="py-1.5 sm:py-2 px-2 text-center">Score</th>
                      <th className="py-1.5 sm:py-2 px-2 text-left">CEFR Level</th>
                      <th className="py-1.5 sm:py-2 px-2 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/10 text-amber-950 font-medium">
                    <tr>
                      <td className="py-1.5 sm:py-2 px-2 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                        <span>Reading Comprehension</span>
                      </td>
                      <td className="py-1.5 sm:py-2 px-2 text-center font-mono font-bold">{readingScore}</td>
                      <td className="py-1.5 sm:py-2 px-2 text-left text-[10px] sm:text-[11px]">{readingGrade.cefr}</td>
                      <td className="py-1.5 sm:py-2 px-2 text-right font-serif font-bold text-amber-900">{readingGrade.grade}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 sm:py-2 px-2 flex items-center gap-1.5">
                        <Headphones className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                        <span>Listening & Lecture Analysis</span>
                      </td>
                      <td className="py-1.5 sm:py-2 px-2 text-center font-mono font-bold">{listeningScore}</td>
                      <td className="py-1.5 sm:py-2 px-2 text-left text-[10px] sm:text-[11px]">{listeningGrade.cefr}</td>
                      <td className="py-1.5 sm:py-2 px-2 text-right font-serif font-bold text-amber-900">{listeningGrade.grade}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 sm:py-2 px-2 flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                        <span>Oral Discussion & Seminar</span>
                      </td>
                      <td className="py-1.5 sm:py-2 px-2 text-center font-mono font-bold">{speakingScore}</td>
                      <td className="py-1.5 sm:py-2 px-2 text-left text-[10px] sm:text-[11px]">{speakingGrade.cefr}</td>
                      <td className="py-1.5 sm:py-2 px-2 text-right font-serif font-bold text-amber-900">{speakingGrade.grade}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 sm:py-2 px-2 flex items-center gap-1.5">
                        <PenTool className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                        <span>Academic Composition & Essays</span>
                      </td>
                      <td className="py-1.5 sm:py-2 px-2 text-center font-mono font-bold">{writingScore}</td>
                      <td className="py-1.5 sm:py-2 px-2 text-left text-[10px] sm:text-[11px]">{writingGrade.cefr}</td>
                      <td className="py-1.5 sm:py-2 px-2 text-right font-serif font-bold text-amber-900">{writingGrade.grade}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* OVERALL ESTIMATED EXAM BAND SUMMARY BOX */}
              <div className="bg-gradient-to-r from-amber-900/10 via-amber-800/15 to-amber-900/10 border border-amber-700/30 rounded-xl p-3 sm:p-3.5 my-3 flex items-center justify-between text-xs relative z-10 gap-2">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900/70 block">
                    Estimated Exam Equivalence
                  </span>
                  <p className="font-serif font-bold text-amber-950 text-xs sm:text-sm mt-0.5">
                    TOEFL iBT: <span className="text-amber-800 font-mono">{toeflLow}–{toeflHigh}</span> / 120
                  </p>
                </div>

                <div className="text-right border-l border-amber-800/20 pl-3 sm:pl-4">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900/70 block">
                    IELTS Band
                  </span>
                  <p className="font-serif font-bold text-amber-950 text-xs sm:text-sm mt-0.5">
                    <span className="text-amber-800 font-mono">{ieltsLow.toFixed(1)}–{ieltsHigh.toFixed(1)}</span> Band
                  </p>
                </div>
              </div>

              {/* FOOTER & ENDORSEMENT */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-amber-800/30 flex items-end justify-between relative z-10">
                {/* Dean Signature */}
                <div>
                  <div className="font-serif italic text-amber-950 text-base sm:text-lg font-bold leading-tight select-none">
                    Dr. Margaret Holloway
                  </div>
                  <div className="h-0.5 w-28 sm:w-36 bg-amber-900/40 my-1" />
                  <p className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900/70">
                    Dean of Academic Affairs
                  </p>
                </div>

                {/* Embossed Gold Seal Stamp */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-600 border-2 border-amber-300 shadow-md p-1 flex items-center justify-center text-amber-950 text-[7px] sm:text-[8px] font-black tracking-tighter text-center uppercase shadow-inner rounded-full ring-2 ring-amber-600/30">
                    <div className="w-full h-full rounded-full border border-dashed border-amber-900/60 flex flex-col items-center justify-center p-0.5">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950 mb-0.5" />
                      <span>OFFICIAL SEAL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON & TOAST NOTIFICATION */}
            <div className="w-full space-y-2">
              <button
                id="share-save-transcript-btn"
                onClick={handleExportAndShare}
                disabled={isExporting}
                className="w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-slate-950 font-bold text-sm py-3 px-6 rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
              >
                {isExporting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
                    <span>Generating Image...</span>
                  </div>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-950" />
                    <span>Share / Save Transcript</span>
                  </>
                )}
              </button>

              {exportToast && (
                <div
                  className={`text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 animate-bounce text-center ${
                    exportToast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                >
                  {exportToast.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-white shrink-0" />
                  )}
                  <span>{exportToast.message}</span>
                </div>
              )}

              {/* INLINE PREVIEW IMAGE FOR MOBILE SAFARI PRESS & HOLD TO SAVE */}
              {previewImageUrl && (
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold">
                    <ImageIcon className="w-4 h-4" />
                    <span>Generated Image Preview</span>
                  </div>
                  <p className="text-[11px] text-amber-100/80">
                    Mobile user? Press & hold the image below to save directly to your Photos or Files:
                  </p>
                  <img
                    src={previewImageUrl}
                    alt="Campus Official Transcript"
                    className="w-full rounded-xl border border-amber-300/40 shadow-lg max-h-64 object-contain mx-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
