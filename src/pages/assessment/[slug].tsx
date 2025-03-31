import { Test } from "@/types";
import { API_BASE_URL } from "@/utils";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import sampleTests from "@/lib/sample-tests.json";

const AssessmentSlug = () => {
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, Record<number, { answer: string; submitted: boolean }>>>({});
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter();
  const { query } = router;
  const testId = query.slug as string;

  useEffect(() => {
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

    if (testId) fetchTest();
  }, [testId]);

  console.log(test);


  const handleAnswerSelect = (categoryName: string, qIndex: number, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [categoryName]: {
        ...prev[categoryName],
        [qIndex]: { answer: option, submitted: false },
      },
    }));
  };

  const handleQuestionSubmit = (categoryName: string, qIndex: number) => {
    setSelectedAnswers((prev) => {
      const isCurrentlySubmitted = prev[categoryName]?.[qIndex]?.submitted || false;

      return {
        ...prev,
        [categoryName]: {
          ...prev[categoryName],
          [qIndex]: {
            submitted: !isCurrentlySubmitted,
            answer: isCurrentlySubmitted ? "" : prev[categoryName]?.[qIndex]?.answer,
          },
        },
      };
    });
  };

  const isCategoryReadyToSubmit = () => {
    const currentCategory = test?.categories.find((cat) => cat.categoryName === selectedCategory);
    return currentCategory?.questions.every((_, qIndex) => selectedAnswers[selectedCategory]?.[qIndex]?.submitted);
  };

  const handleCategorySubmit = () => {
    setCompletedCategories([...completedCategories, selectedCategory]);
    setSelectedCategory("");
  };

  const calculateCategoryStats = (categoryName: string) => {
    const category = test?.categories.find((cat) => cat.categoryName === categoryName);
    if (!category) return { score: 0, percentage: 0 };
    let correct = 0;
    category.questions.forEach((q, index) => {
      if (selectedAnswers[categoryName]?.[index]?.answer === q.correctAnswer) {
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
      <div className="p-6 flex justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-center">Final Results</h1>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-6 mt-6">
            {test.categories.map((category, index) => {
              const { score, percentage } = calculateCategoryStats(category.categoryName);
              return (
                <div
                  key={category.categoryName}
                  className={`p-6 rounded-lg shadow-xl border border-neutral-400`}
                >
                  <h3 className="text-xl font-semibold">{category.categoryName}</h3>
                  <p className="text-lg">Score: {score}/{category.questions.length}</p>
                  <p className="text-lg">Correct Score: {percentage}%</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-2xl font-semibold text-gray-800">Overall Score: {overallPercentage}%</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              Restart Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen font-sans">
        <div className="">
          <h1 className="text-xl font-semibold font-mono uppercase  mb-4 text-gray-800">Select a Category ({test.categories.length})</h1>
          <p className="text-neutral-500 text-center mt-2 font-sans font-medium">Choose a category to begin your assessment</p>
          <div className="mt-6 grid grid-cols-4 xl:grid-cols-3 md:!grid-cols-2 gap-4 md:gap-2">
            {test.categories.map((cat) => {
              const isCompleted = completedCategories.includes(cat.categoryName);
              return (
                <button
                  key={cat.categoryName}
                  onClick={() => setSelectedCategory(cat.categoryName)}
                  disabled={isCompleted}
                  className={`p-4 py-6 border-[2px] h-32 w-full transition-all duration-100 font-medium 
                  ${isCompleted ? "bg-green-500 text-green-800 cursor-not-allowed border-green-800" : "bg-white text-neutral-600 hover:border-blue-600 hover:text-blue-900"}
                `}
                >
                  {cat.categoryName} {isCompleted && "✓"}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = test.categories.find((cat) => cat.categoryName === selectedCategory);
  const currentQuestions = currentCategory?.questions || [];

  return (
    <div className="relative min-h-screen w-full max-w-6xl mx-auto p-6">
      <div className="">
        <h2 className="text-xl font-semibold font-mono uppercase text-center mb-4 text-gray-800">{selectedCategory}</h2>
        <div className="absolute top-4 right-6">
          <button
            className="px-3 py-1.5 text-sm font-sans font-medium border border-yellow-500/40 bg-yellow-500/30 text-yellow-600 shadow-md hover:bg-yellow-400/50 hover:border-yellow-600/40 hover:text-yellow-600 transition-all"
            onClick={() => setSelectedCategory("")}
          >
            Switch Category
          </button>
        </div>

        <div className="flex flex-col gap-6 font-sans">
          {currentQuestions.map((question, qIndex) => {
            const isSubmitted = selectedAnswers[selectedCategory]?.[qIndex]?.submitted || false;
            const selectedOption = selectedAnswers[selectedCategory]?.[qIndex]?.answer || "";

            return (
              <div
                key={qIndex}
                className="p-5 py-7 bg-white border-l-4 shadow-md transition-all duration-300 border-blue-500"
              // className="p-5 bg-white border-l-8 rounded-xl shadow-md transition-all duration-300 border-blue-500 hover:border-purple-500"
              >
                <h3 className="text-base font-semibold text-gray-800">{question.question}</h3>
                <ul className="mt-3 space-y-3 text-sm font-[540]">
                  {question.options.map((option, index) => (
                    <li key={index}>
                      <label
                        className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-100 cursor-pointer 
                          hover:bg-blue-200 transition-all duration-200"
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          value={option}
                          checked={selectedOption === option}
                          onChange={() => handleAnswerSelect(selectedCategory, qIndex, option)}
                          disabled={isSubmitted}
                          className="form-radio text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>

                <button
                  className={`px-3 py-1.5 mt-4 mb-2 rounded font-sans font-medium border border-blue-500/40 bg-blue-500/30 text-blue-600 shadow-md hover:bg-blue-400/50 hover:border-blue-600/40 hover:text-blue-600 transition-all ${isSubmitted ? "border-red-500/40 bg-red-500/30 text-red-600 shadow-md hover:bg-red-400/50 hover:border-red-600/40 hover:text-red-600" : ""}`}
                  onClick={() => handleQuestionSubmit(selectedCategory, qIndex)}
                  disabled={!selectedOption && !isSubmitted}
                >
                  {isSubmitted ? "Clear Selection" : "Submit Answer"}
                </button>


                {isSubmitted && selectedOption && (
                  <div className="mt-2 p-2 bg-green-100 text-green-800 font-medium rounded-lg">
                    Selected: {selectedOption}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-3 rounded font-sans font-medium border border-green-500 bg-green-600 text-white hover:bg-green-600 transition-all"
            onClick={handleCategorySubmit}
            disabled={!isCategoryReadyToSubmit()}
          >
            Submit This Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSlug;
