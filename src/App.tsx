import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to FinAid Frontend
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            React 18 + TypeScript + Vite + Tailwind
          </h2>
          <p className="text-gray-600 mb-6">
            Your new project is ready! Start building your financial aid application.
          </p>
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Count is {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App 