import React, { ComponentType } from 'react';
import { PropUpdateRule } from './animationUpdateRules';
import { IgnoreUndefined, RestrictProperties } from '../../common/types/utility';
import { VNFC } from '../../common/types/components';
import { useLinearAnimation } from './animationHooks';

export type AnimatedProps<T> = {
  [Prop in keyof T]?: {
    type: 'linear',
    initial: T[Prop],
    updateRule: PropUpdateRule<T[Prop]>,
  }
};

/**
 * @param animated Props to animate, will be excluded from the returned components props
 * @param Comp Component to animate
 */
export default function withAnimatedProps<
  Props,
  Animated extends AnimatedProps<Props>,
  NewProps extends Omit<Props, keyof IgnoreUndefined<Animated>>,
>(
  animated: RestrictProperties<Animated, keyof Props>,
  Comp: VNFC<Props>,
): VNFC<NewProps> {
  type AnimatedPropsDefinition = [
    keyof Animated & string,
    Exclude<Animated[keyof Animated & string], undefined>,
  ];
  const animatedPropDefinitions = Object
    .entries(animated)
    .filter(([,v]) => v !== undefined) as AnimatedPropsDefinition[];

  const name = (Comp as ComponentType<Props>).displayName ?? Comp.name ?? 'Anonymous';

  function Wrapped(props: NewProps) {
    const animatedProps = Object.fromEntries(
      animatedPropDefinitions.map(([prop, spec]) => {
        if (spec.type === 'linear') {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          return [prop, useLinearAnimation(spec.initial, spec.updateRule)];
        }
        throw new Error(`'${spec.type}' is not a recognized animation type!`);
      }),
    );
    return <Comp {...animatedProps as Props} {...props} />;
  }

  (Wrapped as ComponentType).displayName = `withAnimatedProps(${name})`;
  return Wrapped;
}
