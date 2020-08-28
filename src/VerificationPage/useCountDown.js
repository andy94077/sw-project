import { useState, useEffect } from "react";

export default function useCountDown() {
  const [count, setCount] = useState();
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((preCount) => preCount - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [count]);
}
