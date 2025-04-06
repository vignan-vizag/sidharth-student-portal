import { Test } from "@/types";
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
    const [studentYear, setStudentYear] = useState<number | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, Record<string, { answer: string; submitted: boolean }>>>({});
    const [completedCategories, setCompletedCategories] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState<boolean>(false);
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
        const student = localStorage.getItem("student") || "";
        // const studentData = localStorage.getItem("student");
        const parsedStudent = JSON.parse(student);
        // console.log(parsedStudent._id);
        setStudentId(parsedStudent._id);
        setStudentYear(parsedStudent.year);
        
        if (!student || !studentData) {
            router.push("/login");
        }
    }, []);
    

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStudentData((prev) => ({ ...prev, [name]: value }));
    };

    const startTest = () => {
        // const { rollNo, name, email } = studentData;

        // if (!rollNo || !name || !email) {
        //     alert('Please fill in all fields.');
        //     return;
        // }

        setIsRunning(true);
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

        // scroll to top
        window.scrollTo(0, 0);
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

    return {
        test,
        loading,
        error,
        selectedAnswers,
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
