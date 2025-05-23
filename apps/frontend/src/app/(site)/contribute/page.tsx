"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectFilter from "@/components/SelectFilter";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { CirclePlus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { topics } from "@/constant/topics";
import { generateSlug } from "@/lib/generateSlug";
import axios from "axios";
import { useSession } from "next-auth/react";
import {  useRouter } from "next/navigation";
import { Tags } from "@/constant/tags";

const Contribute = () => {
  const { data: session,status } = useSession();
  
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page if session is loaded and user is not admin
    if (status === "authenticated" && session?.user?.Role !== "ADMIN") {
      router.replace("/"); // Redirect to home page
    }
  }, [session, status, router]);

  const [title, setTitle] = useState("");
  const [topicTitle, setTopicTitle] = useState("");
  const [content, setContent] = useState("");
  const [options, setOptions] = useState<
    { content: string; isCorrect: boolean }[]
  >([]);
  const [difficulty, setDifficulty] = useState("");
  const [subject, setSubject] = useState("");
  const [std, setStd] = useState("");
  const [tag, setTag] = useState("");
  const [stream, setStream] = useState("");
  const [hint, setHint] = useState("");
  const [numericalAnswer, setNumericalAnswer] = useState<number | undefined>(
    undefined
  );
  
  const [questionTime, setQuestionTime] = useState(5);
  const [questionType, setQuestionType] = useState("mcq");

  const [msg, setMsg] = useState("");

  const handleOptionChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { content: "", isCorrect: false }]);
  };

  const slug = generateSlug(topicTitle, subject);

  const ContributeForm = {
    slug,
    title,
    topicTitle,
    questionType,
    std,
    difficulty,
    subject,
    stream,
    hint,
    tag,
    content,
    questionTime,
    options,
    numericalAnswer,
  };

  if(questionType === "NUM"){
    delete ContributeForm.options;
  }
 
  if(questionType === "MCQ"){
    delete ContributeForm.numericalAnswer;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const respones = await axios.post("/api/question", ContributeForm);
      setMsg(respones.data.message);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to submit the form");
    }
    finally{
    setTitle("");
    setTopicTitle("");
    setContent("");
    setOptions([]);
    setDifficulty("");
    setSubject("");
    setStd("");
    setTag("");
    setStream("");
    setHint("");
    setNumericalAnswer(undefined);
    setQuestionTime(5);
    setQuestionType("mcq");
    }
  };
  if (status === "authenticated" && session?.user?.Role === "ADMIN") {

  return (
    <div className="max-w-screen-2xl mx-auto    p-5">
      <div className="grid grid-cols-1 md:grid-cols-12 border">
        
        <form
          className="md:col-span-8 p-10"
          onSubmit={handleSubmit}
          // onSubmit={async (e) => {
          //   const result = await handleContribution(e, ContributeForm);
          //   setMsg(result.message);
          // }}
        >
          <div className="flex flex-wrap mx-3 mb-6   ">
            <div className="w-full  px-3 mb-6 md:mb-0">
                <label
                  className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Topics Title
                </label>
                <Input
                  required
                  type="text"
                  className="mb-2"
                  placeholder="Title"
                  value={title}
                  name="title"
                  onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap  mb-6 w-full">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Topics Title
                </label>
                <Combobox
                  onchange={(newTopic: string) => {
                    setTopicTitle(newTopic);
                  }}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Class
                </label>
                <SelectFilter
                  width={"full"}
                  placeholder="Class"
                  selectName={["Foundation", "11th", "12th"]}
                  onChange={(value: string[]) => setStd(value[0])}
                />
              </div>
            </div>
            <div className="flex flex-wrap  mb-6 w-full">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Difficulty
                </label>
                <SelectFilter
                  width={"full"}
                  placeholder="Difficulty"
                  selectName={["Easy", "Medium", "Hard"]}
                  onChange={(value: string[]) => setDifficulty(value[0])}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Subjects
                </label>
                <SelectFilter
                  width={"full"}
                  placeholder="Subjects"
                  selectName={["Mathematics", "Physics", "Chemistry"]}
                  onChange={(value: string[]) => setSubject(value[0])}
                />
              </div>
            </div>
            <div className="flex flex-wrap   px-3 w-full md:w-1/2">
            <label
                  className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Tags
                </label>
                <SelectFilter
                  width={"full"}
                  placeholder="Tags"
                  selectName={Tags}
                  onChange={(value: string[]) => setTag(value[0])}
                />
            </div>  
            <div className="flex flex-wrap  px-3 w-full md:w-1/2">
            <label
                  className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Stream
                </label>
                <SelectFilter
                  width={"full"}
                  placeholder="Stream"
                  selectName={["NEET", "JEE"]}
                  onChange={(value: string[]) => setStream(value[0])}
                />
            </div>  
            <div className="w-full m-2">
              <Label htmlFor="grid-title">Question Time (Min)</Label>
              <SelectFilter
                  width={"full"}
                  placeholder="Question Time"
                  selectName={["1","2","3","4","5","6","8","10","12","15"]}
                  onChange={(value: string[]) => setQuestionTime(parseInt(value[0]))}
                />
            </div>
            <div className="w-full m-2">
              <Label htmlFor="grid-title">Hints</Label>
              <Textarea
                className="min-h-[50px]"
                id="grid-desc"
                name="question hints"
                placeholder="Question Hinits"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
              />
            </div>
            <div className="w-full m-2">
              <Label htmlFor="grid-title">Question</Label>
              <Textarea
                className="min-h-[400px]"
                id="grid-desc"
                name="questioncontent"
                value={content}
                placeholder="Question Content"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
           
            <div className="w-full m-2">
              <Label htmlFor="grid-problem">Question Type</Label>
              <Tabs
                defaultValue="MCQ"
                onValueChange={setQuestionType}
                value={questionType}
              >
                <TabsList>
                  <TabsTrigger value="MCQ" 
                  
                  >MCQ</TabsTrigger>
                  <TabsTrigger value="NUM"> Numerical </TabsTrigger>
                </TabsList>

                <TabsContent value="MCQ">
                  {/* MCQ */}
                  <div>
                    {options.map((option, index) => (
                      <div
                        className="flex items-center  justify-center "
                        key={index}
                      >
                        <label>
                          <Input
                            className="h-5 w-5"
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                "isCorrect",
                                e.target.checked
                              )
                            }
                          />
                        </label>

                        <Input
                          type="text"
                          className="mb-2"
                          value={option.content}
                          placeholder={`Option ${index + 1}`}
                          name={`options.text[${index}]`}
                          onChange={(e) =>
                            handleOptionChange(index, "content", e.target.value)
                          }
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1"
                      onClick={addOption}
                    >
                      <CirclePlus className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Option
                      </span>
                    </Button>

                  </div>
                </TabsContent>
                <TabsContent value="NUM">
                  {/* NUM */}
                  <Input
                    type="text"
                    className="mb-2"
                    placeholder="Enter Answer"
                    name="numerical"
                    value={numericalAnswer}
                    onChange={(e) =>
                      setNumericalAnswer(parseFloat(e.target.value))
                    }
                  />
                </TabsContent>
                
              </Tabs>
            </div>

            {msg && <p className="text-red-500 text-sm ml-4">{msg}</p>}
            <div className="w-full m-2">
              <Button>Submit</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
return null;
};

export default Contribute;

interface ComboboxProps {
  onchange: (value: string) => void;
}

function Combobox({ onchange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  React.useEffect(() => {
    onchange(value);
  }, [value, onchange]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? topics.find((topic) => topic === value) : "Select Topic..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search topic..." className="h-9" />
          <CommandList>
            <CommandEmpty>No topic found.</CommandEmpty>
            <CommandGroup>
              {topics.map((topic) => (
                <CommandItem
                  key={topic}
                  value={topic}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {topic}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === topic ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}