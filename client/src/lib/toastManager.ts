import { toast } from '@/hooks/use-toast';
import { TOAST_DURATION } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

// Tipos permitidos por el componente Toast (Shadcn)
type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  titleKey?: string;
  descriptionKey?: string;
}

export const useToastManager = () => {
  const { t } = useTranslation();

  const createToast = ({
    title,
    description,
    duration,
    titleKey,
    descriptionKey,
    variant,
  }: ToastOptions & { variant: ToastVariant }) => {
    return toast({
      title: titleKey ? t(titleKey) : title,
      description: descriptionKey ? t(descriptionKey) : description,
      variant,
      duration: duration ?? TOAST_DURATION.DEFAULT,
    });
  };

  const showSuccessToast = (opts: ToastOptions) =>
    createToast({ ...opts, variant: "success" });

  const showErrorToast = (opts: ToastOptions) =>
    createToast({ ...opts, variant: "destructive" });

  const showInfoToast = (opts: ToastOptions) =>
    createToast({ ...opts, variant: "info" });

  const showWarningToast = (opts: ToastOptions) =>
    createToast({ ...opts, variant: "warning" });

  const showCopySuccessToast = (itemName?: string) =>
    createToast({
      titleKey: "common.copied",
      description: itemName
        ? t("common.copiedItem", { item: itemName })
        : t("common.copiedGeneric"),
      variant: "success",
      duration: TOAST_DURATION.SHORT,
    });

  const showCopyErrorToast = () =>
    createToast({
      titleKey: "common.copyErrorTitle",
      descriptionKey: "common.copyErrorDesc",
      variant: "destructive",
    });

  const showConversionSuccessToast = () =>
    createToast({
      titleKey: "conversion.successTitle",
      descriptionKey: "conversion.successDesc",
      variant: "success",
    });

  const showConversionErrorToast = (message?: string) =>
    createToast({
      titleKey: "conversion.errorTitle",
      description: message,
      descriptionKey: message ? undefined : "conversion.errorDesc",
      variant: "destructive",
      duration: TOAST_DURATION.LONG,
    });

  const showSettingsSavedToast = () =>
    createToast({
      titleKey: "settings.savedTitle",
      descriptionKey: "settings.savedDesc",
      variant: "success",
      duration: TOAST_DURATION.SHORT,
    });

  const showDeleteSuccessToast = (itemName?: string) =>
    createToast({
      titleKey: "common.deletedTitle",
      description: itemName
        ? t("common.deletedItem", { item: itemName })
        : t("common.deleted"),
      variant: "success",
      duration: TOAST_DURATION.SHORT,
    });

  return {
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
};
