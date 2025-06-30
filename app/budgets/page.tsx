"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/hooks/use-auth"
import { getBudgets, createBudget, updateBudget, deleteBudget, getCategories } from "@/lib/database"
import { Plus, Edit, Trash2, Target } from "lucide-react"

export default function BudgetsPage() {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
  })

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    try {
      const [budgetsResult, categoriesResult] = await Promise.all([getBudgets(user.id), getCategories(user.id)])

      setBudgets(budgetsResult.data || [])
      setCategories(categoriesResult.data?.filter((c) => c.type === "expense") || [])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const budgetData = {
      user_id: user.id,
      category_id: formData.category_id,
      amount: Number.parseFloat(formData.amount),
      month: `${formData.month}-01`, // Convert to first day of month
    }

    try {
      if (editingBudget) {
        const { data } = await updateBudget(editingBudget.id, budgetData)
        if (data) {
          setBudgets((prev) => prev.map((b) => (b.id === editingBudget.id ? data : b)))
        }
      } else {
        const { data } = await createBudget(budgetData)
        if (data) {
          setBudgets((prev) => [...prev, data])
        }
      }

      resetForm()
      setDialogOpen(false)
    } catch (error) {
      console.error("Error saving budget:", error)
    }
  }

  const handleEdit = (budget: any) => {
    setEditingBudget(budget)
    setFormData({
      category_id: budget.category_id,
      amount: budget.amount.toString(),
      month: budget.month.slice(0, 7), // Extract YYYY-MM from date
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return

    try {
      await deleteBudget(id)
      setBudgets((prev) => prev.filter((b) => b.id !== id))
    } catch (error) {
      console.error("Error deleting budget:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      category_id: "",
      amount: "",
      month: new Date().toISOString().slice(0, 7),
    })
    setEditingBudget(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
            <p className="text-gray-600">Set and track your monthly spending limits</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBudget ? "Edit Budget" : "Add New Budget"}</DialogTitle>
                <DialogDescription>
                  {editingBudget ? "Update the budget details." : "Set a spending limit for a category."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <span>{category.icon || "📊"}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Budget Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData((prev) => ({ ...prev, month: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingBudget ? "Update" : "Create"} Budget</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {budgets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets set</h3>
              <p className="text-gray-500 mb-4">Start by creating your first budget to track your spending</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Budget
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              // Calculate spent amount (placeholder - in real app, this would be calculated from transactions)
              const spentAmount = Math.random() * budget.amount
              const percentage = (spentAmount / budget.amount) * 100
              const remaining = budget.amount - spentAmount

              return (
                <Card key={budget.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{budget.categories?.icon || "📊"}</span>
                        <div>
                          <CardTitle className="text-lg">{budget.categories?.name}</CardTitle>
                          <CardDescription>{formatMonth(budget.month)}</CardDescription>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(budget)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(budget.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Spent</span>
                        <span className="font-medium">{formatCurrency(spentAmount)}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget</span>
                        <span className="font-medium">{formatCurrency(budget.amount)}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Remaining</span>
                        <span className={`font-medium ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(remaining)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(0)}% of budget used</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
