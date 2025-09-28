// Sample CA Lobby Data Generator for Chart Testing

export const generateSampleLobbyData = (count = 100) => {
  const organizations = [
    'California Chamber of Commerce',
    'PG&E Corporation',
    'California Medical Association',
    'California Teachers Association',
    'Amazon.com Inc.',
    'Google LLC',
    'Meta Platforms Inc.',
    'Tesla Inc.',
    'Apple Inc.',
    'California Hospital Association',
    'Chevron Corporation',
    'AT&T Inc.',
    'Pharmaceutical Research Association',
    'California Manufacturers Association',
    'Real Estate Association'
  ];

  const lobbyCategories = [
    'Healthcare',
    'Technology',
    'Energy',
    'Transportation',
    'Education',
    'Environment',
    'Labor',
    'Finance',
    'Agriculture',
    'Housing'
  ];

  const data = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2025-09-28');

  for (let i = 0; i < count; i++) {
    const randomDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    );

    const organization = organizations[Math.floor(Math.random() * organizations.length)];
    const category = lobbyCategories[Math.floor(Math.random() * lobbyCategories.length)];

    // Generate realistic lobby spending amounts
    const baseAmount = Math.random() * 500000; // Up to $500K
    const amount = Math.round(baseAmount * 100) / 100; // Round to cents

    data.push({
      id: `lobby_${i + 1}`,
      date: randomDate.toISOString().split('T')[0],
      organization,
      category,
      amount,
      quarter: `Q${Math.floor(randomDate.getMonth() / 3) + 1} ${randomDate.getFullYear()}`,
      year: randomDate.getFullYear(),
      month: randomDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
  }

  return data.sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Process data for trend charts
export const processLobbyTrends = (data, groupBy = 'quarter') => {
  const grouped = data.reduce((acc, item) => {
    const key = item[groupBy];
    if (!acc[key]) {
      acc[key] = { period: key, amount: 0, count: 0 };
    }
    acc[key].amount += item.amount;
    acc[key].count += 1;
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => {
    if (groupBy === 'quarter') {
      const [qA, yearA] = a.period.split(' ');
      const [qB, yearB] = b.period.split(' ');
      return yearA !== yearB ? yearA - yearB : qA.replace('Q', '') - qB.replace('Q', '');
    }
    return new Date(a.period) - new Date(b.period);
  });
};

// Process data for organization comparison
export const processOrganizationData = (data, limit = 10) => {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.organization]) {
      acc[item.organization] = { name: item.organization, amount: 0, count: 0 };
    }
    acc[item.organization].amount += item.amount;
    acc[item.organization].count += 1;
    return acc;
  }, {});

  return Object.values(grouped)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

// Process data for category breakdown
export const processCategoryData = (data) => {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { name: item.category, amount: 0, count: 0 };
    }
    acc[item.category].amount += item.amount;
    acc[item.category].count += 1;
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => b.amount - a.amount);
};