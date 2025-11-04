"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Trash2, Plus } from "lucide-react"
import Link from "next/link"

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
}

interface PackingItem {
  id: string
  name: string
  category: string
  packed: boolean
}

export default function TripDetailsPage({ params }: { params: { id: string } }) {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", category: "accommodation", description: "Hotel 2 nights", amount: 200, date: "2025-06-01" },
    { id: "2", category: "food", description: "Dinner at restaurant", amount: 45, date: "2025-06-02" },
    { id: "3", category: "transport", description: "Uber rides", amount: 65, date: "2025-06-02" },
    { id: "4", category: "activities", description: "Museum ticket", amount: 30, date: "2025-06-03" },
  ])

  const [packingItems, setPackingItems] = useState<PackingItem[]>([
    { id: "1", name: "Passport", category: "documents", packed: true },
    { id: "2", name: "Sunscreen", category: "toiletries", packed: false },
    { id: "3", name: "Shorts", category: "clothing", packed: true },
    { id: "4", name: "T-shirts", category: "clothing", packed: true },
    { id: "5", name: "Phone charger", category: "electronics", packed: false },
    { id: "6", name: "Camera", category: "electronics", packed: true },
  ])

  const [newExpense, setNewExpense] = useState({ category: "", description: "", amount: "" })
  const [newItem, setNewItem] = useState({ name: "", category: "" })

  const tripData = {
    id: params.id,
    destination: "Paris, France",
    startDate: "2025-06-01",
    endDate: "2025-06-10",
    days: 10,
  }

  // Calculate expense totals
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const expensesByCategory = expenses.reduce(
    (acc, e) => {
      if (!acc[e.category]) acc[e.category] = 0
      acc[e.category] += e.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryLabels: Record<string, string> = {
    accommodation: "Accommodation",
    food: "Food & Dining",
    transport: "Transportation",
    activities: "Activities",
    shopping: "Shopping",
    other: "Other",
  }

  const categoryColors: Record<string, string> = {
    accommodation: "bg-blue-100 text-blue-800",
    food: "bg-green-100 text-green-800",
    transport: "bg-purple-100 text-purple-800",
    activities: "bg-orange-100 text-orange-800",
    shopping: "bg-pink-100 text-pink-800",
    other: "bg-gray-100 text-gray-800",
  }

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.description && newExpense.amount) {
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        description: newExpense.description,
        amount: Number.parseFloat(newExpense.amount),
        date: new Date().toISOString().split("T")[0],
      }
      setExpenses([...expenses, expense])
      setNewExpense({ category: "", description: "", amount: "" })
    }
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const handleAddItem = () => {
    if (newItem.name && newItem.category) {
      const item: PackingItem = {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category,
        packed: false,
      }
      setPackingItems([...packingItems, item])
      setNewItem({ name: "", category: "" })
    }
  }

  const handleTogglePacked = (id: string) => {
    setPackingItems(packingItems.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)))
  }

  const handleDeleteItem = (id: string) => {
    setPackingItems(packingItems.filter((item) => item.id !== id))
  }

  const packedCount = packingItems.filter((item) => item.packed).length
  const packedPercentage = Math.round((packedCount / packingItems.length) * 100)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trips
          </Link>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{tripData.destination}</h1>
            <p className="text-muted-foreground mb-4">
              {new Date(tripData.startDate).toLocaleDateString()} - {new Date(tripData.endDate).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Duration:</span>
                <span className="font-semibold">{tripData.days} days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Total Spent:</span>
                <span className="font-semibold text-lg">${totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="packing">Packing List</TabsTrigger>
          </TabsList>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            {/* Add Expense Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Expense</CardTitle>
                <CardDescription>Record a new expense for your trip</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Hotel booking, dinner..."
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddExpense} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </CardContent>
            </Card>

            {/* Expense Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <Card key={category}>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">{categoryLabels[category]}</div>
                    <div className="text-2xl font-bold">${amount.toFixed(2)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Expenses List */}
            <Card>
              <CardHeader>
                <CardTitle>All Expenses</CardTitle>
                <CardDescription>Total: ${totalExpenses.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expenses.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No expenses recorded yet.</p>
                  ) : (
                    expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded ${categoryColors[expense.category]}`}
                            >
                              {categoryLabels[expense.category]}
                            </span>
                            <span className="font-medium">{expense.description}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold">${expense.amount.toFixed(2)}</span>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this expense? This action cannot be undone.
                              </AlertDialogDescription>
                              <div className="flex justify-end gap-2">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteExpense(expense.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packing List Tab */}
          <TabsContent value="packing" className="space-y-6">
            {/* Add Item Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Item</CardTitle>
                <CardDescription>Add an item to your packing list</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      id="item-name"
                      placeholder="e.g., Passport, sunscreen..."
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-category">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                    >
                      <SelectTrigger id="item-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="toiletries">Toiletries</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            {/* Packing Progress */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Packing Progress</span>
                  <span className="text-sm font-bold">
                    {packedCount}/{packingItems.length} items
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${packedPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-2">{packedPercentage}% complete</div>
              </CardContent>
            </Card>

            {/* Packing List by Category */}
            <div className="space-y-4">
              {["documents", "clothing", "toiletries", "electronics", "accessories", "other"].map((category) => {
                const items = packingItems.filter((item) => item.category === category)
                if (items.length === 0) return null

                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Checkbox checked={item.packed} onCheckedChange={() => handleTogglePacked(item.id)} />
                              <span className={item.packed ? "line-through text-muted-foreground" : ""}>
                                {item.name}
                              </span>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{item.name}" from your packing list?
                                </AlertDialogDescription>
                                <div className="flex justify-end gap-2">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
