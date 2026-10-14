# Parcial 2 - Árbol n-ario de carpetas y archivos

## Ejecutar
npm install
npm run dev

## Firebase (consola)
1. Authentication > Sign-in method > habilitar Correo/contraseña.
2. Firestore Database > Crear base de datos.
3. Firestore > Reglas > pegar el contenido de firestore.rules > Publicar.

## Estructura
- src/models/TreeNode.js : nodo (un archivo no puede tener hijos)
- src/models/NaryTree.js : árbol n-ario desde cero
- src/services/          : Auth y repositorio Firestore
- src/ui/treeView.js     : render visual del árbol
- src/styles/main.scss   : estilos SASS
