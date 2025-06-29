import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import ListPeople from './pages/ListPeople'
import EditPeople from './pages/EditPeople'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/people" element={<ListPeople />} />
          <Route path="/people/add" element={<EditPeople />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 