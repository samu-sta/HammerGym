import { Link } from 'react-router-dom';
import './styles/ActionLink.css';

const ActionLink = ({
  to,
  icon,
  text,
  className = '',
  onClick
}) => {
  return (
    <Link
      to={to}
      className={`${className} action-link`}
      onClick={onClick}
    >
      {icon}
      {text}
    </Link>
  );
};

export default ActionLink;