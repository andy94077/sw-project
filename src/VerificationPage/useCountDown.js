import { useState, useEffect } from "react";

export default () => {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow((prevNow) => {
        if (prevNow <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevNow - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [now]);

  return [now, setNow];
};
