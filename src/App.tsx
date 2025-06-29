import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import ListPeople from './pages/ListPeople'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/people" element={<ListPeople />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 