interface ChatCardProps {
  title: string;
  subtitle: string;
  description: string;
  graphic: React.ReactNode;
}

const ChatCard = ({ title, subtitle, description, graphic }: ChatCardProps) => {
  return (
    <div className="w-full h-[280px] bg-white rounded-[18px] px-[40px] py-[30px] flex justify-between items-center cursor-pointer">
      <div>
        <h1 className="text-[28px] font-bold leading-tight">
          {title}
          <br />
          {subtitle}
        </h1>
        <h3 className="text-[16px] text-gray-500 mt-[8px]">{description}</h3>
      </div>
      <div className="w-[120px] h-[120px] rounded-[12px] flex items-center justify-center">
        {graphic}
      </div>
    </div>
  );
};

export default ChatCard;
