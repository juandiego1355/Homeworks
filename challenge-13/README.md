# GIF Finder

GIF Finder es un buscador web sencillo para explorar GIFs. En esta primera versión, la interfaz y el endpoint de búsqueda funcionan con resultados simulados locales: **no se conecta a GIPHY ni a ningún servicio externo**.

## Tecnologías

- HTML5, CSS3 y JavaScript sin frameworks en el frontend.
- Node.js y Express para servir la aplicación y su endpoint.
- dotenv para preparar la configuración privada del servidor.
- Fetch API para que el navegador consulte nuestro propio backend.

## Requisitos

- Node.js 18 o posterior.
- npm.

## Instalación y ejecución

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. El archivo `.env` ya está creado con `GIPHY_API_KEY` vacío. Si necesitas restaurarlo, copia `.env.example` como `.env`; no agregues una clave hasta que configures la integración.
3. Inicia el servidor:

   ```bash
   npm start
   ```

   Para reiniciar automáticamente el servidor al editar archivos con Node.js 18 o posterior:

   ```bash
   npm run dev
   ```

4. Abre <http://localhost:3000>.

El puerto se puede cambiar mediante la variable `PORT` en `.env`.

## Estructura

```text
public/
  index.html   Estructura accesible de la página
  styles.css   Diseño responsive y estilos de estados/resultados
  app.js       Búsquedas, estados de interfaz y Fetch al backend
server.js      Servidor Express y endpoint /api/gifs/search
.env           Configuración local; no se debe subir al repositorio
.env.example   Plantilla de variables de entorno
.gitignore     Excluye dependencias y secretos locales
package.json   Dependencias y comandos npm
```

## Búsquedas de demostración

El frontend envía `GET /api/gifs/search?q=...` usando Fetch. El servidor valida el término y devuelve seis tarjetas de demostración con vistas decorativas animadas. Se puede buscar con el botón, con Enter o usando las sugerencias. La interfaz incluye estados inicial, de carga y error.

La función `searchDemoGifs` en `server.js` está identificada como simulación y es el punto que se reemplazará por la petición real. Las vistas actuales son ilustraciones de demostración, no archivos GIF descargados.

## Qué falta para conectar GIPHY

La integración real queda pendiente de forma intencional:

1. Crear una aplicación y obtener una API Key válida en GIPHY.
2. Guardar la clave únicamente en `GIPHY_API_KEY` dentro del `.env` local. El archivo está excluido por `.gitignore`; nunca publiques esa clave.
3. Sustituir `searchDemoGifs` en `server.js` por una llamada `fetch` desde el backend al endpoint de búsqueda de GIPHY. Leer la clave desde `process.env.GIPHY_API_KEY` y manejar la respuesta, errores y límites del servicio.
4. Transformar los datos de GIPHY al formato que ya consume el frontend (`id`, `title`, `emoji`, `colors`, `label`) o ajustar el renderizado para mostrar sus URLs reales de GIF.
5. Confirmar que el frontend siga consultando solo `/api/gifs/search`; no poner la clave en `public/app.js`, HTML ni en ninguna respuesta de la API.

No se ha inventado ni utilizado una API Key y no se realiza ninguna petición a GIPHY.
