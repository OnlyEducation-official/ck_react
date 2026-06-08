// question.types.ts

export type TOptionType = "Single" | "Multiple" | "Numerical";

export type TDifficultyLevel = "easy" | "moderate" | "hard";

export type TQuestionOption = {
    id?: number;
    name: string;
    isCorrect: boolean;
    questionId?: number;
    createdAt?: string;
    updatedAt?: string;
};

export type TQuestionImage = {
    id?: number;
    imageLink: string;
    questionId?: number;
    createdAt?: string;
    updatedAt?: string;
};

export type TQuestionRelation = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    // [key: string]: unknown;
};



// Get question
export type TQuestion = {
    id: number;
    question: string;
    explanation: string;
    hint: string;
    optionType: TOptionType;
    difficultyLevel: TDifficultyLevel;
    createdAt: string;
    updatedAt: string;

    options: TQuestionOption[];
    images: TQuestionImage[];

    subjects: TQuestionRelation[];
    topics: TQuestionRelation[];
    chapters: TQuestionRelation[];
    subjectCategories: TQuestionRelation[];
    examCategories: TQuestionRelation[];

    subjectIds: number[];
    topicIds: number[];
    chapterIds: number[];
    subjectCategoryIds: number[];
    examCategoryIds: number[];
};
