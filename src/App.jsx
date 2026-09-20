import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import TestApi from './components/TestApi'
import Home from './Home'
import LoginPage from './Login'
import ItemPage from './Item'
import UsersPage from './Users'
import AuditLogPage from './AuditLog'
import { UserContext } from './context/UserContext'
import './App.css'

function Welcome() {
  return (
    <div className="page">
      <h1>Hello API Frontend</h1>
      <Link to="/test_api">Go to /test_api</Link>
    </div>
  )
}

// Non-admins are sent home; the backend enforces the same rule with a 403.
function AdminOnly({ children }) {
  const { isAdmin } = useContext(UserContext)
  return isAdmin ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />}>
          <Route index element={<Welcome />} />
          <Route path="test_api" element={<TestApi />} />
          <Route path="item" element={<ItemPage />} />
          <Route path="users" element={<AdminOnly><UsersPage /></AdminOnly>} />
          <Route path="audit" element={<AdminOnly><AuditLogPage /></AdminOnly>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
