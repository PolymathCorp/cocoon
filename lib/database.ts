import { supabase } from "./supabase"
import type { Database } from "./supabase"

type Category = Database["public"]["Tables"]["categories"]["Row"]
type Transaction = Database["public"]["Tables"]["transactions"]["Row"]
type Budget = Database["public"]["Tables"]["budgets"]["Row"]

// Categories
export const getCategories = async (userId: string) => {
  const { data, error } = await supabase.from("categories").select("*").eq("user_id", userId).order("name")

  return { data, error }
}

export const createCategory = async (category: Database["public"]["Tables"]["categories"]["Insert"]) => {
  const { data, error } = await supabase.from("categories").insert(category).select().single()

  return { data, error }
}

export const updateCategory = async (id: string, updates: Database["public"]["Tables"]["categories"]["Update"]) => {
  const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single()

  return { data, error }
}

export const deleteCategory = async (id: string) => {
  const { error } = await supabase.from("categories").delete().eq("id", id)

  return { error }
}

// Transactions
export const getTransactions = async (userId: string, limit?: number) => {
  let query = supabase
    .from("transactions")
    .select(`
      *,
      categories (
        name,
        type,
        icon
      )
    `)
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  return { data, error }
}

export const createTransaction = async (transaction: Database["public"]["Tables"]["transactions"]["Insert"]) => {
  const { data, error } = await supabase
    .from("transactions")
    .insert(transaction)
    .select(`
      *,
      categories (
        name,
        type,
        icon
      )
    `)
    .single()

  return { data, error }
}

export const updateTransaction = async (
  id: string,
  updates: Database["public"]["Tables"]["transactions"]["Update"],
) => {
  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .select(`
      *,
      categories (
        name,
        type,
        icon
      )
    `)
    .single()

  return { data, error }
}

export const deleteTransaction = async (id: string) => {
  const { error } = await supabase.from("transactions").delete().eq("id", id)

  return { error }
}

// Budgets
export const getBudgets = async (userId: string, month?: string) => {
  let query = supabase
    .from("budgets")
    .select(`
      *,
      categories (
        name,
        type,
        icon
      )
    `)
    .eq("user_id", userId)

  if (month) {
    query = query.eq("month", month)
  }

  const { data, error } = await query.order("created_at", { ascending: false })
  return { data, error }
}

export const createBudget = async (budget: Database["public"]["Tables"]["budgets"]["Insert"]) => {
  const { data, error } = await supabase
    .from("budgets")
    .insert(budget)
    .select(`
      *,
      categories (
        name,
        type,
        icon
      )
    `)
    .single()

  return { data, error }
}

export const updateBudget = async (id: string, updates: Database["public"]["Tables"]["budgets"]["Update"]) => {
  const { data, error } = await supabase
    .from("budgets")
    .update(updates)
    .eq("id", id)
    .select(`
      *,
      categories (
        name,
        type,
        icon
      )
    `)
    .single()

  return { data, error }
}

export const deleteBudget = async (id: string) => {
  const { error } = await supabase.from("budgets").delete().eq("id", id)

  return { error }
}

// Analytics
export const getMonthlyStats = async (userId: string, month: string) => {
  const startDate = `${month}-01`
  const endDate = `${month}-31`

  const { data, error } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)

  if (error) return { data: null, error }

  const income = data.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0)
  const expenses = data.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0)
  const balance = income - expenses

  return {
    data: { income, expenses, balance },
    error: null,
  }
}

export const getCategorySpending = async (userId: string, month: string) => {
  const startDate = `${month}-01`
  const endDate = `${month}-31`

  const { data, error } = await supabase
    .from("transactions")
    .select(`
      amount,
      categories (
        name,
        icon
      )
    `)
    .eq("user_id", userId)
    .eq("type", "expense")
    .gte("date", startDate)
    .lte("date", endDate)

  if (error) return { data: null, error }

  const categoryTotals = data.reduce((acc: any, transaction: any) => {
    const categoryName = transaction.categories.name
    const categoryIcon = transaction.categories.icon
    if (!acc[categoryName]) {
      acc[categoryName] = {
        name: categoryName,
        icon: categoryIcon,
        amount: 0,
      }
    }
    acc[categoryName].amount += Number(transaction.amount)
    return acc
  }, {})

  return {
    data: Object.values(categoryTotals).sort((a: any, b: any) => b.amount - a.amount),
    error: null,
  }
}
