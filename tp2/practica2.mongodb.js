use("finanzas");

// 1. Realizar una consulta que devuelva la siguiente información: Región y cantidad
// total de productos vendidos a clientes de esa Región.

db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: "$cliente.region",
      total: {
        $sum: "$item.cantidad",
      },
    },
  },
  {
    $project: {
      region: "$_id",  
      _id: 0,
      total: 1,
    },
  },
]);

// Resultado:
// [
// {
//     "total": 14,
//     "region": "NOA"
//   },
//   {
//     "total": 180,
//     "region": "CENTRO"
//   },
//   {
//     "total": 282,
//     "region": "CABA"
//   },
//   {
//     "total": 420,
//     "region": "NEA"
//   }
// ]

// 2. Basado en la consulta del punto 1, mostrar sólo la región que tenga el menor ingreso.
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: "$cliente.region",
      total: {
        $sum: "$item.cantidad",
      },
    },
  },
  {
    $project: {
      region: "$_id",  
      _id: 0,
      total: 1,
    },
  },
  { $sort: { total: 1 } },
  { $limit: 1 },
]);

// Resultado:
// [
//   {
//     "total": 14,
//     "region": "NOA"
//   }
// ]

// 3. Basado en la consulta del punto 1, mostrar sólo las regiones que tengan una
// cantidad de productos vendidos superior a 300.
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: "$cliente.region",
      total: {
        $sum: "$item.cantidad",
      },
    },
  },
  {
    $project: {
      region: "$_id",  
      _id: 0,
      total: 1,
    },
  },
  { $match: { total: { $gt: 300 } } },
]);

// Resultado:
// [
//   {
//     "total": 420,
//     "region": "NEA"
//   }
// ]

// 4. Se requiere obtener un reporte que contenga la siguiente información, nro. cuit,
// apellido y nombre y región y cantidad de facturas, ordenado por apellido.
db.facturas.aggregate([
  {
    $group: {
      _id: {
        cuit: "$cliente.cuit",
        apellido: "$cliente.apellido",
        nombre: "$cliente.nombre",
        region: "$cliente.region",
      },
      cantidadFacturas: { $sum: 1 },
    },
  },
  {
    $project: {
      cuit: "$_id.cuit",
      apellido: "$_id.apellido",
      nombre: "$_id.nombre",
      region: "$_id.region",
      cantidadFacturas: 1,
      _id: 0,
    },
  },
  { $sort: { apellido: 1 } }
]);

// Resultado:
// [
//   {
//     "cantidadFacturas": 14,
//     "cuit": 2729887543,
//     "apellido": "Lavagno",
//     "nombre": "Soledad",
//     "region": "NOA"
//   },
//   {
//     "cantidadFacturas": 15,
//     "cuit": 2740488484,
//     "apellido": "Malinez",
//     "nombre": "Marina",
//     "region": "CENTRO"
//   },
//   {
//     "cantidadFacturas": 42,
//     "cuit": 2029889382,
//     "apellido": "Manoni",
//     "nombre": "Juan Manuel",
//     "region": "NEA"
//   },
//   {
//     "cantidadFacturas": 29,
//     "cuit": 2038373771,
//     "apellido": "Zavasi",
//     "nombre": "Martin",
//     "region": "CABA"
//   }
// ]

// 5. Basados en la consulta del punto 4 informar sólo los clientes con número de
// CUIT mayor a 27000000000.
db.facturas.aggregate([
  {
    $group: {
      _id: {
        cuit: "$cliente.cuit",
        apellido: "$cliente.apellido",
        nombre: "$cliente.nombre",
        region: "$cliente.region",
      },
      cantidadFacturas: { $sum: 1 },
    },
  },
  {
    $project: {
      cuit: "$_id.cuit",
      apellido: "$_id.apellido",
      nombre: "$_id.nombre",
      region: "$_id.region",
      cantidadFacturas: 1,
      _id: 0,
    },
  },
  { $sort: { apellido: 1 } },
  { $match: { cuit: { $gt: 2700000000 } } }
]);

// Resultado:
// [
//   {
//     "cantidadFacturas": 14,
//     "cuit": 2729887543,
//     "apellido": "Lavagno",
//     "nombre": "Soledad",
//     "region": "NOA"
//   },
//   {
//     "cantidadFacturas": 15,
//     "cuit": 2740488484,
//     "apellido": "Malinez",
//     "nombre": "Marina",
//     "region": "CENTRO"
//   }
// ]

