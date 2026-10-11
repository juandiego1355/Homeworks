export interface MenuNode {
  id: string;
  title: string;
  link: string;
  component: string;
  description: string;
  children?: MenuNode[];
}

export const MENU_TREE: MenuNode[] = [
  {
    id: 'profile',
    title: 'Perfil',
    link: '/cuenta/perfil',
    component: 'PerfilComponent',
    description: 'Actualiza la información de tu cuenta y las preferencias de tu perfil.',
  },
  {
    id: 'messages',
    title: 'Mensajes',
    link: '/mensajes',
    component: 'MensajesComponent',
    description: 'Consulta tus mensajes y conversaciones.',
  },
  {
    id: 'settings',
    title: 'Configuración',
    link: '/configuracion',
    component: 'ConfiguracionComponent',
    description: 'Administra las opciones de tu cuenta.',
    children: [
      {
        id: 'account',
        title: 'Cuenta',
        link: '/configuracion/cuenta',
        component: 'CuentaComponent',
        description: 'Actualiza los datos y las preferencias de tu cuenta.',
      },
      {
        id: 'security',
        title: 'Seguridad y privacidad',
        link: '/configuracion/seguridad',
        component: 'SeguridadComponent',
        description: 'Configura las opciones de seguridad y privacidad.',
        children: [
          {
            id: 'password',
            title: 'Contraseña',
            link: '/configuracion/seguridad/contrasena',
            component: 'ContrasenaComponent',
            description: 'Cambia tu contraseña y protege tu cuenta.',
          },
          {
            id: 'notification',
            title: 'Notificaciones',
            link: '/configuracion/seguridad/notificaciones',
            component: 'NotificacionesComponent',
            description: 'Administra las notificaciones por correo y las alertas.',
          },
        ],
      },
    ],
  },
  {
    id: 'help',
    title: 'Ayuda',
    link: '/ayuda',
    component: 'AyudaComponent',
    description: 'Encuentra soporte y recursos útiles.',
    children: [
      {
        id: 'faq',
        title: 'Preguntas frecuentes',
        link: '/ayuda/preguntas-frecuentes',
        component: 'PreguntasFrecuentesComponent',
        description: 'Consulta respuestas a las preguntas más frecuentes.',
      },
      {
        id: 'ticket',
        title: 'Enviar una solicitud',
        link: '/ayuda/solicitud',
        component: 'SolicitudComponent',
        description: 'Contacta al equipo de soporte.',
      },
      {
        id: 'network',
        title: 'Estado de la red',
        link: '/ayuda/estado-de-red',
        component: 'EstadoDeRedComponent',
        description: 'Consulta el estado actual de nuestros servicios.',
      },
    ],
  },
  {
    id: 'logout',
    title: 'Cerrar sesión',
    link: '/cerrar-sesion',
    component: 'CerrarSesionComponent',
    description: 'Finaliza la sesión actual.',
  },
];
