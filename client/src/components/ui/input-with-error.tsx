import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean;
  success?: boolean;
  inputSize?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-8 px-2 py-1 text-xs',
  md: 'h-10 px-3 py-2 text-base',
  lg: 'h-12 px-4 py-3 text-base',
};

const InputWithErrorState = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, inputSize = 'md', disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full rounded-md border bg-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          sizeStyles[inputSize],
          error
            ? 'border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-50 bg-red-50'
            : success
              ? 'border-green-500 focus-visible:ring-green-500 focus-visible:ring-offset-green-50 bg-green-50'
              : 'border-input ring-offset-background focus-visible:ring-ring',
          className,
        )}
        aria-invalid={error ? true : false}
        {...props}
      />
    );
  },
);

InputWithErrorState.displayName = 'InputWithErrorState';

export { InputWithErrorState };
