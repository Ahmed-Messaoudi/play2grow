'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`http://localhost:3001/quizzes/${id}`);
      const data = await res.json();
      setQuiz(data);
      setLoading(false);
    };
    if (id) fetchQuiz();
  }, [id]);

  const handleSelect = (questionId: number, optionId: number) => {
    if (submitted) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionId });
  };

  const handleSubmit = () => {
    let s = 0;
    quiz.questions.forEach((q: any) => {
      const correct = q.options.find((opt: any) => opt.isCorrect);
      if (selectedAnswers[q.id] === correct?.id) s += 1;
    });
    setScore(s);
    setSubmitted(true);
  };

  if (loading) return <p className="text-center mt-10">⏳ Loading quiz...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  return (
    <div className="p-4 mx-auto w-screen h-screen flex flex-col items-center justify-center bg-cover"
    style = {{backgroundImage : "url('/bg-lvl1.png')", backgroundSize: "cover"}}>
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        {quiz.title}
      </h1>

      {quiz.questions.map((q: any) => (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: q.id * 0.1 }}
          className="mb-8 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 bg">{q.text}</h2>
          <div className="flex flex-row gap-4 ">
            {q.options.map((opt: any) => {
              const isSelected = selectedAnswers[q.id] === opt.id;
              const isCorrect = submitted && opt.isCorrect;
              const isWrong =
                submitted && isSelected && !opt.isCorrect;

              return (
                <motion.div
                  key={opt.id}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`
                    p-3 rounded-lg border-[4px] transition-all cursor-pointer text-black font-bold w-[144px] h-[160px] text-center justify-center items-center flex flex-col
                    ${isCorrect ? 'bg-green-100 border-green-500 text-green-700' : ''}
                    ${isWrong ? 'bg-red-100 border-red-500 text-red-700' : ''}
                    ${!isCorrect && !isWrong && isSelected ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'}
                  `}
                  onClick={() => handleSelect(q.id, opt.id)}
                >
                  {opt.text}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg  mt-4 transition"
        >
          Submit Quiz
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center mt-6 text-xl font-bold text-green-700"
        >
          🎉 You scored {score} out of {quiz.questions.length}
        </motion.div>
      )}
    </div>
  );
}
