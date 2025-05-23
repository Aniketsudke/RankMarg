import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { ActivityType, TEST_SUBMIT } from "@/constant/activities";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";



export async function POST(req: Request, { params }: { params: { testId: string } }) {
  const { testId } = params;
  const { submission, marks, timing } = await req.json();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const participation = await prisma.testParticipation.findUnique(
      {
        where: {
          userId_testId: {
            userId: session.user.id,
            testId: testId,
          },
        },
        include: {
          test: {
            select: {
              endTime: true
            }
          }
        }
      },
    )
    if (!participation) {
      return new Response("Unauthorized", { status: 401 });
    }
    const answeredQuestions = submission.filter(q => q.isCorrect !== "NOT_ANSWERED");
    const correctAnswers = submission.filter(q => q.isCorrect === "TRUE");
    const accuracy = answeredQuestions.length > 0 
      ? (correctAnswers.length / answeredQuestions.length) * 100 
      : 0;
    const submissionsToStore = submission.map((answer) => ({
      participationId: participation.id,
      testId: participation.testId,
      questionId: answer.questionId,
      timing: answer.timing,
      isCorrect: answer.isCorrect,
    }));

    await prisma.testSubmission.createMany({
      data: submissionsToStore,
    });

    await prisma.testParticipation.update({
      where: {
        id: participation.id,
      },
      data: {
        status: "COMPLETED",
        score: marks,
        timing,
        accuracy
      },
    });
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type:ActivityType.MISSION,
        message: TEST_SUBMIT,
        earnCoin: 5,
      },
    })
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        coins: {
          increment: 5,
        },
      },
    });

    return new Response(JSON.stringify({ TestEnd: participation.test.endTime }), { status: 200 });
  } catch (error) {
    console.log("[Test Submit API Error]:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
