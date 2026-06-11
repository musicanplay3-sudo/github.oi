// ritmos/valsa_trad.js - O ritmo agora guarda o próprio desenho rítmico!
(() => {
    const estilo = {
        categoria: "Valsa",
        subcategoria: "Valsa Tradicional",
        variacoes: {
            "Valsa Caipira": { 
                metro: "3/4", 
                desenhoRh: "z1 [{RH}]1 [{RH}]1", 
                desenhoLh: "{LH}3" 
            },
            "Valsa Sincopada": { 
                metro: "3/4", 
                desenhoRh: "z1 [{RH}]1 z1", 
                desenhoLh: "{LH}2 {LH}1" 
            },
            "Valsa Beto": { 
                metro: "3/4", 
                desenhoRh: "z1 z1 [{RH}]1 ", 
                desenhoLh: "{LH}2 z1" 
            }
        }
    };

    if (typeof REGISTRO_RITMOS !== 'undefined') {
        REGISTRO_RITMOS.registrar(estilo);
    }
})();