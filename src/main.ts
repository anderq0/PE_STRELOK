import './style.scss'
import {
  Chart,
  ScatterController,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  LineController,
  LineElement
} from 'chart.js';

Chart.register(
  ScatterController,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  LineController,
  LineElement
);

const shooterNameInput = document.getElementById('shooterName') as HTMLInputElement;
const scoresInput = document.getElementById('scores') as HTMLInputElement;
const addShooterButton = document.getElementById('addShooterButton') as HTMLButtonElement;
const canvas = document.getElementById('scatterChart') as HTMLCanvasElement;
const resultsDiv = document.getElementById('results') as HTMLDivElement;

let chart: Chart | null = null;

const shooters: { name: string; scores: number[] }[] = [];

const colors = ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(255, 208, 0, 0.5)', 'rgba(153, 102, 255, 0.5)'];

function calculateStats(scores: number[]): { mean: number; variance: number; stdDev: number } {
  const n = scores.length;
  const mean = scores.reduce((sum, score) => sum + score, 0) / n;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  return { mean, variance, stdDev };
}

function renderChart(): void {
  const datasets = shooters.map((shooter, index) => ({
      label: shooter.name,
      data: shooter.scores.map((score, i) => ({ x: i + 1, y: score })),
      backgroundColor: colors[index % colors.length],
  }));

  if (chart) {
      chart.destroy();
  }

  chart = new Chart(canvas, {
      type: 'scatter',
      data: { datasets },
      options: {
          plugins: {
              title: {
                  display: true,
                  text: 'Разброс выстрелов разных стрелков',
              },
          },
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Выстрел',
                  },
              },
              y: {
                  title: {
                      display: true,
                      text: 'Результат',
                  },
              },
          },
      },
  });
}

function addShooterInfo(name: string, stats: { mean: number; variance: number; stdDev: number }): void {
  const shooterInfo = document.createElement('div');
  shooterInfo.className = 'shooter-info';
  shooterInfo.innerHTML = `
      <strong>${name}</strong><br>
      Среднее: ${stats.mean.toFixed(2)}<br>
      Дисперсия: ${stats.variance.toFixed(2)}<br>
      Стандартное отклонение: ${stats.stdDev.toFixed(2)}
  `;
  resultsDiv.appendChild(shooterInfo);
}


function highlightMostStableShooter(): void {
  if (shooters.length === 0) return;

  let mostStableShooterIndex = 0;
  let minStdDev = Infinity;

  shooters.forEach((shooter, index) => {
      const stats = calculateStats(shooter.scores);
      if (stats.stdDev < minStdDev) {
          minStdDev = stats.stdDev;
          mostStableShooterIndex = index;
      }
  });

  const existingHighlight = document.querySelector('.highlight');
  if (existingHighlight) {
      existingHighlight.classList.remove('highlight');
  }

  const shooterInfoBlocks = document.querySelectorAll('.shooter-info');
  if (shooterInfoBlocks[mostStableShooterIndex]) {
      shooterInfoBlocks[mostStableShooterIndex].classList.add('highlight');
  }
}

addShooterButton.addEventListener('click', () => {
  const name = shooterNameInput.value.trim();
  const input = scoresInput.value.trim();

  if (!name || !input) {
      alert('Введите имя стрелка и результаты.');
      return;
  }

  const scores = input.split(',').map((val) => parseFloat(val.trim()));

  if (scores.some(isNaN)) {
      alert('Некорректный ввод. Убедитесь, что вы ввели числа через запятую.');
      return;
  }

  const stats = calculateStats(scores);

  shooters.push({ name, scores });

  renderChart();
  addShooterInfo(name, stats);

  highlightMostStableShooter();

  shooterNameInput.value = '';
  scoresInput.value = '';
});