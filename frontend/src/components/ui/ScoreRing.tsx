// src/components/ui/ScoreRing.tsx
// Circular score ring that shows match percentage with color coding.

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
}

function getColor(score: number): string {
  if (score >= 75) return "#16a34a"; // green
  if (score >= 50) return "#d97706"; // yellow
  return "#dc2626";                  // red
}

export default function ScoreRing({ score, size = 80 }: ScoreRingProps) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill={color}
        >
          {score}%
        </text>
      </svg>
    </div>
  );
}
