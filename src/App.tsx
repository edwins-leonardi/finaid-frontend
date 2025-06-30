import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import ListPeople from './pages/ListPeople'
import EditPeople from './pages/EditPeople'
import ListAccounts from './pages/ListAccounts'
import EditAccount from './pages/EditAccount'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/people" element={<ListPeople />} />
          <Route path="/people/add" element={<EditPeople />} />
          <Route path="/people/edit/:id" element={<EditPeople />} />
          <Route path="/accounts" element={<ListAccounts />} />
          <Route path="/accounts/new" element={<EditAccount />} />
          <Route path="/accounts/:id/edit" element={<EditAccount />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 