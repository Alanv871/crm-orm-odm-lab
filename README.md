# CRM ORM/ODM Lab

API REST de un CRM básico que combina un ORM (Sequelize + PostgreSQL) y un ODM (Mongoose + MongoDB).

## Stack

- Node.js 22, Express 5, CommonJS
- Sequelize + PostgreSQL 16 (`User`, `Company`, `Contact`)
- Mongoose + MongoDB 7 (`Activity`)
- Jest + Supertest
- GitHub Codespaces, Dev Containers, Docker Compose
- Supervisor (`npm run dev`)

## Arquitectura

```text
GitHub Codespace
│
├── app       Node.js 22  ──┬── Sequelize ──> postgres (PostgreSQL)
│                           └── Mongoose  ──> mongo    (MongoDB)
├── postgres
└── mongo
```

La aplicación se conecta por nombre de servicio (`postgres`, `mongo`). Las credenciales de desarrollo llegan como variables de entorno definidas en `.devcontainer/docker-compose.yml` (ver `.env.example`).

## Iniciar el Codespace

1. En GitHub: **Code → Codespaces → Create codespace on main**.
2. Espera a que se levanten los tres servicios (`app`, `postgres`, `mongo`). `postCreateCommand` ejecuta `npm install`.

## Instalar dependencias

```bash
npm install
```

## Seed y reset

```bash
npm run seed    # inserta datos deterministas (3 users, 4 companies, 8 contacts, 10 activities)
npm run reset   # elimina y recrea tablas/base de datos y vuelve a sembrar
```

## Iniciar la API

```bash
npm start       # node ./bin/www
npm run dev     # supervisor ./bin/www
```

Servidor en el puerto `3000` (variable `PORT`).

## Pruebas

```bash
npm test
```

Cada suite restablece PostgreSQL y MongoDB antes de ejecutarse y cierra las conexiones al terminar.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/users` | Listar usuarios |
| GET | `/users/:id` | Obtener usuario |
| POST | `/users` | Crear usuario |
| PUT | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario |
| GET | `/companies` | Listar compañías (`?industry=`) |
| GET | `/companies/:id` | Obtener compañía |
| POST | `/companies` | Crear compañía |
| PUT | `/companies/:id` | Actualizar compañía |
| DELETE | `/companies/:id` | Eliminar compañía |
| GET | `/contacts` | Listar contactos |
| GET | `/contacts/:id` | Obtener contacto |
| POST | `/contacts` | Crear contacto |
| PUT | `/contacts/:id` | Actualizar contacto |
| DELETE | `/contacts/:id` | Eliminar contacto |
| GET | `/activities` | Listar actividades (`?type=`) |
| GET | `/activities/:id` | Obtener actividad |
| POST | `/activities` | Crear actividad |
| PUT | `/activities/:id` | Actualizar actividad |
| DELETE | `/activities/:id` | Eliminar actividad |

Los errores se devuelven como JSON: `{ "error": "Contact not found" }`.


## Respuestas

1. Dos motores. En este proyecto User, Company y Contact viven en PostgreSQL y
Activity en MongoDB. Da una razón por la que Activity es buen candidato para
una base documental y otra por la que Company y Contact son buenos candidatos
para una base relacional.

R. Se crean nuevas actividades mucho mas rápido de lo que se crean nuevas empresas, usuarios y contactos,
además, cada actividad tiene características diferentes, es decir, campos diferentes para guardar en la base de datos,
por estas condiciones es preferible una base de datos no estructurada.


2. ORM vs ODM. ¿Qué es un ORM y qué es un ODM? Nombra la librería de cada
uno en este proyecto y una diferencia importante entre ambos.

R. Ambos son mapeadores de objetos para bases de datos, osea, técnicas para realizar operaciones CRUD mediante un paradigma orientado a objetos permiten interactuar con las bases de datos utilizando el mismo lenguaje usado en el backend, sirven para facilitar las consultas cuando una base de datos aumenta en dimensiones y los queries crudos se vuelven difícilies de manejar, la diferencia entre estos dos es que ORM se usa para bases de datos relacionales y ODM para bases no relacionales, para este proyecto se usó sequelize para las bases relacionales y mongoose para  las no relacionales.


3. Configuración por variables de entorno. Las credenciales de las bases de datos
no están escritas en el código JavaScript. ¿Dónde se definen en este Codespace y por
qué es mala práctica escribirlas dentro de los archivos .js? Menciona los nombres
de host que usa la app para conectarse (DB HOST y MONGODB URI) y por qué no son
localhost.

R. Se definen en el archivo .env, aunque en este codespace solo hay un ejemplo, las credenciales no se escriben en el código y los .env no se envían al proyecto porque las credenciales contienen secretos que si se exponen abren las puertas a ataques y robo de datos.
DB HOST lleva por nombre "postgres" y MONGODB URI lleva "mongodb://mongo:27017/crm", no son localhost porque este apunta al otro contenedor de la app, entonces, si la base de datos vive en otro contenedor, localhost no encontraría nada.


4. Asociaciones. Explica qué relación existe entre Company y Contact según models/
sequelize/index.js. ¿Cuál es la llave foránea, en qué tabla vive y para qué sirve
el alias as: ’contacts’?

R. La relación se basa en que una compañía tiene varios contactos, mientras que un contacto solo pertenece a una compagía, generando una relación 1 a muchos, la llave foránea es company_id y vive en la tabla "company", contacts sirve para evitar el uso de un genérico y así tener más claro el significado de la relación.


5. Eager loading. En el Reto 05, ¿qué diferencia habría entre traer la compañía
y luego hacer una segunda consulta para sus contactos, y traerlos en la misma
consulta con include? ¿Cuál es preferible y por qué?
