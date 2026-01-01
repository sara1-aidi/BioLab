import {
  UserGroupIcon,
  DocumentTextIcon,
  EyeIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from 'recharts';

const cards = [
  {
    label: 'Utilisateurs',
    value: 128,
    icon: <UserGroupIcon className="w-6 h-6 text-blue-600" />,
    type: 'line',
    data: [
      { name: 'Lun', value: 30 },
      { name: 'Mar', value: 50 },
      { name: 'Mer', value: 60 },
      { name: 'Jeu', value: 70 },
      { name: 'Ven', value: 90 },
    ],
    color: '#3B82F6',
  },
  {
    label: 'Articles publiés',
    value: 12,
    icon: <DocumentTextIcon className="w-6 h-6 text-green-600" />,
    type: 'bar',
    data: [
      { name: 'Lun', value: 2 },
      { name: 'Mar', value: 4 },
      { name: 'Mer', value: 6 },
      { name: 'Jeu', value: 4 },
      { name: 'Ven', value: 8 },
    ],
    color: '#10B981',
  },
  {
    label: 'Visiteurs',
    value: 432,
    icon: <EyeIcon className="w-6 h-6 text-purple-600" />,
    type: 'area',
    data: [
      { name: 'Lun', value: 200 },
      { name: 'Mar', value: 250 },
      { name: 'Mer', value: 270 },
      { name: 'Jeu', value: 300 },
      { name: 'Ven', value: 432 },
    ],
    color: '#8B5CF6',
  },
  {
    label: 'Répartition rôles',
    value: '',
    icon: <ChartPieIcon className="w-6 h-6 text-yellow-600" />,
    type: 'pie',
    data: [
      { name: 'Admin', value: 2 },
      { name: 'Patient', value: 3 },
      { name: 'Externe', value: 1 },

    ],
    colors: ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#c084fc'],
  },
];

const renderChart = (card) => {
  switch (card.type) {
    case 'line':
      return (
        <LineChart data={card.data}>
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={card.color} strokeWidth={2} dot={false} />
        </LineChart>
      );
    case 'bar':
      return (
        <BarChart data={card.data}>
          <Tooltip />
          <Bar dataKey="value" fill={card.color} radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    case 'area':
      return (
        <AreaChart data={card.data}>
          <Tooltip />
          <Area dataKey="value" stroke={card.color} fill={card.color} fillOpacity={0.3} />
        </AreaChart>
      );
    case 'pie':
      return (
        <PieChart>
          <Pie
            data={card.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={50}
            innerRadius={25}
            paddingAngle={2}
          >
            {card.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={card.colors[index % card.colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      );
    default:
      return null;
  }
};

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl shadow-md p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              {card.value !== '' && <p className="text-2xl font-bold text-gray-800">{card.value}</p>}
            </div>
            <div className="p-2 bg-gray-100 rounded-full">{card.icon}</div>
          </div>

          <div className="mt-4 h-24">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(card)}
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
