import { useAptabase } from '@aptabase/nextjs/client';
import { useState } from 'react';

export function Counter() {
  const { trackEvent } = useAptabase();
  const [count, setCount] = useState(0);

  function increment() {
    setCount((c) => c + 1);
    trackEvent('increment');
  }

  function decrement() {
    setCount((c) => c - 1);
    trackEvent('decrement');
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
