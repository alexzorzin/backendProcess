const express = require("express");
const { Router } = express;
const router = new Router();
const info = {
  argumentosDeEntrada: process.argv,
  sistemaOperativo: process.platform,
  versionNode: process.version,
  memoriaReservada: process.memoryUsage().heapTotal,
  memoriaLibre: process.memoryUsage().heapUsed,
  pathEjecucion: process.execPath,
  processID: process.pid,
  carpetaProyecto: process.cwd(),
};
router.get("/", (req, res) => {
  res.send(info);
});

module.exports = router;
