import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { useSearchStore, useUserStore } from '../../stores';
import { generateSampleLobbyData, processOrganizationData } from '../../utils/sampleData';

const OrganizationChart = () => {
  const { results } = useSearchStore();
  const { preferences } = useUserStore();

  // Use sample data for now, will be replaced with real search results
  const sampleData = useMemo(() => generateSampleLobbyData(300), []);
  const chartData = useMemo(() => {
    const dataToProcess = results && results.length > 0 ? results : sampleData;
    return processOrganizationData(dataToProcess, 8); // Top 8 organizations
  }, [results, sampleData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleBarClick = (data) => {
    console.log('Organization clicked:', data);
    // Future: Filter search results by selected organization
  };

  const chartTheme = {
    light: {
      background: '#ffffff',
      text: '#333333',
      bars: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
      grid: '#e5e7eb'
    },
    dark: {
      background: '#1f2937',
      text: '#f9fafb',
      bars: ['#60a5fa', '#93c5fd', '#dbeafe', '#bfdbfe', '#e0e7ff'],
      grid: '#374151'
    }
  };

  const theme = chartTheme[preferences.theme] || chartTheme.light;

  // Truncate long organization names for display
  const formatOrgName = (name) => {
    if (name.length > 20) {
      return name.substring(0, 17) + '...';
    }
    return name;
  };

  return (
    <ChartWrapper
      title="Top Organizations by Lobby Spending"
      height={400}
      className="organization-chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          onClick={handleBarClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            dataKey="name"
            stroke={theme.text}
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tickFormatter={formatOrgName}
          />
          <YAxis
            stroke={theme.text}
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={[formatCurrency, 'Total Spending']}
            labelFormatter={(label) => `Organization: ${label}`}
            labelStyle={{ color: theme.text }}
            contentStyle={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.grid}`,
              borderRadius: '4px'
            }}
          />
          <Bar
            dataKey="amount"
            name="Lobby Spending"
            cursor="pointer"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={theme.bars[index % theme.bars.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default OrganizationChart;