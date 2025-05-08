import { StockData, TimeSeriesData, TimeRange, StockPrediction, HistoricalDataPoint, PredictionDataPoint } from '../types/stock';

export const mockStocks: StockData[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 182.63, change: 1.25, changePercent: 0.69, volume: 59382400, marketCap: 2850000000000 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 402.56, change: -3.28, changePercent: -0.81, volume: 17289300, marketCap: 2990000000000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 171.19, change: 0.96, changePercent: 0.56, volume: 21382600, marketCap: 2140000000000 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.87, change: 2.45, changePercent: 1.39, volume: 32953100, marketCap: 1850000000000 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.48, change: -5.73, changePercent: -2.25, volume: 93732000, marketCap: 790000000000 },
  { symbol: 'META', name: 'Meta Platforms, Inc.', price: 487.98, change: 8.21, changePercent: 1.71, volume: 13587200, marketCap: 1240000000000 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 116.01, change: 1.55, changePercent: 1.35, volume: 184723600, marketCap: 2860000000000 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 196.43, change: -0.98, changePercent: -0.50, volume: 8937400, marketCap: 567000000000 },
];

// Helper to generate dates
const generateDates = (days: number, startDate = new Date()): string[] => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() - (days - i - 1));
    return date.toISOString().split('T')[0];
  });
};

// Helper to generate random price movements with a trend
const generatePriceData = (startPrice: number, days: number, volatility: number, trend: number): number[] => {
  return Array.from({ length: days }).reduce((prices, _, i) => {
    const lastPrice = prices[prices.length - 1];
    const change = (Math.random() - 0.5) * 2 * volatility + trend;
    const newPrice = Math.max(lastPrice + change, 1); // Ensure price never goes below 1
    prices.push(newPrice);
    return prices;
  }, [startPrice]);
};

export const getMockTimeSeriesData = async (symbol: string, range: TimeRange): Promise<TimeSeriesData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Map timerange to days
  const daysMap: Record<TimeRange, number> = {
    '1d': 1,
    '1w': 7,
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365,
    '5y': 1825
  };
  
  const days = daysMap[range];
  const stock = mockStocks.find(s => s.symbol === symbol);
  const currentPrice = stock?.price || 100;
  
  // Generate historical data
  const dates = generateDates(days);
  const volatility = currentPrice * 0.02; // 2% daily volatility
  const trend = range === '5y' ? 0.05 : 0.01; // Slight upward trend
  
  // Generate prices backwards from current price
  const prices = generatePriceData(currentPrice, days, volatility, -trend).reverse();
  
  const historical: HistoricalDataPoint[] = dates.map((date, i) => {
    const close = prices[i];
    return {
      date,
      close,
      open: close * (1 - Math.random() * 0.01),
      high: close * (1 + Math.random() * 0.015),
      low: close * (1 - Math.random() * 0.015),
      volume: Math.floor(Math.random() * 10000000 + 5000000)
    };
  });
  
  // Generate predictions for next 30 days
  const futureDates = generateDates(30, new Date(dates[dates.length - 1])).slice(1);
  const lastPrice = prices[prices.length - 1];
  const futurePrices = generatePriceData(lastPrice, 30, volatility * 1.2, trend * 1.5).slice(1);
  
  const predictions: PredictionDataPoint[] = futureDates.map((date, i) => {
    const prediction = futurePrices[i];
    const confidence = 0.05 + (i * 0.01); // Confidence decreases over time
    
    return {
      date,
      prediction,
      upperBound: prediction * (1 + confidence),
      lowerBound: prediction * (1 - confidence),
    };
  });
  
  return { historical, predictions };
};

export const getMockPrediction = async (symbol: string): Promise<StockPrediction> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const stock = mockStocks.find(s => s.symbol === symbol);
  const currentPrice = stock?.price || 100;
  
  // Random prediction with slight upward bias
  const changePercent = (Math.random() * 10 - 3); // -3% to +7%
  const predictedPrice = currentPrice * (1 + changePercent / 100);
  const confidence = 75 + Math.random() * 20; // 75-95% confidence
  
  let recommendation: 'buy' | 'sell' | 'hold';
  if (changePercent > 3) recommendation = 'buy';
  else if (changePercent < -1) recommendation = 'sell';
  else recommendation = 'hold';
  
  return {
    symbol: symbol,
    currentPrice,
    predictedPrice,
    changePercent,
    confidence,
    recommendation
  };
};