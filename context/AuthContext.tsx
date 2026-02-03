import { createContext, PropsWithChildren, SetStateAction, useContext, useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalContext'
import generateProgram from '@/models/generate-sprints-program'

interface AuthContextProps {
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter()
  const { setProgram } = useGlobalContext()

  useEffect(() => {
    setProgram(generateProgram(11.37))
    router.replace('/home')
  }, [])

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)