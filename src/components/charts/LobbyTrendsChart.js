import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { useSearchStore, useUserStore } from '../../stores';
import { generateSampleLobbyData, processLobbyTrends } from '../../utils/sampleData';

const LobbyTrendsChart = () => {
  const { results } = useSearchStore();
  const { preferences } = useUserStore();

  // Use sample data for now, will be replaced with real search results
  const sampleData = useMemo(() => generateSampleLobbyData(200), []);
  const chartData = useMemo(() => {
    const dataToProcess = results && results.length > 0 ? results : sampleData;
    return processLobbyTrends(dataToProcess, 'quarter');
  }, [results, sampleData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleDataClick = (data) => {
    console.log('Trend data clicked:', data);
    // Future: Filter search results by selected time period
  };

  const chartTheme = {
    light: {
      background: '#ffffff',
      text: '#333333',
      line: '#2563eb',
      grid: '#e5e7eb'
    },
    dark: {
      background: '#1f2937',
      text: '#f9fafb',
      line: '#60a5fa',
      grid: '#374151'
    }
  };

  const theme = chartTheme[preferences.theme] || chartTheme.light;

  return (
    <ChartWrapper
      title="CA Lobby Expenditure Trends"
      height={350}
      className="lobby-trends-chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onClick={handleDataClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            dataKey="period"
            stroke={theme.text}
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke={theme.text}
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={[formatCurrency, 'Total Amount']}
            labelStyle={{ color: theme.text }}
            contentStyle={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.grid}`,
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={theme.line}
            strokeWidth={2}
            dot={{ fill: theme.line, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: theme.line, strokeWidth: 2 }}
            name="Lobby Spending"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default LobbyTrendsChart;