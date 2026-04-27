'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

type BarChartProps = {
  chartData: ApexAxisChartSeries;
  chartOptions: ApexOptions;
};

const BarChart = ({ chartData, chartOptions }: BarChartProps) => {
  return (
    <Chart
      options={chartOptions}
      series={chartData}
      type="bar"
      width="100%"
      height="100%"
    />
  );
};

export default BarChart;
