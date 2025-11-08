import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaLongArrowAltLeft } from "react-icons/fa"
import { DashboardHeader } from "@/components/dss/dashboard-header"
import { BentoGrid } from "@/components/dss/bento-grid"
import { SharedCharts } from "@/components/dss/shared-charts"
import { getDatosDecisionUsuario, formatearDatosParaComponentes } from "@/services/DecisionService"
import ActionButton from "@/components/common/ActionButton"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import "./styles/DecisionPage.css"

function TrainingDecisionPage() {
  const { email } = useParams()
  const navigate = useNavigate()
  const [selectedExercises, setSelectedExercises] = useState([])
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Llamar al servicio que simula la API
        const response = await getDatosDecisionUsuario(email)
        
        if (response.success) {
          // Formatear los datos para que sean compatibles con los componentes
          const datosFormateados = formatearDatosParaComponentes(response.data)
          setUserData(datosFormateados)
        } else {
          setError("No se pudieron cargar los datos del usuario")
        }
      } catch (err) {
        console.error("Error al cargar datos de decisión:", err)
        setError("Error al cargar los datos. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [email])

  // Reset selected exercises when user data changes
  useEffect(() => {
    setSelectedExercises([])
  }, [userData])

  const handleGoBack = () => {
    navigate('/entrenador')
  }

  if (loading) {
    return (
      <div className="decision-page">
        <LoadingSpinner message="Cargando datos de decisión..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="decision-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <ActionButton
            icon={<FaLongArrowAltLeft />}
            text="Volver a Clientes"
            onClick={handleGoBack}
            className="back-button"
          />
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="decision-page">
        <div className="error-container">
          <h2>No se encontraron datos</h2>
          <p>No hay información disponible para este usuario.</p>
          <ActionButton
            icon={<FaLongArrowAltLeft />}
            text="Volver a Clientes"
            onClick={handleGoBack}
            className="back-button"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="decision-page">
      <header className="decision-page-header">
        <ActionButton
          icon={<FaLongArrowAltLeft />}
          text="Volver a Clientes"
          onClick={handleGoBack}
          className="back-button"
        />
        <p className="decision-page-subtitle">
          Cliente: <strong>{userData.name}</strong> ({email})
        </p>
      </header>

      <main className="dss-container">
        <div className="dss-content">
          <BentoGrid
            onSelectionChange={setSelectedExercises}
            userData={userData}
          />
          <SharedCharts
            selectedExerciseIds={selectedExercises}
            userData={userData}
          />
        </div>
      </main>
    </div>
  )
}

export default TrainingDecisionPage
