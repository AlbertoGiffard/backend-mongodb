const ticket = require('../models/ticket');
const empleado = require('../models/empleado');

exports.obtenerTickets = async (req, res) => {
    try {
        const tickets = await ticket.find();
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//total de desperfectos por titulo
exports.desperfectosPorTitulo = async (req, res) => {
    try {
        const tickets = await ticket.aggregate([
            {$match:{tipo: "desperfecto"}},
            {$group:{
              _id: "$problema", 
              cantidad: {$sum : 1}
             }}
          ]);
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//total de desperfectos en el mes de Octubre
exports.desperfectosEnOctubre = async (req, res) => {
    try {
        const tickets = await ticket.aggregate([
            {$match:{
              $and: [
                {fecha: {$gt: "2022-09-30"}},
                {fecha: {$lt: "2022-11-01"}},
                {tipo: "desperfecto"}
              ]
            }},
            {$group:{
              _id: "$problema", 
              cantidad: {$sum : 1}
             }}
          ]);
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//total de desperfectos por oficina
exports.desperfectosPorOficina = async (req, res) => {
    try {
        const tickets = await ticket.aggregate([
            {$match:{tipo: "desperfecto"}},
            {$group:{
              _id: "$area.tipo", 
              cantidad: {$sum : 1}
             }}
          ]);
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//que persona atiende mas tickets
exports.aiendeMasTickets = async (req, res) => {
    try {
        const tickets = await ticket.aggregate([
            {$group:{
              _id: "$empleado.dni", 
              nombre: { $first: '$empleado.nombre'},
              apellido: { $first: '$empleado.apellido'},
              cantidad: {$sum : 1}
            }},
            {$sort: {cantidad: -1}},
            {$limit:1}
          ]);
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//tickets sin resolver
exports.sinResolver = async (req, res) => {
    try {
        const tickets = await ticket.find({resuelto: {$ne: true}},{id: 1, fecha: 1, tipo: 1, problema: 1});
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Ver clientes cerca de oficinas
exports.clientesCercaDeOficinas = async (req, res) => {
    try {
        await tickets.createIndex({"area.posicion_gps": "2dsphere" });
        await tickets.createIndex({"cliente.localidad.posicion_gps": "2dsphere" });
        const tickets = await ticket.find({"cliente.localidad.posicion_gps":{
            $near: {
              $geometry:{
                type : "Point",
                coordinates : [
                  -58.39922936512508, 
                  -34.615292049964
                  ]
              }, $maxDistance: 5
            }
          }}).count();
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//cuantos clientes viven en Buenos Aires
exports.clientesEnBA = async (req, res) => {
    try {
        const tickets = await ticket.find({"cliente.localidad.posicion_gps":{
            $geoWithin: {
              $geometry:{
                type : "Polygon",
                coordinates : [[
                      [
                        -58.46470129018587,
                        -34.53773055895173
                      ],
                      [
                        -58.4978896522604,
                        -34.55139894333022
                      ],
                      [
                        -58.5282332975856,
                        -34.617366115536775
                      ],
                      [
                        -58.525862700294454,
                        -34.653450227097416
                      ],
                      [
                        -58.4857996060764,
                        -34.68386570814527
                      ],
                      [
                        -58.46114539424916,
                        -34.63472745835372
                      ],
                      [
                        -58.38386392256169,
                        -34.620487523640435
                      ],
                      [
                        -58.3833898031036,
                        -34.5836083947123
                      ],
                      [
                        -58.46470129018587,
                        -34.53773055895173
                      ]
                ]]
              }}
          }}).count();
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//cantidad de clientes que tengan el plan normal o super pack 
exports.cantidadPlanNormalOSuperPack = async (req, res) => {
    try {
        const tickets = await ticket.find({
            $or: [
              {"cliente.plan.nombre": "super pack"},
              {"cliente.plan.nombre": "normal"}
            ]
          },{id: 1, cliente: 1});
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//promedio de precio que paga un cliente por plan
exports.promedioPrecioPlan = async (req, res) => {
    try {
        const tickets = await ticket.aggregate(
            [{
              $group: {
                _id: "$cliente.plan.nombre",
                promedio_costo: { $avg: "$cliente.plan.costo" }
              }
            }]
          );
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//incrementar los costos del plan normal en $500
exports.incrementoPlanNormal = async (req, res) => {
    try {
        const tickets = await ticket.updateMany({"cliente.plan.nombre": "normal"}, {$inc:{"cliente.plan.costo": 500}});
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//incrementar los costos del plan super pack el doble
exports.incrementoPlanSuperPack = async (req, res) => {
    try {
        const tickets = await ticket.updateMany({"cliente.plan.nombre": "super pack"}, {$mul:{"cliente.plan.costo": 2}});
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//el maximo que se puede pagar por el plan normal es de $5000
exports.maxPlanNormal = async (req, res) => {
    try {
        const tickets = await ticket.updateMany({"cliente.plan.nombre": "normal"},{$max:{"cliente.plan.costo": 5000}});
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//el minimo que se puede pagar por el plan super pack es de $5000
exports.minPlanSuperPack = async (req, res) => {
    try {
        const tickets = await ticket.updateMany({"cliente.plan.nombre": "super pack"},{$min:{"cliente.plan.costo": 5000}});
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//agregar a los que que tengan el plan super pack full que son clientes vip
exports.agregarCampoVip = async (req, res) => {
    try {
        const tickets = await ticket.updateMany({"cliente.plan.nombre": "super pack full"},{$set:{vip: true } });
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//renombrar el campo vip por cliente_vip
exports.renombrarCampoVip = async (req, res) => {
    try {
        const tickets = await ticket.updateMany({"cliente.plan.nombre": "super pack full"},{$rename:{"vip": "cliente_vip" } });
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Borrar el campo cliente_vip
exports.borrarCampoVip = async (req, res) => {
    try {
        const tickets = await ticket.updateMany({"cliente.plan.nombre": "super pack full"},{$unset:{cliente_vip: "" } });
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//crear un indice en el campo plan nombre
exports.crearIndiceCampoNombre = async (req, res) => {
    try {
        const tickets = await ticket.createIndex({"cliente.plan.nombre": 1}, {name: "nombre_plan"});
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//listar indices
exports.indices = async (req, res) => {
    try {
        const tickets = await ticket.getIndexes();
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//borrar el indice de nombre_plan
exports.borrarIndice = async (req, res) => {
    try {
        const tickets = await ticket.dropIndex( "nombre_plan" );
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//crear un indice de texto en el campo problema
exports.crearIndiceTexto = async (req, res) => {
    try {
        const tickets = await ticket.createIndex( { "problema": "text"}, {name: "problema_text"} );
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//buscar cuantos tickets tienen la palabra hd en el campo problema
exports.contienePalabraHd = async (req, res) => {
    try {
        const tickets = await ticket.find({$text: { $search: "\"hd\"" }}).count();
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//buscar los clientes a los cuales se le agrego Space en las derivaciones
exports.clientesConCanalSpace = async (req, res) => {
    try {
        const tickets = await ticket.aggregate([
            {$unwind: "$derivaciones" },
            {$match: {"derivaciones.canales_agregados": "Space"}},
            {$project: {"cliente.nombre": 1, "cliente.apellido": 1}}
          ]);
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//tickets por resolver de los que tienen mas de 4 dias de vacaciones
exports.pendientesConVacaciones = async (req, res) => {
    try {
        const empleados = await empleados.aggregate([
            {$lookup:{
              from: "tickets", 
              pipeline: [{
                $match: {
                  resuelto: false
                }
              }],
              as: "ticket", 
              localField: "dni", 
              foreignField:"empleado.dni"
            }},
            {$match: 
              {dias_de_vacaciones: {$gt: 4}}
            },
            {$project: {
              nombre: 1, 
              apellido: 1,
              dias_de_vacaciones: 1,
              cantidad: {
                $size: "$ticket"
              }
            }},
            {$sort: {dias_de_vacaciones: -1}},
          ]);
        res.json(empleados);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

////////////////////////////////////////

//encontrar si en las coordenadas dadas hay una oficina o un servicio tecnico
exports.queHay = async (req, res) => {
    try {
        await tickets.createIndex({"area.posicion_gps": "2dsphere" });
        const tickets = await ticket.findOne({"area.posicion_gps":{ 
            $geoIntersects:{ 
              $geometry:{ 
                type: "Point",
                coordinates:[
                  -58.36241494736605,
                  -34.66362091804544
                ]
              }
            }
          }},{"area.tipo": 1});
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//buscar los clientes que tengan el atributo campo_vip
exports.tienenAtributoCampoVip = async (req, res) => {
    try {
        const tickets = await ticket.find({campo_vip: {$exists: true}}).count();
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//obtener el tipo de valores del array de canales agregados
exports.tipoCanalesAgregados = async (req, res) => {
    try {
        const tickets = await ticket.aggregate([{
            $project: {
               tipo : { $type: "$derivaciones.canales_agregados" }
            }
        }])
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//encontrar los clientes que solo se le hayan agregado los canales de Cartoon Network y Space
exports.agregadosCanalesEspecificos = async (req, res) => {
    try {
        const tickets = await ticket.find({"derivaciones.canales_agregados": {$all: [["Cartoon Network", "Space"]]}});
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//clientes que paguen mas o igual a 3000 y menos que 6000
exports.paguenMenosOMasQueEstosValores = async (req, res) => {
    try {
        const tickets = await ticket.find({"plan.costo": {$elemMatch: {$gte: 3000, $lt: 6000}}});
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}















