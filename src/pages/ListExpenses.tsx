import { useState, useEffect } from 'react'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { apiService } from '../services/api'
import { 
  Expense, 
  ExpenseCategory, 
  ExpenseSubCategory, 
  ListExpensesParams 
} from '../types/expense'
import { Person } from '../types/person'
import ConfirmModal from '../components/ConfirmModal'

export default function ListExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [subCategories, setSubCategories] = useState<ExpenseSubCategory[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Current month state
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null)
  const [selectedPayeeId, setSelectedPayeeId] = useState<number | null>(null)
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Get month boundaries
  const getMonthBoundaries = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0) // Last day of current month
    
    return {
      start: startDate.toISOString().split('T')[0], // YYYY-MM-DD
      end: endDate.toISOString().split('T')[0]
    }
  }

  // Format month display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesData, peopleData] = await Promise.all([
          apiService.listExpenseCategories(),
          apiService.listPersons({ limit: 1000 }) // Get all people for filter
        ])
        
        setCategories(categoriesData)
        setPeople(peopleData)
        
        // Load all subcategories
        const subCategoriesData = await apiService.listExpenseSubCategories()
        setSubCategories(subCategoriesData)
      } catch (err) {
        console.error('Failed to load initial data:', err)
        setError('Failed to load categories and people')
      }
    }

    loadInitialData()
  }, [])

  // Load expenses when month or filters change
  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const { start, end } = getMonthBoundaries(currentDate)
        
        const params: ListExpensesParams = {
          start_date: start,
          end_date: end,
          limit: 1000 // Get all expenses for the month
        }
        
        // Apply filters
        if (selectedCategoryId) {
          params.category_id = selectedCategoryId
        }
        if (selectedSubCategoryId) {
          params.subcategory_id = selectedSubCategoryId
        }
        if (selectedPayeeId) {
          params.payee_id = selectedPayeeId
        }
        
        const expensesData = await apiService.listExpenses(params)
        setExpenses(expensesData)
      } catch (err) {
        console.error('Failed to load expenses:', err)
        setError('Failed to load expenses')
      } finally {
        setLoading(false)
      }
    }

    loadExpenses()
  }, [currentDate, selectedCategoryId, selectedSubCategoryId, selectedPayeeId])

  // Clear filters
  const clearFilters = () => {
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
    setSelectedPayeeId(null)
  }

  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    return categories?.find(cat => cat.id === categoryId)?.name || 'Unknown'
  }

  // Get subcategory name by ID
  const getSubCategoryName = (subCategoryId: number) => {
    return subCategories?.find(sub => sub.id === subCategoryId)?.name || 'Unknown'
  }

  // Get person name by ID
  const getPersonName = (personId: number) => {
    return people?.find(person => person.id === personId)?.name || 'Unknown'
  }

  // Handle delete expense
  const handleDeleteClick = (expense: Expense) => {
    setExpenseToDelete(expense)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return
    
    setDeleteLoading(true)
    try {
      await apiService.deleteExpense(expenseToDelete.id)
      setExpenses(prev => prev.filter(exp => exp.id !== expenseToDelete.id))
      setDeleteModalOpen(false)
      setExpenseToDelete(null)
    } catch (err) {
      console.error('Failed to delete expense:', err)
      setError('Failed to delete expense')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Calculate total amount
  const totalAmount = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0

  // Filter subcategories based on selected category
  const filteredSubCategories = selectedCategoryId 
    ? subCategories?.filter(sub => sub.expense_category_id === selectedCategoryId) || []
    : subCategories || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h1>
        <p className="text-gray-600">Track and manage your monthly expenses</p>
      </div>

      {/* Month Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {formatMonthYear(currentDate)}
            </h2>
          </div>
          
          <button
            onClick={goToNextMonth}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span>Next</span>
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters and Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
            
            {(selectedCategoryId || selectedSubCategoryId || selectedPayeeId) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-lg font-semibold">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            <span className="text-gray-900">
              Total: {new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
              }).format(totalAmount)}
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategoryId || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null
                  setSelectedCategoryId(value)
                  setSelectedSubCategoryId(null) // Reset subcategory when category changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                )) || []}
              </select>
            </div>

            {/* Subcategory Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                value={selectedSubCategoryId || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null
                  setSelectedSubCategoryId(value)
                }}
                disabled={!selectedCategoryId}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">All Subcategories</option>
                {filteredSubCategories?.map(subCategory => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                )) || []}
              </select>
            </div>

            {/* Payee Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payee
              </label>
              <select
                value={selectedPayeeId || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null
                  setSelectedPayeeId(value)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Payees</option>
                {people?.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                )) || []}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-600 text-sm">{error}</div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading expenses...</span>
          </div>
        ) : !expenses || expenses.length === 0 ? (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
            <p className="text-gray-600">
              {(selectedCategoryId || selectedSubCategoryId || selectedPayeeId) 
                ? 'No expenses match your current filters.' 
                : `No expenses recorded for ${formatMonthYear(currentDate)}.`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subcategory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses?.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-gray-900">
                        {new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: 'USD' 
                        }).format(expense.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TagIcon className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm text-gray-900">
                          {getCategoryName(expense.category_id)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {expense.subcategory_id ? getSubCategoryName(expense.subcategory_id) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {getPersonName(expense.payee_id)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="max-w-xs truncate" title={expense.notes || ''}>
                        {expense.notes || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteClick(expense)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )) || []}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense"
        message={`Are you sure you want to delete this expense of ${expenseToDelete ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expenseToDelete.amount) : ''}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={deleteLoading}
      />
    </div>
  )
} 