'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TruckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Vehicle {
  id: string
  type: 'car' | 'motorcycle' | 'truck'
  brand: string
  model: string
  year: string
  plate: string
  fuel: 'flex' | 'gasoline' | 'diesel' | 'electric' | 'hybrid'
}

interface VehiclesStepProps {
  data: {
    vehicles?: Vehicle[]
  }
  onChange: (data: any) => void
  errors: string[]
}

export function VehiclesStep({ data, onChange, errors }: VehiclesStepProps) {
  const [validations, setValidations] = useState<Record<string, Record<string, boolean>>>({})

  const vehicles = data.vehicles || []

  const vehicleTypes = [
    { id: 'car', name: 'Carro', emoji: '🚗', description: 'Carros de passeio' },
    { id: 'motorcycle', name: 'Moto', emoji: '🏍️', description: 'Motocicletas e ciclomotores' },
    { id: 'truck', name: 'Caminhão', emoji: '🚛', description: 'Caminhões e utilitários' }
  ]

  const carBrands = [
    'Volkswagen', 'Fiat', 'Chevrolet', 'Ford', 'Toyota', 'Honda', 'Hyundai', 'Nissan', 
    'Renault', 'Peugeot', 'Citroën', 'Mitsubishi', 'Jeep', 'BMW', 'Mercedes-Benz', 
    'Audi', 'Volvo', 'Land Rover', 'Porsche', 'Ferrari', 'Lamborghini', 'Outro'
  ]

  const motorcycleBrands = [
    'Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Harley-Davidson', 'BMW', 'Ducati', 
    'Triumph', 'KTM', 'Aprilia', 'MV Agusta', 'Indian', 'Royal Enfield', 'Outro'
  ]

  const truckBrands = [
    'Mercedes-Benz', 'Volvo', 'Scania', 'Iveco', 'DAF', 'MAN', 'Ford', 'Volkswagen',
    'Agrale', 'International', 'Freightliner', 'Kenworth', 'Peterbilt', 'Outro'
  ]

  const fuelTypes = [
    { id: 'flex', name: 'Flex (Álcool/Gasolina)', emoji: '⛽' },
    { id: 'gasoline', name: 'Gasolina', emoji: '⛽' },
    { id: 'diesel', name: 'Diesel', emoji: '🛢️' },
    { id: 'electric', name: 'Elétrico', emoji: '🔋' },
    { id: 'hybrid', name: 'Híbrido', emoji: '🔋⛽' }
  ]

  const getBrandsForType = (type: string) => {
    switch (type) {
      case 'car': return carBrands
      case 'motorcycle': return motorcycleBrands
      case 'truck': return truckBrands
      default: return carBrands
    }
  }

  const validateVehicle = (vehicleId: string, field: string, value: string) => {
    let isValid = false
    
    switch (field) {
      case 'type':
      case 'brand':
      case 'fuel':
        isValid = value.trim().length > 0
        break
      case 'model':
        isValid = value.trim().length >= 2
        break
      case 'year':
        const year = parseInt(value)
        isValid = year >= 1950 && year <= new Date().getFullYear() + 1
        break
      case 'plate':
        // Brazilian plate format: ABC-1234 or ABC1D23 (Mercosul)
        isValid = /^[A-Z]{3}-?\d{4}$/.test(value.toUpperCase()) || /^[A-Z]{3}\d[A-Z]\d{2}$/.test(value.toUpperCase())
        break
      default:
        isValid = true
    }

    setValidations(prev => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        [field]: isValid
      }
    }))

    return isValid
  }

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      type: 'car',
      brand: '',
      model: '',
      year: '',
      plate: '',
      fuel: 'flex'
    }
    
    onChange({ vehicles: [...vehicles, newVehicle] })
  }

  const removeVehicle = (vehicleId: string) => {
    onChange({ vehicles: vehicles.filter(v => v.id !== vehicleId) })
    setValidations(prev => {
      const newValidations = { ...prev }
      delete newValidations[vehicleId]
      return newValidations
    })
  }

  const updateVehicle = (vehicleId: string, field: string, value: string) => {
    let formattedValue = value

    if (field === 'plate') {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)
      if (formattedValue.length > 3) {
        formattedValue = formattedValue.slice(0, 3) + '-' + formattedValue.slice(3)
      }
    } else if (field === 'year') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4)
    }

    validateVehicle(vehicleId, field, formattedValue)

    const updatedVehicles = vehicles.map(vehicle =>
      vehicle.id === vehicleId ? { ...vehicle, [field]: formattedValue } : vehicle
    )
    
    onChange({ vehicles: updatedVehicles })
  }

  const getVehicleTypeIcon = (type: string) => {
    const vehicleType = vehicleTypes.find(t => t.id === type)
    return vehicleType?.emoji || '🚗'
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <TruckIcon className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Seus Veículos</h3>
        <p className="text-gray-600">Adicione os veículos que você possui para encontrar os serviços ideais</p>
      </div>

      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <div className="text-red-600 text-sm">
            {errors.map((error, index) => (
              <p key={index}>• {error}</p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Vehicles List */}
      <div className="space-y-6">
        <AnimatePresence>
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg relative overflow-hidden"
            >
              {/* Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/20 -z-10"></div>

              {/* Vehicle Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getVehicleTypeIcon(vehicle.type)}</div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Veículo {index + 1}
                  </h4>
                </div>
                
                {vehicles.length > 1 && (
                  <motion.button
                    onClick={() => removeVehicle(vehicle.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* Vehicle Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  🚗 Tipo de Veículo
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {vehicleTypes.map(type => (
                    <motion.button
                      key={type.id}
                      type="button"
                      onClick={() => updateVehicle(vehicle.id, 'type', type.id)}
                      className={`p-4 border-2 rounded-xl text-center transition-all ${
                        vehicle.type === type.id
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-1">{type.emoji}</div>
                      <div className="font-semibold text-sm">{type.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🏭 Marca
                  </label>
                  <select
                    value={vehicle.brand}
                    onChange={(e) => updateVehicle(vehicle.id, 'brand', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all bg-white/80"
                    required
                  >
                    <option value="">Selecione a marca</option>
                    {getBrandsForType(vehicle.type).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🚙 Modelo
                  </label>
                  <input
                    type="text"
                    value={vehicle.model}
                    onChange={(e) => updateVehicle(vehicle.id, 'model', e.target.value)}
                    placeholder="Ex: Gol, Uno, CB 600F"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all bg-white/80"
                    required
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📅 Ano
                  </label>
                  <input
                    type="text"
                    value={vehicle.year}
                    onChange={(e) => updateVehicle(vehicle.id, 'year', e.target.value)}
                    placeholder="2023"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all bg-white/80"
                    required
                  />
                </div>

                {/* Plate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🔖 Placa
                  </label>
                  <input
                    type="text"
                    value={vehicle.plate}
                    onChange={(e) => updateVehicle(vehicle.id, 'plate', e.target.value)}
                    placeholder="ABC-1234"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all bg-white/80"
                    required
                  />
                </div>

                {/* Fuel */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ⛽ Combustível
                  </label>
                  <select
                    value={vehicle.fuel}
                    onChange={(e) => updateVehicle(vehicle.id, 'fuel', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all bg-white/80"
                    required
                  >
                    {fuelTypes.map(fuel => (
                      <option key={fuel.id} value={fuel.id}>
                        {fuel.emoji} {fuel.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Vehicle Button */}
      {vehicles.length < 5 && (
        <motion.button
          onClick={addVehicle}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-400 hover:bg-purple-50 transition-all text-gray-600 hover:text-purple-600 flex items-center justify-center space-x-3"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <PlusIcon className="w-6 h-6" />
          <span className="font-medium">Adicionar Outro Veículo</span>
        </motion.button>
      )}

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-purple-50 rounded-xl p-4 text-center"
      >
        <p className="text-purple-700 text-sm">
          <span className="font-semibold">Dica:</span> Você pode adicionar até 5 veículos. Isso nos ajuda a encontrar as oficinas mais adequadas! 🚗✨
        </p>
      </motion.div>
    </div>
  )
}