// 6. Basados en la consulta del punto 5 informar solamente la cantidad de clientes
// que cumplen con esta condición.
db.facturas.aggregate([
  {
    $group: {
      _id: {
        cuit: "$cliente.cuit",
        apellido: "$cliente.apellido",
        nombre: "$cliente.nombre",
        region: "$cliente.region",
      },
      cantidadFacturas: { $sum: 1 },
    },
  },
  {
    $project: {
      cuit: "$_id.cuit",
      apellido: "$_id.apellido",
      nombre: "$_id.nombre",
      region: "$_id.region",
      cantidadFacturas: 1,
      _id: 0,
    },
  },
  { $sort: { apellido: 1 } },
  { $match: { cuit: { $gt: 2700000000 } } },
  { $count: "cantidadClientes" }
]);

// Resultado:
// [
//   {
//     "cantidadClientes": 2
//   }
// ]

// 7. Se requiere realizar una consulta que devuelva la siguiente información: producto
// y cantidad de facturas en las que lo compraron, ordenado por cantidad de facturas
// descendente.
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: "$item.producto",
      cantidadFacturas: { $sum: 1 },
    },
  },
  {
    $project: {
      producto: "$_id",
      cantidadFacturas: 1,
      _id: 0,
    },
  },
  { $sort: { cantidadFacturas: -1 } }
])

// Resultado:
// [
//   {
//     "cantidadFacturas": 43,
//     "producto": "TALADRO 12mm"
//   },
//   {
//     "cantidadFacturas": 29,
//     "producto": "CORREA 10mm"
//   },
//   {
//     "cantidadFacturas": 28,
//     "producto": "TUERCA 2mm"
//   },
//   {
//     "cantidadFacturas": 28,
//     "producto": "TUERCA 5mm"
//   },
//   {
//     "cantidadFacturas": 28,
//     "producto": "SET HERRAMIENTAS"
//   },
//   {
//     "cantidadFacturas": 15,
//     "producto": " CORREA 12mm"
//   }
// ]

// 8. Obtener la cantidad total comprada así como también los ingresos totales para cada
// producto.
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: "$item.producto",
      cantidadProducto: { $sum: "$item.cantidad" },
      ingresosProducto: { $sum: { $multiply: ["$item.cantidad", "$item.precio"] } },
    },
  },
  {
    $project: {
      producto: "$_id",
      cantidadProducto: 1,
      ingresosProducto: 1,
      _id: 0,
    },
  }
])

// Resultado:
// [
//   {
//     "cantidadProducto": 28,
//     "ingresosProducto": 19600,
//     "producto": "SET HERRAMIENTAS"
//   },
//   {
//     "cantidadProducto": 198,
//     "ingresosProducto": 26532,
//     "producto": "CORREA 10mm"
//   },
//   {
//     "cantidadProducto": 112,
//     "ingresosProducto": 6720,
//     "producto": "TUERCA 2mm"
//   },
//   {
//     "cantidadProducto": 165,
//     "ingresosProducto": 2970,
//     "producto": " CORREA 12mm"
//   },
//   {
//     "cantidadProducto": 43,
//     "ingresosProducto": 21070,
//     "producto": "TALADRO 12mm"
//   },
//   {
//     "cantidadProducto": 350,
//     "ingresosProducto": 31500,
//     "producto": "TUERCA 5mm"
//   }
// ]

// 9. Idem el punto anterior, ordenar por ingresos en forma ascendente, saltear el 1ro
// y mostrar 2do y 3ro.
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: "$item.producto",
      cantidadProducto: { $sum: "$item.cantidad" },
      ingresosProducto: { $sum: { $multiply: ["$item.cantidad", "$item.precio"] } },
    },
  },
  {
    $project: {
      producto: "$_id",
      cantidadProducto: 1,
      ingresosProducto: 1,
      _id: 0,
    },
  },
  { $sort: { ingresosProducto: 1 } },
  { $skip: 1 },
  { $limit: 2 }
])

// Resultado:
// [
//   {
//     "cantidadProducto": 112,
//     "ingresosProducto": 6720,
//     "producto": "TUERCA 2mm"
//   },
//   {
//     "cantidadProducto": 28,
//     "ingresosProducto": 19600,
//     "producto": "SET HERRAMIENTAS"
//   }
// ]

// 10. Obtener todos productos junto con un array de las personas que lo compraron. En
// este array deberá haber solo strings con el nombre completo de la persona. Los
// documentos entregados como resultado deberán tener la siguiente forma:
// {producto: “<nombre>”, personas:[“…”, …]}
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: "$item.producto",
      personas: { $addToSet: { $concat: ["$cliente.nombre", " ", "$cliente.apellido"] } },
      },
  },
  {
    $project: {
      producto: "$_id",
      personas: 1,
      _id: 0,
    },
  }
])

