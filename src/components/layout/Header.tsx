import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  BanknotesIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const desktopProfileRef = useRef<HTMLDivElement>(null)
  const mobileProfileRef = useRef<HTMLDivElement>(null)
  
  // Mock user data - in real app this would come from auth context
  const user = {
    name: "John Doe",
    email: "john.doe@university.edu",
    avatar: null // Set to null to show generic icon, or provide image URL
  }

  // Close profile modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (desktopProfileRef.current && !desktopProfileRef.current.contains(event.target as Node)) &&
        (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target as Node))
      ) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isProfileOpen])

  return (
    <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <BanknotesIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FinAid Budget
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
            <Link to="/people" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">People</Link>
            <Link to="/accounts" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Accounts</Link>
            <Link to="/expenses" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Expenses</Link>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Incomes</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Transfers</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Reports</a>
          </nav>

          {/* User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={desktopProfileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-white" />
                  )}
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </button>

              {/* Profile Dropdown Modal */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                      <span>Profile Settings</span>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button and profile */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile User Profile */}
            <div className="relative" ref={mobileProfileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-white" />
                  )}
                </div>
              </button>

              {/* Mobile Profile Dropdown Modal */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                      <span>Profile Settings</span>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium py-2">Home</Link>
              <Link to="/people" className="text-gray-700 hover:text-blue-600 font-medium py-2">People</Link>
              <Link to="/accounts" className="text-gray-700 hover:text-blue-600 font-medium py-2">Accounts</Link>
              <Link to="/expenses" className="text-gray-700 hover:text-blue-600 font-medium py-2">Expenses</Link>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Incomes</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Transfers</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Reports</a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 