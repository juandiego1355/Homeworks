# Spotify Edu

Aplicación universitaria inspirada en Spotify Desktop para explorar canciones de ejemplo y demostrar Trie, Max Heap y grafos no dirigidos. Está construida con Angular 21 standalone, TypeScript y SCSS; las estructuras se implementan manualmente y no usan librerías de estructuras de datos.

## Ejecutar desde VS Code

1. Abre esta carpeta en VS Code.
2. En la terminal integrada ejecuta `npm install` (solo es necesario la primera vez).
3. Ejecuta `npm start`.
4. Abre `http://localhost:4200/` en el navegador.

Validaciones: `npm run build` compila la aplicación y `npm test -- --watch=false` ejecuta las pruebas unitarias.

## Estructuras para la sustentación

- **Trie** — `src/app/structures/trie.ts`: `insert`, `search`, `startsWith` y `getSuggestions`. Normaliza mayúsculas y tildes; el buscador y el laboratorio académico consumen sus sugerencias. Los 21 títulos están en `src/app/data/songs.ts`.
- **Max Heap** — `src/app/structures/max-heap.ts`: heap binario máximo con `insert`, `extractMax`, `peek`, `heapifyUp`, `heapifyDown` y `getTopK`. `updatePlays` repara el heap después de actualizar reproducciones. El dashboard muestra el TOP 10 y el laboratorio permite registrar 25.000 reproducciones para comprobar el nuevo orden.
- **Grafo no dirigido** — `src/app/structures/graph.ts`: lista de adyacencia, aristas en ambos sentidos, vecinos y recorrido BFS. El servicio conecta las 21 canciones y el dashboard usa BFS para sugerir canciones relacionadas.
- **Panel visual reutilizable** — `src/app/components/popular-songs/` encapsula el ranking TOP 10 en un componente standalone, con SCSS propio y diseño responsive. Recibe canciones ya ordenadas por el heap y emite la seleccionada al dashboard.
- **Integración** — `src/app/services/music.service.ts` instancia las estructuras y comparte los datos con el dashboard y el panel académico (`src/app/components/academic-panel/`).
- **Insertar canciones** — el formulario del panel académico agrega una canción al Trie, Max Heap y grafo; opcionalmente crea una arista no dirigida hacia otra canción. El ranking y las sugerencias se actualizan de inmediato. Los datos se mantienen en memoria y vuelven a las canciones de ejemplo al recargar la página.

## Interfaz y audio

El dashboard, buscador predictivo, ranking, recomendaciones y reproductor están conectados a los datos del servicio. El reproductor permite seleccionar canciones, recorrer anterior/siguiente y alternar el favorito visual de la canción seleccionada. No se incluyen archivos de audio: reproducir muestra un aviso y la barra de progreso/volumen queda deshabilitada para no simular audio real. Las portadas usan imágenes de demostración alojadas en Unsplash.

## Pruebas

Las pruebas enfocadas de las estructuras están en `src/app/structures/structures.spec.ts`; la prueba del dashboard está en `src/app/app.spec.ts`.
