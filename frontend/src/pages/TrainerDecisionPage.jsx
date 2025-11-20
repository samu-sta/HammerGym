import React, { useEffect, useState } from 'react';
import { getTrainersStatistics } from '../services/TrainerStatisticsService';
import { useTrainerScores } from '../hooks/useTrainerScores';
import TrainerComparisonTable from '../components/TrainerDecision/TrainerComparisonTable';
import TRCEBreakdown from '../components/TrainerDecision/TRCEBreakdown';
import ISACBreakdown from '../components/TrainerDecision/ISACBreakdown';
import REDDBreakdown from '../components/TrainerDecision/REDDBreakdown';

const TrainerDecisionPage = () => {
  const [trainersData, setTrainersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrainers, setSelectedTrainers] = useState([]);

  // Calcular scores de entrenadores
  const trainersWithScores = useTrainerScores(trainersData);

  // Manejar selección múltiple de entrenadores (máximo 3)
  const toggleTrainerSelection = (trainer) => {
    setSelectedTrainers(prev => {
      const isSelected = prev.some(t => t.id === trainer.id);
      if (isSelected) {
        return prev.filter(t => t.id !== trainer.id);
      } else {
        // Limitar a 3 entrenadores
        if (prev.length >= 3) {
          alert('Máximo 3 entrenadores para comparar');
          return prev;
        }
        return [...prev, trainer];
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTrainersData();
  }, []);

  const fetchTrainersData = async () => {
    try {
      setLoading(true);
      const response = await getTrainersStatistics();
      
      if (response.success) {
        setTrainersData(response.trainers);
      } else {
        setError(response.message || 'Error al cargar los datos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f] p-4">
        <section className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando datos de entrenadores...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f] p-4">
        <section className="text-center max-w-md bg-[#1f1f1f] border border-[#333] rounded-lg p-8">
          <h2 className="text-red-500 text-xl font-bold mb-4">Error</h2>
          <p className="text-gray-400 mb-6">❌ {error}</p>
          <button
            onClick={fetchTrainersData}
            className="px-6 py-2 bg-[#1f1f1f] text-white border border-[#333] rounded-lg hover:bg-[#2a2a2a] hover:border-[#444] transition-all"
          >
            Reintentar
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8">
      <header className="mb-8 max-w-[1400px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Análisis de Rendimiento de Entrenadores
        </h1>
      </header>

      {/* Tabla Comparativa */}
      <section id="trainer-comparison" className="mb-12">
        <TrainerComparisonTable 
          trainers={trainersWithScores}
          selectedTrainers={selectedTrainers}
          onToggleTrainer={toggleTrainerSelection}
        />
      </section>

      {/* Gráficos Comparativos */}
      {selectedTrainers.length > 0 && (
        <section id="trainer-comparison-details" className="space-y-10 max-w-[1400px] mx-auto">
          <header>
            <h2 className="text-2xl font-semibold text-white">
              Comparación Detallada
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {selectedTrainers.length} entrenador{selectedTrainers.length > 1 ? 'es' : ''} seleccionado{selectedTrainers.length > 1 ? 's' : ''}
            </p>
          </header>

          {/* TRCE Comparison */}
          <TRCEBreakdown trainers={selectedTrainers} />

          {/* ISAC Comparison */}
          <ISACBreakdown trainers={selectedTrainers} />

          {/* REDD Comparison */}
          <REDDBreakdown trainers={selectedTrainers} allTrainers={trainersWithScores} />
        </section>
      )}

    </main>
  );
};

export default TrainerDecisionPage;
