import React from 'react';
import { AlertCircle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  variant?: 'error' | 'warning' | 'info';
  message?: string;
  icon?: React.ReactNode;
  className?: string;
  show?: boolean;
  onDismiss?: () => void;
  dismissible?: boolean;
  dismissLabel?: string;
}

const variantStyles = {
  error: {
    container: 'bg-red-50 border border-red-200 text-red-800',
    icon: 'text-red-600',
    defaultIcon: AlertCircle,
  },
  warning: {
    container: 'bg-amber-50 border border-amber-200 text-amber-800',
    icon: 'text-amber-600',
    defaultIcon: AlertCircle,
  },
  info: {
    container: 'bg-blue-50 border border-blue-200 text-blue-800',
    icon: 'text-blue-600',
    defaultIcon: Info,
  },
};

export const ErrorMessage = React.forwardRef<HTMLDivElement, ErrorMessageProps>(
  (
    {
      variant = 'error',
      message,
      icon,
      className,
      show = true,
      onDismiss,
      dismissible = false,
      dismissLabel = 'Dismiss message',
    },
    ref,
  ) => {
    const styles = variantStyles[variant];
    const DefaultIcon = styles.defaultIcon;

    if (!show || !message) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(
          'flex items-start gap-3 p-3 rounded-lg transition-all duration-200 animate-in fade-in slide-in-from-top-2',
          styles.container,
          className,
        )}
      >
        <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
          {icon || <DefaultIcon className="h-5 w-5" />}
        </div>

        <div className="flex-1 text-sm leading-relaxed">{message}</div>

        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 hover:opacity-70 transition-opacity p-1 rounded',
              styles.icon,
            )}
            aria-label={dismissLabel}
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  },
);

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;
