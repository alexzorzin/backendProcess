const express = require("express");
const { Router } = express;
const router = new Router();
const { fork } = require("child_process");

router.get("/", (req, res) => {
  let cant = 100000000;
  if (req.query.cant) {
    cant = req.query.cant;
  }
  const random = fork("./src/helpers/randomize.js");
  random.send(cant);
  random.on("message", (veces) => {
    res.send(
      `Numeros aleatorios y cuantos se repitieron\n<pre>${JSON.stringify(
        veces,
        null,
        2
      )}</pre>`
    );
  });
});

module.exports = router;
