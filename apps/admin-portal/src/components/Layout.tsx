import { Link, useLocation } from 'react-router-dom'
import { Building2, Grid3X3, Utensils, Home } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Business Info', href: '/business', icon: Building2 },
    { name: 'Menu Categories', href: '/categories', icon: Grid3X3 },
    { name: 'Menu Items', href: '/items', icon: Utensils },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Online Ordering System
          </p>
        </div>
        
        <nav className="mt-6">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-700 bg-blue-50 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout