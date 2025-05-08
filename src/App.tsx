import React from 'react';
import { StockProvider } from './context/StockContext';
import Dashboard from './components/Dashboard';
import NavHeader from './components/NavHeader';

function App() {
  return (
    <StockProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <NavHeader />
        <Dashboard />
      </div>
    </StockProvider>
  );
}

export default App;