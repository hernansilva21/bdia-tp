-- Selecciona todos los registros de la tabla Albums.
SELECT * FROM album;
-- Selecciona todos los géneros únicos de la tabla Genres.
SELECT DISTINCT * FROM genre;
-- Cuenta el número de pistas por género.
SELECT genre.name, COUNT(*) 
FROM track 
INNER JOIN genre ON genre.genre_id = track.genre_id 
GROUP BY genre.name;
-- Encuentra la longitud total (en milisegundos) de todas las pistas para cada álbum.
SELECT album.title, SUM(milliseconds) AS "Longitud total" 
FROM track 
INNER JOIN album ON album.album_id = track.album_id 
GROUP BY track.album_id, album.title;
-- Lista los 10 álbumes con más pistas.
SELECT album.title, COUNT(track.track_id) AS "Total Pistas" 
FROM track 
INNER JOIN album ON album.album_id = track.album_id 
GROUP BY track.album_id, album.title 
ORDER BY COUNT(track.track_id) DESC 
LIMIT 10;
-- Encuentra la longitud promedio de la pista para cada género.
SELECT genre.name, AVG(milliseconds) AS "Longitud promedio" 
FROM track 
INNER JOIN genre ON genre.genre_id = track.genre_id 
GROUP BY track.genre_id, genre.name;
-- Para cada cliente, encuentra la cantidad total que han gastado.
SELECT customer_id, SUM(total) AS "Total gastado" 
FROM invoice 
GROUP BY customer_id;
-- Para cada país, encuentra la cantidad total gastada por los clientes.
SELECT billing_country, SUM(total) AS "Total gastado" 
FROM invoice 
GROUP BY billing_country;
-- Clasifica a los clientes en cada país por la cantidad total que han gastado.
SELECT billing_country, 
       SUM(total) AS "Total gastado", 
       CASE WHEN SUM(total) > 200 THEN 'A' 
            WHEN SUM(total) BETWEEN 100 AND 200 
            THEN 'B' ELSE 'C'
       END AS "Clasificacion" 
FROM invoice 
GROUP BY billing_country;
-- Para cada artista, encuentra el álbum con más pistas y clasifica a los artistas por este número.
WITH track_count AS (
     SELECT artist.name, album.title, COUNT(track.track_id) AS cantidad FROM track 
     INNER JOIN album ON album.album_id = track.album_id
     INNER JOIN artist ON artist.artist_id = album.artist_id
     GROUP BY artist.name, album.album_id)
SELECT name, title, MAX(cantidad) OVER (PARTITION BY name, title)
FROM track_count



-- Selecciona todas las pistas que tienen la palabra "love" en su título.

-- Selecciona a todos los clientes cuyo primer nombre comienza con 'A'.

-- Calcula el porcentaje del total de la factura que representa cada factura.

-- Calcula el porcentaje de pistas que representa cada género.

-- Para cada cliente, compara su gasto total con el del cliente que gastó más.

-- Para cada factura, calcula la diferencia en el gasto total entre ella y la factura anterior.

-- Para cada factura, calcula la diferencia en el gasto total entre ella y la próxima factura.

-- Encuentra al artista con el mayor número de pistas para cada género.

-- Compara el total de la última factura de cada cliente con el total de su factura anterior.

-- Encuentra cuántas pistas de más de 3 minutos tiene cada álbum.
