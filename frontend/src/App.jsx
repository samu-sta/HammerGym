import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { useState, useRef } from 'react'
import { useIsMobile } from './hooks/useWindowSize.jsx';
import { DEFAULT_MOBILE_WIDTH as mobileSize } from './config/constants.js';
import Home from './pages/Home.jsx'
import Footer from './components/app/Footer.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegisterPage.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminPage from './pages/AdminPage.jsx';
import UserPage from './pages/UserPage.jsx';
import ProtectedLayout from './components/common/ProtectedLayout.jsx';
import Header from './components/app/Header.jsx';
import { AccountProvider } from './context/AccountContext.jsx';
import TrainerPage from './pages/TrainerPage.jsx';
import CreateTraining from './components/trainer/createTraining/CreateTraining.jsx';
import UserProgress from './components/trainer/userProgress/UserProgress.jsx';
import UsersManagement from './pages/UsersManagement.jsx';
import TrainersManagement from './pages/TrainersManagement.jsx';
import GymsManagement from './pages/GymsManagement.jsx';
import MachineModelsManagement from './pages/MachineModelsManagement.jsx';
import MachinesManagement from './pages/MachinesManagement.jsx';
import MembershipsManagement from './pages/MembershipsManagement.jsx';
import MembershipFeaturesManagement from './pages/MembershipFeaturesManagement.jsx';
import ContractPage from './pages/ContractPage.jsx';
import ContractsManagement from './pages/ContractsManagement.jsx';
import Gimnasios from './pages/Gimnasios.jsx';
import ExercisesManagement from './pages/ExercisesManagement.jsx';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile({ mobileSize });
  const accessSectionRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [shouldShowAccessButton, setShouldShowAccessButton] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToAccessSection = () => {
    accessSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      setIsScrolling(true);
    }, 600);

    setTimeout(() => {
      setIsScrolling(false);
    }, 1300);
  };

  return (
    <AccountProvider>
      <BrowserRouter>
        <main className='main-app' onClick={() => isMenuOpen && setIsMenuOpen(false)}>
          <Header
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            isMobile={isMobile}
            shouldShowAccessButton={shouldShowAccessButton}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  isMobile={isMobile}
                  accessSectionRef={accessSectionRef}
                  scrollToAccessSection={scrollToAccessSection}
                  isScrolling={isScrolling}
                  setShouldShowAccessButton={setShouldShowAccessButton} />}
            />
            <Route
              path="/login"
              element={<LoginPage setShouldShowAccessButton={setShouldShowAccessButton} />}
            />
            <Route
              path="/register"
              element={<RegistrationPage setShouldShowAccessButton={setShouldShowAccessButton} />}
            />
            <Route
              path="/gimnasios"
              element={<Gimnasios />}
            />

            {/* Rutas protegidas */}
            <Route element={<ProtectedLayout allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/users" element={<UsersManagement />} />
              <Route path="/admin/trainers" element={<TrainersManagement />} />
              <Route path="/admin/memberships" element={<MembershipsManagement />} />
              <Route path="/admin/membership-features" element={<MembershipFeaturesManagement />} />
              <Route path="/admin/contracts" element={<ContractsManagement />} />
              <Route path="/admin/gyms" element={<GymsManagement />} />
              <Route path="/admin/machine-models" element={<MachineModelsManagement />} />
              <Route path="/admin/machines" element={<MachinesManagement />} />
              <Route path="/admin/exercises" element={<ExercisesManagement />} />
              <Route path="/admin/*" element={<AdminPage />} />
            </Route>

            <Route element={<ProtectedLayout allowedRoles={['user']} />}>
              <Route path="/usuario" element={<UserPage />} />
              <Route path="/usuario/contratos" element={<ContractPage />} />
              <Route path="/usuario/*" element={<UserPage />} />
            </Route>

            <Route element={<ProtectedLayout allowedRoles={['trainer']} />}>
              <Route path="/entrenador" element={<TrainerPage />} />
              <Route path="/entrenador/crear-plan" element={<CreateTraining />} />
              <Route path="/entrenador/:email/progress" element={<UserProgress />} />
              <Route path="/entrenador/training/:userEmail" element={<CreateTraining />} />
              <Route path="/entrenador/management" element={<TrainersManagement />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </main>
      </BrowserRouter>
    </AccountProvider>
  )
}

export default App