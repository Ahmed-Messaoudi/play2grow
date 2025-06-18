"use client";

import { useState } from "react";

const questions = [
  {
    text: "How does your child respond to their name?",
    options: [
      { text: "Immediately", score: 0 },
      { text: "Sometimes", score: 1 },
      { text: "Rarely or never", score: 3 },
    ],
  },
  {
    text: "How does your child communicate their needs?",
    options: [
      { text: "With words or gestures", score: 0 },
      { text: "Points or pulls you", score: 1 },
      { text: "Doesn’t attempt to communicate", score: 3 },
    ],
  },
  {
    text: "Does your child maintain eye contact?",
    options: [
      { text: "Regularly", score: 0 },
      { text: "Occasionally", score: 1 },
      { text: "Avoids eye contact", score: 3 },
    ],
  },
  {
    text: "How does your child react to new environments or people?",
    options: [
      { text: "Curious and adaptive", score: 0 },
      { text: "Shy but adjusts", score: 1 },
      { text: "Gets very upset or avoids", score: 3 },
    ],
  },
  {
    text: "Repetitive behavior (e.g. flapping hands, rocking)?",
    options: [
      { text: "No", score: 0 },
      { text: "Sometimes", score: 1 },
      { text: "Very often", score: 3 },
    ],
  },
];

export default function ParentQuiz() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex: number, score: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = score;
    setAnswers(newAnswers);
  };

  const totalScore = answers.reduce((acc, val) => acc + (val >= 0 ? val : 0), 0);

  const getResult = () => {
    if (totalScore <= 10) {
      return {
        label: "🟢 Mild Signs",
        message: "Your child is showing minor developmental delays. Keep observing and support them with love.",
        color: "text-green-600",
      };
    } else if (totalScore <= 20) {
      return {
        label: "🟠 Moderate Signs",
        message: "Your child may need guidance and support. A specialist could help with structured development.",
        color: "text-orange-500",
      };
    } else {
      return {
        label: "🔴 Strong Signs",
        message: "Your child shows clear signs of developmental delay. Professional help is recommended.",
        color: "text-red-600",
      };
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 text-black">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">🧠 Parent Diagnostic Quiz</h1>

      {!submitted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!answers.includes(-1)) setSubmitted(true);
            else alert("Please answer all questions.");
          }}
          className="space-y-6"
        >
          {questions.map((q, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <p className="font-semibold mb-2">{i + 1}. {q.text}</p>
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <label key={j} className="block">
                    <input
                      type="radio"
                      name={`q${i}`}
                      className="mr-2"
                      onChange={() => handleSelect(i, opt.score)}
                      checked={answers[i] === opt.score}
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800">
            See Result
          </button>
        </form>
      ) : (
        <div className="text-center mt-10">
          <h2 className={`text-2xl font-bold ${getResult().color}`}>{getResult().label}</h2>
          <p className="mt-4 text-lg text-gray-700">{getResult().message}</p>
          <p className="mt-4 font-semibold">🧮 Total Score: {totalScore}</p>
          <button
            className="mt-6 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => {
              setAnswers(Array(questions.length).fill(-1));
              setSubmitted(false);
            }}
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
