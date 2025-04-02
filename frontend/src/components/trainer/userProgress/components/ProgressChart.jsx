import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getDifficultyColor, mapDifficultyToNumeric, difficultyLabels } from '../../../../config/constants';
import '../styles/ProgressChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressChart = ({ progressData }) => {
  const chartRefs = {
    Monday: useRef(null),
    Tuesday: useRef(null),
    Wednesday: useRef(null),
    Thursday: useRef(null),
    Friday: useRef(null),
    Saturday: useRef(null),
    Sunday: useRef(null)
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Efecto para manejar el redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      // Forzar actualización en todos los gráficos
      Object.values(chartRefs).forEach(ref => {
        if (ref.current && ref.current.chartInstance) {
          ref.current.chartInstance.resize();
        }
      });
    };

    window.addEventListener('resize', handleResize);

    // Limpieza
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Agrupar datos por día de la semana
  const weekdayData = useMemo(() => {
    if (!progressData || progressData.length === 0) return null;

    // Crear objeto para almacenar datos por día de la semana
    const weekdays = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    // Nombres de los días en español
    const weekdayNames = {
      Monday: 'Lunes',
      Tuesday: 'Martes',
      Wednesday: 'Miércoles',
      Thursday: 'Jueves',
      Friday: 'Viernes',
      Saturday: 'Sábado',
      Sunday: 'Domingo'
    };

    // Función para ajustar el valor según la dificultad
    const adjustValueByDifficulty = (difficulty) => {
      const baseValue = 3; // Valor base (medium)

      switch (difficulty) {
        case 'reallyEasy': return baseValue + 2; // Sube 2 puntos
        case 'easy': return baseValue + 1;       // Sube 1 punto
        case 'medium': return baseValue;         // Se mantiene igual
        case 'hard': return baseValue - 1;       // Baja 1 punto
        case 'reallyHard': return baseValue - 2; // Baja 2 puntos
        default: return baseValue;
      }
    };

    // Agrupar entradas por día de la semana
    progressData.forEach(item => {
      const date = new Date(item.date);
      const weekday = date.toLocaleString('en-US', { weekday: 'long' });

      if (weekdays[weekday]) {
        weekdays[weekday].push({
          ...item,
          formattedDate: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
          adjustedValue: adjustValueByDifficulty(item.howWasIt)
        });
      }
    });

    // Ordenar cada día por fecha
    Object.keys(weekdays).forEach(day => {
      weekdays[day] = weekdays[day].sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    return { weekdays, weekdayNames };
  }, [progressData]);

  // Configurar datos para cada gráfico
  const createChartData = (dayEntries) => {
    if (!dayEntries || dayEntries.length === 0) return null;

    const labels = dayEntries.map(item => item.formattedDate);
    const values = dayEntries.map(item => item.adjustedValue);

    return {
      labels,
      datasets: [
        {
          label: 'Progreso del entrenamiento',
          data: values,
          borderColor: 'rgba(153, 136, 0, 0.8)',
          backgroundColor: 'rgba(153, 136, 0, 0.2)',
          pointBackgroundColor: dayEntries.map(item => getDifficultyColor(item.howWasIt)),
          pointBorderColor: '#fff',
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.2,
        }
      ]
    };
  };

  // Opciones del gráfico
  const getChartOptions = (dayEntries) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 0,
      scales: {
        y: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: function (value) {
              // Personalizar etiquetas del eje Y basadas en los valores ajustados
              switch (value) {
                case 1: return 'Muy difícil';
                case 2: return 'Difícil';
                case 3: return 'Normal';
                case 4: return 'Fácil';
                case 5: return 'Muy fácil';
                default: return '';
              }
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          title: {
            display: true,
            text: 'Progreso',
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 12
            }
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          title: {
            display: true,
            text: 'Fecha',
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 12
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const item = dayEntries[index];
              const value = context.parsed.y;

              let difficultyText;
              switch (value) {
                case 1: difficultyText = 'Muy difícil'; break;
                case 2: difficultyText = 'Difícil'; break;
                case 3: difficultyText = 'Normal'; break;
                case 4: difficultyText = 'Fácil'; break;
                case 5: difficultyText = 'Muy fácil'; break;
                default: difficultyText = 'Desconocido';
              }

              let label = `Progreso: ${difficultyText}`;
              if (item.observations) {
                label += `\nObservaciones: ${item.observations.substring(0, 30)}${item.observations.length > 30 ? '...' : ''}`;
              }

              return label;
            },
            title: function (tooltipItems) {
              const item = tooltipItems[0];
              return dayEntries[item.dataIndex].formattedDate;
            }
          }
        }
      }
    };
  };

  // Si no hay datos
  if (!weekdayData) {
    return <div className="no-chart-data">No hay datos suficientes para mostrar la gráfica</div>;
  }

  const { weekdays, weekdayNames } = weekdayData;

  // Conteo de entradas por día y filtrado de días con datos
  const daysWithData = Object.keys(weekdays).filter(day => weekdays[day].length > 0);

  // Verificar si hay al menos un día con datos
  if (daysWithData.length === 0) {
    return <div className="no-chart-data">No hay datos para ningún día de la semana</div>;
  }

  return (
    <div className="progress-chart-container">
      <div className="weekly-charts">
        {/* Sólo mostrar los días que tienen datos */}
        {daysWithData.map(day => (
          <div key={day} className="day-chart">
            <h4 className="day-title">{weekdayNames[day]}</h4>
            <div className="chart-wrapper day-chart-wrapper">
              <Line
                ref={chartRefs[day]}
                data={createChartData(weekdays[day])}
                options={getChartOptions(weekdays[day])}
                key={`${day}-${windowWidth}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;