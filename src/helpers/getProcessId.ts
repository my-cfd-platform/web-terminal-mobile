export const getProcessId = () => {
  // TODO: regex please
  return `${new Date()
    .toISOString()
    .replace('-', '')
    .replace(':', '')
    .replace('Z', '')}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};
