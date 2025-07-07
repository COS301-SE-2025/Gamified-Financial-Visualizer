import React, { useEffect, useState } from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const BarChart = () => {
  const [data, setData] = useState([]);
  const [performanceMessage, setPerformanceMessage] = useState({
    main: "You're doing great!",
    sub: "Keep adding progress to your goals",
    emoji: "☺"
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/goal/${user.id}/progress-frequency`
        );
        const result = await res.json();
        const apiData = result.data; // [{ day_label, count }, ...]

        // highlight today
        const today = new Date();
        const currentDayName = daysOfWeek[today.getDay()];

        // map API → chart format
        const mapped = daysOfWeek.map(day => {
          const entry = apiData.find(d => d.day_label === day);
          return {
            day,
            value: entry ? Number(entry.count) : 0,
            isCurrent: day === currentDayName
          };
        });

        setData(mapped);

        // recalc performance
        const totalProgress = mapped.reduce((sum, d) => sum + d.value, 0);
        const activeDays = mapped.filter(d => d.value > 0).length;

        let message = {
          main: "You're doing great!",
          sub: "Keep adding progress to your goals",
          emoji: "☺"
        };

        if (totalProgress === 0) {
          message = {
            main: "Let's get started!",
            sub: "Track your first goal progress today",
            emoji: "😴"
          };
        } else if (activeDays >= 5) {
          message = {
            main: "You're crushing it!",
            sub: "Amazing consistency this week",
            emoji: "🔥"
          };
        } else if (activeDays >= 3) {
          message = {
            main: "Good progress!",
            sub: "Almost halfway through the week",
            emoji: "😊"
          };
        } else if (totalProgress > 10) {
          message = {
            main: "Great effort!",
            sub: "Quality over quantity",
            emoji: "💪"
          };
        }

        setPerformanceMessage(message);
      } catch (err) {
        console.error('Failed to load bar chart data', err);
        setPerformanceMessage({
          main: "Data loading failed",
          sub: "We'll try again soon",
          emoji: "😕"
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-md font-semibold text-gray-600 mb-4">
          Weekly Goal Completion
        </h3>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {data.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.isCurrent ? '#FF955A' : '#5FBFFF'}
                  />
                ))}
              </Bar>
            </ReBarChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Message */}
        <div className="mt-[70px] flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#FEEBCB] flex items-center justify-center">
            <span className="text-[#FF955A] font-bold text-lg">
              {performanceMessage.emoji}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {performanceMessage.main}
            </p>
            <p className="text-xs text-gray-500">
              {performanceMessage.sub}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
