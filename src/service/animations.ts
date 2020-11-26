import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

/** Time and timing curve for animations. */
export const ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';
export const ANIMATION_TIMING_DELAY = '225ms 225ms cubic-bezier(0.4,0.0,0.2,1)';
export const ANIMATION_TIMING_LONG_OUT = '425ms ease-out';
export const ANIMATION_TIMING_OUT = '225ms ease-out';

export const ssAnimations: {
  readonly rotateSlideInOut: AnimationTriggerMetadata;
  readonly taskIn: AnimationTriggerMetadata;
  readonly taskOut: AnimationTriggerMetadata;
  readonly fadeInOut: AnimationTriggerMetadata;
} = {

  /** Animation that rotates and slides in from the right */
  rotateSlideInOut: trigger('rotateSlideInOut', [
    state('out, void', style({
      transform: 'translateX(60px) rotate(180deg)'
    })),
    state('in', style({
      transform: 'translateX(0px) rotate(0deg)'
    })),
    transition('in <=> out, void <=> in',
      animate(ANIMATION_TIMING))
  ]),

  /** Animation that simply fades, scales, and moves up slightly */
  taskIn: trigger('taskIn', [
    state('out, void', style({
      transform: 'translateY(100px) scale(.7)',
      opacity: '0'
    })),
    state('in', style({
      transform: 'translateY(0px) scale(1)',
      opacity: '1'
    })),
    transition('out => in, void => in',
      animate(ANIMATION_TIMING))
  ]),

  /** Animation that simply fades, rotates, and moves down slightly */
  taskOut: trigger('taskOut', [
    state('out, void', style({
      transform: 'rotate(-10deg) translateY(100px)',
      opacity: '0'
    })),
    state('in', style({
      transform: 'translateY(0px) scale(1)',
      opacity: '1'
    })),
    transition('in => out, in => void',
      animate(ANIMATION_TIMING_LONG_OUT))
  ]),

  /** Animation that fades content in and out. */
  fadeInOut: trigger('fadeInOut', [
    state('out, void', style({ opacity: '0' })),
    state('in', style({ opacity: '1' })),
    transition('in <=> out, void <=> in',
      animate(ANIMATION_TIMING_OUT))
  ]),

};
