export const serializeForm = container => {
  const inputs = container.querySelectorAll('input, select, textarea');
  const fields = {};

  inputs.forEach(input => {
    fields[input.name] = input.value.trim();
  });

  return fields;
};
