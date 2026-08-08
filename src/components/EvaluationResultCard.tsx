/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle, Award, Sparkles, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { EvaluationResult } from '../utils/evaluationEngine';

interface EvaluationResultCardProps {
  result: EvaluationResult | { feedback: string; score: number; [key: string]: any };
  skillName?: string;
  note?: string;
  submittedText?: string;
}

export const EvaluationResultCard: React.FC<EvaluationResultCardProps> = ({
  result,
  skillName = 'Skill',
  note,
  submittedText
}) => {
  const isFullRubric = 'rubricBreakdown' in result && result.rubricBreakdown;
  const fullEval = isFullRubric ? (result as EvaluationResult) : null;

  const totalScore = fullEval ? fullEval.score : (result.score <= 20 ? Math.round((result.score / 20) * 100) : result.score);
  const letterGrade = fullEval ? fullEval.letterGrade : (totalScore >= 90 ? 'A' : totalScore >= 80 ? 'B' : totalScore >= 70 ? 'C' : 'D');
  const skillPoints = fullEval ? fullEval.skillPointsContribution : (result.score <= 20 ? result.score : Math.round(5 + (totalScore / 100) * 15));

  return (
    <div className="bg-sage-light dark:bg-emerald-950/20 border border-sage/30 dark:border-emerald-800/40 p-4.5 rounded-2xl space-y-3.5 shadow-sm">
      {/* Header with Score, Grade, and Skill Contribution */}
      <div className="flex items-start justify-between gap-3 border-b border-sage/20 dark:border-emerald-800/30 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sage/20 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 text-sage dark:text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-sage dark:text-emerald-400 uppercase tracking-wider">
                Academic Evaluation
              </h4>
              <span className="px-2 py-0.5 bg-terracotta/10 text-terracotta dark:bg-rose-950/40 dark:text-rose-400 font-mono text-[11px] font-bold rounded-md">
                Grade: {letterGrade}
              </span>
            </div>
            <p className="text-[11px] text-navy/60 dark:text-slate-400 font-medium mt-0.5">
              Evaluated on 100-Point Academic Rubric
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg font-mono font-bold text-navy dark:text-slate-100 leading-none">
            {totalScore}<span className="text-xs text-navy/40 dark:text-slate-500">/100</span>
          </div>
          <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 bg-sage/20 dark:bg-emerald-900/40 text-sage dark:text-emerald-300 font-mono text-[11px] font-bold rounded-full">
            <Award className="w-3 h-3" /> +{skillPoints} {skillName} Pts
          </span>
        </div>
      </div>

      {/* Main Constructive Feedback */}
      <div className="space-y-1">
        <h5 className="text-[11px] font-bold text-navy/70 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Strengths & Growth Areas
        </h5>
        <div className="text-xs text-navy/80 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-line">
          {result.feedback}
        </div>
      </div>

      {/* 4 Weighted Rubric Dimensions Breakdown */}
      {fullEval?.rubricBreakdown && (
        <div className="space-y-2 pt-1">
          <h5 className="text-[11px] font-bold text-navy/70 dark:text-slate-300 uppercase tracking-wider">
            Rubric Criteria Breakdown
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-navy/5 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-[11px] font-semibold">
                <span className="text-navy/70 dark:text-slate-300">Academic Vocab (30%)</span>
                <span className="font-mono text-terracotta dark:text-rose-400 font-bold bg-terracotta/5 dark:bg-rose-950/30 px-1.5 py-0.5 rounded">
                  {fullEval.rubricBreakdown.academicVocabulary.score}/30
                </span>
              </div>
              <p className="text-[10px] text-navy/60 dark:text-slate-400 leading-tight">
                {fullEval.rubricBreakdown.academicVocabulary.feedback}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-navy/5 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-[11px] font-semibold">
                <span className="text-navy/70 dark:text-slate-300">Grammar & Syntax (30%)</span>
                <span className="font-mono text-terracotta dark:text-rose-400 font-bold bg-terracotta/5 dark:bg-rose-950/30 px-1.5 py-0.5 rounded">
                  {fullEval.rubricBreakdown.grammaticalAccuracy.score}/30
                </span>
              </div>
              <p className="text-[10px] text-navy/60 dark:text-slate-400 leading-tight">
                {fullEval.rubricBreakdown.grammaticalAccuracy.feedback}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-navy/5 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-[11px] font-semibold">
                <span className="text-navy/70 dark:text-slate-300">Coherence & Flow (20%)</span>
                <span className="font-mono text-terracotta dark:text-rose-400 font-bold bg-terracotta/5 dark:bg-rose-950/30 px-1.5 py-0.5 rounded">
                  {fullEval.rubricBreakdown.coherenceFlow.score}/20
                </span>
              </div>
              <p className="text-[10px] text-navy/60 dark:text-slate-400 leading-tight">
                {fullEval.rubricBreakdown.coherenceFlow.feedback}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-navy/5 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-[11px] font-semibold">
                <span className="text-navy/70 dark:text-slate-300">Task Relevance (20%)</span>
                <span className="font-mono text-terracotta dark:text-rose-400 font-bold bg-terracotta/5 dark:bg-rose-950/30 px-1.5 py-0.5 rounded">
                  {fullEval.rubricBreakdown.topicRelevance.score}/20
                </span>
              </div>
              <p className="text-[10px] text-navy/60 dark:text-slate-400 leading-tight">
                {fullEval.rubricBreakdown.topicRelevance.feedback}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison UI: Suggested Academic Polish vs Your Original Submission */}
      {(fullEval?.suggestedCorrection || submittedText) && (
        <div className="space-y-2.5 pt-1.5 border-t border-sage/20 dark:border-emerald-800/30">
          {fullEval?.suggestedCorrection && (
            <div className="bg-cream/60 dark:bg-slate-900/80 p-3 rounded-xl border border-terracotta/25 dark:border-rose-900/40 space-y-1">
              <h5 className="text-[11px] font-bold text-terracotta dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-terracotta dark:text-rose-400" /> ✨ SUGGESTED ACADEMIC POLISH
              </h5>
              <p className="text-xs text-navy/90 dark:text-slate-200 leading-relaxed font-serif italic">
                "{fullEval.suggestedCorrection}"
              </p>
            </div>
          )}

          {submittedText && (
            <div className="bg-white/60 dark:bg-slate-950/60 p-3 rounded-xl border border-navy/10 dark:border-slate-800 space-y-1">
              <h5 className="text-[11px] font-bold text-navy/60 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> 📝 YOUR ORIGINAL SUBMISSION
              </h5>
              <p className="text-xs text-navy/75 dark:text-slate-300 leading-relaxed font-serif italic">
                "{submittedText}"
              </p>
            </div>
          )}
        </div>
      )}

      {note && (
        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono italic">
          * {note}
        </p>
      )}
    </div>
  );
};
