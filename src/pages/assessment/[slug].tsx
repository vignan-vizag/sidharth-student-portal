import CountdownTimer from "@/components/Elements/CoutdownTimer";
import { Test } from "@/types";
import { API_BASE_URL } from "@/utils";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const AssessmentSlug = () => {
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, Record<string, { answer: string; submitted: boolean }>>>({});
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  const router = useRouter();
  const { query } = router;
  const testId = query.slug as string;

  useEffect(() => {
    if (!testId) return;
    const fetchTest = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/tests/${testId}`);
        if (!res.ok) throw new Error("Failed to fetch test details");
        const data: Test = await res.json();
        setTest(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  const handleAnswerSelect = (categoryName: string, qId: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [categoryName]: {
        ...prev[categoryName],
        [qId]: { answer: option, submitted: false },
      },
    }));
  };

  const handleQuestionSubmit = (categoryName: string, qId: string) => {
    setSelectedAnswers((prev) => {
      const isCurrentlySubmitted = prev[categoryName]?.[qId]?.submitted || false;
      return {
        ...prev,
        [categoryName]: {
          ...prev[categoryName],
          [qId]: {
            submitted: !isCurrentlySubmitted,
            answer: isCurrentlySubmitted ? "" : prev[categoryName]?.[qId]?.answer,
          },
        },
      };
    });
  };

  const handleSubmit = () => {
    if (!test) return;
    const completed = test.categories
      .filter(category => category.questions.every(q => selectedAnswers[category.categoryName]?.[q._id]?.submitted))
      .map(cat => cat.categoryName);
    setCompletedCategories(completed);
  };

  const calculateCategoryStats = (categoryName: string) => {
    const category = test?.categories.find(cat => cat.categoryName === categoryName);
    if (!category) return { score: 0, percentage: "0.00" };
    let correct = 0;
    category.questions.forEach(q => {
      if (selectedAnswers[categoryName]?.[q._id]?.answer === q.correctAnswer) {
        correct++;
      }
    });
    const percentage = ((correct / category.questions.length) * 100).toFixed(2);
    return { score: correct, percentage };
  };

  if (loading) return <div className="text-center mt-5 h-screen">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-5 h-screen">{error}</div>;
  if (!test) return <div className="text-center mt-5 h-screen">Test not found</div>;

  if (completedCategories.length === test.categories.length) {
    const totalCorrect = test.categories.reduce((total, category) => total + calculateCategoryStats(category.categoryName).score, 0);
    const totalQuestions = test.categories.reduce((total, category) => total + category.questions.length, 0);
    const overallPercentage = ((totalCorrect / totalQuestions) * 100).toFixed(2);
    return (
      <div className="min-h-screen w-full max-w-6xl mx-auto p-6 lg:px-0">
        <div className="">
          <h1 className="text-3xl font-semibold font-mono uppercase text-left text-neutral-800">{test.testName}</h1>
          <h2 className="text-xl font-semibold font-mono uppercase text-left text-neutral-800">Final Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-6 mt-6">
            {test.categories.map((category) => {
              const { score, percentage } = calculateCategoryStats(category.categoryName);
              return (
                <div key={category.categoryName} className="p-6 border border-neutral-500 font-sans">
                  <h3 className="text-xl font-semibold font-mono uppercase text-left text-neutral-800">{category.categoryName}</h3>
                  <p className="text-lg">Score: {score}/{category.questions.length}</p>
                  <p className="text-lg">Correct Score: {percentage}%</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <p className="text-2xl font-semibold text-neutral-800">Overall Score: {overallPercentage}%</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition-all">
              Restart Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full max-w-6xl mx-auto p-6 lg:px-0">
      <div className="flex gap-3 items-center justify-between mb-4">
        <h1 className="text-xl font-semibold font-mono uppercase text-left text-neutral-800">{test.testName}</h1>
        <div><CountdownTimer /></div>
      </div>
      {test.categories.map((category) => (
        <div key={category.categoryName} className="flex flex-col gap-6 lg:gap-3 font-sans">
          <h2 className="text-xl font-semibold font-mono uppercase text-center mb-4 text-neutral-800">
            {category.categoryName}
          </h2>
          {category.questions.map((question) => {
            const isSubmitted = selectedAnswers[category.categoryName]?.[question._id]?.submitted || false;
            const selectedOption = selectedAnswers[category.categoryName]?.[question._id]?.answer;

            return (
              <div key={question._id} className="p-5 mb-10 lg:mb-8 py-7 bg-white border-l-4 shadow-md border-blue-500">
                <h3 className="text-base font-semibold text-neutral-800">{question.question}</h3>
                <ul className="mt-3 space-y-3 text-sm font-[540]">
                  {question.options.map((option, index) => (
                    <li key={index}>
                      <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-200 transition-all
                            ${selectedOption === option ? "bg-blue-200 text-blue-500 border-blue-500" : "bg-neutral-100 text-neutral-700"}
                        `}>
                        <input
                          type="radio"
                          name={`question-${question._id}`}
                          value={option}
                          checked={selectedOption === option}
                          onChange={() => handleAnswerSelect(category.categoryName, question._id, option)}
                          disabled={isSubmitted}
                          className="form-radio text-blue-600"
                        />
                        <span className="">{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleQuestionSubmit(category.categoryName, question._id)}
                  className={`mt-4 px-3 py-1.5 rounded border transition-all ${!isSubmitted ? "bg-blue-200 text-blue-700 hover:bg-blue-300 border-blue-500" : "bg-red-200 border-red-500 text-red-700"}`}
                  disabled={selectedOption == null || selectedOption === ""}
                >
                  {isSubmitted ? "Clear Answer" : "Save Answer"}
                </button>
              </div>
            );
          })}
        </div>

      ))}
      <div className="flex justify-center mb-6">
        <button onClick={handleSubmit} className="px-6 py-2 font-sans text-sm tracking-wider font-medium uppercase rounded border bg-green-600 text-white hover:bg-green-700 transition-all">
          Submit
        </button>
      </div>
    </div>
  );
};
export default AssessmentSlug;
