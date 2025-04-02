import React from 'react';
import './styles/InputProfileSection.css';
import { useIsMobile } from '../../../../hooks/useWindowSize';

const mobileSize = 768;

const InputProfileSection = ({ label, value, name }) => {
  const isMobile = useIsMobile({ mobileSize });
  return (
    <article className={`profile-atribute ${isMobile ? 'mobile' : ''}`}>
      <strong>{label}:</strong>{' '}
      <input
        className='input user-profile-section-input'
        type="text"
        defaultValue={value}
        name={name}
      />
    </article>
  );
};

export default InputProfileSection;