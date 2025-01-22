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

    const { data } = await axios.post("http://localhost:8282/api/query", {
      prompt: `
      You are a quiz assistant. Your task is to choose the correct answer to the following question.
      Select only one answer (A, B, C, or D) and respond with the corresponding letter—nothing else.

      Question: ${question} choose from one of the answers: ${JSON.stringify(answers)}

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

    console.log("AI Response to the question was: ", data);

    setAiThinking(false);
    setSelectedAnswer(data?.message?.content.slice(1));
  }

  function renderStep() {
    switch (step) {
      case 1: {
        return (
          <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">第一題</h1>
            <p className="text-lg text-gray-700 mb-6">{question}</p>

            <ul className="space-y-4">
              {answers.map((answer) => (
                <li
                  key={answer.id}
                  className="text-xl text-black"
                  onClick={() => setSelectedAnswer(answer.id)}
                >
                  <div className="flex gap-2">
                    <span className="font-medium">{answer.id})</span>{" "}
                    {answer.text}
                    {selectedAnswer === answer.id && (
                      <Image
                        width={24}
                        height={24}
                        src={"/image/ai.png"}
                        alt="AI IS HERE"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* AI Thinking Corner */}
            {aiThinking ? (
              <div className="flex gap-2 pt-2 w-100 text-center font-medium text-gray-500">
                <Image
                  width={24}
                  height={24}
                  src={"/image/ai.png"}
                  alt="AI IS HERE"
                />{" "}
                : 讓我思考試一下...
              </div>
            ) : (
              <div className="mt-4"></div>
            )}

            <button
              onClick={handleAIChooseAnswer}
              className="mt-6 w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              AI Answer
            </button>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </div>
        );
      }
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-4xl">問答</h2>
      {renderStep()}
    </div>
  );
}
