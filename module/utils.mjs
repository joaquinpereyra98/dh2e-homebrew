/**
 * Converts a string into camelCase format.
 *
 * @param {string} str - The input string to convert.
 * @returns {string} The camelCase version of the input string.
 */
export function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, chr => chr.toLowerCase());
}

/**
 * Generates a unique key by appending a number if the base key already exists in a given list.
 *
 * @param {string} baseKey - The initial key to check for uniqueness.
 * @param {string[]} keys - The list of existing keys to check against.
 * @returns {string} A unique key not present in the keys array.
 */
export function generateKey(baseKey, keys) {
  let finalKey = baseKey;
  let i = 1;

  while (keys.includes(finalKey)) {
    finalKey = `${baseKey}${i++}`;
  }

  return finalKey;
}
