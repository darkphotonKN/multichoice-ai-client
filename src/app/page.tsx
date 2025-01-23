'use client';

import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const typingSpeed = 300;
const text = 'I WANT TO PLAY A GAME...';
const answerSeconds = 10;

const domain = 'https://6e68-210-242-7-79.ngrok-free.app';
interface Questions {
  [key: number]: { question: string; answers: { id: string; text: string }[] };
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
  },
  2: {
    question: '你媽?',
    answers: [
      { id: 'A', text: 'Berlin' },
      { id: 'B', text: 'Madrid' },
      { id: 'C', text: 'Paris' },
      { id: 'D', text: 'Rome' },
    ],
  },
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [aiThinking, setAiThinking] = useState(false);
  const [isAIAnswer, setIsAIAnswer] = useState(false);
  const [gamerSelectedAnswer, setGamerSelectedAnswer] = useState<string | null>(
    null
  );
  const [AISelectedAnswer, setAISelectedAnswer] = useState<string | null>(null);

  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // submit answer for the round
  // const handleSubmit = () => {
  //   if (!AISelectedAnswer) {
  //     alert('pleaseeeeee select an answer before submitting.');
  //     return;
  //   }
  //   console.log('Selected Answer:', AISelectedAnswer);
  // };

  // test AI choosing answer
  async function handleAIChooseAnswer() {
    if (!questions[questionNumber]) return;
    setAiThinking(true);

    const { data } = await axios.post(`${domain}/api/query`, {
      prompt: `
      You are a quiz assistant. Your task is to choose the correct answer to the following question.
      Select only one answer (A, B, C, or D) and respond with the corresponding letter—nothing else.

      Question: ${
        questions[questionNumber].question
      } choose from one of the answers: ${JSON.stringify(
        `${questions[questionNumber].answers}`
      )}

      Please respond with a single letter (A, B, C, or D):
    `,
    });

    // const { data } = await axios.post(
    //   "http://localhost:8282/api/query-multi-choice",
    //   JSON.stringify({
    //     question,
    //     answers,
    //   }),
    // );

    console.log(
      'AI Response to the question was: ',
      data,
      data?.message?.content
    );
    console.log('AI Response to the question was: ', data?.message?.content);
    setAiThinking(false);
    setIsAIAnswer(true);
    setAISelectedAnswer(data?.message?.content);
  }

  const apiStart = async () => {
    const { data } = await axios.post(`${domain}/api/game/start`);
    console.log('AI start ', data);
  };

  const apiEnd = async () => {
    const { data } = await axios.post(`${domain}/api/game/end`);
    console.log('AI end ', data);
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
  };

  useEffect(() => {
    if (seconds <= 8 && !isAIAnswer) {
      handleAIChooseAnswer();
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
                    src="/image/gamer.png"
                    alt="gamer"
                    className={`m-auto transition duration-[15s] ${
                      currentIndex > 1 ? 'brightness-[0.3]' : 'brightness-[0]'
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
            <h2 className="text-[80px] font-[new-tegomin-regular] text-[#aa0000]">
              問題{questionNumber}
            </h2>
            <div className="w-[1000px] mx-auto mt-10 shadow-lg rounded-lg">
              {/* <h1 className="text-2xl font-bold mb-4"></h1> */}
              <p className="text-[80px] text-[#aa0000] mb-6 font-[new-tegomin-regular]">
                {questions[questionNumber].question}
              </p>

              <ul className="space-y-4">
                {questions[questionNumber].answers.map((answer) => (
                  <li
                    key={answer.id}
                    className="text-xl text-[#aa0000] text-[40px] pt-[30px] cursor-pointer"
                    onClick={() => setGamerSelectedAnswer(answer.id)}
                  >
                    <div className="flex gap-2 font-[new-tegomin-regular] ">
                      <span className="font-medium">{answer.id})</span>{' '}
                      {answer.text}
                      {gamerSelectedAnswer === answer.id && (
                        <Image
                          width={24}
                          height={24}
                          src={'/image/ai.png'}
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
                <div className="mt-[20px] flex gap-2 pt-2 w-100 text-center font-medium text-[#aa0000] font-[new-tegomin-regular]">
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

              <div className="w-full text-right">
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
    <div className="p-8">
      {step >= 2 && (
        <div className="text-[120px] text-center text-[#aa0000] font-[new-tegomin-regular]">
          {seconds}
        </div>
      )}
      {renderStep()}
    </div>
  );
}
