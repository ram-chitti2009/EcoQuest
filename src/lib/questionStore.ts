type Question  = {
    question_text : string;
    category? : string;
    difficulty? : string;
    tags?: string[];
    source?: string;
}

let questionStore: Question[] = [];

export function getAllQuestions(): Question[] {
    return questionStore;
}
export function addQuestion(question: Question): void {
    questionStore.push(question);
}
export function clearQuestions(): void {
    questionStore = [];
}
