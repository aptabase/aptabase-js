import { trackEvent } from '@aptabase/browser';
import { useState } from 'react';

function IndexPopup() {
  const [count, setCount] = useState(0);

  function increment() {
    trackEvent('increment', { count: count + 1 });
    setCount((c) => c + 1);
  }

  function decrement() {
    trackEvent('decrement', { count: count - 1 });
    setCount((c) => c - 1);
  }

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>decrement</button>
    </div>
  );
}

export default IndexPopup;
