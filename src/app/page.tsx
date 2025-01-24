'use client';

import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const typingSpeed = 300;
const text = 'I WANT TO PLAY A GAME...';
const answerSeconds = 10;

const domain = 'https://b99d-210-242-7-79.ngrok-free.app';
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
    question:
      '任天堂(Nintendo)的耀西(Yoshi)在2019年後被官方證實是哪一種動物(animals)?',
    answers: [
      { id: 'A', text: '蜥蜴(Lizard)' },
      { id: 'B', text: '恐龍(Dinosaur)' },
      { id: 'C', text: '小卷(Squid)' },
      { id: 'D', text: '烏龜(Turtle)' },
    ],
    realAnswer: 'D',
  },
  3: {
    question: '在吉伊卡哇(Chīkawa)動畫中主角(ちいかわ)代表哪一種動物(animals)?',
    answers: [
      { id: 'A', text: '北極熊(Polar bear)' },
      { id: 'B', text: '哈姆太郎(Hamtaro)' },
      { id: 'C', text: '飛鼠(Flying squirrel)' },
      { id: 'D', text: '兔子(Rabbit)' },
    ],
    realAnswer: 'A',
  },
  4: {
    question:
      '在 Netflix 韓劇魷魚遊戲(Squid Game), 哪一項是參賽者第一關玩的遊戲(game)?',
    answers: [
      { id: 'A', text: '一二三木頭人 (One, two, three, freeze!)' },
      { id: 'B', text: '拔河(Tug of War)' },
      { id: 'C', text: '彈珠(Marbles)' },
      { id: 'D', text: '騎自行車(Ride bike)' },
    ],
    realAnswer: 'A',
  },
  5: {
    question: '無足能行千里路，無翅可飛九重天? 猜一種動物(animals)',
    answers: [
      { id: 'A', text: '兔子(Rabbit)' },
      { id: 'B', text: '蛇(Snake)' },
      { id: 'C', text: '鯊魚(shark)' },
      { id: 'D', text: '蜘蛛(Spider)' },
    ],
    realAnswer: 'B',
  },
  6: {
    question: '紅衣裡面藏乾肉，過年時節滿天飛? 猜ㄧ物品(Item)',
    answers: [
      { id: 'A', text: '紅包(Red envelope)' },
      { id: 'B', text: '年糕(Rice cake)' },
      { id: 'C', text: '湯圓(Glutinous rice ball)' },
      { id: 'D', text: '鞭炮(Firecracker)' },
    ],
    realAnswer: 'D',
  },
  7: {
    question: '長得像虎又像豹，害怕紅色和炮聲。（猜傳說中的怪獸）',
    answers: [
      { id: 'A', text: '麒麟(Kirin)' },
      { id: 'B', text: '青龍(Azure Dragon)' },
      { id: 'C', text: '年獸(Nian (Year Beast))' },
      { id: 'D', text: '鳳凰(Phoenix)' },
    ],
    realAnswer: 'C',
  },
  8: {
    question:
      '雲端互動(cloud-interactive)的誰不是設計師(UI Designer/ UX Designer) ',
    answers: [
      { id: 'A', text: 'Sky Hsu' },
      { id: 'B', text: 'Chloe Tsai' },
      { id: 'C', text: 'Jen Jen' },
      { id: 'D', text: 'Tracy Hou' },
    ],
    realAnswer: 'D',
  },
  9: {
    question:
      '在雲端互動(cloud-interactive)對任何年假或打卡等有疑問時，可以找人人力資源部門(HR)幫忙解決，帶領人力資源部經理(HR Manager)是誰?',
    answers: [
      { id: 'A', text: 'Yvonne Chang' },
      { id: 'B', text: 'Gary Chai' },
      { id: 'C', text: 'Sean Lin' },
      { id: 'D', text: 'Rita Chao' },
    ],
    realAnswer: 'A',
  },
  10: {
    question:
      '在雲端互動(cloud-interactive)每月月底(人力資源部門)HR舉辦的Happy Hour，想提供好吃好玩的想法時，該和誰提供意見呢？',
    answers: [
      { id: 'A', text: 'David' },
      { id: 'B', text: 'Danny' },
      { id: 'C', text: 'Vince' },
      { id: 'D', text: 'Hera' },
    ],
    realAnswer: 'D',
  },
  11: {
    question: '誰不是雲端互動(cloud-interactive)的工程師(RD)？',
    answers: [
      { id: 'A', text: 'Michael Cheng' },
      { id: 'B', text: 'Nick Peng' },
      { id: 'C', text: 'Sky Hsu' },
      { id: 'D', text: 'Boris Chang' },
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
  const [aiTalkWhy, setAiTalkWhy] = useState('');

  const [gamerMostAnswer, setGamerMostAnswer] = useState('');
  const [allGamerAnswerData, setAllGamerAnswerData] = useState(null);

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
    const match = data?.textResponse.match(/^[^.]+/); // 匹配.前的所有字符
    const result = match ? match[0] : null;

    console.log('match', match);

    setAiThinking(false);
    setIsAIAnswer(true);
    setAISelectedAnswer(result);
    setAiTalkWhy(data?.textResponse);
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
    setAISelectedAnswer(null);
    setGamerMostAnswer('');
    setIsAIAnswer(false);
    setAiHasAnswered(false); // 一題只能回答一次 允許下一題作答
    setAllGamerAnswerData(null);
    setAiTalkWhy('');
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

  const [totalScore, setTotalScore] = useState({
    players: 0,
    ai: 0,
  });

  console.log(
    'questions[questionNumber]?.realAnswer',
    questions[questionNumber]?.realAnswer
  );
  console.log('gamerMostAnswer', gamerMostAnswer);
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
            <h2 className="text-[45px] font-[new-tegomin-regular] text-[#aa0000]">
              問題{questionNumber}
            </h2>
            <div className="w-[1200px] mx-auto mt-10 shadow-lg rounded-lg">
              {/* <h1 className="text-2xl font-bold mb-4"></h1> */}{' '}
              <p className="text-[45px] text-[#aa0000] mb-6 font-[new-tegomin-regular]">
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
                        <div className="flex flex-row gap-3 text-blue-500">
                          CI
                          <Image
                            width={30}
                            height={30}
                            src={'/image/gamer.png'}
                            alt="AI IS HERE"
                          />
                        </div>
                      )}
                      {AISelectedAnswer === answer.id && (
                        <>
                          <Image
                            width={24}
                            height={24}
                            src={'/image/ai.png'}
                            alt="AI IS HERE"
                          />
                          {/* <p className="text-[#FFF]">{aiTalkWhy}</p> */}
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {/* AI Thinking Corner */}
              <div className="text-[25px] w-[700px] h-[45px] mx-[auto] mt-[40px] flex gap-2 pt-2 w-100 text-center font-medium text-[#aa0000] font-[new-tegomin-regular]">
                {aiThinking && (
                  <>
                    <Image
                      width={24}
                      height={24}
                      src={'/image/ai.png'}
                      alt="AI IS HERE"
                    />
                    ：讓我思考一下...
                  </>
                )}
              </div>
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
    <div
      className={`relative ${
        seconds === 0 &&
        questions[questionNumber] &&
        gamerMostAnswer &&
        questions[questionNumber]?.realAnswer !== gamerMostAnswer
          ? 'shake'
          : ''
      }`}
    >
      {step >= 2 && (
        <>
          <div className="relative text-[120px] text-center text-[#aa0000] font-[new-tegomin-regular]">
            {seconds}
          </div>
          {questions[questionNumber] && gamerMostAnswer && (
            <div className="relative text-[120px] text-center text-[#aa0000] font-[new-tegomin-regular]">
              {seconds === 0 &&
                questions[questionNumber].realAnswer !== gamerMostAnswer && (
                  <div
                    className={`absolute bloodAnimation`}
                    // className={`absolute transition duration-300 opacity-1`}
                  >
                    <img src="/image/blood.png" alt="" />
                  </div>
                )}
            </div>
          )}
        </>
      )}
      {renderStep()}
    </div>
  );
}
