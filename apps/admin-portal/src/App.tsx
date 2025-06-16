import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import BusinessInfo from './pages/BusinessInfo'
import MenuCategories from './pages/MenuCategories'
import MenuItems from './pages/MenuItems'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/business" element={<BusinessInfo />} />
            <Route path="/categories" element={<MenuCategories />} />
            <Route path="/items" element={<MenuItems />} />
          </Routes>
        </Layout>
        <Toaster />
      </div>
    </Router>
  )
}

export default App