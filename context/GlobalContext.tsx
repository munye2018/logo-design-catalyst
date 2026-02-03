import { createContext, PropsWithChildren, SetStateAction, useContext, useState } from 'react'

interface GlobalContextProps {
  sex: string
  setSex: React.Dispatch<SetStateAction<string>>
  event: number
  setEvent: React.Dispatch<SetStateAction<number>>
  bestTime: number
  setBestTime: React.Dispatch<SetStateAction<number>>
  programType: string
  setProgramType: React.Dispatch<SetStateAction<string>>
  program: any
  setProgram: React.Dispatch<SetStateAction<[]>>
  week: number
  setWeek: React.Dispatch<SetStateAction<number>>
  session: number
  setSession: React.Dispatch<SetStateAction<number>>
}

const GlobalContext = createContext<GlobalContextProps>({} as GlobalContextProps)

export const GlobalProvider = ({ children }: PropsWithChildren) => {
  const [sex, setSex] = useState<string>("male")
  const [event, setEvent] = useState<number>(100)
  const [bestTime, setBestTime] = useState<number>(11.37)
  const [programType, setProgramType] = useState<string>("ongoing")
  const [program, setProgram] = useState<any>()
  const [week, setWeek] = useState<number>(0)
  const [session, setSession] = useState<number>(0)

  return (
    <GlobalContext.Provider value={{
      week,
      setWeek,
      sex,
      setSex,
      event,
      setEvent,
      bestTime,
      setBestTime,
      programType,
      setProgramType,
      program,
      setProgram,
      session,
      setSession
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)