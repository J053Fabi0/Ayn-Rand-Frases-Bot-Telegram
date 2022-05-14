const initFrasesCollection = (db: Loki) => db.addCollection("frases", { indices: ["últimaVezEnviada"] });

export default initFrasesCollection;
