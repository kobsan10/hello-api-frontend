import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import TestApi from './components/TestApi'
import Home from './Home'
import LoginPage from './Login'
import './App.css'

function Welcome() {
  return (
    <div className="page">
      <h1>Hello API Frontend</h1>
      <Link to="/test_api">Go to /test_api</Link>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />}>
          <Route index element={<Welcome />} />
          <Route path="test_api" element={<TestApi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
