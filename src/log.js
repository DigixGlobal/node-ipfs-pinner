module.exports = (str) => {
  process.stdout.write(`<${new Date().toISOString()}> ${str}\n`);
};
