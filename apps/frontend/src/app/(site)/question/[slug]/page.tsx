"use client";
import QuestionUI from '@/components/QuestionUI';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';
import QuestionUISkeleton from '@/components/QuestionUISkeleton';
import { useRouter } from 'next/navigation';

interface attempDataProps {
  questionId: string;
  userId: string;
  selectedOptions: number[];
  isCorrect: boolean;
}

const QuestionPage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const handleRandom = async() => {
    const storedFilters = JSON.parse(localStorage.getItem('questionFilters') || '{}');
    try {
      const question = await axios.post(`/api/pickRandom`,
      {
        topic: storedFilters.topic,
        difficulty: storedFilters.difficulty,
      }
      );
      if(question){
        router.push(`/question/${question.data.slug}`);
      }
    } catch (error) {
      console.error( error);
    }

  }

  const { slug } = params;
  const { data: question, isLoading } = useQuery({
    queryKey: ["question",slug],
    queryFn: async () => {
      const { data } = await axios.get(`/api/question/${slug}`);
      return data;
    },
  });
  const handleAttempt = async(attemptData:attempDataProps) => {
    try {
       await axios.post('/api/attempts', attemptData)
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <div>
      
      {
        isLoading ? (
          <QuestionUISkeleton />
        ) : (
          <QuestionUI question={question}
          handleAttempt={handleAttempt} 
           />
        )

      }
      <div className="flex flex-wrap justify-center items-center p-2 bg-white border-b-2">
        <Button size="sm" className="h-9 w-40 gap-1"
        onClick={handleRandom}
        >
          <Shuffle className="h-4 w-4" />
          <span>Pick random</span>
        </Button>
      </div>
    </div>
  );
};



export default QuestionPage;
