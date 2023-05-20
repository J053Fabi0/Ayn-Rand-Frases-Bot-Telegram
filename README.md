# Requisitos

- `deno`. Encuentra las instrucciones de instalación en [deno.land](https://deno.land/).

# `.env`

- `WEB_PORT` El puerto en el que correrá el front-end.
- `API_PORT` El puerto en el que correrá el API.
- `AUTH_TOKEN` El token secreto que se usará para autenticar las peticiones. Usa cualquier contraseña segura.
- `ADMINS_IDS` Los ids de los administradores que podrán usarlo privadamente. Puedes obtenerlo con
  [@userinfobot](https://t.me/userinfobot). Separa los ids con comas, sin espacios.
- `BOT_TOKEN` El token del bot. Puedes crear un bot con [@BotFather](https://t.me/BotFather).
- `MONGO_URI` La URI de la base de datos de MongoDB. Puedes crear una base de datos gratuita en
  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

# Correr el bot

Copia el archivo `constants.example.ts` a `constants.ts` y modifica, si quieres, la hora de envío.

Copia el archivo `.env.example` a `.env` y modifica las variables de entorno.

Para correr el bot, ejecuta `deno task run`.

Para ver los posibles comandos, ejecuta `deno task`.
