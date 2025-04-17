/**
 * Utility functions for generating table headers and form fields
 * These functions help standardize the creation of data tables and forms
 * across different management interfaces (Users, Trainers, Gyms, etc.)
 */

/**
 * Capitalizes the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} The capitalized string
 */
export const capitalizeFirstLetter = (string) => {
  if (!string || typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Predefined headers for different entity types
 * These can be used directly or as a base to modify
 */
export const predefinedHeaders = {
  trainers: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'username', label: 'Nombre', type: 'text' },
    { key: 'email', label: 'Correo Electrónico', type: 'email' }
  ],
  gyms: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'location', label: 'Ubicación', type: 'text' },
    { key: 'telephone', label: 'Teléfono', type: 'text' },
    { key: 'maxCapacity', label: 'Capacidad Máxima', type: 'number' },
    { key: 'currentOccupancy', label: 'Ocupación Actual', type: 'number' }
  ],
  users: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'username', label: 'Nombre', type: 'text' },
    { key: 'email', label: 'Correo Electrónico', type: 'email' }
  ]
};

/**
 * Generates table headers from an array of data objects
 * @param {Array} data - Array of data objects
 * @param {string} entityType - Optional type of entity (e.g., 'trainers', 'gyms')
 * @returns {Array} Array of header objects with key and label properties
 */
export const generateTableHeaders = (data, entityType = null) => {
  if (entityType && predefinedHeaders[entityType]) {
    return predefinedHeaders[entityType];
  }

  if (!data?.length) return [];

  const firstItem = data[0];

  return Object.keys(firstItem)
    .filter(key => typeof firstItem[key] !== 'object' || firstItem[key] === null)
    .map(key => ({
      key,
      label: capitalizeFirstLetter(key)
    }));
};

/**
 * Generates form fields based on data and optional current item
 * @param {Array} data - Array of data objects
 * @param {Object} currentItem - Optional current item for editing (null for new items)
 * @param {string} entityType - Optional type of entity (e.g., 'trainers', 'gyms')
 * @returns {Array} Array of form field configurations
 */
export const generateFormFields = (data, currentItem = null, entityType = null) => {
  if (!data?.length && !entityType) return [];

  let headers;
  if (entityType && predefinedHeaders[entityType]) {
    headers = predefinedHeaders[entityType];
  } else {
    headers = generateTableHeaders(data);
  }

  return generateFormFieldsFromHeaders(headers, currentItem || (data.length > 0 ? data[0] : {}));
};

/**
 * Creates form field configurations from headers and item data
 * @param {Array} headers - Array of header objects
 * @param {Object} itemData - Data object to determine field types and values
 * @returns {Array} Array of form field configurations
 */
export const generateFormFieldsFromHeaders = (headers, itemData) => {
  const fields = headers
    .filter(header => header.key !== 'id')
    .map(header => {
      if (itemData?.id && header.key === 'password') return null;

      const field = {
        name: header.key,
        label: header.label,
        type: header.type,
      };

      return field;
    })
    .filter(Boolean);
  return fields;
};

/**
 * Renders a cell value based on its data type
 * @param {Object} item - The data item containing the cell value
 * @param {Object} column - The column configuration with key property
 * @returns {string} The formatted cell value
 */
export const renderCell = (item, column) => {
  const value = item[column.key];

  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (column.key.includes('.')) {
    const keys = column.key.split('.');
    let nestedValue = item;
    for (const key of keys) {
      if (nestedValue && nestedValue[key] !== undefined) {
        nestedValue = nestedValue[key];
      } else {
        return 'N/A';
      }
    }
    return nestedValue;
  }

  if (value === 0) return 0;

  return value || 'N/A';
};