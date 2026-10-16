const SENSITIVE_FIELD_NAMES = new Set([
  'password',
  'passwordhash',
  'token',
  'authtoken',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'secret',
  'secretkey',
  'clientsecret',
  'apikey',
  'sessiontoken',
]);

export const stripSensitiveFields = (value) => {
  if (Array.isArray(value)) {
    return value.map(stripSensitiveFields);
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([fieldName]) => !SENSITIVE_FIELD_NAMES.has(fieldName.toLowerCase()))
      .map(([fieldName, fieldValue]) => [fieldName, stripSensitiveFields(fieldValue)])
  );
};
