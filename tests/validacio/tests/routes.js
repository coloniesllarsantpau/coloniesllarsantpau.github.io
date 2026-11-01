// Rutes de la web; sempre amb barra final, com les serveix Pages després del 301.
// Amb VALIDA_NOU (scripts/valida.sh --nou) només les d'app-nou/ ja migrades.
module.exports = process.env.VALIDA_NOU ? require('./rutes-nou') : require('./rutes-totes');
