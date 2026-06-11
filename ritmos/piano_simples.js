// Arquivo de Estilo Isolado - Gerado Automaticamente
(() => {
    const estilo = {
        categoria: "Piano",
        subcategoria: "Simples",
        variacoes: {
            "var:1": { 
                metro: "4/4", 
                desenhoRh: "z1 [{RH}]1 [{RH}]1  [{RH}]1", 
                desenhoLh: "{LH}4" 
            }
        }
    };

    // Injeta automaticamente o estilo dentro do banco global se ele existir
    if (typeof REGISTRO_RITMOS !== 'undefined') {
        REGISTRO_RITMOS.registrar(estilo);
    }
})();
