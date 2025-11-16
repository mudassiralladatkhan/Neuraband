import React from 'react';
import { Card } from '../ui/Card';
import SparklineChart from './SparklineChart';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Metric } from '../../types/neuraband';

interface MetricCardProps {
  metric: Metric;
  icon: React.ElementType;
  color: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, icon: Icon, color }) => {
  const ChangeIcon = metric.changeType === 'increase' ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-muted-foreground font-medium">{metric.label}</h3>
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-3xl font-bold">{metric.value}</span>
          <span className="text-muted-foreground">{metric.unit}</span>
        </div>
        {metric.change && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ChangeIcon className={`h-3 w-3 ${metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`} />
            <span className="ml-1">{metric.change} vs last hour</span>
          </div>
        )}
      </div>
      <div className="h-16 mt-4 -mb-4 -mx-6">
        <SparklineChart data={metric.sparkline} color={color} />
      </div>
    </Card>
  );
};
