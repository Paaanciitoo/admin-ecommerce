# AdminStore – Plataforma de Administración para Tiendas Online

> **Estado del proyecto:** Activo (v1.0.0)
> **Deploy:** https://<tu-deploy-vercel>

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Características Principales](#características-principales)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
5. [Autenticación con Clerk](#autenticación-con-clerk)
6. [Despliegue en Vercel](#despliegue-en-vercel)
6. [Optimización y Buenas Prácticas](#optimización-y-buenas-prácticas)
7. [Roadmap](#roadmap)
8. [Contribuciones](#contribuciones)
9. [Créditos](#créditos)

---

## Descripción General
**AdminStore** es un sistema de administración backend diseñado para la gestión avanzada de tiendas en línea. Cada usuario puede crear y administrar múltiples tiendas, cuyo contenido es consumido por el frontend como una API.

Este panel permite:
- Visualización de estadísticas en tiempo real.
- Modificación de banners, nombres, colores y más.
- Configuración avanzada de la tienda: ajustes de peso, temas, branding.
- Panel de control centralizado para gestión de recursos.

## Características Principales
- Dashboard dinámico con métricas en tiempo real.
- CRUD completo para tiendas (crear, editar, eliminar).
- Sistema de autenticación seguro con **Clerk**.
- Personalización de la interfaz de cada tienda (branding, colores, banners).
- Arquitectura separada del frontend principal para escalabilidad.
- Despliegue con **Vercel**.

## Tecnologías Utilizadas
| Área | Tecnología | Versión |
|------|------------|---------|
| Framework JS | **React** | ^18.x |
| Framework Web | **Next.js** | 14.2.5 |
| Estilos | **Tailwind CSS** + **shadcn/ui** | ^3.x |
| UI | **Radix UI** + **Emotion** + **Goober** | Latest |
| Autenticación | **Clerk** | Latest |
| PaaS Hosting | **Vercel** | Latest |
| Bundler | **Webpack** | Latest |
| Seguridad | **HSTS (HTTP Strict Transport Security)** | Enabled |
| Performance | **Priority Hints** | Enabled |

## Arquitectura del Proyecto
- **Next.js 14 (App Router):** Generación híbrida (SSR y SSG).
- **Autenticación Clerk:** Control de accesos y gestión de sesiones.
- **Panel de administración:** Manejo de banners, estadísticas y configuración de tiendas.
- **Diseño modular:** Componentes reutilizables creados con shadcn/ui y Radix.
- **Integración API:** Comunicación segura con el frontend que consume los datos.

## Autenticación con Clerk
- **Registro y login:** Gestión de usuarios mediante Clerk.
- **Protección de rutas:** Secciones del dashboard accesibles solo con sesión activa.
- **Administración multi-tenant:** Cada usuario administra sus propias tiendas.

## Despliegue en Vercel
1. Conectar el repositorio a Vercel.
2. Configurar las variables de entorno en el panel de Vercel.
3. Despliegue automático al realizar `push` en la rama `main`.

## Optimización y Buenas Prácticas
- **SEO:** Configuración de metadatos en `<head>`.
- **Performance:** Carga diferida de scripts y componentes críticos.
- **Accesibilidad:** ARIA roles, soporte completo de teclado, contraste de colores.
- **Seguridad:** HTTPS, HSTS y sanitización de datos.

## Roadmap
- [ ] Añadir soporte para gráficos más avanzados en el dashboard.
- [ ] Notificaciones en tiempo real (WebSockets).
- [ ] Sistema de roles (admin, editor, viewer).
- [ ] Internacionalización (i18n).

## Contribuciones
1. Realiza un fork.
2. Crea una rama `feature/nueva-funcionalidad`.
3. Envía un Pull Request.


## Créditos
- **Desarrollador Backend/Frontend:** [Nicolás Machuca / https://github.com/Paaanciitoo].
- **Hosting:** [Vercel](https://vercel.com/).
- **Autenticación:** [Clerk](https://clerk.dev/).
