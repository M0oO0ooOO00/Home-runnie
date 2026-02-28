'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'px-7 py-4 bg-stone-950 rounded-[100px] flex flex-row items-center gap-6 shadow-lg w-max group-[[data-x-position=center]]:left-0 group-[[data-x-position=center]]:right-0 group-[[data-x-position=center]]:mx-auto',
          icon: 'flex justify-center items-center w-6 h-6',
          title: "text-white text-base font-medium font-['Pretendard'] leading-6 whitespace-nowrap",
          description: 'text-neutral-400 text-sm',
          content: 'flex-1 justify-start',
        },
      }}
      icons={{
        info: <img src="/icons/info.svg" alt="info" width={26} height={26} />,
        // success: (
        //   <div className="w-6 h-6 px-3 py-2 rounded-xl outline outline-[1.40px] outline-offset-[-1.40px] outline-neutral-50 flex justify-start items-center gap-2.5">
        //     <div className="w-0.5 inline-flex flex-col justify-start items-start gap-px">
        //       <div className="self-stretch h-0.5 bg-white rounded-full"></div>
        //       <div className="self-stretch h-1.5 bg-white rounded-[1px]"></div>
        //     </div>
        //   </div>
        // ),
      }}
      {...props}
    />
  );
};

export { Toaster };
