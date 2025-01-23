"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [aiThinking, setAiThinking] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  // const question = "What is the capital of France?";
  // const question = "What is the highest mountain peak in the solar system?";
  // const question =
  // "In the Netflix Korean drama Squid Game, what is the first game the contestants play?";
  const question =
    "任天堂(Nintendo)的耀西(Yoshi)在2019年後被官方證實是哪一種動物(animals)?";
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
    { id: "A", text: "蜥蜴(Lizard)" },
    { id: "B", text: "恐龍(Dinosaur)" },
    { id: "C", text: "小卷(Squid)" },
    { id: "D", text: "烏龜(Turtle)" },
  ];
  // const answers = [
  //   { id: "A", text: "北極熊(Polar bear)" },
  //   { id: "B", text: "哈姆太郎(Hamtaro)" },
  //   { id: "C", text: "飛鼠(Flying squirrel)" },
  //   { id: "D", text: "兔子(Rabbit)" },
  // ];

  // submit answer for the round
  const handleSubmit = () => {
    if (!selectedAnswer) {
      alert("pleaseeeeee select an answer before submitting.");
      return;
    }
    console.log("Selected Answer:", selectedAnswer);
  };

  // test AI choosing answer
  async function handleAIChooseAnswer() {
    setAiThinking(true);

    const { data } = await axios.post(
      "https://0a73-2401-e180-8830-da40-fcb6-268f-649b-186.ngrok-free.app/api/query",
      {
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
      Question: ${question}
      Options: ${answers.map(({ id, text }) => `${id}. ${text}`)}
      Tell me the correct option—respond with the shortest answer possible, nothing else.
    `,
      }
    );

    // const { data } = await axios.post(
    //   "http://localhost:8282/api/query-multi-choice",
    //   JSON.stringify({
    //     question,
    //     answers,
    //   }),
    // );

    console.log("AI Response to the question was: ", data);
    const match = data?.message?.content.match(/^[^.]+/); // 匹配.前的所有字符
    const result = match ? match[0] : null;
    setAiThinking(false);
    setSelectedAnswer(result);
  }

  function renderStep() {
    switch (step) {
      case 1: {
        return (
          <div className='max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg'>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>第一題</h1>
            <p className='text-lg text-gray-700 mb-6'>{question}</p>

            <ul className='space-y-4'>
              {answers.map((answer) => (
                <li
                  key={answer.id}
                  className='text-xl text-black'
                  onClick={() => setSelectedAnswer(answer.id)}
                >
                  <div className='flex gap-2'>
                    <span className='font-medium'>{answer.id}</span>{" "}
                    {answer.text}
                    {selectedAnswer === answer.id && (
                      <Image
                        width={24}
                        height={24}
                        src={"/image/ai.png"}
                        alt='AI IS HERE'
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* AI Thinking Corner */}
            {aiThinking ? (
              <div className='flex gap-2 pt-2 w-100 text-center font-medium text-gray-500'>
                <Image
                  width={24}
                  height={24}
                  src={"/image/ai.png"}
                  alt='AI IS HERE'
                />{" "}
                : 讓我思考試一下...
              </div>
            ) : (
              <div className='mt-4'></div>
            )}

            <button
              onClick={handleAIChooseAnswer}
              className='mt-6 w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition'
            >
              AI Answer
            </button>

            <button
              onClick={handleSubmit}
              className='mt-6 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition'
            >
              Submit
            </button>
          </div>
        );
      }
    }
  }

  return (
    <div className='p-8'>
      <h2 className='text-4xl'>問答</h2>
      {renderStep()}
    </div>
  );
}
