const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const quiz = await prisma.quiz.create({
        data: {
            title: "Color Quiz",
            level: 1,
            questions: {
                create: [
                    {
                        text: "What color is the sky?",
                        type: "TEXT",
                        options: {
                            create: [
                                { text: "Blue", isCorrect: true },
                                { text: "Red", isCorrect: false },
                                { text: "Green", isCorrect: false },
                            ]
                        }
                    }
                ]
            }
        }
    });

    console.log("Seeded quiz:", quiz);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
