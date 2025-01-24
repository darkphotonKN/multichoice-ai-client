"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";

function Player() {
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(selectedAnswer: string) {
    let data: any;
    try {
      const response = await axios.post(
        "https://b99d-210-242-7-79.ngrok-free.app/api/game/submitAnswer",
        {
          answer: selectedAnswer,
        },
      );

      data = response.data;

      setSubmitted(true);
    } catch (err) {
      const error = err as AxiosError<any>;

      setError(error?.response?.data);
      alert(error?.response?.data);
    }
  }

  console.log(error);

  function handleContinue() {
    window.location.reload();
  }

  return (
    <div className="p-6 bg-gray-900 h-screen flex flex-col items-center justify-center text-white">
      {submitted && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
          <p className="text-2xl font-bold mb-6 text-center">請等待下一回合</p>
          <button
            onClick={handleContinue}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-4xl shadow-lg"
          >
            CONTINUE
          </button>
        </div>
      )}
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Welcome Player.</h1>
        <p className="text-lg mt-2">
          Choose your answer <span className="text-red"> wisely.</span>
        </p>
      </div>
      <div className="flex flex-col gap-6 mt-12 w-full max-w-md">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg text-4xl shadow-lg"
          onClick={() => handleSubmit("A")}
        >
          A
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-4xl shadow-lg"
          onClick={() => handleSubmit("B")}
        >
          B
        </button>
        <button
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 rounded-lg text-4xl shadow-lg"
          onClick={() => handleSubmit("C")}
        >
          C
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg text-4xl shadow-lg"
          onClick={() => handleSubmit("D")}
        >
          D
        </button>
      </div>
    </div>
  );
}

export default Player;
