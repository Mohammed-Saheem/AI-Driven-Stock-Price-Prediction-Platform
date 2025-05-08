import React, { useRef, useEffect } from 'react';
import { useStock } from '../context/StockContext';

// In a real app, we would use a chart library like Chart.js, Recharts, or D3
// For this example, we'll create a simplified SVG chart

const StockChart: React.FC = () => {
  const { timeSeriesData, timeRange } = useStock();
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!timeSeriesData || !svgRef.current) return;
    
    const svg = svgRef.current;
    // Clear previous chart
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    const historical = timeSeriesData.historical;
    const predictions = timeSeriesData.predictions;
    
    // Dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const width = svg.clientWidth - margin.left - margin.right;
    const height = svg.clientHeight - margin.top - margin.bottom;
    
    // Create the main group element with margin
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);
    
    // Find min and max for scales
    const allPrices = [
      ...historical.map(d => d.close),
      ...predictions.map(d => d.prediction),
      ...predictions.map(d => d.upperBound || 0),
      ...predictions.map(d => d.lowerBound || 0)
    ];
    
    const minPrice = Math.min(...allPrices) * 0.95;
    const maxPrice = Math.max(...allPrices) * 1.05;
    
    // Date scale
    const allDates = [
      ...historical.map(d => new Date(d.date).getTime()),
      ...predictions.map(d => new Date(d.date).getTime())
    ];
    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    
    // X scale (dates)
    const xScale = (date: number) => {
      return ((date - minDate) / (maxDate - minDate)) * width;
    };
    
    // Y scale (prices)
    const yScale = (price: number) => {
      return height - ((price - minPrice) / (maxPrice - minPrice)) * height;
    };
    
    // Create x-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    xAxis.setAttribute('transform', `translate(0,${height})`);
    xAxis.classList.add('text-xs', 'text-slate-500');
    g.appendChild(xAxis);
    
    // X-axis line
    const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxisLine.setAttribute('x1', '0');
    xAxisLine.setAttribute('y1', '0');
    xAxisLine.setAttribute('x2', width.toString());
    xAxisLine.setAttribute('y2', '0');
    xAxisLine.setAttribute('stroke', '#cbd5e1');
    xAxisLine.setAttribute('stroke-width', '1');
    xAxis.appendChild(xAxisLine);
    
    // Create y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    yAxis.classList.add('text-xs', 'text-slate-500');
    g.appendChild(yAxis);
    
    // Y-axis line
    const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxisLine.setAttribute('x1', '0');
    yAxisLine.setAttribute('y1', '0');
    yAxisLine.setAttribute('x2', '0');
    yAxisLine.setAttribute('y2', height.toString());
    yAxisLine.setAttribute('stroke', '#cbd5e1');
    yAxisLine.setAttribute('stroke-width', '1');
    yAxis.appendChild(yAxisLine);
    
    // Add horizontal grid lines
    const gridLinesCount = 5;
    for (let i = 0; i <= gridLinesCount; i++) {
      const price = minPrice + (maxPrice - minPrice) * (i / gridLinesCount);
      const y = yScale(price);
      
      // Grid line
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('x1', '0');
      gridLine.setAttribute('y1', y.toString());
      gridLine.setAttribute('x2', width.toString());
      gridLine.setAttribute('y2', y.toString());
      gridLine.setAttribute('stroke', '#e2e8f0');
      gridLine.setAttribute('stroke-width', '1');
      g.appendChild(gridLine);
      
      // Price label
      const priceLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      priceLabel.setAttribute('x', '-5');
      priceLabel.setAttribute('y', y.toString());
      priceLabel.setAttribute('dy', '0.32em');
      priceLabel.setAttribute('text-anchor', 'end');
      priceLabel.textContent = price.toFixed(2);
      priceLabel.classList.add('fill-slate-500', 'text-xs');
      yAxis.appendChild(priceLabel);
    }
    
    // Draw historical line
    const historicalPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const historicalPathD = historical.map((d, i) => {
      const x = xScale(new Date(d.date).getTime());
      const y = yScale(d.close);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
    
    historicalPath.setAttribute('d', historicalPathD);
    historicalPath.setAttribute('stroke', '#1e40af');
    historicalPath.setAttribute('stroke-width', '2');
    historicalPath.setAttribute('fill', 'none');
    g.appendChild(historicalPath);
    
    // Add prediction area (confidence interval)
    const predictionArea = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const predictionAreaD = [
      // Upper bound
      ...predictions.map((d, i) => {
        const x = xScale(new Date(d.date).getTime());
        const y = yScale(d.upperBound || 0);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      }),
      // Lower bound (reversed)
      ...predictions.map((d, i) => {
        const idx = predictions.length - 1 - i;
        const x = xScale(new Date(predictions[idx].date).getTime());
        const y = yScale(predictions[idx].lowerBound || 0);
        return `L${x},${y}`;
      })
    ].join(' ');
    
    predictionArea.setAttribute('d', predictionAreaD);
    predictionArea.setAttribute('fill', '#93c5fd');
    predictionArea.setAttribute('fill-opacity', '0.3');
    g.appendChild(predictionArea);
    
    // Draw prediction line
    const predictionPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const predictionPathD = predictions.map((d, i) => {
      const x = xScale(new Date(d.date).getTime());
      const y = yScale(d.prediction);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
    
    predictionPath.setAttribute('d', predictionPathD);
    predictionPath.setAttribute('stroke', '#60a5fa');
    predictionPath.setAttribute('stroke-width', '2');
    predictionPath.setAttribute('stroke-dasharray', '5,5');
    predictionPath.setAttribute('fill', 'none');
    g.appendChild(predictionPath);
    
    // Add divider between historical and prediction
    if (historical.length > 0 && predictions.length > 0) {
      const dividerX = xScale(new Date(predictions[0].date).getTime());
      const divider = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      divider.setAttribute('x1', dividerX.toString());
      divider.setAttribute('y1', '0');
      divider.setAttribute('x2', dividerX.toString());
      divider.setAttribute('y2', height.toString());
      divider.setAttribute('stroke', '#475569');
      divider.setAttribute('stroke-width', '1');
      divider.setAttribute('stroke-dasharray', '4,4');
      g.appendChild(divider);
      
      // "Prediction starts" label
      const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      labelBg.setAttribute('x', (dividerX - 40).toString());
      labelBg.setAttribute('y', '10');
      labelBg.setAttribute('width', '80');
      labelBg.setAttribute('height', '20');
      labelBg.setAttribute('rx', '4');
      labelBg.setAttribute('fill', '#475569');
      g.appendChild(labelBg);
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', dividerX.toString());
      label.setAttribute('y', '22');
      label.setAttribute('text-anchor', 'middle');
      label.textContent = 'Prediction';
      label.classList.add('fill-white', 'text-xs');
      g.appendChild(label);
    }
    
    // Add legend
    const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legend.setAttribute('transform', `translate(${width - 150},20)`);
    g.appendChild(legend);
    
    // Historical line legend
    const historicalLegendLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    historicalLegendLine.setAttribute('x1', '0');
    historicalLegendLine.setAttribute('y1', '0');
    historicalLegendLine.setAttribute('x2', '20');
    historicalLegendLine.setAttribute('y2', '0');
    historicalLegendLine.setAttribute('stroke', '#1e40af');
    historicalLegendLine.setAttribute('stroke-width', '2');
    legend.appendChild(historicalLegendLine);
    
    const historicalLegendText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    historicalLegendText.setAttribute('x', '25');
    historicalLegendText.setAttribute('y', '0');
    historicalLegendText.setAttribute('dy', '0.32em');
    historicalLegendText.textContent = 'Historical';
    historicalLegendText.classList.add('fill-slate-700', 'dark:fill-slate-300', 'text-xs');
    legend.appendChild(historicalLegendText);
    
    // Prediction line legend
    const predictionLegendLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    predictionLegendLine.setAttribute('x1', '0');
    predictionLegendLine.setAttribute('y1', '20');
    predictionLegendLine.setAttribute('x2', '20');
    predictionLegendLine.setAttribute('y2', '20');
    predictionLegendLine.setAttribute('stroke', '#60a5fa');
    predictionLegendLine.setAttribute('stroke-width', '2');
    predictionLegendLine.setAttribute('stroke-dasharray', '5,5');
    legend.appendChild(predictionLegendLine);
    
    const predictionLegendText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    predictionLegendText.setAttribute('x', '25');
    predictionLegendText.setAttribute('y', '20');
    predictionLegendText.setAttribute('dy', '0.32em');
    predictionLegendText.textContent = 'Prediction';
    predictionLegendText.classList.add('fill-slate-700', 'dark:fill-slate-300', 'text-xs');
    legend.appendChild(predictionLegendText);
    
  }, [timeSeriesData, timeRange]);
  
  return (
    <svg 
      ref={svgRef} 
      width="100%" 
      height="100%" 
      className="overflow-visible"
    ></svg>
  );
};

export default StockChart;