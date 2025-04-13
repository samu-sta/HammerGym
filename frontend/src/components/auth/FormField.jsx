import './styles/FormField.css';

const FormField = ({ id, label, type = 'text', errors, name = id }) => (
  <fieldset className="form-group">
    <label htmlFor={id}>{label}:</label>
    <input
      type={type}
      id={id}
      name={name}
      className='input'
    />
    {errors && errors[id] ? (
      <p className="error-message">{errors[id]._errors.join(', ')}</p>
    ) : (<p className="error-message" />)}
  </fieldset>
);

export default FormField;