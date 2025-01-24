'use client';

import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const typingSpeed = 300;
const text = 'I WANT TO PLAY A GAME...';
const answerSeconds = 10;

const domain = 'https://bd35-210-242-7-79.ngrok-free.app';
interface Questions {
  [key: number]: {
    question: string;
    answers: { id: string; text: string }[];
    realAnswer: string;
  };
}

const questions: Questions = {
  1: {
    question: 'What is the capital of France?',
    answers: [
      { id: 'A', text: 'Berlin' },
      { id: 'B', text: 'Madrid' },
      { id: 'C', text: 'Paris' },
      { id: 'D', text: 'Rome' },
    ],
    realAnswer: 'C',
  },
  2: {
    question: '你媽?',
    answers: [
      { id: 'A', text: 'Google' },
      { id: 'B', text: 'IBM' },
      { id: 'C', text: 'Gray' },
      { id: 'D', text: 'OpenAI' },
    ],
    realAnswer: 'C',
  },
  3: {
    question:
      '任天堂(Nintendo)的耀西(Yoshi)在2019年後被官方證實是哪一種動物(animals)?',
    answers: [
      { id: 'A', text: '蜥蜴(Lizard)' },
      { id: 'B', text: '恐龍(Dinosaur)' },
      { id: 'C', text: '小卷(Squid)' },
      { id: 'D', text: '烏龜(Turtle)' },
    ],
    realAnswer: 'C',
  },
  4: {
    question: '在吉伊卡哇(Chīkawa)動畫中主角(ちいかわ)代表哪一種動物(animals)?',
    answers: [
      { id: 'A', text: '北極熊(Polar bear)' },
      { id: 'B', text: '哈姆太郎(Hamtaro)' },
      { id: 'C', text: '飛鼠(Flying squirrel)' },
      { id: 'D', text: '兔子(Rabbit)' },
    ],
    realAnswer: 'C',
  },
  5: {
    question:
      'In the Netflix Korean drama Squid Game, what is the first game the contestants play?',
    answers: [
      { id: 'A', text: 'One, two, three, freeze!' },
      { id: 'B', text: 'Tug of War' },
      { id: 'C', text: 'Marbles' },
      { id: 'D', text: 'Ride bike' },
    ],
    realAnswer: 'C',
  },
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [aiThinking, setAiThinking] = useState(false);
  // 開啟和關掉 ai 思考狀態的文字
  const [isAIAnswer, setIsAIAnswer] = useState(false);
  const [gamerSelectedAnswer, setGamerSelectedAnswer] = useState<string | null>(
    null
  );
  const [AISelectedAnswer, setAISelectedAnswer] = useState<string | null>(null);

  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const [gamerMostAnswer, setGamerMostAnswer] = useState('');
  const [allGamerAnswerData, setAllGamerAnswerData] = useState();

  // const question = "What is the capital of France?";
  // const question = "What is the highest mountain peak in the solar system?";
  // const question =
  // "In the Netflix Korean drama Squid Game, what is the first game the contestants play?";
  const question =
    '任天堂(Nintendo)的耀西(Yoshi)在2019年後被官方證實是哪一種動物(animals)?';
  // const question =
  //   "在吉伊卡哇(Chīkawa)動畫中主角(ちいかわ)代表哪一種動物(animals)?";

  // const answers = [
  //   { id: "A", text: "Berlin" },
  //   { id: "B", text: "Madrid" },
  //   { id: "C", text: "Paris" },
  //   { id: "D", text: "Rome" },
  // ];
  // const answers = [
  //   { id: "A", text: "Mount Everest" },
  //   { id: "B", text: "Mount Kilimanjaro" },
  //   { id: "C", text: "Olympus Mons" },
  //   { id: "D", text: "Mount Fuji Response" },
  // ];
  // const answers = [
  //   { id: "A", text: "One, two, three, freeze!" },
  //   { id: "B", text: "Tug of War" },
  //   { id: "C", text: "Marbles" },
  //   { id: "D", text: "Ride bike" },
  // ];
  const answers = [
    { id: 'A', text: '蜥蜴(Lizard)' },
    { id: 'B', text: '恐龍(Dinosaur)' },
    { id: 'C', text: '小卷(Squid)' },
    { id: 'D', text: '烏龜(Turtle)' },
  ];
  // const answers = [
  //   { id: "A", text: "北極熊(Polar bear)" },
  //   { id: "B", text: "哈姆太郎(Hamtaro)" },
  //   { id: "C", text: "飛鼠(Flying squirrel)" },
  //   { id: "D", text: "兔子(Rabbit)" },
  // ];

  // submit answer for the round
  // const handleSubmit = () => {
  //   if (!AISelectedAnswer) {
  //     alert('pleaseeeeee select an answer before submitting.');
  //     return;
  //   }
  //   console.log('Selected Answer:', AISelectedAnswer);
  // };
  // 倒數計時會不斷重新觸發 Ai
  const [aiHasAnswered, setAiHasAnswered] = useState<boolean>(false);

  // test AI choosing answer
  async function handleAIChooseAnswer() {
    if (!questions[questionNumber]) return;
    setAiThinking(true);

    const { data } = await axios.post(`${domain}/api/query`, {
      prompt: `
      [Role]
      You are an NPC AI in a quiz game. Your sole responsibility is to provide the correct answers to all questions with 100% accuracy. You are a highly knowledgeable entity with expertise in general knowledge, geography, history, arts, and culture. Your primary goal is to deliver accurate and factual responses for every question, avoiding any competitive or misleading behavior.

      [Game Rules]
      The game consists of ten multiple-choice questions, each with four options: A, B, C, and D. Your job is to select the correct answer for each question as accurately and confidently as possible. You do not need to consider speed or strategy—your only focus is on providing the correct and factual answer.

      [Behavior Guidelines]
        1.	Evaluate all options thoroughly: Always analyze each answer choice carefully before making a selection.
        2.	Select the correct answer based on knowledge: Use your expertise to ensure your response is factually correct.
        3.	Avoid biases toward specific options: Do not default to any specific choice (e.g., A) or follow patterns unless the content of the question dictates the correct answer.
        4.	Treat every question independently: Focus only on the current question without considering previous patterns.
        

      [Clarification for Answering Questions]
        •	Review each answer choice equally and identify the correct one based on your factual knowledge.
        •	Avoid prioritizing options based on order or repetition.
        •	Respond with a single letter (A, B, C, or D) corresponding to the correct answer.

        Now answer the following question and match your answer to the correct option
      Question: ${questions[questionNumber].question}
      Options: ${questions[questionNumber].answers.map(
        ({ id, text }) => `${id}. ${text}`
      )}
      Tell me the correct option—respond with the shortest answer possible, nothing else.
    `,
    });

    // const { data } = await axios.post(
    //   "http://localhost:8282/api/query-multi-choice",
    //   JSON.stringify({
    //     question,
    //     answers,
    //   }),
    // );

    console.log('AI Response to the question was: ', data);
    const match = data?.message?.content.match(/^[^.]+/); // 匹配.前的所有字符
    const result = match ? match[0] : null;

    setAiThinking(false);
    setIsAIAnswer(true);
    setAISelectedAnswer(result);
  }

  const apiStart = async () => {
    const { data } = await axios.post(`${domain}/api/game/start`);
    console.log('AI start ', data);
  };

  const apiEnd = async () => {
    const { data } = await axios.post(`${domain}/api/game/end`);
    console.log('AI end ', data);
    if (data) {
      const answers = data?.score;

      let mostCounts = 0;
      let mostAnswer = '';
      for (const [answer, counts] of Object.entries(
        answers as Record<string, number>
      )) {
        if (counts > mostCounts) {
          mostCounts = counts;
          mostAnswer = answer;
        }
      }

      setAllGamerAnswerData(answers);
      setGamerMostAnswer(mostAnswer);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, typingSpeed + (currentIndex === 0 ? 6000 : 0));

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex]);

  const [seconds, setSeconds] = useState(answerSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const intervalId = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, seconds]);

  const handleNext = () => {
    apiStart();
    setIsRunning(true);
    setSeconds(answerSeconds);
    setQuestionNumber((prev) => prev + 1);
    setIsAIAnswer(false);
    setAiHasAnswered(false); // 一題只能回答一次 允許下一題作答
  };

  useEffect(() => {
    if (seconds <= 8 && !aiHasAnswered) {
      handleAIChooseAnswer();
      setAiHasAnswered(true); // 確保每題AI只回答一次
    }
    if (seconds === 0) {
      apiEnd();
    }
  }, [seconds, isAIAnswer]);

  console.log('questions[questionNumber]', questions[questionNumber]);
  console.log('AISelectedAnswer', AISelectedAnswer);
  function renderStep() {
    switch (step) {
      case 1: {
        return (
          <div
            className="text-center font-bold cursor-pointer"
            onClick={() => {
              handleNext();
              setStep(2);
            }}
          >
            <div className="flex text-center justify-center">
              <div>
                <div className="text-center">
                  <img
                    src="/image/host.png"
                    alt="gamer"
                    className={`m-auto transition duration-[15s] ${
                      currentIndex > 10 ? 'brightness-[0.5]' : 'brightness-[0]'
                    }`}
                  />
                </div>
                <div className="h-[120px] text-[120px] text-[#cc0000] font-[ghastly-panic] flex">
                  {displayText}
                  <div className="cursor ml-4"></div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 2: {
        return (
          <>
            <h2 className="text-[70px] font-[new-tegomin-regular] text-[#aa0000]">
              問題{questionNumber}
            </h2>
            <div className="w-[1200px] mx-auto mt-10 shadow-lg rounded-lg">
              {/* <h1 className="text-2xl font-bold mb-4"></h1> */}
              <p className="text-[70px] text-[#aa0000] mb-6 font-[new-tegomin-regular]">
                {questions[questionNumber]?.question}
              </p>

              <ul className="space-y-4 w-[700px] mx-[auto] mt-[80px]">
                {questions[questionNumber]?.answers.map((answer) => (
                  <li
                    key={answer.id}
                    className="text-xl text-[#aa0000] h-[70px]"
                    // onClick={() => setGamerSelectedAnswer(answer.id)}
                  >
                    <div
                      className={`flex gap-2 font-[new-tegomin-regular] text-[40px]`}
                    >
                      <span className="font-medium">{answer.id})</span>{' '}
                      {answer.text}
                      {allGamerAnswerData &&
                        `(${
                          allGamerAnswerData?.[answer.id] +
                          (AISelectedAnswer === answer.id ? 1 : 0)
                        })`}
                      {questions[questionNumber]?.realAnswer === answer.id &&
                        seconds === 0 && (
                          <Image
                            width={36}
                            height={36}
                            src={'/image/right.png'}
                            alt="AI IS HERE"
                          />
                        )}
                      {gamerMostAnswer === answer.id && (
                        <Image
                          width={24}
                          height={24}
                          src={'/image/gamer.png'}
                          alt="AI IS HERE"
                        />
                      )}
                      {AISelectedAnswer === answer.id && (
                        <Image
                          width={24}
                          height={24}
                          src={'/image/ai.png'}
                          alt="AI IS HERE"
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* AI Thinking Corner */}
              {aiThinking ? (
                <div className="text-[30px] w-[700px] mx-[auto] mt-[40px] flex gap-2 pt-2 w-100 text-center font-medium text-[#aa0000] font-[new-tegomin-regular]">
                  <Image
                    width={24}
                    height={24}
                    src={'/image/ai.png'}
                    alt="AI IS HERE"
                  />{' '}
                  : 讓我思考一下...
                </div>
              ) : (
                <div className="mt-4"></div>
              )}

              {/* <button
                onClick={handleAIChooseAnswer}
                className="mt-6 w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                AI Answer
              </button> */}

              <div className="w-full text-right h-[100px]">
                {seconds === 0 && (
                  <button
                    onClick={handleNext}
                    className="mt-6  text-[#aa0000] font-[new-tegomin-regular] font-bold py-2 px-4 text-[40px]"
                  >
                    下一題
                  </button>
                )}
              </div>
            </div>
          </>
        );
      }
    }
  }

  return (
    <div>
      {step >= 2 && (
        <div className="text-[120px] text-center text-[#aa0000] font-[new-tegomin-regular]">
          {seconds}
        </div>
      )}
      {renderStep()}
    </div>
  );
}
