export const uniqueId = (length = 16) => {
  return `id${(Math.ceil(Math.random() * 10000000000000) + Date.now()).toString(length)}`;
};
// crypto.randomUUID()
