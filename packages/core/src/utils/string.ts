/**
 * Utility function to check if a string is null, undefined, or empty.
 *
 * @param {string | null | undefined} value - The string to check.
 * @returns {boolean} - Returns true if the string is null, undefined, or empty, otherwise false.
 */
export const isNullOrEmpty = (value: string | null | undefined): value is null | undefined => {
  return value === null || value === undefined || value.trim() === '';
};

/**
 * Replace placeholders in a string with the provided arguments.
 *
 * @param {string} template The string template with placeholders.
 * @param {...args: string[]} The values to
 * replace the placeholders with.
 * @returns {string} The formatted string with placeholders replaced by the provided values.
 */
export const format = (template: string, ...args: string[]) => {
  for (let i = 0; i < args.length; i++) {
    // biome-ignore lint/style/noParameterAssign: no need to create a new variable.
    template = template.replaceAll(`{${i}}`, args[i]);
  }
  return template;
};
