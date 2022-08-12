import Quiz from 'entities/quiz.entity';

export default async function createNewQuiz(quiz: typeof Quiz): Promise<typeof Quiz> {
    const res = await fetch('/api/prof/quiz', {
        method: 'POST',
        body: JSON.stringify(quiz)
    });
    const data = await res.json();
    return data.data;
}