const encoder = new TextEncoder();

const LokiFsSyncAdapter: LokiPersistenceAdapter = {
  loadDatabase: function loadDatabase(dbname, callback) {
    try {
      callback(Deno.statSync(dbname).isFile ? Deno.readTextFileSync(dbname) : null);
    } catch (err) {
      // first autoload when file doesn't exist yet
      // should not throw error but leave default
      // blank database.
      if (err.code === "ENOENT") callback(null);

      callback(err);
    }
  },

  saveDatabase: function saveDatabase(dbname, dbstring, callback) {
    try {
      Deno.writeFileSync(dbname, encoder.encode(dbstring));
      callback();
    } catch (err) {
      callback(err);
    }
  },

  deleteDatabase: function deleteDatabase(dbname, callback) {
    try {
      Deno.removeSync(dbname);
      callback();
    } catch (err) {
      callback(err);
    }
  },
};

export default LokiFsSyncAdapter;
