
import React, { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : data.detail?.[0]?.msg || 'Registration failed'
        )
      }

      setSuccess(`Welcome ${data.name}! Registration successful.`)

      setFormData({
        name: '',
        email: '',
        password: ''
      })

    } catch (err) {
      setError(err.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-cyan-400">SWYNEX</h1>
        <span className="text-slate-400">Smart Expense Splitter</span>
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
          <h3 className="text-xl font-semibold mb-4">Get Started</h3>
          <p className="text-slate-400 mb-5">
            Create a group, upload a receipt, and split expenses easily.
          </p>

          <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg">
            Create Your First Group
          </button>
        </div>

        <div className="mt-10 max-w-xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-800">

          <h3 className="text-2xl font-bold text-cyan-400 mb-2">
            Create Your Account
          </h3>

          <p className="text-slate-400 mb-6">
            Register to get started with SWYNEX.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength="2"
              maxLength="100"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password (minimum 8 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              maxLength="100"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-400"
            />

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {success && (
              <p className="text-green-400 text-sm">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold p-3 rounded-lg"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

          </form>
        </div>

      </main>
    </div>
  )
}

export default App
