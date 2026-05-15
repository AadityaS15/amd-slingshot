import { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAppContext } from '../context/AppContext';

export default function Today() {
  const { meals } = useAppContext();

  const todayMeals = useMemo(() => {
    const todayStr = new Date().toDateString();
    return meals.filter(m => new Date(m.timestamp).toDateString() === todayStr);
  }, [meals]);

  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const dayMeals = meals.filter(m => new Date(m.timestamp).toDateString() === dateStr);
      
      const calories = dayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
      const avgHealth = dayMeals.length ? dayMeals.reduce((acc, m) => acc + (m.healthScore || 0), 0) / dayMeals.length : 0;
      
      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        calories,
        health: Math.round(avgHealth)
      });
    }
    return data;
  }, [meals]);

  return (
    <div className="flex flex-col space-y-8 pt-4 pb-12">
      <section>
        <h2 className="text-2xl font-bold mb-4">Today's Log</h2>
        {todayMeals.length === 0 ? (
          <div className="bg-card rounded-3xl p-8 text-center flex flex-col items-center justify-center border border-gray-100">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-gray-500 font-medium">No meals logged today yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayMeals.map(meal => (
              <div key={meal.id} className="bg-card p-4 rounded-3xl flex items-center space-x-4 border border-gray-100">
                {meal.image ? (
                   <img src={meal.image} alt={meal.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                ) : (
                   <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center text-2xl">🍲</div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-tight">{meal.name}</h3>
                  <p className="text-gray-500 text-sm font-medium">{meal.calories} kcal</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${meal.healthScore > 70 ? 'bg-accent/10 text-accent' : meal.healthScore >= 40 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                  {meal.healthScore}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-6">7-Day Calorie Intake</h2>
        <div className="h-64 w-full bg-card rounded-3xl p-4 border border-gray-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E8E93' }} dy={10} />
              <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="calories" fill="#00C896" radius={[6, 6, 6, 6]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-6">Average Health Score</h2>
        <div className="h-48 w-full bg-card rounded-3xl p-4 border border-gray-100">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E8E93' }} dy={10} />
              <Tooltip cursor={false} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="health" stroke="#FF9500" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#FFF' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
