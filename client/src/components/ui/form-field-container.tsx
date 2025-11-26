import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface FormFieldContainerProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  validationState?: 'idle' | 'error' | 'success' | 'loading';
  children: React.ReactNode;
  className?: string;
  fieldId?: string;
}

export const FormFieldContainer = React.forwardRef<
  HTMLDivElement,
  FormFieldContainerProps
>(
  (
    {
      label,
      hint,
      error,
      required,
      validationState = 'idle',
      children,
      className,
      fieldId,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
      >
        {label && (
          <div className="flex items-center gap-1">
            <label
              htmlFor={fieldId}
              className={cn(
                'text-sm font-medium',
                validationState === 'error' && 'text-red-600',
                validationState === 'success' && 'text-green-600',
              )}
            >
              {label}
            </label>
            {required && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </div>
        )}

        <div className="relative">
          {children}
        </div>

        {/* Hint o Helper Text */}
        {hint && !error && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {hint}
          </p>
        )}

        {/* Error Message */}
        {error && validationState === 'error' && (
          <div className="flex items-start gap-2 text-sm text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-xs mt-0.5">•</span>
            <p>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {validationState === 'success' && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            {t('form.validation.valid')}
          </p>
        )}
      </div>
    );
  },
);

FormFieldContainer.displayName = 'FormFieldContainer';

export default FormFieldContainer;
