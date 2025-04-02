import './styles/ActionButton.css';
const ActionButton = ({
  icon,
  text,
  onClick,
  className = '',
  disabled = false
}) => {
  return (
    <button
      className={`${className} action-button`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {text}
    </button>
  );
};

export default ActionButton;