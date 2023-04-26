# Requisitos

- `deno`. Encuentra las instrucciones de instalación en [deno.land](https://deno.land/).

# `.env`

- `PORT` El puerto en el que correrá el servidor.
- `AUTH_TOKEN` El token secreto que se usará para autenticar las peticiones.
- `ADMIN_ID` El id del administrador que podrá usarlo privadamente. Puedes obtenerlo con
  [@userinfobot](https://t.me/userinfobot).
- `BOT_TOKEN` El token del bot. Puedes crear un bot con [@BotFather](https://t.me/BotFather).

# Correr el bot

Copia el archivo `constants.example.ts` a `constants.ts` y modifica, si quieres, la hora de envío.

Copia el archivo `.env.example` a `.env` y modifica las variables de entorno.

Para correr el bot, ejecuta `deno task run`.

Para ver los posibles comandos, ejecuta `deno task`.
