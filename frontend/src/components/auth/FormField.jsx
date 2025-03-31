import './styles/FormField.css';

const FormField = ({ id, label, type = 'text', errors }) => (
  <fieldset className="form-group">
    <label htmlFor={id}>{label}:</label>
    <input
      type={type}
      id={id}
      name={id}
      className='input'
    />
    {errors && errors[id] ? (
      <p className="error-message">{errors[id]._errors.join(', ')}</p>
    ) : (<p className="error-message" />)}
  </fieldset>
);

export default FormField;