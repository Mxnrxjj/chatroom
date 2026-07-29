export default function HeroMockup() {
  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
          A
        </div>

        <div>
          <h3 className="font-semibold">Aman</h3>

          <p className="text-sm opacity-90">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-50 dark:bg-[#16232B] p-6 space-y-4">
        <div className="bg-white dark:bg-[#23333B] p-4 rounded-2xl w-fit shadow">
          Hey! 👋
        </div>

        <div className="bg-blue-600 text-white p-4 rounded-2xl ml-auto w-fit">
          Hi! How are you?
        </div>

        <div className="bg-white dark:bg-[#23333B] p-4 rounded-2xl w-fit">
          Want to meet at 6?
        </div>

        <div className="text-sm text-gray-500">Riya is typing...</div>
      </div>
    </div>
  );
}
