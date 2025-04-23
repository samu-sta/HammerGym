import React from 'react';
import GymMachine from './GymMachine';
import './styles/MachinesList.css';

const MachinesList = ({ machines }) => {
  if (!machines || machines.length === 0) {
    return <p className="no-machines">No hay máquinas disponibles en este gimnasio.</p>;
  }

  return (
    <section className="machines-section">
      <h3>Máquinas Disponibles</h3>
      <ul className="machines-list">
        {machines.map(machine => (
          <GymMachine key={machine.id} machine={machine} />
        ))}
      </ul>
    </section>
  );
};

export default MachinesList;