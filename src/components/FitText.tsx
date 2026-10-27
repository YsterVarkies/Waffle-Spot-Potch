import { useRef, type ElementType, type ReactNode } from 'react';
import { useFitText } from '@/lib/hooks';

interface FitTextProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** cap on the computed size, in px */
  max?: number;
  'aria-hidden'?: boolean;
}

/** One line of display type fitted from margin to margin (the monument size). */
export function FitText({ as: Tag = 'span', children, className = '', max, ...rest }: FitTextProps) {
  const ref = useRef<HTMLElement>(null);
  useFitText(ref, [children], max);
  return (
    <Tag ref={ref} className={`monument fit-text ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
