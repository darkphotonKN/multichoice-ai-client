"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";

function Player() {
  const [error, setError] = useState("");

  async function handleSubmit(selectedAnswer: string) {
    const answer = JSON.stringify({
      answer: selectedAnswer,
    });

    let data;
    try {
      const response = await axios.post(
        "https://0a73-2401-e180-8830-da40-fcb6-268f-649b-186.ngrok-free.app/api/game/submitAnswer",
        answer,
      );

      data = response.data;
    } catch (err) {
      const error = err as AxiosError<any>;

      setError(error?.response?.data);
      alert(error?.response?.data);
    }
  }

  console.log(error);

  return (
    <div className="p-3">
      <div>Welcome Player.</div>
      <div>Choose your answer wisely.</div>
      <div className="flex flex-col gap-4 h-full mt-9">
        <button className="text-5xl" onClick={() => handleSubmit("A")}>
          A
        </button>
        <button className="text-5xl" onClick={() => handleSubmit("B")}>
          B
        </button>
        <button className="text-5xl" onClick={() => handleSubmit("C")}>
          C
        </button>
        <button className="text-5xl" onClick={() => handleSubmit("D")}>
          D
        </button>
      </div>
    </div>
  );
}

export default Player;
