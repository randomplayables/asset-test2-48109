import React, { useState } from 'react';
import './styles.css';
import RPLogo from '/src/assets/RPLogo2.png';

declare global {
  interface Window {
    sendDataToGameLab?: (data: any) => void;
  }
}

export default function App() {
  const [target, setTarget] = useState<number>(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('Guess a number between 1 and 100!');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleGuess = () => {
    const num = parseInt(guess, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      setMessage('Please enter a valid number between 1 and 100.');
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (num === target) {
      setMessage(`Correct! You found the number in ${newAttempts} attempts.`);
      setGameOver(true);
      if (typeof window.sendDataToGameLab === 'function') {
        window.sendDataToGameLab({
          event: 'gameEnd',
          targetNumber: target,
          attempts: newAttempts,
          timestamp: new Date().toISOString()
        });
      }
    } else if (num < target) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }
    setGuess('');
  };

  const handleReset = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setAttempts(0);
    setMessage('Guess a number between 1 and 100!');
    setGameOver(false);
  };

  return (
    <div className="App">
      <img src={RPLogo} alt="RP Logo" className="logo" />
      <h1>Number Guessing Game</h1>
      <p className="message">{message}</p>
      <div className="input-group">
        <input
          type="number"
          min="1"
          max="100"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={gameOver}
          placeholder="Enter your guess"
        />
        <button onClick={handleGuess} disabled={gameOver}>Guess</button>
      </div>
      {gameOver && (
        <button className="reset-button" onClick={handleReset}>
          Play Again
        </button>
      )}
      <p className="attempts">Attempts: {attempts}</p>
    </div>
  );
}