"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [aiThinking, setAiThinking] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const question = "What is the capital of France?";

  const answers = [
    { id: "A", text: "Berlin" },
    { id: "B", text: "Madrid" },
    { id: "C", text: "Paris" },
    { id: "D", text: "Rome" },
  ];

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

      [Example Questions]
      To ensure accuracy, here are sample questions and how you should respond:
      Question: "What is the capital of Taiwan?"
      Options:
      A. Taipei
      B. Beijing
      C. Seoul
      D. Tokyo
      Answer: A

      Question: "What is 5 + 5?"
      Options:
      A. 9
      B. 10
      C. 11
      D. 12
      Answer: B

      You are a quiz assistant. Your task is to choose the correct answer to the following question.
      Question: **${question}**  
      Options: **${answers.map((item) => `${item.id}.  ${item.text},`)} **
      Select only one answer follow in Options (A. B. C. or D.) and respond with the corresponding letter—nothing else.
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

    setAiThinking(false);
    setSelectedAnswer(data?.message?.content);
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
