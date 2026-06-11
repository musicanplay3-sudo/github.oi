// ritmos/rock_pop.js - Módulo de Rock/Pop
(() => {
    const estilo = {
        categoria: "Rock",
        subcategoria: "Pop Rock",
        variacoes: {
            "Balada Clássica": { metro: "4/4", formula: "rock_balada" },
            "Rock 8 Beats": { metro: "4/4", formula: "rock_8b" }
        }
    };

    if (typeof REGISTRO_RITMOS !== 'undefined') {
        REGISTRO_RITMOS.registrar(estilo);
    }
})();