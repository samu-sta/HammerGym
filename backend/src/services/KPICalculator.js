/**
 * Servicio para calcular los KPIs de los entrenadores
 * TRCE: Tasa de Retención de Clientes y Engagement
 * ISAC: Índice de Satisfacción y Asistencia a Clases
 * REDD: Rendimiento Económico y Desempeño
 */

/**
 * Calcula TRCE (Tasa de Retención de Clientes y Engagement)
 * TRCE = (Retención × 0.7) + (Captación × 0.3)
 * - Retención: % de clientes que NO se volvieron inactivos
 * - Captación: % de nuevos clientes captados respecto al total
 * Usa ÚNICAMENTE los datos reales de contratos (clientContracts)
 */
const calculateTRCE = (trainer, allTrainers) => {
  const { clientContracts } = trainer;
  
  if (!clientContracts || clientContracts.length === 0) return 0;

  // COMPONENTE 1: RETENCIÓN (70%)
  // Calcular cuántos clientes se retienen (siguen activos) vs los que se perdieron
  const totalContratos = clientContracts.length;
  const contratosActivos = clientContracts.filter(c => !c.endDate || c.endDate === null).length;
  const contratosInactivos = clientContracts.filter(c => c.endDate !== null && c.endDate !== undefined).length;
  
  // Tasa de retención: % de contratos que siguen activos
  const tasaRetencion = totalContratos > 0 ? (contratosActivos / totalContratos) * 100 : 0;

  // COMPONENTE 2: CAPTACIÓN (30%)
  // Contar total de contratos de este trainer
  const totalContratosTrainer = clientContracts.length;
  
  // Contar total de contratos de TODOS los trainers
  let totalContratosGlobal = 0;
  allTrainers.forEach(t => {
    if (t.clientContracts && t.clientContracts.length > 0) {
      totalContratosGlobal += t.clientContracts.length;
    }
  });

  // Tasa de captación: % de clientes captados respecto al total
  const tasaCaptacion = totalContratosGlobal > 0 
    ? (totalContratosTrainer / totalContratosGlobal) * 100 
    : 0;

  // TRCE combinado: 70% retención + 30% captación
  const trce = (tasaRetencion * 0.9) + (tasaCaptacion * 0.1);
  
  // Convertir de escala 0-100 a 0-10
  const trceScale10 = trce / 10;
  return Math.round(trceScale10 * 100) / 100;
};

/**
 * Calcula ISAC (Índice de Satisfacción y Asistencia a Clases)
 * ISAC = (Asistencia × 0.5 + Satisfacción × 0.5)
 * - Asistencia = (Asistencias Reales / Asistencias Esperadas) × 100
 * - Satisfacción = (Promedio de ratings / 5) × 100
 * Promedio de los últimos 3 meses
 */
const calculateISAC = (trainer) => {
  const { averageRating, averageAttendance, averageMaxCapacity } = trainer;

  // Satisfacción: convertir rating (1-5) a porcentaje (0-100)
  const satisfaccion = averageRating ? (averageRating / 5) * 100 : 0;

  // Asistencia: porcentaje de asistencia respecto a capacidad
  const asistencia = averageMaxCapacity > 0 
    ? (averageAttendance / averageMaxCapacity) * 100 
    : 0;

  // ISAC: promedio ponderado 50-50
  const isac = (asistencia * 0.5) + (satisfaccion * 0.5);

  // Convertir de escala 0-100 a 0-10
  const isacScale10 = isac / 10;
  return Math.round(isacScale10 * 100) / 100;
};

/**
 * Calcula REDD (Rendimiento Económico y Desempeño)
 * REDD = min(100, [(((IG - CE) / CE) × 0.5 + (CA / CPG) × 0.5) × 100 × 2])
 * - IG: Ingresos generados
 * - CE: Costos del entrenador
 * - CA: Clientes activos del entrenador
 * - CPG: Total de clientes de TODOS los entrenadores
 * Promedio de los últimos 3 meses
 */
const calculateREDD = (trainer, allTrainers) => {
  const { monthlyEconomy } = trainer;

  if (!monthlyEconomy || monthlyEconomy.length === 0) return 0;

  // Usar los últimos 3 meses
  const recentMonths = monthlyEconomy.slice(-3);
  let totalREDD = 0;

  recentMonths.forEach((month, index) => {
    const { income, costs, activeClients } = month;

    const ig = income;
    const ce = costs;
    const ca = activeClients;

    // Calcular CPG: total de clientes activos de todos los entrenadores en ese mismo período
    let cpg = 0;
    allTrainers.forEach(t => {
      if (t.monthlyEconomy && t.monthlyEconomy.length > 0) {
        // Obtener el mismo mes relativo (últimos 3 meses)
        const monthIndex = t.monthlyEconomy.length - (recentMonths.length - index);
        if (monthIndex >= 0 && monthIndex < t.monthlyEconomy.length) {
          cpg += t.monthlyEconomy[monthIndex].activeClients || 0;
        }
      }
    });

    // Rentabilidad: ((IG - CE) / CE)
    const rentabilidad = ce > 0 ? ((ig - ce) / ce) : 0;

    // Cartera relativa: (CA / CPG)
    const carteraRelativa = cpg > 0 ? (ca / cpg) : 0;

    // REDD base = (rentabilidad × 0.5 + carteraRelativa × 0.5) × 100
    let reddBase = (rentabilidad * 0.5 + carteraRelativa * 0.5) * 100;

    // Multiplicar por 2 para mejor escala visual
    let redd = reddBase * 2;

    // Limitar a máximo 100
    redd = Math.min(100, redd);

    totalREDD += redd;
  });

  const avgREDD = totalREDD / recentMonths.length;
  
  // Convertir de escala 0-100 a 0-10
  const reddScale10 = avgREDD / 10;
  return Math.round(reddScale10 * 100) / 100;
};

/**
 * Calcula el Score Global ponderado
 * Score Global = TRCE × 0.30 + ISAC × 0.45 + REDD × 0.25
 * Retorna en escala 0-10
 */
const calculateGlobalScore = (trce, isac, redd) => {
  const KPI_WEIGHTS = {
    TRCE: 0.30,
    ISAC: 0.45,
    REDD: 0.25
  };

  const globalScore = 
    trce * KPI_WEIGHTS.TRCE +
    isac * KPI_WEIGHTS.ISAC +
    redd * KPI_WEIGHTS.REDD;

  return Math.round(globalScore * 100) / 100;
};

/**
 * Calcula todos los KPIs para un entrenador
 */
const calculateAllKPIs = (trainer, allTrainers) => {
  const trce = calculateTRCE(trainer, allTrainers);
  const isac = calculateISAC(trainer);
  const redd = calculateREDD(trainer, allTrainers);
  const globalScore = calculateGlobalScore(trce, isac, redd);

  return {
    trce,
    isac,
    redd,
    globalScore
  };
};

export {
  calculateTRCE,
  calculateISAC,
  calculateREDD,
  calculateGlobalScore,
  calculateAllKPIs
};
