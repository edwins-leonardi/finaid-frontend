import { useState, useEffect, useRef } from 'react'
import { 
  BanknotesIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

function App() {
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

  const features = [
    {
      icon: CurrencyDollarIcon,
      title: "Budget Tracking",
      description: "Monitor your financial aid budget and expenses in real-time"
    },
    {
      icon: AcademicCapIcon,
      title: "Student Aid Management",
      description: "Manage scholarships, grants, and student loan applications"
    },
    {
      icon: ChartBarIcon,
      title: "Financial Analytics",
      description: "Get insights into spending patterns and budget optimization"
    },
    {
      icon: DocumentTextIcon,
      title: "Document Management",
      description: "Store and organize all your financial aid documents securely"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-green-500"></div>
        <div className="absolute top-32 right-20 w-24 h-24 rounded-full bg-blue-500"></div>
        <div className="absolute bottom-20 left-32 w-40 h-40 rounded-full bg-purple-500"></div>
        <div className="absolute bottom-32 right-10 w-28 h-28 rounded-full bg-indigo-500"></div>
        
        {/* Dollar signs pattern */}
        <div className="absolute top-1/4 left-1/4 text-6xl text-green-500 opacity-10">$</div>
        <div className="absolute top-1/3 right-1/3 text-4xl text-blue-500 opacity-10">$</div>
        <div className="absolute bottom-1/3 left-1/2 text-5xl text-purple-500 opacity-10">$</div>
        <div className="absolute bottom-1/4 right-1/4 text-3xl text-indigo-500 opacity-10">$</div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <BanknotesIcon className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FinAid Budget
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">People</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Accounts</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Expenses</a>
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
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Home</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">People</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Accounts</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Expenses</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Incomes</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Transfers</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Reports</a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Financial Aid
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Budget Management
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take control of your educational finances with our comprehensive budget tracking, 
              aid management, and financial planning tools designed specifically for students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Start Managing Your Budget
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200">
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Financial Aid
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to help you track, manage, and optimize your educational funding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white/50 backdrop-blur-sm border-y border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  $2.5M+
                </div>
                <p className="text-gray-600 font-medium">Financial Aid Managed</p>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <p className="text-gray-600 font-medium">Students Helped</p>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  95%
                </div>
                <p className="text-gray-600 font-medium">Success Rate</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App 