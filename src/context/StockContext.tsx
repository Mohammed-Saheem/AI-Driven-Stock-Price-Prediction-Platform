import React, { createContext, useContext, useState, useEffect } from 'react';
import { StockData, TimeSeriesData, TimeRange, StockPrediction } from '../types/stock';
import { mockStocks, getMockTimeSeriesData, getMockPrediction } from '../data/mockData';

interface StockContextType {
  stocks: StockData[];
  selectedStock: StockData | null;
  timeSeriesData: TimeSeriesData | null;
  predictions: StockPrediction | null;
  timeRange: TimeRange;
  isLoading: boolean;
  selectStock: (symbol: string) => void;
  setTimeRange: (range: TimeRange) => void;
  portfolio: string[];
  addToPortfolio: (symbol: string) => void;
  removeFromPortfolio: (symbol: string) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<StockData[]>(mockStocks);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(null);
  const [predictions, setPredictions] = useState<StockPrediction | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<string[]>([]);

  useEffect(() => {
    if (selectedStock) {
      fetchTimeSeriesData(selectedStock.symbol, timeRange);
      fetchPrediction(selectedStock.symbol);
    }
  }, [selectedStock, timeRange]);

  const fetchTimeSeriesData = async (symbol: string, range: TimeRange) => {
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      const data = await getMockTimeSeriesData(symbol, range);
      setTimeSeriesData(data);
    } catch (error) {
      console.error('Error fetching time series data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrediction = async (symbol: string) => {
    try {
      // In a real application, this would be an API call
      const prediction = await getMockPrediction(symbol);
      setPredictions(prediction);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  const selectStock = (symbol: string) => {
    const stock = stocks.find(s => s.symbol === symbol) || null;
    setSelectedStock(stock);
  };

  const addToPortfolio = (symbol: string) => {
    if (!portfolio.includes(symbol)) {
      setPortfolio([...portfolio, symbol]);
    }
  };

  const removeFromPortfolio = (symbol: string) => {
    setPortfolio(portfolio.filter(s => s !== symbol));
  };

  return (
    <StockContext.Provider value={{
      stocks,
      selectedStock,
      timeSeriesData,
      predictions,
      timeRange,
      isLoading,
      selectStock,
      setTimeRange,
      portfolio,
      addToPortfolio,
      removeFromPortfolio
    }}>
      {children}
    </StockContext.Provider>
  );
};