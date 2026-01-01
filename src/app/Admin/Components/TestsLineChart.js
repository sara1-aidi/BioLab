'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Mon', tests: 120 },
  { date: 'Tue', tests: 200 },
  { date: 'Wed', tests: 150 },
  { date: 'Thu', tests: 180 },
  { date: 'Fri', tests: 220 },
  { date: 'Sat', tests: 170 },
  { date: 'Sun', tests: 130 },
];

const TestsLineChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Tests Over the Week</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="tests" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TestsLineChart;