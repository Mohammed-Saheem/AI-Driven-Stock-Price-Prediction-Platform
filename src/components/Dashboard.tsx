import React from 'react';
import { useStock } from '../context/StockContext';
import SearchBar from './SearchBar';
import StockList from './StockList';
import StockChart from './StockChart';
import PredictionCard from './PredictionCard';
import TimeRangeSelector from './TimeRangeSelector';
import PortfolioSection from './PortfolioSection';

const Dashboard: React.FC = () => {
  const { selectedStock, isLoading } = useStock();

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <SearchBar />
          <StockList />
          <PortfolioSection />
        </div>

        {/* Main content */}
        <div className="lg:col-span-9 space-y-6">
          {selectedStock ? (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStock.name} ({selectedStock.symbol})</h2>
                    <div className="flex items-center mt-1">
                      <span className="text-3xl font-semibold">${selectedStock.price.toFixed(2)}</span>
                      <span className={`ml-3 px-2 py-1 rounded-md text-sm font-medium ${selectedStock.change >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <TimeRangeSelector />
                </div>
                
                <div className="h-[400px] w-full">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <StockChart />
                  )}
                </div>
              </div>

              <PredictionCard />
            </>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to MarketCode AI</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Use the search bar to find a stock and view AI-driven price predictions.
              </p>
              <div className="p-6 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-slate-500 dark:text-slate-300 italic">
                  "The stock market is a device for transferring money from the impatient to the patient."
                </p>
                <p className="mt-2 text-slate-600 dark:text-slate-400">— Warren Buffett</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;