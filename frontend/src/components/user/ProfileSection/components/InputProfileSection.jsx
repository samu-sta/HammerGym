import React from 'react';
import './styles/InputProfileSection.css';
import { useIsMobile } from '../../../../hooks/useWindowSize';

const mobileSize = 768;

const InputProfileSection = ({ label, value }) => {
  const isMobile = useIsMobile({ mobileSize });
  return (
    <article className={`profile-atribute ${isMobile ? 'mobile' : ''}`}>
      <strong>{label}:</strong>{' '}
      <input
        className='input user-profile-section-input'
        type="text"
        defaultValue={value}
      />
    </article>
  );
};

export default InputProfileSection;