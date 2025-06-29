import { Student, Test } from "@/types";
import { API_BASE_URL } from "@/utils";
import { useRouter } from "next/router";
import { useState, useEffect, ChangeEvent } from "react";

interface StudentData {
    rollNo: string;
    name: string;
    email: string;
}

export const useAssessment = () => {
    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studentId, setStudentId] = useState<string | null>(null);
    const [studentInfo, setStudentInfo] = useState<Student | null>(null);
    const [studentYear, setStudentYear] = useState<number | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, Record<string, { answer: string; submitted: boolean }>>>({});
    const [completedCategories, setCompletedCategories] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [testCompleted, setTestCompleted] = useState<boolean | null>(false);
    const [studentData, setStudentData] = useState<StudentData>({
        rollNo: '',
        name: '',
        email: '',
    });
    const router = useRouter();
    const { slug } = router.query;
    const { query } = router;
    const testId = query.slug as string;

    useEffect(() => {
        const student = localStorage.getItem("student");
        
        if (!student) {
            router.push("/login");
            return;
        }

        try {
            const parsedStudent = JSON.parse(student);
            // console.log(parsedStudent._id);
            setStudentId(parsedStudent._id);
            setStudentYear(parsedStudent.year);
        } catch (error) {
            console.error("Error parsing student data:", error);
            // Clear invalid data and redirect to login
            localStorage.removeItem("student");
            router.push("/login");
        }
    }, []);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStudentData((prev) => ({ ...prev, [name]: value }));
    };

    const startTest = async () => {
        if (!test) return;

        // Check if the test is already completed
        const currentTest = studentInfo?.assignedTests.find(test => test.testId === testId);
        if (currentTest?.status === "completed") {
            // Don't use alert, return early to prevent starting
            setIsRunning(false);
            setTestCompleted(true);
            return;
        }

        setIsRunning(true);

        try {
            const res = await fetch(`${API_BASE_URL}/tests/${test._id}/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: studentId,
                    testId: test._id,
                    year: studentYear,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsRunning(true);
                setTestCompleted(false)
            } else {
                setTestCompleted(true)
                // alert(`Failed to start the test: ${data.message}`);
            }
        } catch (err) {
            alert("An error occurred while starting the test. Please try again.");
        }
    };


    const endTest = () => {
        setIsRunning(false);
        // localStorage.removeItem(`timer-${slug}`);
    };

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

    useEffect(() => {
        if (!studentId) return;

        const fetchStudent = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/students/${studentId}?year=${studentYear}`);
                if (!res.ok) throw new Error("Failed to fetch student details");
                const data = await res.json();

                setStudentInfo(data);

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [studentId, studentYear]);

    useEffect(() => {
        if (!studentInfo?.assignedTests || !testId) return;

        const currentTest = studentInfo.assignedTests.find(test => test.testId === testId);

        if (currentTest?.status === "completed") {
            setIsRunning(false);
            setTestCompleted(true);
        }

        if (currentTest?.status === "in-progress") {
            setIsRunning(true);
            setTestCompleted(false);
        }
    }, [studentInfo, testId]);

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

    const handleSubmit = async () => {
        if (!test) return;
        // console.log(studentData);


        const completed = test.categories
            .filter(category =>
                category.questions.every(q =>
                    selectedAnswers[category.categoryName]?.[q._id]?.submitted
                )
            )
            .map(cat => cat.categoryName);

        setCompletedCategories(completed);

        // if all categories are completed, compute marks and submit
        if (completed.length === test.categories.length) {
            const marks: Record<string, number> = {};

            test.categories.forEach(category => {
                let score = 0;

                category.questions.forEach(question => {
                    const submittedAnswer = selectedAnswers[category.categoryName]?.[question._id];
                    if (submittedAnswer?.answer === question.correctAnswer) {
                        score += 1;
                    }
                });

                marks[category.categoryName] = score;
            });

            try {
                const res = await fetch(`${API_BASE_URL}/tests/${testId}/submit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: studentId,
                        testId: test._id,
                        year: studentYear,
                        marks
                    })
                });

                const data = await res.json();

                console.log(data);

                if (res.ok) {
                    console.log("Test marks submitted:", data);
                    endTest();
                } else {
                    console.error("Submission failed:", data.message);
                    alert(`Failed to submit test: ${data.message}`);
                }
            } catch (err) {
                console.error("Error during submission:", err);
                alert("Error submitting test. Please try again.");
            }
        }
        setTestCompleted(true)
        setIsRunning(false)
        // scroll to top
        window.scrollTo(0, 0);
    };

    // const isTestCompleted = async () => {
    //     const testId = test?._id;
    //     try {
    //         const res = await fetch(`${API_BASE_URL}/students`);
    //         const students: Student[] = await res.json();

    //         // Find the student by studentId
    //         const student = students.find((student) => student._id === studentId);

    //         if (student) {
    //             // Check if the specific test is completed
    //             const isCompleted = student.assignedTests.some((test) => test.testId === testId && test.status === "completed");
    //             return isCompleted;
    //         } else {
    //             // If the student is not found, return false or handle accordingly
    //             return false;
    //         }
    //     } catch (error) {
    //         console.error("Error fetching student data:", error);
    //         return false;
    //     }
    // }

    // useEffect(() => {
    //     const checkTestCompletion = async () => {
    //         const completed = await isTestCompleted();
    //         setTestCompleted(completed);
    //     };

    //     checkTestCompletion();
    // }, [testId, studentId]);

    // if (testCompleted === null) {
    //     return <div>Loading...</div>;
    // }

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

    return {
        test,
        loading,
        error,
        selectedAnswers,
        testCompleted,
        studentInfo,
        completedCategories,
        isRunning,
        studentData,
        slug: testId,
        handleChange,
        startTest,
        endTest,
        handleAnswerSelect,
        handleQuestionSubmit,
        handleSubmit,
        calculateCategoryStats,
    };
}
