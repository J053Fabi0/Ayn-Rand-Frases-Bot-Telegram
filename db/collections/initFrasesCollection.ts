const initFrasesCollection = (db: Loki) => db.addCollection("frases", { indices: ["ĂșltimaVezEnviada"] });

export default initFrasesCollection;
