// 1.​ Obtener los nodos de todas las personas de la red.
MATCH (p:Persona) RETURN p;

// 2.​ Obtener el nombre y fecha de nacimiento de la persona de apellido Domínguez.
MATCH (p:Persona {apellido: 'Dominguez'}) RETURN p.nombre, p.fechanac;

// Resultado:
// p.nombre     p.fechanac
// "Mariana"   "31/10/1990"

// 3.​ Obtener la lista de empresas en las que trabajó Domínguez.
MATCH (p:Persona {apellido: 'Dominguez'})-[:TRABAJO]->(e:Empresa) RETURN e.nombre;

// Resultado:
// e.nombre
// "Lan"
// "Claro"
// "Banco Nación"

// 4.​ Obtener la lista de personas que estudiaron carreras que no son de nivel
// “Universitario” y los nombres de las carreras.
MATCH (p:Persona)-[:ESTUDIO]->(c:Carrera)
WHERE c.nivel <> 'Universitario'
RETURN p.nombre, p.apellido, c.nombre;

// Resultado:
// p.nombre	    p.apellido  c.nombre
// "Mario"      "López"     "Comercialización"
// "Jorge"      "Lupis"     "MBA"
// "Mario"      "López"     "MBA"
// "Eduardo"    "García"    "Tec. En Programación"

// 5.​ Obtener los nodos etiquetados como Conocimiento.
MATCH (c:Conocimiento) RETURN c;

// 6.​ Obtener los nodos de todas las personas con nombre terminado en a.
MATCH (p:Persona)
WHERE p.nombre ENDS WITH 'a'
RETURN p;

// Resultado:
// {
//   "identity": 1,
//   "labels": [
//     "Persona"
//   ],
//   "properties": {
//     "fechanac": "10/12/1978",
//     "apellido": "Díaz",
//     "nombre": "Analía",
//     "email": "adiaz@hotmail.com",
//     "pais": "Argentina"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:1"
// }
// {
//   "identity": 2,
//   "labels": [
//     "Persona"
//   ],
//   "properties": {
//     "fechanac": "31/10/1990",
//     "apellido": "Dominguez",
//     "nombre": "Mariana",
//     "email": "mariana@yahoo.com",
//     "pais": "Chile"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:2"
// }
// {
//   "identity": 5,
//   "labels": [
//     "Persona"
//   ],
//   "properties": {
//     "fechanac": "07/04/1972",
//     "apellido": "Ferreira",
//     "nombre": "Natalia",
//     "email": "nf@hotmail.com",
//     "pais": "Argentina"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:5"
// }
// {
//   "identity": 7,
//   "labels": [
//     "Persona"
//   ],
//   "properties": {
//     "fechanac": "09/11/1974",
//     "apellido": "González",
//     "nombre": "Bibiana",
//     "email": "bibiana@live.com.ar",
//     "pais": "España"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:7"
// }
// {
//   "identity": 9,
//   "labels": [
//     "Persona"
//   ],
//   "properties": {
//     "fechanac": "28/02/1968",
//     "apellido": "Mendez",
//     "nombre": "Verónica",
//     "email": "veromendi@yahoo.com.ar",
//     "pais": "Argentina"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:9"
// }

// 7.​ Crear un nodo para la persona Analía Martinelli si no existe.
MERGE (p:Persona {nombre: 'Analia', apellido: 'Martinelli'})
RETURN p;

// Resultado:
// {
//   "identity": 58,
//   "labels": [
//     "Persona"
//   ],
//   "properties": {
//     "apellido": "Martinelli",
//     "nombre": "Analia"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:58"
// }

// 8.​ Asociar un conocimiento "Cálculo" a Analía Martinelli si no lo posee.
MATCH (p:Persona {nombre: 'Analia', apellido: 'Martinelli'})
MERGE (c:Conocimiento {nombre: 'Cálculo'})
MERGE (p)-[a:POSEE]->(c)
RETURN p, a, c;

// Resultado:
// p	a	c
// {
//   "identity": 58,
//   "labels": [
//     "Persona"
//   ],
//   "properties": {
//     "apellido": "Martinelli",
//     "nombre": "Analia"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:58"
// }
// {
//   "identity": 80,
//   "start": 58,
//   "end": 59,
//   "type": "POSEE",
//   "properties": {},
//   "elementId": "5:96184ac4-2088-4d70-8819-497669669f64:80",
//   "startNodeElementId": "4:96184ac4-2088-4d70-8819-497669669f64:58",
//   "endNodeElementId": "4:96184ac4-2088-4d70-8819-497669669f64:59"
// }
// {
//   "identity": 59,
//   "labels": [
//     "Conocimiento"
//   ],
//   "properties": {
//     "nombre": "Cálculo"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:59"
// }



