'use client';

import { useState } from 'react';

type Question = {
  text: string;
  options: { label: string; score: number }[];
};

const questions: Question[] = [
  {
    text: "How does your child respond to their name?",
    options: [
      { label: "Always responds", score: 0 },
      { label: "Sometimes responds", score: 1 },
      { label: "Rarely responds", score: 2 },
    ],
  },
  {
    text: "How does your child interact with others?",
    options: [
      { label: "Engages and plays easily", score: 0 },
      { label: "Sometimes interacts", score: 1 },
      { label: "Avoids interaction", score: 2 },
    ],
  },
  {
    text: "Does your child have repetitive behaviors (hand-flapping, rocking)?",
    options: [
      { label: "No", score: 0 },
      { label: "Occasionally", score: 1 },
      { label: "Frequently", score: 2 },
    ],
  },
  {
    text: "How well does your child communicate needs?",
    options: [
      { label: "Very clearly", score: 0 },
      { label: "Sometimes struggles", score: 1 },
      { label: "Barely communicates", score: 2 },
    ],
  },
  {
    text: "How sensitive is your child to lights/sounds/textures?",
    options: [
      { label: "Not sensitive", score: 0 },
      { label: "A little sensitive", score: 1 },
      { label: "Very sensitive", score: 2 },
    ],
  },
];

export default function DiagnosticQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (answerScore: number) => {
    const newScore = score + answerScore;

    if (currentIndex + 1 < questions.length) {
      setScore(newScore);
      setCurrentIndex(currentIndex + 1);
    } else {
      setScore(newScore);
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setCurrentIndex(0);
    setFinished(false);
  };

  const getResult = () => {
    if (score <= 3) return "🟢 Mild or No Signs of Autism";
    if (score <= 6) return "🟠 Moderate Signs – Monitor Closely";
    return "🔴 Strong Signs – Consider Professional Assessment";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-6 text-black"
    style={{ backgroundImage: "url('/level14.jpg')", backgroundSize: "cover" }}>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl w-full text-center">
        {!finished ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-purple-800">Question {currentIndex + 1}</h2>
            <p className="text-lg font-semibold mb-4">{questions[currentIndex].text}</p>
            <div className="flex flex-col gap-3">
              {questions[currentIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.score)}
                  className="bg-[#a024acb0] hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-green-700 mb-4">Result</h2>
            <p className="text-xl mb-6">{getResult()}</p>
            <button
              onClick={resetQuiz}
              className="bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Retake Quiz ?
            </button>
          </>
        )}
      </div>
    </div>
  );
}
