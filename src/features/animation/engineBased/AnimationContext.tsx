import React, {
  createContext, PropsWithChildren, useContext, useEffect, useState
} from 'react';
import { AnimationEngine, createBrowserEngine } from '../../generalAnimation/animationEngine';

const AnimationContext = createContext<{ engine: AnimationEngine } | null>(null);

export function AnimationWrapper({ children }: PropsWithChildren) {
  // do touches on "next frame" in engine?
  // or should animation consumers touch themselves?
  // for now, it will be up to the consumers
  const [context] = useState({ engine: createBrowserEngine() });
  // just destroy the engine on unmount
  useEffect(() => () => context.engine.destroy(), []);
  return (
    <AnimationContext.Provider value={context}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimationEngine() {
  const context = useContext(AnimationContext);
  // decided to use the .name instead of hard coding
  // plays nicer with refactors and auto renaming
  // the compiler will freak out if the names diverge
  if (context === null) throw new Error(`${useAnimationEngine.name} can only be used within a ${AnimationWrapper.name}!`);
  return context.engine;
}
