//rutas para tickets
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// /
router.get('/', ticketController.obtenerTickets);
router.get('/desperfectosPorTitulo', ticketController.desperfectosPorTitulo);
router.get('/desperfectosEnOctubre', ticketController.desperfectosEnOctubre);
router.get('/desperfectosPorOficina', ticketController.desperfectosPorOficina);
router.get('/aiendeMasTickets', ticketController.aiendeMasTickets);
router.get('/sinResolver', ticketController.sinResolver);
router.get('/clientesCercaDeOficinas', ticketController.clientesCercaDeOficinas);
router.get('/clientesEnBA', ticketController.clientesEnBA);
router.get('/cantidadPlanNormalOSuperPack', ticketController.cantidadPlanNormalOSuperPack);
router.get('/promedioPrecioPlan', ticketController.promedioPrecioPlan);
router.get('/incrementoPlanNormal', ticketController.incrementoPlanNormal);
router.get('/incrementoPlanSuperPack', ticketController.incrementoPlanSuperPack);
router.get('/maxPlanNormal', ticketController.maxPlanNormal);
router.get('/minPlanSuperPack', ticketController.minPlanSuperPack);
router.get('/agregarCampoVip', ticketController.agregarCampoVip);
router.get('/renombrarCampoVip', ticketController.renombrarCampoVip);
router.get('/borrarCampoVip', ticketController.borrarCampoVip);
router.get('/crearIndiceCampoNombre', ticketController.crearIndiceCampoNombre);
router.get('/indices', ticketController.indices);
router.get('/borrarIndice', ticketController.borrarIndice);
router.get('/crearIndiceTexto', ticketController.crearIndiceTexto);
router.get('/contienePalabraHd', ticketController.contienePalabraHd);
router.get('/clientesConCanalSpace', ticketController.clientesConCanalSpace);
router.get('/pendientesConVacaciones', ticketController.pendientesConVacaciones);

module.exports = router;