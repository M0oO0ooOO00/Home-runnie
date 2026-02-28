import { toast as sonnerToast, ToasterProps } from 'sonner';
import { ReactNode } from 'react';

export enum ToastIconType {
  SUCCESS = 'success',
  INFO = 'info',
}

export enum ToastPosition {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  TOP_CENTER = 'top-center',
  BOTTOM_CENTER = 'bottom-center',
}

export const showToast = (
  message: string,
  type: ToastIconType = ToastIconType.INFO,
  position?: ToastPosition,
) => {
  const options = position ? { position: position as ToasterProps['position'] } : {};

  switch (type) {
    case ToastIconType.INFO:
      sonnerToast.info(message, options);
      break;
    case ToastIconType.SUCCESS:
    default:
      sonnerToast.success(message, options);
      break;
  }
};
