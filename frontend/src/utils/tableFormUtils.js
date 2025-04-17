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
 * Generates table headers from an array of data objects
 * @param {Array} data - Array of data objects
 * @returns {Array} Array of header objects with key and label properties
 */
export const generateTableHeaders = (data) => {
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
 * @returns {Array} Array of form field configurations
 */
export const generateFormFields = (data, currentItem = null) => {
  if (!data?.length) return [];

  const headers = generateTableHeaders(data);
  return generateFormFieldsFromHeaders(headers, currentItem || data[0]);
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
      // Skip password for editing
      if (itemData?.id && header.key === 'password') return null;

      const field = {
        name: header.key,
        label: header.label
      };

      // Set field type based on key or data type
      if (header.key === 'email') {
        field.type = 'email';
      } else if (header.key === 'password') {
        field.type = 'password';
      } else if (typeof itemData[header.key] === 'boolean') {
        field.type = 'checkbox';
      } else if (typeof itemData[header.key] === 'number') {
        console.log('itemData[header.key]', itemData[header.key]);
        field.type = 'number';
      } else if (header.key.toLowerCase().includes('date')) {
        field.type = 'date';
      } else if (header.key === 'status') {
        field.type = 'select';
        field.options = [
          { value: 'active', label: 'Activo' },
          { value: 'inactive', label: 'Inactivo' }
        ];
      } else {
        field.type = 'text';
      }

      return field;
    })
    .filter(Boolean); // Remove null items
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