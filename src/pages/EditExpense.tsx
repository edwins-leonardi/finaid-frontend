import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  CurrencyDollarIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  TagIcon,
  UserIcon,
  BanknotesIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { apiService } from '../services/api'
import { 
  Expense, 
  ExpenseCategory, 
  ExpenseSubCategory, 
  CreateExpenseRequest 
} from '../types/expense'
import { Person } from '../types/person'
import { Account } from '../types/account'

interface FormData {
  amount: string
  category_id: string
  subcategory_id: string
  date: string
  payee_id: string
  account_id: string
  notes: string
}

interface FormErrors {
  amount?: string
  category_id?: string
  subcategory_id?: string
  date?: string
  payee_id?: string
  account_id?: string
  notes?: string
  general?: string
}

export default function EditExpense() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState<FormData>({
    amount: '',
    category_id: '',
    subcategory_id: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    payee_id: '',
    account_id: '',
    notes: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditMode)
  
  // Data for dropdowns
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [subCategories, setSubCategories] = useState<ExpenseSubCategory[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // Load dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true)
        const [categoriesData, subCategoriesData, peopleData, accountsData] = await Promise.all([
          apiService.listExpenseCategories(),
          apiService.listExpenseSubCategories(),
          apiService.listPersons({ limit: 1000 }),
          apiService.listAccounts({ limit: 1000 })
        ])
        
        setCategories(categoriesData)
        setSubCategories(subCategoriesData)
        setPeople(peopleData)
        setAccounts(accountsData)
      } catch (err) {
        console.error('Error fetching dropdown data:', err)
        setErrors({ general: 'Failed to load form data. Please refresh the page.' })
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [])

  // Load expense data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchExpense = async () => {
        try {
          setInitialLoading(true)
          const expense = await apiService.getExpenseById(parseInt(id))
          
          setFormData({
            amount: expense.amount.toString(),
            category_id: expense.category_id.toString(),
            subcategory_id: expense.subcategory_id?.toString() || '',
            date: expense.date.split('T')[0], // Extract date part from ISO string
            payee_id: expense.payee_id.toString(),
            account_id: expense.account_id.toString(),
            notes: expense.notes || ''
          })
        } catch (err) {
          console.error('Error fetching expense:', err)
          setErrors({ general: 'Failed to load expense data. Please try again.' })
        } finally {
          setInitialLoading(false)
        }
      }

      fetchExpense()
    }
  }, [isEditMode, id])

  // Filter subcategories based on selected category
  const filteredSubCategories = formData.category_id 
    ? subCategories.filter(sub => sub.expense_category_id === parseInt(formData.category_id))
    : []

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Amount validation
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required'
    } else {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number'
      }
    }

    // Category validation
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required'
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    // Payee validation
    if (!formData.payee_id) {
      newErrors.payee_id = 'Payee is required'
    }

    // Account validation
    if (!formData.account_id) {
      newErrors.account_id = 'Account is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Reset subcategory when category changes
      if (field === 'category_id') {
        newData.subcategory_id = ''
      }
      
      return newData
    })
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const expenseData: CreateExpenseRequest = {
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
        subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : undefined,
        date: formData.date,
        payee_id: parseInt(formData.payee_id),
        account_id: parseInt(formData.account_id),
        notes: formData.notes.trim() || undefined
      }

      if (isEditMode && id) {
        await apiService.updateExpense(parseInt(id), expenseData)
      } else {
        await apiService.createExpense(expenseData)
      }

      // Navigate back to expenses list
      navigate('/expenses')
    } catch (err: any) {
      console.error('Error saving expense:', err)
      setErrors({ 
        general: err.message || `Failed to ${isEditMode ? 'update' : 'create'} expense. Please try again.` 
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/expenses')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Expenses
        </button>
        
        <div className="flex items-center">
          <CurrencyDollarIcon className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Expense' : 'Add New Expense'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Update expense information' : 'Record a new expense'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Amount and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                Amount *
              </label>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Category and Subcategory Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                <TagIcon className="h-4 w-4 inline mr-1" />
                Category *
              </label>
              <select
                id="category_id"
                value={formData.category_id}
                onChange={(e) => handleInputChange('category_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.category_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
              )}
            </div>

            {/* Subcategory */}
            <div>
              <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700 mb-2">
                <TagIcon className="h-4 w-4 inline mr-1" />
                Subcategory (Optional)
              </label>
              <select
                id="subcategory_id"
                value={formData.subcategory_id}
                onChange={(e) => handleInputChange('subcategory_id', e.target.value)}
                disabled={!formData.category_id}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.subcategory_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">No subcategory</option>
                {filteredSubCategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id.toString()}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              {errors.subcategory_id && (
                <p className="mt-1 text-sm text-red-600">{errors.subcategory_id}</p>
              )}
            </div>
          </div>

          {/* Payee and Account Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payee */}
            <div>
              <label htmlFor="payee_id" className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="h-4 w-4 inline mr-1" />
                Payee *
              </label>
              <select
                id="payee_id"
                value={formData.payee_id}
                onChange={(e) => handleInputChange('payee_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.payee_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select payee</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id.toString()}>
                    {person.name} ({person.email})
                  </option>
                ))}
              </select>
              {errors.payee_id && (
                <p className="mt-1 text-sm text-red-600">{errors.payee_id}</p>
              )}
            </div>

            {/* Account */}
            <div>
              <label htmlFor="account_id" className="block text-sm font-medium text-gray-700 mb-2">
                <BanknotesIcon className="h-4 w-4 inline mr-1" />
                Account *
              </label>
              <select
                id="account_id"
                value={formData.account_id}
                onChange={(e) => handleInputChange('account_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.account_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id.toString()}>
                    {account.name} ({account.currency})
                  </option>
                ))}
              </select>
              {errors.account_id && (
                <p className="mt-1 text-sm text-red-600">{errors.account_id}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional notes about this expense..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/expenses')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              )}
              <span>
                {loading 
                  ? (isEditMode ? 'Updating...' : 'Creating...') 
                  : (isEditMode ? 'Update Expense' : 'Create Expense')
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 