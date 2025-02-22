import React from 'react';
import './styles/InputProfileSection.css';


const InputProfileSection = ({ label, value, onChange }) => {
  return (
    <p className='profile-atribute-p'>
      <strong>{label}:</strong>{' '}
      <input 
        className='input user-profile-section-input' 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </p>
  );
};

export default InputProfileSection;