// Resultado:
// [
//   {
//     "personas": [
//       "Marina Malinez"
//     ],
//     "producto": " CORREA 12mm"
//   },
//   {
//     "personas": [
//       "Juan Manuel Manoni",
//       "Marina Malinez"
//     ],
//     "producto": "TALADRO 12mm"
//   },
//   {
//     "personas": [
//       "Martin Zavasi"
//     ],
//     "producto": "CORREA 10mm"
//   },
//   {
//     "personas": [
//       "Martin Zavasi",
//       "Juan Manuel Manoni"
//     ],
//     "producto": "TUERCA 2mm"
//   },
//   {
//     "personas": [
//       "Juan Manuel Manoni"
//     ],
//     "producto": "TUERCA 5mm"
//   },
//   {
//     "personas": [
//       "Soledad Lavagno",
//       "Juan Manuel Manoni"
//     ],
//     "producto": "SET HERRAMIENTAS"
//   }
// ]

// 11. Obtener los productos ordenados en forma descendente por la cantidad de
// diferentes personas que los compraron.
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: "$item.producto",
      personas: { $addToSet: { $concat: ["$cliente.nombre", " ", "$cliente.apellido"] } },
      },
  },
  {
    $project: {
      producto: "$_id",
      personas: 1,
      cantidadPersonas: { $size : "$personas" },
      _id: 0,
    },
  },
  { $sort: { cantidadPersonas: -1 } }
])

// Resultado:
// [
//   {
//     "personas": [
//       "Marina Malinez",
//       "Juan Manuel Manoni"
//     ],
//     "producto": "TALADRO 12mm",
//     "cantidadPersonas": 2
//   },
//   {
//     "personas": [
//       "Martin Zavasi",
//       "Juan Manuel Manoni"
//     ],
//     "producto": "TUERCA 2mm",
//     "cantidadPersonas": 2
//   },
//   {
//     "personas": [
//       "Soledad Lavagno",
//       "Juan Manuel Manoni"
//     ],
//     "producto": "SET HERRAMIENTAS",
//     "cantidadPersonas": 2
//   },
//   {
//     "personas": [
//       "Marina Malinez"
//     ],
//     "producto": " CORREA 12mm",
//     "cantidadPersonas": 1
//   },
//   {
//     "personas": [
//       "Martin Zavasi"
//     ],
//     "producto": "CORREA 10mm",
//     "cantidadPersonas": 1
//   },
//   {
//     "personas": [
//       "Juan Manuel Manoni"
//     ],
//     "producto": "TUERCA 5mm",
//     "cantidadPersonas": 1
//   }
// ]

// 12. Obtener el total gastado por persona y mostrar solo los que gastaron más de
// 3100000. Los documentos devueltos deben tener el nombre completo del cliente y el
// total gastado:
// {cliente:”<nombreCompleto>”,total:<num>}
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: {
        cuit: "$cliente.cuit",
        apellido: "$cliente.apellido",
        nombre: "$cliente.nombre",
      },
      totalGastado: { $sum: { $multiply: ["$item.cantidad", "$item.precio"] } },
    },
  },
  {
    $project: {
      cliente: { $concat: ["$_id.nombre", " ", "$_id.apellido"] },
      totalGastado: 1,
      _id: 0,
    },
  },
  { $match: { totalGastado: { $gt: 31000 } } }
]);

// Resultado: para total gastado mayor a 31000
// [
//   {
//     "totalGastado": 56700,
//     "cliente": "Juan Manuel Manoni"
//   },
//   {
//     "totalGastado": 31572,
//     "cliente": "Martin Zavasi"
//   }
// ]

// 13. Obtener el promedio de gasto por factura por cada región.
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: {
        nroFactura : "$nroFactura",
        region : "$cliente.region",
      },
      gasto: { $sum: { $multiply: ["$item.cantidad", "$item.precio"] } },
    },
  },
  {
    $project: {
      nroFactura: "$_id.nroFactura",
      region: "$_id.region",
      gasto: 1,
      _id: 0,
    },
  },
  {
    $group: {
      _id: "$region",
      promedioGasto: { $avg: "$gasto" },
    },
  },
  {
    $project: {
      region: "$_id",
      promedioGasto: 1,
      _id: 0,
    },
  }
]);

// Resultado:
// [
//   {
//     "promedioGasto": 700,
//     "region": "NOA"
//   },
//   {
//     "promedioGasto": 1350,
//     "region": "NEA"
//   },
//   {
//     "promedioGasto": 1088.6896551724137,
//     "region": "CABA"
//   },
//   {
//     "promedioGasto": 688,
//     "region": "CENTRO"
//   }
// ]

// 14. Obtener la factura en la que se haya gastado más. En caso de que sean varias
// obtener la que tenga el número de factura menor.
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: "$nroFactura",
      gasto: { $sum: { $multiply: ["$item.cantidad", "$item.precio"] } },
    },
  },
  {
    $project: {
      nroFactura: "$_id",
      gasto: 1,
      _id: 0,
    },
  },
  { $sort: { gasto: -1, nroFactura: 1 } },
  { $limit: 1 }
]);

// Resultado:
// [
//   {
//     "gasto": 1968,
//     "nroFactura": 1002
//   }
// ]

