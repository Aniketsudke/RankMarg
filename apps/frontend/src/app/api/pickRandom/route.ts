import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.json();
  const { topic, difficulty, subject } = body;

  console.log("Request Body:", body);
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    // Define the priority order for filters
    const filters: Prisma.QuestionWhereInput[] = [
      { subject, topic, difficulty },
      { subject, topic },
      { subject },
      { topic, difficulty },
      { topic },
      { difficulty },
    ];

    let question = null;

    // Iterate over filters in priority order and fetch the first matching question
    for (const filter of filters) {
      const queryFilter: Prisma.QuestionWhereInput = {
        ...filter,
        attempts: {
          none: {
            userId: session.user.id,
            isCorrect: false,
          },
        },
      };

      const questions = await prisma.question.findMany({ where: queryFilter });

      if (questions.length > 0) {
        question = questions[Math.floor(Math.random() * questions.length)];
        break;
      }
    }

    // Check if all questions have been solved
    if (!question) {
      const attemptedQuestions = await prisma.attempt.count({
        where: {
          userId: session.user.id,
          isCorrect: true,
        },
      });

      const totalQuestions = await prisma.question.count();

      if (attemptedQuestions === totalQuestions) {
        return new Response(
          JSON.stringify({
            message: "Congratulations! You've solved all available questions. Stay tuned for more content.",
          }),
          { status: 200 }
        );
      } else {
        
        return new Response(
          JSON.stringify({
            message: "We couldn't find a matching question. Please try relaxing your filters.",
          }),
          { status: 404 }
        );
      }
    }

    return new Response(
      JSON.stringify({
        message: "success",
        question,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("[Pick Random] Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
