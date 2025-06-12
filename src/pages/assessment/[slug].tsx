import Link from "next/link";
import { Student } from "@/types/index";
import React, { useState, useEffect } from "react";
import { useAssessment } from "@/components/Hooks/useAssessment";
import CountdownTimer from "@/components/Elements/CoutdownTimer";
import Head from "next/head";
import RankCard from "@/components/Elements/RankCard";
import TestStartConfirmation from "@/components/Elements/TestStartConfirmation";

const AssessmentSlug = () => {
  const {
    loading,
    error,
    test,
    isRunning,
    selectedAnswers,
    testCompleted,
    studentData,
    studentInfo,
    handleChange,
    startTest,
    handleAnswerSelect,
    handleQuestionSubmit,
    handleSubmit,
    endTest,
    slug,
    completedCategories,
    calculateCategoryStats,
  } = useAssessment();

  const [student, setStudent] = useState<Student | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) {
      setStudent(JSON.parse(stored));
    }
  }, []);

  const handleStartTestClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmStart = () => {
    setShowConfirmation(false);
    startTest();
  };

  const handleCancelStart = () => {
    setShowConfirmation(false);
  };

  const Header = ({ testName }: { testName: string; }) => {
    return (
      <div className="sticky top-0 bg-white w-full">
        <div className="flex items-center justify-between px-10 py-5 lg:px-0">
          <div>
            <div className="flex gap-4 items-center">
              <button className="flex group">
                <Link href={`/dashboard`} className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 group-hover:fill-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.952 44.952" fill="currentColor">
                    <g transform="rotate(180 22.476 22.476)">
                      <path d="M44.952 22.108c0-1.25-.478-2.424-1.362-3.308L30.627 5.831a2.5 2.5 0 0 0-3.536 0 2.5 2.5 0 0 0 0 3.546l10.574 10.57H2.484A2.48 2.48 0 0 0 0 22.464v.028a2.48 2.48 0 0 0 2.484 2.523h35.182L27.094 35.579a2.5 2.5 0 0 0 0 3.541 2.5 2.5 0 0 0 3.538-.001l12.958-12.97a4.662 4.662 0 0 0 1.362-3.309v-.732z" />
                    </g>
                  </svg>
                  <span className="group-hover:text-blue-600">
                    Back
                  </span>
                </Link>
              </button>
              <div className="-space-y-1">
                <h1 className="text-xl lg:text-lg font-semibold font-mono uppercase text-left text-neutral-800">{testName}</h1>
                {test && completedCategories.length === test.categories.length && (<h2 className="text-sm lg:text-xs font-semibold font-sans uppercase text-left text-neutral-800">Final Results</h2>)}
              </div>
            </div>
          </div>
          <div>
            {slug && <CountdownTimer slug={slug as string} isRunning={isRunning} onComplete={endTest} />}
          </div>
        </div>
      </div>
    )
  }

  if (loading) return <div className="text-center mt-5 h-screen">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-5 h-screen">{error}</div>;
  if (!student) return <p>Loading student data...</p>;
  if (!test) return <div className="text-center mt-5 h-screen">Test not found</div>;

  // Check if student has already completed this test
  const currentAssignedTest = studentInfo?.assignedTests.find(
    (assignedTest) => assignedTest.testId === test._id
  );

  // If test is completed, show a message and redirect option
  if (currentAssignedTest?.status === 'completed' && !testCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-20">
        <Head>
          <title>{`${test.testName} - Already Completed`}</title>
        </Head>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Test Already Completed
          </h1>
          <p className="text-gray-600 mb-6">
            You have already completed the "{test.testName}" assessment. 
            Re-attempts are not allowed.
          </p>
          <div className="space-y-3">
            <Link
              href={`/assessment/${test._id}`}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              View Your Results
            </Link>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted && !isRunning) {
    const totalCorrect = test.categories.reduce((total, category) => {
      const categoryScore = calculateCategoryStats(category.categoryName).score;
      const assignedTestMarks = studentInfo?.assignedTests.find(
        (assignedTest) => assignedTest.testId === test._id
      )?.marks[category.categoryName] || 0;
      console.log(test._id);
      console.log(assignedTestMarks);
      console.log(studentInfo?.assignedTests);

      return total + categoryScore + assignedTestMarks;
    }, 0) || 0;

    const totalQuestions = test.categories.reduce((total, category) => total + category.questions.length, 0);

    const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100);

    return (
      <div className="">
        <Head>
          <title>{`${test.testName}`}</title>
        </Head>
        <Header testName={test.testName} />
        <div className={`mb-3 -mx-3 h-28 w-[100%+12px] ${overallPercentage >= 80 ? "bg-green-500/30" : "bg-red-500/30"}`}>
          <div className="flex lg:flex-col gap-2 items-center lg:items-start justify-between w-full max-w-6xl mx-auto p-6 lg:p-3">
            <div>
              <div className="text-3xl font-sans font-medium">Your grade: <span className={`font-semibold font-mono tracking-wide ${overallPercentage >= 80 ? "text-green-600" : "text-red-600"}`}>{overallPercentage}%</span></div>
            </div>
            {/* <div>
              <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all">
                Retry Assessment
              </button>
            </div> */}
          </div>
        </div>
        <div className="min-h-screen w-full max-w-6xl mx-auto p-6 lg:p-0">
          <div className="">

            <h1 className="text-3xl font-semibold font-mono uppercase text-left text-neutral-800">{test.testName}</h1>
            <h2 className="text-xl font-semibold font-mono uppercase text-left text-neutral-800">Final Results</h2>


            <div className="mt-6">
              <RankCard studentId={student._id} test={test} /> {/* Insert your rank data prop here */}
            </div>

            <div className="mt-6 space-y-10 font-sans">
              {test.categories.map((category) => (
                <div key={category.categoryName}>
                  <h2 className="text-3xl font-semibold font-mono uppercase text-left text-neutral-800 mb-2">{category.categoryName} - Review</h2>
                  {category.questions.map((question) => {
                    const selected = selectedAnswers[category.categoryName]?.[question._id]?.answer;
                    const isCorrect = selected === question.correctAnswer;

                    return (
                      <div key={question._id} className="p-4 border rounded-lg mb-4 bg-white shadow-sm">
                        <h3 className="font-semibold text-neutral-800">{question.question}</h3>
                        <ul className="mt-2 space-y-2">
                          {question.options.map((option, idx) => {
                            const isUserAnswer = selected === option;
                            const isCorrectAnswer = question.correctAnswer === option;

                            return (
                              <li key={idx}>
                                <div
                                  className={`px-3 py-2 rounded border 
                                    ${isCorrectAnswer ? 'bg-green-100 border-green-600 text-green-800' : ''}
                                    ${isUserAnswer && !isCorrect ? 'bg-red-100 border-red-600 text-red-800' : ''}
                                  `}
                                >
                                  {option}
                                  {isCorrectAnswer ? " (Correct Answer)" : ""}
                                  {isUserAnswer && !isCorrect ? " (Your Answer)" : ""}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isRunning) {
    // Check if test is already completed before showing start form
    const currentAssignedTest = studentInfo?.assignedTests.find(
      (assignedTest) => assignedTest.testId === test._id
    );

    if (currentAssignedTest?.status === 'completed') {
      return (
        <div>
          <Head>
            <title>{`${test.testName} - Already Completed`}</title>
          </Head>
          <Header testName={test.testName} />
          <div className="flex flex-col items-center justify-center mt-10 space-y-6 max-w-md mx-auto">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Test Already Completed
            </h2>
            <p className="text-gray-600 text-center">
              You have already completed this assessment. Re-attempts are not allowed.
            </p>
            <div className="space-x-4">
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Head>
          <title>{`${test.testName}`}</title>
        </Head>
        <Header testName={test.testName} />
        <div className="flex flex-col items-center justify-center mt-10 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 max-w-md text-center">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Important:</strong> Once you start this test, you cannot retake it. Make sure you're ready before proceeding.
            </p>
          </div>
          
          <input
            type="text"
            name="rollNo"
            placeholder="Roll Number"
            value={student.rollno}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-64"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={student.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-64"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={student.email}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-64"
          />
          <button
            onClick={handleStartTestClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Start Test (No Retakes Allowed)
          </button>
        </div>
        
        <TestStartConfirmation
          testName={test.testName}
          isOpen={showConfirmation}
          onConfirm={handleConfirmStart}
          onCancel={handleCancelStart}
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <Head>
        <title>{`${test.testName}`}</title>
      </Head>
      <Header testName={test.testName} />
      <div className="min-h-screen w-full max-w-6xl mx-auto p-6 lg:px-0">
        {/* <h1 className="text-xl font-semibold font-mono uppercase text-left text-neutral-800">{test.testName}</h1> */}
        {/* <div className="flex gap-3 items-center justify-between mb-4 absolute top-5 right-10">
          <div className="flex gap-3">
            <button onClick={endTest}>End Test</button>
            {slug && <CountdownTimer slug={slug as string} isRunning={isRunning} onComplete={endTest} />}
          </div>
        </div> */}
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
    </div>
  );
};
export default AssessmentSlug;