// 15. Obtener a los clientes indicando cuánto fue lo que más gastó en una única factura.
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: {
        nroFactura : "$nroFactura",
        nombre: "$cliente.nombre",
        apellido: "$cliente.apellido",
        cuit: "$cliente.cuit",
      },
      gasto: { $sum: { $multiply: ["$item.cantidad", "$item.precio"] } },
    },
  },
  {
    $project: {
      nroFactura: "$_id.nroFactura",
      nombre: "$_id.nombre",
      apellido: "$_id.apellido",
      cuit: "$_id.cuit",
      gasto: 1,
      _id: 0,
    },
  },
  {
    $group: {
      _id: {
        nombre: "$nombre",
        apellido: "$apellido",
        cuit: "$cuit",
      },
      maxGasto: { $max: "$gasto" },
    },
  },
  {
    $project: {
      nombre: "$_id.nombre",
      apellido: "$_id.apellido",
      cuit: "$_id.cuit",
      maxGasto: 1,
      _id: 0,
    }
  }
]);

// Resultado:
// [
//   {
//     "maxGasto": 688,
//     "nombre": "Marina",
//     "apellido": "Malinez",
//     "cuit": 2740488484
//   },
//   {
//     "maxGasto": 1960,
//     "nombre": "Juan Manuel",
//     "apellido": "Manoni",
//     "cuit": 2029889382
//   },
//   {
//     "maxGasto": 1968,
//     "nombre": "Martin",
//     "apellido": "Zavasi",
//     "cuit": 2038373771
//   },
//   {
//     "maxGasto": 700,
//     "nombre": "Soledad",
//     "apellido": "Lavagno",
//     "cuit": 2729887543
//   }
// ]

// 17. Obtener la información de los clientes que hayan gastado 1000 en una orden junto
// con el número de orden.
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: {
        nroFactura : "$nroFactura",
        nombre: "$cliente.nombre",
        apellido: "$cliente.apellido",
        cuit: "$cliente.cuit",
        region: "$cliente.region",
      },
      gasto: { $sum: { $multiply: ["$item.cantidad", "$item.precio"] } },
    },
  },
  {
    $project: {
      nroFactura: "$_id.nroFactura",
      nombre: "$_id.nombre",
      apellido: "$_id.apellido",
      cuit: "$_id.cuit",
      region: "$_id.region",
      gasto: 1,
      _id: 0,
    },
  },
  { $match: { gasto: { $gt: 1000 }}},
  {
    $group: {
      _id: {
        nombre: "$nombre",
        apellido: "$apellido",
        cuit: "$cuit",
        region: "$region",
      },
      facturas: { $push: "$nroFactura" },
    },
  },
  {
    $project: {
      nombre: "$_id.nombre",
      apellido: "$_id.apellido",
      cuit: "$_id.cuit",
      region: "$_id.region",
      facturas: 1,
      _id: 0,
    }
  }
]);

// Resultado: gasto mayor a 1000
// [
//   {
//     "facturas": [
//       1044,
//       1030,
//       1037,
//       1023,
//       1058,
//       1079,
//       1016,
//       1086,
//       1072,
//       1065,
//       1002,
//       1051,
//       1009,
//       1093
//     ],
//     "nombre": "Martin",
//     "apellido": "Zavasi",
//     "cuit": 2038373771,
//     "region": "CABA"
//   },
//   {
//     "facturas": [
//       1068,
//       1010,
//       1061,
//       1024,
//       1038,
//       1075,
//       1040,
//       1017,
//       1019,
//       1082,
//       1087,
//       1026,
//       1096,
//       1073,
//       1054,
//       1059,
//       1033,
//       1052,
//       1012,
//       1080,
//       1047,
//       1089,
//       1031,
//       1005,
//       1094,
//       1045,
//       1066,
//       1003
//     ],
//     "nombre": "Juan Manuel",
//     "apellido": "Manoni",
//     "cuit": 2029889382,
//     "region": "NEA"
//   }
// ]

// 18. En base a la localidad de los clientes, obtener el total facturado por localidad.
db.facturas.aggregate([
  { $unwind: "$item" },
  {
    $group: {
      _id: "$cliente.region",
      totalFacturado: { $sum: { $multiply: ["$item.cantidad", "$item.precio"] } },
    },
  },
  {
    $project: {
      region: "$_id",
      totalFacturado: 1,
      _id: 0
    },
  }
]);

// Resultado:
// [
//   {
//     "totalFacturado": 31572,
//     "region": "CABA"
//   },
//   {
//     "totalFacturado": 10320,
//     "region": "CENTRO"
//   },
//   {
//     "totalFacturado": 9800,
//     "region": "NOA"
//   },
//   {
//     "totalFacturado": 56700,
//     "region": "NEA"
//   }
// ]