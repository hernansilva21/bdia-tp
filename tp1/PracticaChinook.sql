----------------------------------------------------------------------------------------
-- Practica Chinook
-- Alumno: Hernan Matias Silva
-- Fecha 24-03-2025
----------------------------------------------------------------------------------------

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
       NTILE(3) OVER (ORDER BY SUM(total) DESC) AS "Clasificacion"
FROM invoice 
GROUP BY billing_country;

-- Para cada artista, encuentra el álbum con más pistas y clasifica a los artistas por este número.
WITH track_count AS (
     SELECT 
          artist.name as artist_name,
          album.title as album_title,
          COUNT(track.track_id) as track_count,
          RANK() OVER (PARTITION BY artist.name ORDER BY COUNT(track.track_id) DESC) as rank
     FROM track 
     INNER JOIN album ON album.album_id = track.album_id
     INNER JOIN artist ON artist.artist_id = album.artist_id
     GROUP BY artist.name, album.title
)
SELECT 
     artist_name,
     album_title,
     track_count,
     DENSE_RANK() OVER (ORDER BY track_count DESC) as artist_rank
FROM track_count
WHERE rank = 1
ORDER BY track_count DESC;

-- Selecciona todas las pistas que tienen la palabra "love" en su título.
SELECT * FROM track WHERE name LIKE '% love %';

-- Selecciona a todos los clientes cuyo primer nombre comienza con 'A'.
SELECT * FROM customer WHERE first_name LIKE 'A%';

-- Calcula el porcentaje del total de la factura que representa cada factura.
SELECT invoice_id, total, total / SUM(total) OVER () AS "Porcentaje total"
FROM invoice;

-- Calcula el porcentaje de pistas que representa cada género.
SELECT genre.name, COUNT(*) AS "Total pistas", COUNT(*) / SUM(COUNT(*)) OVER () AS "Porcentaje total"
FROM track
INNER JOIN genre ON genre.genre_id = track.genre_id
GROUP BY genre.name;

-- Para cada cliente, compara su gasto total con el del cliente que gastó más.
SELECT customer_id, SUM(total) AS "Total gastado",
       MAX(SUM(total)) OVER () AS "Maximo gastado"
FROM invoice
GROUP BY customer_id;

-- Para cada factura, calcula la diferencia en el gasto total entre ella y la factura anterior.
SELECT invoice_id, total, 
       LAG(total) OVER (ORDER BY invoice_id) AS "Total anterior",
       total - LAG(total) OVER (ORDER BY invoice_id) AS "Diferencia"
FROM invoice;

-- Para cada factura, calcula la diferencia en el gasto total entre ella y la próxima factura.
SELECT invoice_id, total, 
       LEAD(total) OVER (ORDER BY invoice_id) AS "Total siguiente",
       LEAD(total) OVER (ORDER BY invoice_id) - total AS "Diferencia"
FROM invoice;

-- Encuentra al artista con el mayor número de pistas para cada género.
WITH 
     artist_genre AS (
          SELECT artist.name AS artista, genre.name AS genero, 
               COUNT(*) AS "Total pistas"
          FROM track
          INNER JOIN genre ON genre.genre_id = track.genre_id
          INNER JOIN album ON album.album_id = track.album_id
          INNER JOIN artist ON artist.artist_id = album.artist_id
          GROUP BY artist.name, genre.name) 
SELECT genero, artista, "Total pistas"
FROM (
     SELECT genero, artista, "Total pistas",
          RANK() OVER (PARTITION BY genero ORDER BY "Total pistas" DESC) AS rank
     FROM artist_genre
) AS artist_genre_rank
WHERE rank = 1;

-- Compara el total de la última factura de cada cliente con el total de su factura anterior.
WITH 
     factura AS (
          SELECT invoice.customer_id, first_name, last_name, 
               company, invoice_id, invoice_date, total,
               LAG(total) OVER (PARTITION BY invoice.customer_id ORDER BY invoice_date ASC, invoice_id ASC) AS "Total anterior",
               total - LAG(total) OVER (PARTITION BY invoice.customer_id ORDER BY invoice_date ASC, invoice_id ASC) AS "Diferencia"          
          FROM invoice
          INNER JOIN customer ON customer.customer_id = invoice.customer_id)
SELECT customer_id, first_name, last_name, company, invoice_id, 
     invoice_date, total, "Total anterior", "Diferencia"
FROM factura
WHERE invoice_id IN (
     SELECT MAX(invoice_id) FROM factura GROUP BY customer_id);

-- Encuentra cuántas pistas de más de 3 minutos tiene cada álbum.
SELECT track.album_id, title, 
     COUNT(*) AS pistas_mas_de_3_minutos
FROM track
INNER JOIN album ON album.album_id = track.album_id
WHERE milliseconds > 180000
GROUP BY track.album_id, title;
