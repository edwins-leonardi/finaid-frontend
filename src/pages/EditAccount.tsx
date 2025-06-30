import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  BanknotesIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { apiService } from '../services/api'
import { Account, CreateAccountRequest } from '../types/account'
import { Person } from '../types/person'

interface FormData {
  name: string
  currency: string
  account_type: string
  initial_balance: string
  primary_owner_id: string
  second_owner_id: string
}

interface FormErrors {
  name?: string
  currency?: string
  account_type?: string
  initial_balance?: string
  primary_owner_id?: string
  second_owner_id?: string
  general?: string
}

const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit', label: 'Credit' },
  { value: 'investment', label: 'Investment' },
  { value: 'loan', label: 'Loan' },
  { value: 'other', label: 'Other' }
]

const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' }
]

export default function EditAccount() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    currency: 'USD',
    account_type: 'checking',
    initial_balance: '0.00',
    primary_owner_id: '',
    second_owner_id: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditMode)
  const [people, setPeople] = useState<Person[]>([])
  const [peopleLoading, setPeopleLoading] = useState(true)

  // Load people for owner selection
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setPeopleLoading(true)
        const peopleData = await apiService.listPersons({ limit: 1000 }) // Get all people
        setPeople(peopleData)
      } catch (err) {
        console.error('Error fetching people:', err)
      } finally {
        setPeopleLoading(false)
      }
    }

    fetchPeople()
  }, [])

  // Load account data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchAccount = async () => {
        try {
          setInitialLoading(true)
          const account = await apiService.getAccountById(parseInt(id))
          
          setFormData({
            name: account.name,
            currency: account.currency,
            account_type: account.account_type,
            initial_balance: account.initial_balance.toString(),
            primary_owner_id: account.primary_owner_id.toString(),
            second_owner_id: account.second_owner_id?.toString() || ''
          })
        } catch (err) {
          console.error('Error fetching account:', err)
          setErrors({ general: 'Failed to load account data. Please try again.' })
        } finally {
          setInitialLoading(false)
        }
      }

      fetchAccount()
    }
  }, [isEditMode, id])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Account name must be at least 2 characters long'
    }

    // Currency validation
    if (!formData.currency) {
      newErrors.currency = 'Currency is required'
    }

    // Account type validation
    if (!formData.account_type) {
      newErrors.account_type = 'Account type is required'
    }

    // Initial balance validation
    if (!formData.initial_balance.trim()) {
      newErrors.initial_balance = 'Initial balance is required'
    } else {
      const balance = parseFloat(formData.initial_balance)
      if (isNaN(balance)) {
        newErrors.initial_balance = 'Initial balance must be a valid number'
      }
    }

    // Primary owner validation
    if (!formData.primary_owner_id) {
      newErrors.primary_owner_id = 'Primary owner is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
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
      const accountData: CreateAccountRequest = {
        name: formData.name.trim(),
        currency: formData.currency,
        account_type: formData.account_type,
        initial_balance: parseFloat(formData.initial_balance),
        primary_owner_id: parseInt(formData.primary_owner_id),
        second_owner_id: formData.second_owner_id ? parseInt(formData.second_owner_id) : null
      }

      if (isEditMode && id) {
        await apiService.updateAccount(parseInt(id), accountData)
      } else {
        await apiService.createAccount(accountData)
      }

      // Navigate back to accounts list
      navigate('/accounts')
    } catch (err: any) {
      console.error('Error saving account:', err)
      setErrors({ 
        general: err.message || `Failed to ${isEditMode ? 'update' : 'create'} account. Please try again.` 
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading || peopleLoading) {
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
          onClick={() => navigate('/accounts')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Accounts
        </button>
        
        <div className="flex items-center">
          <BanknotesIcon className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Account' : 'Add New Account'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Update account information' : 'Create a new financial account'}
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

          {/* Account Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Account Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Main Checking Account"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Account Type and Currency Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Type */}
            <div>
              <label htmlFor="account_type" className="block text-sm font-medium text-gray-700 mb-2">
                Account Type *
              </label>
              <select
                id="account_type"
                value={formData.account_type}
                onChange={(e) => handleInputChange('account_type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.account_type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {ACCOUNT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.account_type && (
                <p className="mt-1 text-sm text-red-600">{errors.account_type}</p>
              )}
            </div>

            {/* Currency */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                Currency *
              </label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.currency ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
              {errors.currency && (
                <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
              )}
            </div>
          </div>

          {/* Initial Balance */}
          <div>
            <label htmlFor="initial_balance" className="block text-sm font-medium text-gray-700 mb-2">
              Initial Balance *
            </label>
            <input
              type="number"
              id="initial_balance"
              step="0.01"
              value={formData.initial_balance}
              onChange={(e) => handleInputChange('initial_balance', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.initial_balance ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.initial_balance && (
              <p className="mt-1 text-sm text-red-600">{errors.initial_balance}</p>
            )}
          </div>

          {/* Owner Selection Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Owner */}
            <div>
              <label htmlFor="primary_owner_id" className="block text-sm font-medium text-gray-700 mb-2">
                Primary Owner *
              </label>
              <select
                id="primary_owner_id"
                value={formData.primary_owner_id}
                onChange={(e) => handleInputChange('primary_owner_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.primary_owner_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select primary owner</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id.toString()}>
                    {person.name} ({person.email})
                  </option>
                ))}
              </select>
              {errors.primary_owner_id && (
                <p className="mt-1 text-sm text-red-600">{errors.primary_owner_id}</p>
              )}
            </div>

            {/* Second Owner */}
            <div>
              <label htmlFor="second_owner_id" className="block text-sm font-medium text-gray-700 mb-2">
                Second Owner (Optional)
              </label>
              <select
                id="second_owner_id"
                value={formData.second_owner_id}
                onChange={(e) => handleInputChange('second_owner_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No second owner</option>
                {people
                  .filter(person => person.id.toString() !== formData.primary_owner_id)
                  .map((person) => (
                    <option key={person.id} value={person.id.toString()}>
                      {person.name} ({person.email})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/accounts')}
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
                  : (isEditMode ? 'Update Account' : 'Create Account')
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 