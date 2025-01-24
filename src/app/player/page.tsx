'use client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';

function Player() {
  const [error, setError] = useState('');

  async function handleSubmit(selectedAnswer: string) {
    const answer = JSON.stringify({
      answer: selectedAnswer,
    });
<<<<<<< HEAD

    let data: any;

=======
    console.log('answer', answer);
    let data;
>>>>>>> 0c66526f1ad4602ea0a954290fd300c7c20b951c
    try {
      const response = await axios.post(
        'https://bd35-210-242-7-79.ngrok-free.app/api/game/submitAnswer',
        {
          answer: selectedAnswer,
        }
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
        <button className="text-5xl" onClick={() => handleSubmit('A')}>
          A
        </button>
        <button className="text-5xl" onClick={() => handleSubmit('B')}>
          B
        </button>
        <button className="text-5xl" onClick={() => handleSubmit('C')}>
          C
        </button>
        <button className="text-5xl" onClick={() => handleSubmit('D')}>
          D
        </button>
      </div>
    </div>
  );
}

export default Player;
