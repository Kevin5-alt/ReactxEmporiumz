# ReactxEmporiumz

Añado link al repositorio: "https://github.com/Kevin5-alt/ReactxEmporiumz.git"

Contextualización:

Creamos una única aplicación React que combina:

- Autenticación de usuarios y administradores sin llamadas a API.
- Panel administrativo para gestionar usuarios (listar, editar, eliminar).
- Interfaz de usuario para promociones con CRUD completo (crear, listar, editar, eliminar).
- Todo el estado se almacena en localStorage, garantizando persistencia sin necesidad de un backend.

Roles y flujos de usuario
Administrador

-Inicia sesión con sus credenciales.
-Accede al panel que muestra la lista de todos los usuarios registrados.
-Puede editar nombre o contraseña de cualquier usuario o eliminar cuentas.
-Cierra sesión cuando termina su gestión.

Usuario estándar

- Se registra y luego inicia sesión.
- Visualiza la interfaz de promociones.
- Crea nuevas promociones indicando porcentaje, producto y fechas.
- Edita o elimina promociones existentes.
- Cierra sesión al finalizar.
