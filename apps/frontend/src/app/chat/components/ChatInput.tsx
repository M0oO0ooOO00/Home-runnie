const ChatInput = () => {
  return (
    <div className="mt-6 flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
      <input
        type="text"
        placeholder="하고싶은 말을 적어보세요"
        className="flex-grow bg-transparent focus:outline-none px-2"
      />
      <button className="flex-shrink-0 bg-gray-200 text-gray-600 rounded-md px-6 py-2 text-b03-r hover:bg-gray-300">
        전송
      </button>
    </div>
  );
};

export default ChatInput;
