
import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-cyan-400">
          SWYNEX
        </h1>

        <span className="text-slate-400">
          Smart Expense Splitter
        </span>
      </nav>

      <main className="max-w-6xl mx-auto p-8">

        <h2 className="text-3xl font-bold mb-2">
          Welcome to SWYNEX
        </h2>

        <p className="text-slate-400 mb-8">
          Manage shared expenses intelligently with AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-slate-400">Total Expenses</h3>
            <p className="text-3xl font-bold mt-3">₹0.00</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-slate-400">You Owe</h3>
            <p className="text-3xl font-bold mt-3 text-red-400">₹0.00</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-slate-400">You Get Back</h3>
            <p className="text-3xl font-bold mt-3 text-green-400">₹0.00</p>
          </div>

        </div>

        <div className="mt-10 bg-slate-900 rounded-xl p-8 border border-slate-800">

          <h3 className="text-xl font-semibold mb-4">
            Get Started
          </h3>

          <p className="text-slate-400 mb-5">
            Create a group, upload a receipt, and split expenses easily.
          </p>

          <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg">
            Create Your First Group
          </button>

        </div>

      </main>
    </div>
  )
}

export default App
