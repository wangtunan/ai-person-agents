export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl rounded-xl border bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">AI Agent Demo</h1>

        <div className="mb-4 h-64 overflow-y-auto rounded border p-3 text-sm text-gray-600">
          <p>👋 Welcome! Start chatting...</p>
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>
    </main>
  )
}