"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { User } from "lucide-react"
import Link from "next/link"

interface Expense {
  id: string
  description: string
  amount: number
  category: string
}

interface PackingItem {
  id: string
  name: string
  packed: boolean
}

export default function TripDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"gastos" | "itens" | "info">("gastos")
  
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [packingItems, setPackingItems] = useState<PackingItem[]>([])
  
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", category: "" })
  const [newItem, setNewItem] = useState("")

  const tripData = {
    id: params.id,
    destination: "Viagem +"
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const packedCount = packingItems.filter((item) => item.packed).length

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount && newExpense.category) {
      const expense: Expense = {
        id: Date.now().toString(),
        description: newExpense.description,
        amount: Number.parseFloat(newExpense.amount),
        category: newExpense.category,
      }
      setExpenses([...expenses, expense])
      setNewExpense({ description: "", amount: "", category: "" })
    }
  }

  const handleAddItem = () => {
    if (newItem.trim()) {
      const item: PackingItem = {
        id: Date.now().toString(),
        name: newItem,
        packed: false,
      }
      setPackingItems([...packingItems, item])
      setNewItem("")
    }
  }

  const handleTogglePacked = (id: string) => {
    setPackingItems(packingItems.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with hero image */}
      <div className="relative h-80 bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden">
        {/* Mountain background effect */}
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300"%3E%3Cpath d="M0,200 L300,100 L600,150 L900,50 L1200,120 L1200,300 L0,300 Z" fill="%23ffffff" opacity="0.3"/%3E%3Cpath d="M0,220 L400,130 L700,180 L1000,80 L1200,140 L1200,300 L0,300 Z" fill="%23ffffff" opacity="0.2"/%3E%3C/svg%3E')`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom'
          }}
        />
        
        {/* Top navigation */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-white text-2xl font-bold">
            {tripData.destination}
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-white hover:opacity-80">
              Home
            </Link>
            <Link href="/trips" className="text-white hover:opacity-80">
              Planejar Viagens
            </Link>
            <button className="bg-white rounded-full p-2">
              <User className="w-6 h-6 text-gray-700" />
            </button>
          </nav>
        </div>

        {/* Budget and Items counters */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-between px-12">
          <div className="text-white">
            <div className="text-lg font-semibold">Orçamento</div>
            <div className="text-3xl font-bold">R$ {totalExpenses.toFixed(2)}</div>
          </div>
          <div className="text-white text-right">
            <div className="text-lg font-semibold">Itens</div>
            <div className="text-3xl font-bold">{packedCount}/{packingItems.length}</div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-20">
        {/* Add Expense Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Adicionar Gasto</h2>
          
          <div className="space-y-4">
            <Input
              placeholder="Descrição do gasto (ex: Hotel, Comida, Transporte)"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="w-full"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Valor"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
              <Input
                placeholder="Alimentação"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              />
            </div>
            
            <Button 
              onClick={handleAddExpense} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Adicionar Gasto
            </Button>
          </div>
        </div>

        {/* Message when no expenses */}
        {expenses.length === 0 && activeTab === "gastos" && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <p className="text-gray-500 text-lg">Nenhum Gasto registrado ainda</p>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("gastos")}
            className={`px-6 py-3 text-lg font-semibold transition-colors ${
              activeTab === "gastos"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Gastos
          </button>
          <button
            onClick={() => setActiveTab("itens")}
            className={`px-6 py-3 text-lg font-semibold transition-colors ${
              activeTab === "itens"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Itens
          </button>
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-3 text-lg font-semibold transition-colors ${
              activeTab === "info"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Info
          </button>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {/* Gastos Tab */}
          {activeTab === "gastos" && (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-lg">{expense.description}</div>
                    <div className="text-sm text-gray-500">{expense.category}</div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    R$ {expense.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Itens Tab */}
          {activeTab === "itens" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Adicionar Item</h3>
                <div className="flex gap-4">
                  <Input
                    placeholder="Nome do item"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddItem}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {packingItems.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500 text-lg">Nenhum item adicionado ainda</p>
                  </div>
                ) : (
                  packingItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4"
                    >
                      <Checkbox 
                        checked={item.packed} 
                        onCheckedChange={() => handleTogglePacked(item.id)} 
                      />
                      <span className={item.packed ? "line-through text-gray-400" : "text-gray-800"}>
                        {item.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Info Tab */}
          {activeTab === "info" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Informações da Viagem</h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <span className="font-semibold">Total de Gastos:</span> R$ {totalExpenses.toFixed(2)}
                </div>
                <div>
                  <span className="font-semibold">Itens Checados:</span> {packedCount} de {packingItems.length}
                </div>
                <div>
                  <span className="font-semibold">ID da Viagem:</span> {tripData.id}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
