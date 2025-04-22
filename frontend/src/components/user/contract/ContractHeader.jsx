import React from 'react';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import './styles/ContractHeader.css';

const ContractHeader = ({ onGoBack }) => {
  return (
    <header className="contract-header">
      <button className="contract-btn-back" onClick={onGoBack}>
        <FaLongArrowAltLeft /> Volver
      </button>
      <h1 className="contract-title">Contrato y Membresía</h1>
    </header>
  );
};

export default ContractHeader;