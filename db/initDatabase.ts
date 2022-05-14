import loki from "lokijs";
import { join } from "path";

const lfsa = require("../utils/loki-fs-sync-adapter");

// Instanciarla.
const db = new loki(join(__dirname, "database.db"), { adapter: new lfsa() });

const autosave = () =>
  setTimeout(() => {
    db.saveDatabase((err) => {
      if (err) console.error(err);
      autosave();
    });
  }, 4_000);

autosave();

// Cargar la base de datos síncronamente desde el archivo '*.db'.
db.loadDatabase();

console.log("Database loaded.");

export default db;
