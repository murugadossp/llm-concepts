"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";

export type QuizQuestion = {
  question: string;
  options: string[];
  /** Index into options that is correct. */
  correctIndex: number;
  explanation?: string;
};

type QuizProps = {
  title?: string;
  questions?: QuizQuestion[];
};

/**
 * Scored multiple-choice quiz. Mechanics ported from the langgraph standalone
 * quiz pages (langgraph-fundamentals-quiz.html): click an option to lock the
 * question, the correct option always highlights, score increments only on a
 * first-try correct answer, and a reset clears all questions.
 */
export function Quiz({ title = "Check your understanding", questions = [] }: QuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [resetKey, setResetKey] = useState(0);

  const score = useMemo(
    () =>
      Object.entries(answers).filter(
        ([qIndex, optIndex]) => questions[Number(qIndex)]?.correctIndex === optIndex,
      ).length,
    [answers, questions],
  );

  function handleAnswer(questionIndex: number, optionIndex: number) {
    if (questionIndex in answers) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  }

  function handleReset() {
    setAnswers({});
    setResetKey((key) => key + 1);
  }

  if (questions.length === 0) return null;

  return (
    <div className="glass-strong my-8 p-6" key={resetKey}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
          {title}
        </h3>
        <div className="flex items-center gap-3">
          <span
            className="rounded-[var(--r-pill)] border px-3 py-1 font-mono text-xs"
            style={{ borderColor: "var(--border-strong)", color: "var(--ink-soft)" }}
          >
            Score: <strong style={{ color: "var(--accent)" }}>{score}</strong> / {questions.length}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-[var(--r-pill)] px-3 py-1 text-xs font-semibold transition hover:opacity-80"
            style={{ background: "var(--surface-strong)", color: "var(--ink-soft)" }}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset quiz
          </button>
        </div>
      </div>

      <ol className="mt-5 space-y-5">
        {questions.map((q, qIndex) => {
          const answered = qIndex in answers;
          const selectedIndex = answers[qIndex];
          const answeredCorrect = answered && selectedIndex === q.correctIndex;
          const correctOption = q.options[q.correctIndex];
          const resultId = `quiz-question-${qIndex + 1}-result`;

          return (
            <li key={q.question} className="glass p-5">
              <p
                className="qkind text-[11px] font-bold uppercase tracking-wide"
                style={{ color: "var(--ink-mute)" }}
              >
                Question {qIndex + 1} of {questions.length}
              </p>
              <p className="mt-2 font-semibold" style={{ color: "var(--ink)" }}>
                {q.question}
              </p>
              <div className="mt-4 grid gap-2.5">
                {q.options.map((option, optIndex) => {
                  const isCorrect = optIndex === q.correctIndex;
                  const isSelected = selectedIndex === optIndex;
                  const showCorrect = answered && isCorrect;
                  const showWrong = answered && isSelected && !isCorrect;

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={answered}
                      onClick={() => handleAnswer(qIndex, optIndex)}
                      aria-describedby={answered ? resultId : undefined}
                      className="flex items-center justify-between gap-3 rounded-[var(--r-md)] border px-4 py-2.5 text-left text-sm transition disabled:cursor-default"
                      style={{
                        borderColor: showCorrect
                          ? "var(--accent-2)"
                          : showWrong
                            ? "var(--warn)"
                            : "var(--border-strong)",
                        background: showCorrect
                          ? "color-mix(in srgb, var(--accent-2) 14%, var(--surface))"
                          : showWrong
                            ? "color-mix(in srgb, var(--warn) 10%, var(--surface))"
                            : "var(--surface)",
                        color: showCorrect || showWrong ? "var(--ink)" : "var(--ink-soft)",
                      }}
                    >
                      <span>{option}</span>
                      {showCorrect ? (
                        <>
                          <span className="sr-only">Correct answer.</span>
                          <Check
                            className="h-4 w-4 shrink-0"
                            style={{ color: "var(--accent-2)" }}
                            aria-hidden
                          />
                        </>
                      ) : null}
                      {showWrong ? (
                        <>
                          <span className="sr-only">Your answer, incorrect.</span>
                          <X
                            className="h-4 w-4 shrink-0"
                            style={{ color: "var(--warn)" }}
                            aria-hidden
                          />
                        </>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              {answered ? (
                <p
                  id={resultId}
                  aria-live="polite"
                  className="mt-3 text-xs leading-6"
                  style={{ color: "var(--ink-mute)" }}
                >
                  {answeredCorrect ? "Correct." : `Not quite. Correct answer: ${correctOption}.`}
                </p>
              ) : null}
              {answered && q.explanation ? (
                <p className="mt-3 text-xs leading-6" style={{ color: "var(--ink-mute)" }}>
                  {q.explanation}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
