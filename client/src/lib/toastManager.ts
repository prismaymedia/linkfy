import { toast } from '@/hooks/use-toast';
import { TOAST_DURATION } from '@/hooks/use-toast';

/**
 * Toast Manager - Utility functions for showing toast notifications
 * Provides consistent toast messages across the application
 */

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

/**
 * Show a success toast notification
 */
export const showSuccessToast = (options: ToastOptions) => {
  return toast({
    title: options.title,
    description: options.description,
    variant: 'success',
    duration: options.duration ?? TOAST_DURATION.DEFAULT,
  });
};

export const showErrorToast = (options: ToastOptions) => {
  return toast({
    title: options.title,
    description: options.description,
    variant: 'destructive',
    duration: options.duration ?? TOAST_DURATION.LONG,
  });
};


/**
 * Show an info toast notification
 */
export const showInfoToast = (options: ToastOptions) => {
  return toast({
    title: options.title || 'Info',
    description: options.description,
    variant: 'info',
    duration: options.duration ?? TOAST_DURATION.DEFAULT,
  });
};

/**
 * Show a warning toast notification
 */
export const showWarningToast = (options: ToastOptions) => {
  return toast({
    title: options.title || 'Warning',
    description: options.description,
    variant: 'warning',
    duration: options.duration ?? TOAST_DURATION.DEFAULT,
  });
};

/**
 * Show a toast notification for clipboard copy success
 */
export const showCopySuccessToast = (itemName?: string) => {
  return toast({
    title: 'Copied!',
    description: itemName
      ? `${itemName} copied to clipboard.`
      : 'Copied to clipboard.',
    variant: 'success',
    duration: TOAST_DURATION.SHORT,
  });
};

/**
 * Show a toast notification for clipboard copy failure
 */
export const showCopyErrorToast = () => {
  return toast({
    title: 'Failed to copy',
    description: 'Please try again or copy manually.',
    variant: 'destructive',
    duration: TOAST_DURATION.DEFAULT,
  });
};

/**
 * Show a toast notification for conversion success
 */
export const showConversionSuccessToast = () => {
  return toast({
    title: 'Conversion successful',
    description: 'Your track has been converted successfully.',
    variant: 'success',
    duration: TOAST_DURATION.DEFAULT,
  });
};

/**
 * Show a toast notification for conversion error
 */
export const showConversionErrorToast = (message?: string) => {
  return toast({
    title: 'Conversion failed',
    description: message || 'Unable to convert the track. Please try again.',
    variant: 'destructive',
    duration: TOAST_DURATION.LONG,
  });
};

/**
 * Show a toast notification for settings saved
 */
export const showSettingsSavedToast = () => {
  return toast({
    title: 'Settings saved',
    description: 'Your preferences have been updated.',
    variant: 'success',
    duration: TOAST_DURATION.SHORT,
  });
};

/**
 * Show a toast notification for item deleted
 */
export const showDeleteSuccessToast = (itemName?: string) => {
  return toast({
    title: 'Deleted',
    description: itemName
      ? `${itemName} has been removed.`
      : 'Item has been removed.',
    variant: 'success',
    duration: TOAST_DURATION.SHORT,
  });
};

export default {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  showCopySuccessToast,
  showCopyErrorToast,
  showConversionSuccessToast,
  showConversionErrorToast,
  showSettingsSavedToast,
  showDeleteSuccessToast,
};

