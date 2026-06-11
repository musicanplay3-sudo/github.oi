// ritmos.js - Gerenciador Dinâmico de Carga de Estilos Isolados

// 1. Objeto Global de Memória onde os ritmos carregados serão armazenados
const BANCO_RITMOS = {};

// CORREÇÃO NO ritmos.js
const REGISTRO_RITMOS = {
    registrar: function(dadosEstilo) {
        const cat = dadosEstilo.categoria;
        const sub = dadosEstilo.subcategoria;

        if (!BANCO_RITMOS[cat]) BANCO_RITMOS[cat] = {};
        if (!BANCO_RITMOS[cat][sub]) BANCO_RITMOS[cat][sub] = {};

        // Registra cada variação individualmente mantendo o nome como chave
        Object.keys(dadosEstilo.variacoes).forEach(nomeVar => {
            BANCO_RITMOS[cat][sub][nomeVar] = dadosEstilo.variacoes[nomeVar];
        });
        
        console.log(`📦 Estilo [${cat} > ${sub}] injetado no sistema.`);
    }
};

// 3. ÍNDICE GERAL DE ARQUIVOS (Mapeia qual arquivo .js corresponde a cada categoria)
// Sempre que criar um ritmo novo na pasta, adicione a linha correspondente aqui embaixo!
const INDICE_ARQUIVOS_RITMO = [
    { categoria: "Rock", arquivo: "ritmos/rock_pop.js" },
    { categoria: "Samba", arquivo: "ritmos/bossa_nova.js" },
    { categoria: "Piano", arquivo: "ritmos/piano_simples.js" },
    { categoria: "Valsa", arquivo: "ritmos/valsa_trad.js" }
];

// 4. FUNÇÃO INJETORA DINÂMICA (Carrega todos os scripts mapeados no índice)
function carregarPastaDeRitmos() {
    return new Promise((resolve) => {
        let scriptsCarregados = 0;
        if (INDICE_ARQUIVOS_RITMO.length === 0) return resolve();

        INDICE_ARQUIVOS_RITMO.forEach(item => {
            const script = document.createElement("script");
            script.src = item.arquivo;
            script.async = false; // Garante ordem de leitura estável

            script.onload = () => {
                scriptsCarregados++;
                if (scriptsCarregados === INDICE_ARQUIVOS_RITMO.length) {
                    console.log("🚀 Todos os arquivos da pasta de ritmos foram indexados.");
                    resolve();
                }
            };

            script.onerror = () => {
                console.error(`❌ Erro crítico ao tentar ler o arquivo: ${item.arquivo}`);
                scriptsCarregados++;
                if (scriptsCarregados === INDICE_ARQUIVOS_RITMO.length) resolve();
            };

            document.head.appendChild(script);
        });
    });
}



// No ritmos.js - Função genérica e integrada ao seletor de baixos (7 Modos)
function processarCompassoDinamico(stringInternaCompasso, metro, estiloBaixo, proximoTemLigadura) {
    const regexAcorde = /([A-G][A-Za-z0-9°+]*)/;
    let itens = stringInternaCompasso.split(/\s+/).filter(c => c !== "");
    let primeiroItem = itens[0];

    const temposTotais = metro.split("/")[0];
    if (!primeiroItem) return { rh: `z${temposTotais}`, lh: `z${temposTotais}` };

    let match = primeiroItem.match(regexAcorde);
    if (!match) return { rh: `z${temposTotais}`, lh: `z${temposTotais}` };

    let cifra = match[1];
    const acorde = ACORDES[cifra];
    if (!acorde) return { rh: `z${temposTotais}`, lh: `z${temposTotais}` };

    // 1. MAPEIA O MODO DE BAIXO SELECIONADO NA TELA (m1 a m7)
    let notasLhEscolhidas = acorde.m1 || "C,";
    switch (estiloBaixo) {
        case "tonica":          notasLhEscolhidas = acorde.m1 || "C,"; break;
        case "quinta":          notasLhEscolhidas = acorde.m2 || "[C,G,]"; break;
        case "oitava":          notasLhEscolhidas = acorde.m3 || "[C,C]"; break;
        case "triade_aberta":   notasLhEscolhidas = acorde.m4 || "[C,,G,,C,]"; break;
        case "triade_fechada":  notasLhEscolhidas = acorde.m5 || "[C,E,G]"; break;
        case "tetrade":         notasLhEscolhidas = acorde.m6 || "[C,E,G,C]"; break;
        case "baixo_acorde":    notasLhEscolhidas = acorde.m7 || "[C,G,E]"; break;
        default:                notasLhEscolhidas = acorde.m1 || "C,"; break;
    }

    // 2. Descobre qual variação/estilo está selecionado na tela
    const catEl = document.getElementById("ritmoCategoria");
    const subEl = document.getElementById("ritmoSubcategoria");
    const varEl = document.getElementById("ritmoVariacao");
    
    let variacaoObjeto = null;
    if (catEl && subEl && varEl && BANCO_RITMOS[catEl.value] && BANCO_RITMOS[catEl.value][subEl.value]) {
        variacaoObjeto = BANCO_RITMOS[catEl.value][subEl.value][varEl.value];
    }

    // 3. Se a variação tiver um desenho rítmico próprio, aplica a fôrma
    if (variacaoObjeto && variacaoObjeto.desenhoRh && variacaoObjeto.desenhoLh) {
        let notasRh = acorde.rh.join(""); // Ex: "CEG"

        // Removemos colchetes extras caso o desenho do ritmo já use colchetes, 
        // mas mantemos se for um acorde agrupado (ex: oitavas ou tríades no baixo)
        let baixoTratado = notasLhEscolhidas;
        
        // Se o desenho do ritmo já colocar colchetes nativamente como "[{LH}]", 
        // e nosso baixo já trouxer colchetes do tipo "[C,G,]", limpamos para não duplicar.
        if (variacaoObjeto.desenhoLh.includes("[{LH}]") && baixoTratado.startsWith("[")) {
            baixoTratado = baixoTratado.replace(/[\[\]]/g, "");
        }

        let abcRh = variacaoObjeto.desenhoRh.replace(/{RH}/g, notasRh);
        let abcLh = variacaoObjeto.desenhoLh.replace(/{LH}/g, baixoTratado);

        return { rh: abcRh, lh: abcLh };
    }

    // --- FALLBACK: Se o ritmo não tiver desenho (Modo linear padrão) ---
    return { 
        rh: `[${acorde.rh.join("")}]${temposTotais}`, 
        lh: `${notasLhEscolhidas}${temposTotais}` 
    };
}