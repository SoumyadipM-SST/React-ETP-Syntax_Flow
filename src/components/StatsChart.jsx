// This component renders a performance chart showing WPM and Accuracy trends over time

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StatsChart({ history }) {
  // Prepare data (reverse to show latest at the end)
  const dataPoints = history.slice().reverse();

  // Chart data configuration
  const data = {
    labels: dataPoints.map((_, i) => `Test ${i + 1}`),
    datasets: [
      {
        label: 'WPM',
        data: dataPoints.map(item => item.wpm),
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,

        // Point styling
        pointBackgroundColor: '#0f172a',
        pointBorderColor: '#22d3ee',
        pointBorderWidth: 2,
        pointRadius: dataPoints.length > 20 ? 0 : 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Accuracy %',
        data: dataPoints.map(item => item.accuracy),
        borderColor: 'rgba(251, 146, 60, 0.5)',
        backgroundColor: 'transparent',
        borderDash: [6, 4],
        tension: 0.4,
        borderWidth: 2,

        // Keep accuracy line subtle
        pointRadius: 0,
        pointHoverRadius: 5
      }
    ]
  };

  // Chart options and styling
  const options = {
    responsive: true,
    maintainAspectRatio: false,

    // Interaction settings
    interaction: {
      mode: 'index',
      intersect: false,
    },

    plugins: {
      // Legend styling
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          boxWidth: 8,
          font: { family: "'Inter', sans-serif", weight: 600 }
        }
      },

      // Tooltip styling
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        titleFont: { family: 'monospace' }
      }
    },

    // Axes styling
    scales: {
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)', drawBorder: false },
        ticks: { color: '#64748b', font: { family: 'monospace' } },
        beginAtZero: true
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#64748b',
          maxTicksLimit: 12,
          font: { size: 10, family: 'monospace' }
        }
      }
    }
  };

  return (
    <div className="h-full w-full min-h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
}