export function TextInput({ label, id, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text mb-2">
        {label}
        {props.required && <span className="text-danger ml-1">*</span>}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-2 bg-surfaceAlt border ${
          error ? 'border-danger' : 'border-border'
        } rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}

export function SelectInput({ label, id, options, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text mb-2">
        {label}
        {props.required && <span className="text-danger ml-1">*</span>}
      </label>
      <select
        id={id}
        className={`w-full px-4 py-2 bg-surfaceAlt border ${
          error ? 'border-danger' : 'border-border'
        } rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}

export function TextArea({ label, id, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text mb-2">
        {label}
        {props.required && <span className="text-danger ml-1">*</span>}
      </label>
      <textarea
        id={id}
        className={`w-full px-4 py-2 bg-surfaceAlt border ${
          error ? 'border-danger' : 'border-border'
        } rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent transition-colors resize-none`}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}

export function DateInput({ label, id, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text mb-2">
        {label}
        {props.required && <span className="text-danger ml-1">*</span>}
      </label>
      <input
        id={id}
        type="date"
        className={`w-full px-4 py-2 bg-surfaceAlt border ${
          error ? 'border-danger' : 'border-border'
        } rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}

// Default export as an object with all components
const FormInput = {
  TextInput,
  SelectInput,
  TextArea,
  DateInput
};

export default FormInput;
