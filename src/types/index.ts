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
