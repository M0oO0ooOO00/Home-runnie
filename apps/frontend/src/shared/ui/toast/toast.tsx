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

interface ToastProps {
  message: string;
  type?: ToastIconType;
  icon?: ReactNode;
}

// 일단 기본은 info
const DefaultIcon = () => <img src="/icons/info.svg" alt="info" width={26} height={26} />;

export const Toast = ({ message, type = ToastIconType.SUCCESS, icon }: ToastProps) => {
  const renderIcon = () => {
    if (icon) return icon;

    // 나중에 prop으로 전달해서 쓰기
    switch (type) {
      case ToastIconType.INFO:
        return <img src="/icons/info.svg" alt="info" width={26} height={26} />;
      case ToastIconType.SUCCESS:
      default:
        return <DefaultIcon />;
    }
  };

  return (
    <div className="px-7 py-4 bg-stone-950 rounded-[100px] inline-flex flex-col justify-start items-start gap-2.5 shadow-lg">
      <div className="inline-flex justify-start items-start gap-6">
        {/* Icon Area */}
        <div className="flex justify-center items-center">{renderIcon()}</div>

        {/* Message */}
        <div className="justify-start text-white text-base font-medium font-['Pretendard'] leading-6 whitespace-pre-wrap">
          {message}
        </div>
      </div>
    </div>
  );
};

export const showToast = (
  message: string,
  type: ToastIconType = ToastIconType.SUCCESS,
  position?: ToastPosition,
) => {
  sonnerToast.custom(() => <Toast message={message} type={type} />, {
    position: position as ToasterProps['position'],
  });
};
