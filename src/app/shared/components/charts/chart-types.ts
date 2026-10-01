export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polar' | 'bubble' | 'scatter';
  data: ChartDataset[];
  labels?: string[];
  title?: string;
  height?: string;
  options?: any;
}

export interface ChartDataset {
  label: string;
  data: number[] | any[];
  borderColor?: string;
  backgroundColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  radius?: number;
}

export const CHART_COLORS = {
  primary: '#2d3e63',
  secondary: '#ff6b35',
  accent: '#00d4a8',
  tertiary: '#7c5cff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  info: '#1890ff',
};

export const DEFAULT_LINE_CHART: ChartConfig = {
  type: 'line',
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [
    {
      label: 'Dataset 1',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: CHART_COLORS.accent,
      backgroundColor: 'rgba(0, 212, 168, 0.1)',
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Dataset 2',
      data: [5, 10, 15, 8, 12, 18],
      borderColor: CHART_COLORS.secondary,
      backgroundColor: 'rgba(255, 107, 53, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

export const DEFAULT_BAR_CHART: ChartConfig = {
  type: 'bar',
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [
    {
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: [
        CHART_COLORS.accent,
        CHART_COLORS.secondary,
        CHART_COLORS.primary,
        CHART_COLORS.tertiary,
        CHART_COLORS.success,
        CHART_COLORS.warning,
      ],
    },
  ],
};

export const DEFAULT_PIE_CHART: ChartConfig = {
  type: 'pie',
  labels: ['Category A', 'Category B', 'Category C', 'Category D'],
  data: [
    {
      label: 'Distribution',
      data: [300, 150, 100, 250],
      backgroundColor: [
        CHART_COLORS.accent,
        CHART_COLORS.secondary,
        CHART_COLORS.primary,
        CHART_COLORS.tertiary,
      ],
    },
  ],
};

export const DEFAULT_DOUGHNUT_CHART: ChartConfig = {
  type: 'doughnut',
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  data: [
    {
      label: 'Revenue',
      data: [30, 25, 20, 25],
      backgroundColor: [
        CHART_COLORS.accent,
        CHART_COLORS.secondary,
        CHART_COLORS.primary,
        CHART_COLORS.tertiary,
      ],
    },
  ],
};

export const DEFAULT_RADAR_CHART: ChartConfig = {
  type: 'radar',
  labels: ['Strength', 'Speed', 'Endurance', 'Flexibility', 'Intelligence', 'Durability'],
  data: [
    {
      label: 'Character 1',
      data: [65, 59, 90, 81, 56, 55],
      borderColor: CHART_COLORS.accent,
      backgroundColor: 'rgba(0, 212, 168, 0.2)',
    },
    {
      label: 'Character 2',
      data: [28, 48, 40, 19, 96, 27],
      borderColor: CHART_COLORS.secondary,
      backgroundColor: 'rgba(255, 107, 53, 0.2)',
    },
  ],
};

export const DEFAULT_POLAR_CHART: ChartConfig = {
  type: 'polar',
  labels: ['A', 'B', 'C', 'D', 'E'],
  data: [
    {
      label: 'Series 1',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        CHART_COLORS.accent,
        CHART_COLORS.secondary,
        CHART_COLORS.primary,
        CHART_COLORS.tertiary,
        CHART_COLORS.success,
      ],
    },
  ],
};
