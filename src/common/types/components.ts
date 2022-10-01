import { JSXElementConstructor, ReactElement } from 'react';

/**
 * A functional component as an actual function, not an object.
 * React.FC has issues with type propagation.
 */
export type VNFC<P = any, T extends string | JSXElementConstructor<any>
= string | JSXElementConstructor<any>> = (props: P, context?: any) => ReactElement<P, T> | null;
