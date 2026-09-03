"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import {
  type AuthUser,
  fetchMe,
  getToken,
  login as apiLogin,
  register as apiRegister,
  setToken,
} from "@/lib/api"

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  register: (input: { email: string; password: string; name: string }) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function restore() {
      if (!getToken()) {
        setLoading(false)
        return
      }
      try {
        const { user } = await fetchMe()
        if (active) setUser(user)
      } catch {
        setToken(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    restore()
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, user } = await apiLogin(email, password)
    setToken(accessToken)
    setUser(user)
    return user
  }, [])

  const register = useCallback(
    async (input: { email: string; password: string; name: string }) => {
      const { accessToken, user } = await apiRegister(input)
      setToken(accessToken)
      setUser(user)
      return user
    },
    [],
  )

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth 는 AuthProvider 안에서만 사용할 수 있습니다.")
  return ctx
}
