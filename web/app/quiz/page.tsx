// app/quiz/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function QuizPage() {
  const params = useParams();
  const id = params?.id;

  const [quiz, setQuiz] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:3001/quizzes/${id}`, { withCredentials: true })
      .then((res) => setQuiz(res.data))
      .catch((err) => console.error("Failed to load quiz", err));
  }, [id]);

  if (!quiz) return <div className="p-10 text-center">Loading quiz...</div>;

  const question = quiz.questions[current];

  const selectOption = (index: number) => {
    setSelected(index);
    if (question.options[index].isCorrect) setScore((prev) => prev + 1);
  };

  const nextQuestion = () => {
    if (current + 1 < quiz.questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>

      {finished ? (
        <div className="text-green-600 text-xl">
          ✅ You scored {score} out of {quiz.questions.length}
        </div>
      ) : (
        <>
          <div className="text-lg mb-3">
            Question {current + 1}/{quiz.questions.length}
          </div>
          <p className="text-xl font-medium mb-4">{question.text}</p>
          {question.imageUrl && (
            <img
              src={question.imageUrl}
              alt="question"
              className="mx-auto mb-4 w-40 h-40 object-contain"
            />
          )}

          <div className="grid gap-3 mb-4">
            {question.options.map((opt: any, i: number) => (
              <button
                key={i}
                onClick={() => selectOption(i)}
                disabled={selected !== null}
                className={`px-4 py-2 rounded border transition ${
                  selected === i
                    ? opt.isCorrect
                      ? "bg-green-300"
                      : "bg-red-300"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {selected !== null && (
            <button
              onClick={nextQuestion}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Next
            </button>
          )}
        </>
      )}
    </div>
  );
}
