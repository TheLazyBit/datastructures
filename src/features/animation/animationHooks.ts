import { useEffect, useState } from 'react';
import { PropUpdateRule } from './animationUpdateRules';

export function useLinearAnimation<T>(
  initial: T,
  updateRule: PropUpdateRule<T>,
) {
  const [state, setState] = useState(initial);
  useEffect(() => {
    let before: null | DOMHighResTimeStamp = null;
    let animationHandle: number;
    const animationStep = (now: DOMHighResTimeStamp) => {
      if (before === null) before = now;
      const delta = now - before;
      before = now;
      setState((prev) => updateRule(prev, delta));
      animationHandle = requestAnimationFrame(animationStep);
    };
    animationHandle = requestAnimationFrame(animationStep);
    return () => cancelAnimationFrame(animationHandle);
  }, []);
  return state;
}
