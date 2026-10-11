# Challenge 08 — Inicio de sesión

Aplicación de demostración en Angular con formulario de inicio de sesión, estado de autenticación con Signals y dos páginas privadas basadas en el árbol de menús del Challenge 07.

## Ejecutar localmente

```bash
npm install
npm start
```

Después, abre `http://localhost:4200/`.

## Credenciales de demostración

- Correo: `user@mail.com`
- Contraseña: `123`

## Páginas privadas

- **Árbol N-ario** muestra la jerarquía de menús y el título, enlace y componente de cada nodo.
- **Menú lateral** representa el árbol como un menú interactivo y muestra la información de la opción seleccionada.

El guard de autenticación protege ambas rutas. El usuario actual aparece mientras la sesión está iniciada; al cerrar sesión se limpia el estado y se vuelve al formulario.

## Compilar

```bash
npm run build
```
