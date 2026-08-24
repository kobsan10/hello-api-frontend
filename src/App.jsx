import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import TestApi from './components/TestApi'
import './App.css'

function Home() {
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
        <Route path="/" element={<Home />} />
        <Route path="/test_api" element={<TestApi />} />
      </Routes>
    </BrowserRouter>
  )
}
