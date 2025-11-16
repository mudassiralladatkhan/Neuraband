import React from 'react';
import { Card } from '../ui/Card';
import { StressMetric, MotionMetric } from '../../types/neuraband';

interface ScoreCardProps {
  data: StressMetric | MotionMetric;
  icon: React.ElementType;
}

const getScoreColor = (score: number) => {
  if (score < 40) return 'bg-green-500';
  if (score < 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const ScoreCard: React.FC<ScoreCardProps> = ({ data, icon: Icon }) => {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <h3 className="text-muted-foreground font-medium">{data.label}</h3>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-baseline space-x-2">
        <span className="text-3xl font-bold">{data.level}</span>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Score</span>
          <span>{data.score} / 100</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div
            className={`${getScoreColor(data.score)} h-2.5 rounded-full`}
            style={{ width: `${data.score}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};
