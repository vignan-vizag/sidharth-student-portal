export interface ObjectId {
    $oid: string;
}

export interface Question {
    _id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface Category {
    _id: string;
    categoryName: string;
    questions: Question[];
}

export interface Test {
    _id: string;
    testName: string;
    categories: Category[];
    __v: number;
}

interface AssignedTestPending {
    _id: string;
    testId: string;
    status: 'pending';
}

interface AssignedTestCompleted {
    _id: string;
    testId: string;
    status: 'completed';
    marks: Record<string, number>;
    submittedAt: string | null;
}

type AssignedTest = AssignedTestPending | AssignedTestCompleted;

export interface Student {
    _id: string;
    name: string;
    rollno: string;
    year: number;
    branch: string;
    section: string;
    email: string;
    semester: number;
    assignedTests: AssignedTest[];
} 
