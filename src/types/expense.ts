export interface Expense {
  id: number;
  amount: number;
  category_id: number;
  subcategory_id?: number;
  date: string; // ISO date string
  payee_id: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseSubCategory {
  id: number;
  name: string;
  expense_category_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseRequest {
  amount: number;
  category_id: number;
  subcategory_id?: number;
  date: string; // YYYY-MM-DD format
  payee_id: number;
  notes?: string;
}

export interface UpdateExpenseRequest {
  amount: number;
  category_id: number;
  subcategory_id?: number;
  date: string; // YYYY-MM-DD format
  payee_id: number;
  notes?: string;
}

export interface ListExpensesParams {
  skip?: number;
  limit?: number;
  category_id?: number;
  subcategory_id?: number;
  payee_id?: number;
  start_date?: string; // YYYY-MM-DD format
  end_date?: string; // YYYY-MM-DD format
} 