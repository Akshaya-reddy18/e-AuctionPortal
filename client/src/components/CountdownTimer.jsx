import { useEffect, useState } from 'react';

function getRemainingTime(targetTime) {
  const total = new Date(targetTime).getTime() - new Date().getTime();
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / 1000 / 60) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export default function CountdownTimer({ endTime, onEnd }) {
  const [timeLeft, setTimeLeft] = useState(getRemainingTime(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = getRemainingTime(endTime);
      setTimeLeft(updated);
      if (updated.total <= 0) {
        clearInterval(timer);
        if (onEnd) {
          onEnd();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onEnd]);

  if (timeLeft.total <= 0) {
    return <span className="timer ended">Auction Ended</span>;
  }

  return (
    <span className="timer">
      {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m{' '}
      {String(timeLeft.seconds).padStart(2, '0')}s left
    </span>
  );
}