// 9.​ Verificar si se creó duplicado del conocimiento "Cálculo".
MATCH (c:Conocimiento)
WHERE c.nombre = 'Cálculo'
RETURN c, count(*) AS cantidad;

// Resultado:
// c	                                cantidad
// {                                    1
//   "identity": 59,
//   "labels": [
//     "Conocimiento"
//   ],
//   "properties": {
//     "nombre": "Cálculo"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:59"
// }

// 10.​Crear una relación ESTUDIO para Analía Martinelli con la carrera "Lic en Sist de Inf",
// estado "En curso".
MATCH (p:Persona {nombre: 'Analia', apellido: 'Martinelli'})
MATCH (c:Carrera {nombre: 'Lic en Sist de Inf'})
MERGE (p)-[a:ESTUDIO {estado: 'En curso'}]->(c)
RETURN p, a, c;

// Resultado:
// p	a	c
// {
//   "identity": 58,
//   "labels": [
//     "Persona"
//   ],
//   "properties": {
//     "apellido": "Martinelli",
//     "nombre": "Analia"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:58"
// }
// {
//   "identity": 81,
//   "start": 58,
//   "end": 43,
//   "type": "ESTUDIO",
//   "properties": {
//     "estado": "En curso"
//   },
//   "elementId": "5:96184ac4-2088-4d70-8819-497669669f64:81",
//   "startNodeElementId": "4:96184ac4-2088-4d70-8819-497669669f64:58",
//   "endNodeElementId": "4:96184ac4-2088-4d70-8819-497669669f64:43"
// }
// {
//   "identity": 43,
//   "labels": [
//     "Carrera"
//   ],
//   "properties": {
//     "titulo": "Licenciado en Sistemas de Información",
//     "nombre": "Lic en Sist de Inf",
//     "nivel": "Universitario"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:43"
// }

// 11.​Crear un nodo para Verónica Mendez.
MERGE (p:Persona {nombre: 'Verónica', apellido: 'Mendez'})
RETURN p;

// Resultado:
// p
// {
//   "identity": 9,
//   "labels": [
//     "Persona"
//   ],
//   "properties": {
//     "fechanac": "28/02/1968",
//     "apellido": "Mendez",
//     "nombre": "Verónica",
//     "email": "veromendi@yahoo.com.ar",
//     "pais": "Argentina"
//   },
//   "elementId": "4:96184ac4-2088-4d70-8819-497669669f64:9"
// }

// 12.​Crear una relación CONOCE_A entre Analía y Verónica, asegurando que solo se
// cree una vez.


// 13.​Actualizar o crear el nodo de Analía Martinelli con fecha de nacimiento 30/06/1968.


// 14.​Agregarle la etiqueta "Empleado" y el país Argentina a Analía.


// 15.​Eliminar la fecha de nacimiento y la etiqueta Persona de Analía.


// 16.​Eliminar el nodo de Analía y todas sus relaciones.


// 17.​Contar los nodos en total.


// 18.​Contar los tipos de relaciones.


// 19.​Listar todos los nodos y sus relaciones.


// 20.​Obtener los nombres y rubros de las empresas registradas, reemplazando el rubro
// "Telefonía" por IT.


// 21.​Determinar qué etiquetas tienen los nodos que son destino de la relación ESTUDIO.


// 22.​Verificar las etiquetas de la carrera en la relación ESTUDIO.


// 23.​Usar UNWIND para transformar una colección en filas individuales.


// 24.​Contar la cantidad de personas que estudiaron una carrera en cualquier estado.


// 25.​Identificar si puede llegarse directa o indirectamente desde Mario López hasta Jorge
// Lupis mediante la relación CONOCE_A.


// 26.​Obtener el camino más corto entre Gustavo y Mario en la relación CONOCE_A.


// 27.​Listar los caminos de relaciones de un camino determinado.


// 28.​Verificar si una persona trabajó o trabajó en empresas que otro determinado
// profesional trabajo, para sugerir contactos.


// 29.​Obtener los conocimientos más compartidos en cada carrera.


// 30.​Ranking de los primeros 2 conocimientos de la carrera "Ing en Sistemas de
// Información".
