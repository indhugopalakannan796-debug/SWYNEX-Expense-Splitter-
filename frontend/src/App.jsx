
import React, { useEffect, useState } from 'react'

function App() {
  const [user, setUser] = useState(null)
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [expenses, setExpenses] = useState([])
  const [balances, setBalances] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [memberId, setMemberId] = useState('')
  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const api = async (url, options = {}) => {
    const response = await fetch(`https://swynex-backend-1vaq.onrender.com${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        typeof data.detail === 'string'
          ? data.detail
          : data.detail?.[0]?.msg || 'Something went wrong'
      )
    }

    return data
  }

  const loadGroups = async () => {
    try {
      const data = await api('/api/groups')
      setGroups(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadGroups()
  }, [])

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const data = await api('/api/users/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      setUser(data)
      setMessage(`Welcome ${data.name}! Registration successful.`)

      setFormData({
        name: '',
        email: '',
        password: ''
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createGroup = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('Please register first.')
      return
    }

    try {
      setError('')
      const data = await api('/api/groups', {
        method: 'POST',
        body: JSON.stringify({
          group_name: groupName,
          description: groupDescription,
          created_by: user.user_id
        })
      })

      setGroupName('')
      setGroupDescription('')
      setMessage('Group created successfully!')

      await loadGroups()
      await selectGroup(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const selectGroup = async (group) => {
    setSelectedGroup(group)
    setError('')

    try {
      const [memberData, expenseData, balanceData] = await Promise.all([
        api(`/api/groups/${group.group_id}/members`),
        api(`/api/groups/${group.group_id}/expenses`),
        api(`/api/groups/${group.group_id}/balances`)
      ])

      setMembers(memberData)
      setExpenses(expenseData)
      setBalances(balanceData)

      const currentMember = memberData.find(
        member => member.user_id === user?.user_id
      )

      setPaidBy(currentMember ? String(currentMember.user_id) : '')
    } catch (err) {
      setError(err.message)
    }
  }

  const addMember = async (e) => {
    e.preventDefault()

    try {
      await api(`/api/groups/${selectedGroup.group_id}/members`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: Number(memberId)
        })
      })

      setMemberId('')
      setMessage('Member added successfully!')
      await selectGroup(selectedGroup)
    } catch (err) {
      setError(err.message)
    }
  }

  const addExpense = async (e) => {
    e.preventDefault()

    try {
      if (members.length === 0) {
        throw new Error('Add group members before creating an expense.')
      }

      const amountInCents = Math.round(Number(expenseAmount) * 100)

      if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
        throw new Error('Enter a valid expense amount.')
      }

      const baseShare = Math.floor(amountInCents / members.length)
      const remainder = amountInCents % members.length

      const splits = {}

      members.forEach((member, index) => {
        const shareInCents = baseShare + (index < remainder ? 1 : 0)
        splits[member.user_id] = (shareInCents / 100).toFixed(2)
      })

      await api(`/api/groups/${selectedGroup.group_id}/expenses`, {
        method: 'POST',
        body: JSON.stringify({
          title: expenseTitle,
          amount: (amountInCents / 100).toFixed(2),
          paid_by: Number(paidBy),
          splits
        })
      })

      setExpenseTitle('')
      setExpenseAmount('')
      setMessage('Expense added and split successfully!')

      await selectGroup(selectedGroup)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <nav className="flex flex-wrap justify-between items-center gap-3 px-8 py-5 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-cyan-400">SWYNEX</h1>
        <span className="text-slate-400">Smart Expense Splitter</span>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-8">

        <h2 className="text-3xl font-bold mb-2">
          Welcome to SWYNEX
        </h2>

        <p className="text-slate-400 mb-8">
          Manage shared expenses intelligently with AI.
        </p>

        {message && (
          <p className="bg-green-900/30 text-green-400 p-3 rounded-lg mb-4">
            {message}
          </p>
        )}

        {error && (
          <p className="bg-red-900/30 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        {!user && (
          <div className="max-w-xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-800 mb-10">
            <h3 className="text-2xl font-bold text-cyan-400 mb-2">
              Create Your Account
            </h3>

            <p className="text-slate-400 mb-6">
              Register to get started with SWYNEX.
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                minLength="2"
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              />

              <input
                type="password"
                name="password"
                placeholder="Password (minimum 8 characters)"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
                minLength="8"
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold p-3 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        )}

        {user && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
            <h3 className="text-xl font-semibold text-cyan-400">
              Welcome, {user.name}!
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              User ID: {user.user_id} · {user.email}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-slate-400">Total Expenses</h3>
            <p className="text-3xl font-bold mt-3">
              ₹{expenses.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-slate-400">You Owe</h3>
            <p className="text-3xl font-bold mt-3 text-red-400">
              ₹{Math.abs(balances.find(b => b.user_id === user?.user_id)?.balance < 0
                ? balances.find(b => b.user_id === user?.user_id).balance
                : 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-slate-400">You Get Back</h3>
            <p className="text-3xl font-bold mt-3 text-green-400">
              ₹{Math.max(0, Number(
                balances.find(b => b.user_id === user?.user_id)?.balance || 0
              )).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Create a Group</h3>

            <form onSubmit={createGroup} className="space-y-3">
              <input
                placeholder="Group Name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                required
                minLength="2"
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              />

              <input
                placeholder="Description"
                value={groupDescription}
                onChange={e => setGroupDescription(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              />

              <button
                disabled={!user}
                className="w-full bg-cyan-500 text-slate-950 font-bold p-3 rounded-lg disabled:opacity-50"
              >
                Create Group
              </button>
            </form>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Your Groups</h3>

            {groups.length === 0 ? (
              <p className="text-slate-400">No groups created yet.</p>
            ) : (
              <div className="space-y-3">
                {groups.map(group => (
                  <button
                    key={group.group_id}
                    onClick={() => selectGroup(group)}
                    className={`w-full text-left p-4 rounded-lg border ${
                      selectedGroup?.group_id === group.group_id
                        ? 'border-cyan-400 bg-slate-800'
                        : 'border-slate-700 bg-slate-800/50'
                    }`}
                  >
                    <p className="font-semibold">{group.group_name}</p>
                    <p className="text-sm text-slate-400">
                      {group.description || 'No description'}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

        </div>

        {selectedGroup && (
          <div className="mt-8 space-y-6">

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                {selectedGroup.group_name}
              </h3>

              <h4 className="font-semibold mb-3">Group Members</h4>

              <div className="space-y-2 mb-5">
                {members.map(member => (
                  <div key={member.user_id} className="bg-slate-800 p-3 rounded-lg flex justify-between">
                    <span>{member.name}</span>
                    <span className="text-slate-400 text-sm">
                      ID: {member.user_id}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={addMember} className="flex flex-wrap gap-3">
                <input
                  type="number"
                  min="1"
                  placeholder="Enter user ID"
                  value={memberId}
                  onChange={e => setMemberId(e.target.value)}
                  required
                  className="flex-1 min-w-0 p-3 rounded-lg bg-slate-800 border border-slate-700"
                />

                <button className="bg-cyan-500 text-slate-950 font-bold px-5 py-3 rounded-lg">
                  Add Member
                </button>
              </form>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Add an Expense</h3>

              <form onSubmit={addExpense} className="space-y-3">
                <input
                  placeholder="Expense Title"
                  value={expenseTitle}
                  onChange={e => setExpenseTitle(e.target.value)}
                  required
                  minLength="2"
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
                />

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Amount (₹)"
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
                />

                <select
                  value={paidBy}
                  onChange={e => setPaidBy(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
                >
                  <option value="">Select who paid</option>
                  {members.map(member => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.name}
                    </option>
                  ))}
                </select>

                <p className="text-sm text-slate-400">
                  Expense will be split equally among all group members.
                </p>

                <button className="w-full bg-cyan-500 text-slate-950 font-bold p-3 rounded-lg">
                  Add Expense
                </button>
              </form>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Expense History</h3>

              {expenses.length === 0 ? (
                <p className="text-slate-400">No expenses yet.</p>
              ) : (
                expenses.map(expense => (
                  <div key={expense.expense_id} className="flex justify-between gap-3 border-b border-slate-800 py-3">
                    <div>
                      <p className="font-semibold">{expense.title}</p>
                      <p className="text-sm text-slate-400">
                        Paid by User ID: {expense.paid_by}
                      </p>
                    </div>
                    <p className="font-semibold text-cyan-400">
                      ₹{Number(expense.amount).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Group Balances</h3>

              {balances.map(balance => (
                <div key={balance.user_id} className="flex justify-between gap-3 border-b border-slate-800 py-3">
                  <span>{balance.name}</span>
                  <span className={balance.balance >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {balance.balance >= 0 ? '+' : '-'}₹{Math.abs(Number(balance.balance)).toFixed(2)}
                  </span>
                </div>
              ))}
            </section>

          </div>
        )}

      </main>
    </div>
  )
}

export default App
