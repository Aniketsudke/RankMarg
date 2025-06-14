import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { AttemptType, SubmitStatus } from "@prisma/client";
import { getServerSession } from "next-auth";



export async function POST(req: Request, { params }: { params: { testId: string } }) {
  const { testId } = params;
  const { submissions, marks, timing,counts,minimizeCount } = await req.json();
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
    const answeredQuestions = submissions.filter(q => 
      q.status === SubmitStatus.CORRECT || q.status === SubmitStatus.INCORRECT
    );
    const correctAnswers = submissions.filter(q => q.status === SubmitStatus.CORRECT);
    const accuracy = answeredQuestions.length > 0 
      ? (correctAnswers.length / answeredQuestions.length) * 100 
      : 0;
    const submissionsToStore = submissions.map((submission) => ({
      userId: session.user.id,
      testParticipationId: participation.id,
      questionId: submission.questionId,
      type: AttemptType.TEST,
      answer: submission.answer,
      timing: submission.timing || 0,
      reactionTime: submission.timing ? submission.timing * 0.8 : 0,
      solvedAt: submission.submittedAt,
      status: submission.status,
    }));


    await prisma.attempt.createMany({
      data: submissionsToStore,
    });

    await prisma.testParticipation.update({
      where: {
        id: participation.id,
      },
      data: {
        status: "COMPLETED",
        endTime: new Date(),
        score: marks,
        timing,
        accuracy,
        cntAnswered: counts.cntAnswered,
        cntNotAnswered: counts.cntNotAnswered,
        cntMarkForReview: counts.cntMarkForReview,
        cntAnsweredMark: counts.cntAnsweredMark,
        cntMinmize: minimizeCount
      },
    });
    
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
