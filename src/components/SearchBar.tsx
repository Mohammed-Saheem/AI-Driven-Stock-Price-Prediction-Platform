import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useStock } from '../context/StockContext';

const SearchBar: React.FC = () => {
  const { stocks, selectStock } = useStock();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredStocks = searchTerm.length > 0
    ? stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectStock = (symbol: string) => {
    selectStock(symbol);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full p-3 pl-10 pr-4 text-sm border border-slate-300 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          placeholder="Search for a stock..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => setIsOpen(searchTerm.length > 0)}
        />
      </div>

      {isOpen && filteredStocks.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredStocks.map(stock => (
            <div
              key={stock.symbol}
              className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              onClick={() => handleSelectStock(stock.symbol)}
            >
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{stock.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;