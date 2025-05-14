export interface WeeklyData {
  dates: string[];
  humidity: number[];
  ph: number[];
  ec: number[];
  co2: number[];
}

export const weeklyData: WeeklyData = {
  dates: [
    '2024-01-01',
    '2024-01-02',
    '2024-01-03',
    '2024-01-04',
    '2024-01-05',
    '2024-01-06',
    '2024-01-07',
  ],
  humidity: [65, 68, 62, 70, 65, 67, 63],
  ph: [6.2, 6.0, 6.1, 6.3, 6.2, 6.1, 6.0],
  ec: [1.8, 1.7, 1.9, 1.8, 1.7, 1.8, 1.9],
  co2: [450, 460, 440, 470, 455, 445, 465],
};