import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext<any>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState([])
  const [otherChannelsData, setOtherChannelsData] = useState([])
  const [filters, setFilters] = useState({ dateRange: undefined })

  const logAction = () => {}

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        otherChannelsData,
        setOtherChannelsData,
        filters,
        setFilters,
        logAction,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
