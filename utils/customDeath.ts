import ON_DEATH from "death";

let deathFunction: Function = () => 1;

let hasAskedToStop = false;
ON_DEATH(() => {
  if (hasAskedToStop) return process.exit(0);
  hasAskedToStop = true;

  deathFunction();
});

const customDeath = (fn: Function) => (deathFunction = fn);

export default customDeath;
