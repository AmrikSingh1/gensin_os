'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useOsStore } from '@/store/osStore';

// Create context for the OS provider
const OsContext = createContext<null>(null);

// OsProvider props interface
interface OsProviderProps {
  children: ReactNode;
}

// OS Provider component
export function OsProvider({ children }: OsProviderProps) {
  return (
    <OsContext.Provider value={null}>
      {children}
    </OsContext.Provider>
  );
}

// Create a directory to store the providers
export default OsProvider; 