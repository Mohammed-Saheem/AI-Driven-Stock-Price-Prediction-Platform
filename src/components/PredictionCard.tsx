import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useStock } from '../context/StockContext';

const PredictionCard: React.FC = () => {
  const { predictions, isLoading } = useStock();

  if (isLoading || !predictions) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
      </div>
    );
  }

  const isPositive = predictions.changePercent >= 0;
  const recommendationColors = {
    buy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    sell: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    hold: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">AI Price Prediction</h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Predicted Price (30 days)</div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${predictions.predictedPrice.toFixed(2)}</span>
              <span className={`inline-flex items-center text-sm font-medium ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {isPositive ? '+' : ''}{predictions.changePercent.toFixed(2)}%
              </span>
            </div>
            <div className="mt-4 flex items-center">
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${predictions.confidence}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{predictions.confidence.toFixed(0)}% confidence</span>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-full md:w-48 flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-750 rounded-lg">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Recommendation</div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium uppercase ${recommendationColors[predictions.recommendation]}`}>
              {predictions.recommendation}
            </div>
            <div className="mt-3 text-xs text-center text-slate-500 dark:text-slate-400">
              Based on technical analysis and market trends
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Disclaimer</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                This prediction is for informational purposes only and should not be considered as financial advice.
                Always do your own research before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;