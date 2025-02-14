import axios from "axios"
import type { Statistics } from "../types"

const API_URL = `${process.env.EXPO_PUBLIC_API}:3000`

export const fetchStatistics = async (): Promise<Statistics> => {
  const response = await axios.get<Statistics>(`${API_URL}/statistics`)
  return response.data
}

export const updateStatistics = async (updatedStats: Partial<Statistics>): Promise<Statistics> => {
  const currentStats = await fetchStatistics()
  const newStats = { ...currentStats, ...updatedStats }
  const response = await axios.put<Statistics>(`${API_URL}/statistics`, newStats)
  return response.data
}

