// ritmos/bossa_nova.js - Arquivo de Estilo Isolado
(() => {
    const estilo = {
        categoria: "Samba",
        subcategoria: "Bossa Nova",
        variacoes: {
            "Padrão Tradicional": { metro: "2/4", formula: "bossa_trad" },
            "Variação Leve": { metro: "2/4", formula: "bossa_leve" }
        }
    };

    // Injeta automaticamente o estilo dentro do banco global se ele existir
    if (typeof REGISTRO_RITMOS !== 'undefined') {
        REGISTRO_RITMOS.registrar(estilo);
    }
})();