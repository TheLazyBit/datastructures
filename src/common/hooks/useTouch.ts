import { useCallback, useState } from 'react';

export default function useTouch() {
  const [, touch] = useState(0);
  return useCallback(() => touch((x) => (x + 1) % 1_000_000), []);
}
