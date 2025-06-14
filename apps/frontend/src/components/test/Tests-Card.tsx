import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Clock, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Separator } from '../ui/separator';
import Link from 'next/link';

interface TestsCardProps {
  testId: string;
  hasAttempted: boolean;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
}

const TestsCard = ({ title, description, duration, totalQuestions, testId, hasAttempted }: TestsCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const truncatedDescription = description?.length > 20
    ? description.substring(0, 20) + '... '
    : description;

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-300 w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {truncatedDescription}
            {description?.length > 20 && (
              <span
                className="text-yellow-500 cursor-pointer hover:underline"
                onClick={() => setIsDialogOpen(true)}
              >
                more
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span>Duration: {duration} mins</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <HelpCircle className="w-4 h-4 mr-2" />
            <span>{totalQuestions} Questions</span>
          </div>
          {
            hasAttempted ? (
              <Link href={`/analysis/${testId}`}>
                <Button className={`w-full bg-gray-600 hover:bg-gray-700 text-white mt-4`}>
                  View Analysis
                </Button>
              </Link>
            ) : (
              <Link href={`/test/${testId}/instructions`}>
                <Button className={`w-full mt-4`}>
                  Start Test
                </Button>
              </Link>
            )}
        </CardContent>
        <Separator className='hidden md:block' />
        <CardFooter className=" justify-between text-sm text-muted-foreground pt-2 bg-muted hidden ">
          <span>Average Score: 70%</span>
          <span>Pass Rate: 80%</span>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <p className="mt-4">{description}</p>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TestsCard