import React, { useState } from "react";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

// import "../styles/globals.css";

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Presale Ended</div>;
  }

  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};

function Timer() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        // onClick={() => startPresale}
      >
        Start Presale
      </button>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={count}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[10, 6, 3, 0]}
          // onComplete={() => ({ shouldRepeat: true, delay: 1 })}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </div>
  );
}

export default Timer;
