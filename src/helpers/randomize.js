const randomize = (cant) => {
  let arrayNum = [];
  for (let i = 0; i < cant; i++) {
    let num = Math.floor(Math.random() * 1000) + 1;
    arrayNum.push(num);
  }
  let veces = {};
  arrayNum.forEach((num) => {
    veces[num] = (veces[num] || 0) + 1;
  });
  return veces;
};

process.on("message", (message) => process.send(randomize(message)));

module.exports = randomize;
