export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

export interface PredictionDataPoint {
  date: string;
  prediction: number;
  upperBound?: number;
  lowerBound?: number;
  actual?: number;
}

export interface TimeSeriesData {
  historical: HistoricalDataPoint[];
  predictions: PredictionDataPoint[];
}

export interface StockPrediction {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  changePercent: number;
  confidence: number;
  recommendation: 'buy' | 'sell' | 'hold';
}

export type TimeRange = '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | '5y';