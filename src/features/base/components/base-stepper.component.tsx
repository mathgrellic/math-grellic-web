import {
  Children,
  isValidElement,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import cx from 'classix';

import {
  stepperAnimationVariants,
  stepperAnimationTransition,
} from '#/utils/animation.util';
import { BaseDivider } from './base-divider.component';
import { BaseIcon } from './base-icon.component';
import { BaseStepperControls } from './base-stepper-controls.component';
import { BaseStepperStep } from './base-stepper-step.component';

import type { ComponentProps, ReactNode } from 'react';

type StepperControlsProps = ComponentProps<typeof BaseStepperControls>;

type Props = ComponentProps<'div'> & {
  disabled?: boolean;
  controlsRightContent?: ReactNode;
  onReset?: StepperControlsProps['onReset'];
  onPrev?: StepperControlsProps['onPrev'];
  onNext?: StepperControlsProps['onNext'];
};

export const BaseStepper = memo(function ({
  className,
  disabled,
  children,
  controlsRightContent,
  onReset,
  onPrev,
  onNext,
  ...moreProps
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(currentIndex);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = useMemo(
    () =>
      Children.map(children, (child) => {
        const isValid =
          isValidElement(child) &&
          (child as any).type.displayName === 'BaseStepperStep';

        return isValid ? child : null;
      })?.filter((child) => !!child),
    [children],
  );

  const isSingleStep = useMemo(() => steps?.length === 1, [steps]);

  const stepLabels = useMemo(() => {
    if (isSingleStep) {
      return [];
    }

    return (
      steps?.map(
        (c) => (c.props as ComponentProps<typeof BaseStepperStep>).label,
      ) || []
    );
  }, [isSingleStep, steps]);

  const isForward = useMemo(
    () => (prevIndex <= currentIndex ? 1 : 0),
    [prevIndex, currentIndex],
  );

  const handleNextStep = useCallback(() => {
    if (isAnimating || !steps || currentIndex >= steps.length - 1) {
      return;
    }

    !!onNext && onNext();
    setPrevIndex(currentIndex);
    setCurrentIndex(currentIndex + 1);
  }, [isAnimating, steps, currentIndex, onNext]);

  const handlePrevStep = useCallback(() => {
    if (isAnimating || currentIndex <= 0) {
      return;
    }

    !!onPrev && onPrev();
    setPrevIndex(currentIndex);
    setCurrentIndex(currentIndex - 1);
  }, [isAnimating, currentIndex, onPrev]);

  const handleReset = useCallback(() => {
    onReset && onReset();
    setCurrentIndex(0);
  }, [onReset]);

  const handleAnimation = useCallback(
    (isAnimating: boolean) => () => setIsAnimating(isAnimating),
    [],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <div className='flex w-full items-center justify-center'>
        <BaseDivider />
        <ol className='mx-4 my-2 flex h-5 items-center'>
          {stepLabels.map((label, index) => (
            <li
              key={index}
              className={cx(
                "flex items-center py-2 after:mx-2.5 after:h-1 after:w-11 after:border-b after:border-accent after:content-[''] last:after:content-none",
                index <= currentIndex && 'font-medium text-primary-focus',
                index < currentIndex && 'after:border-primary-focus',
              )}
            >
              <div className='mr-1 flex h-full w-5 items-center justify-center'>
                {index < currentIndex ? (
                  <BaseIcon name='check-circle' size={20} weight='fill' />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className='w-max'>{label}</span>
            </li>
          ))}
        </ol>
        <BaseDivider />
      </div>
      <BaseStepperControls
        onPrev={handlePrevStep}
        onNext={handleNextStep}
        onReset={handleReset}
        disabled={disabled}
        isSingleStep={isSingleStep}
      >
        {controlsRightContent}
      </BaseStepperControls>
      <div className='relative mx-auto min-h-[700px] w-full max-w-[600px] !overflow-hidden py-5'>
        {!!steps && (
          <motion.div
            key={currentIndex}
            className='h-full w-full'
            custom={isForward}
            variants={stepperAnimationVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={stepperAnimationTransition}
            onAnimationStart={handleAnimation(true)}
            onAnimationComplete={handleAnimation(false)}
          >
            {steps[currentIndex]}
          </motion.div>
        )}
      </div>
    </div>
  );
});
