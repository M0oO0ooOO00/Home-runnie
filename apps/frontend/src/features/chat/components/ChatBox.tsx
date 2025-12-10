import ChatInfo from "./ChatInfo";
import ChatInput from "./ChatInput";
import ChatReport from "./ChatReport";

const ChatBox = () => {
  // 임시 데이터
  const messages = [
    { id: 1, text: "저도 낄래요", sender: "other" },
    { id: 2, text: "안된다면?", sender: "me" },
    { id: 3, text: "쩔 수다", sender: "other" },
    { id: 4, text: "100만원 준비하면 껴줌", sender: "me" },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 p-6">
      <section className="flex flex-col h-full px-[120px] py-[24px]">
        <ChatReport />

        <ChatInfo
          title="Moo"
          participants="수비니, 수미니, 누누, 호호, 용용, 실버, 바보 07명"
          matchDate="2025/03/02"
          matchTeam="한화이글스 VS 기아 타이거즈"
        />

        <div className="flex-grow flex flex-col justify-end gap-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={[
                  "rounded-2xl px-4 py-2 max-w-xs lg:max-w-md",
                  msg.sender === "me"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-black rounded-bl-none",
                ].join(" ")}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <ChatInput />
      </section>
    </div>
  );
};

export default ChatBox;
