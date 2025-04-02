import './styles/LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <article className="loading-container">
      <figure className="spinner"></figure>
      <p>{message}</p>
    </article>
  );
};

export default LoadingSpinner;