// app.js - Lógica principal de interface, Transposição e Síntese de Áudio (ABCJS)
let synthControllerAtual = null;
let bancoDeMusicasRepertorio = [];

function alterarTom(semitons) {
    const input = document.getElementById("cifras");
    if (!input) return;
    let texto = input.value;

    let novoTexto = texto.replace(/([A-G][#b]?)([A-Za-z0-9°+]*)/g, (match, nota, sufixo) => {
        if (typeof MAPA_ENARMONEOS !== 'undefined' && MAPA_ENARMONEOS[nota]) nota = MAPA_ENARMONEOS[nota];
        if (typeof ESCALA_CIFRAS === 'undefined') return match;
        let indice = ESCALA_CIFRAS.indexOf(nota);
        if (indice === -1) return match;

        let novoIndice = (indice + semitons) % 12;
        if (novoIndice < 0) novoIndice += 12;
        return ESCALA_CIFRAS[novoIndice] + sufixo;
    });

    input.value = novoTexto;
    processarCifrasParaAbc();
}

function processarCifrasParaAbc() {
    const titulo = document.getElementById("titulo") ? document.getElementById("titulo").value : "Música";
    const compositor = document.getElementById("compositor") ? document.getElementById("compositor").value : "N-Play";
    const arranjador = document.getElementById("arranjador") ? document.getElementById("arranjador").value : "N-Play";
    const clave = document.getElementById("clave") ? document.getElementById("clave").value.trim() : "C";
    const estiloBaixo = document.getElementById("padraoBaixo") ? document.getElementById("padraoBaixo").value : "tonica";
    const cifrasRaw = document.getElementById("cifras") ? document.getElementById("cifras").value : "";
    const bpmVal = document.getElementById("bpm") ? document.getElementById("bpm").value : "220";
    
    const loopCheckEl = document.getElementById("loopCheck");
    const querLoop = loopCheckEl ? loopCheckEl.checked : false;
    let vezesRepetir = document.getElementById("loopVezes") ? parseInt(document.getElementById("loopVezes").value) : 4;
    if (isNaN(vezesRepetir) || vezesRepetir < 1) vezesRepetir = 1;

    let metroDinamico = "4/4";
    const catEl = document.getElementById("ritmoCategoria");
    const subEl = document.getElementById("ritmoSubcategoria");
    const varEl = document.getElementById("ritmoVariacao");

    if (catEl && subEl && varEl && BANCO_RITMOS[catEl.value] && BANCO_RITMOS[catEl.value][subEl.value] && BANCO_RITMOS[catEl.value][subEl.value][varEl.value]) {
        metroDinamico = BANCO_RITMOS[catEl.value][subEl.value][varEl.value].metro;
    }

    let blocosCompasso = cifrasRaw.split("|").map(b => b.trim());
    let partesRh = [];
    let partesLh = [];

    blocosCompasso.forEach((bloco, index) => {
        if (bloco === "") return;
        let proximoTemLigadura = false;
        if (blocosCompasso[index + 1] && bloco.endsWith("_")) proximoTemLigadura = true;

        if (typeof processarCompassoDinamico === 'function') {
            let resultado = processarCompassoDinamico(bloco, metroDinamico, estiloBaixo, proximoTemLigadura);
            partesRh.push(resultado.rh);
            partesLh.push(resultado.lh);
        }
    });

    const baseRh = partesRh.join(" | ");
    const baseLh = partesLh.join(" | ");
    
    let barraInicioVisual = "";
    let barraFimVisual = "|]";
    if (querLoop) {
        barraInicioVisual = "|:";
        barraFimVisual = ":|";
    }
    
    const linhaRhVisual = `${barraInicioVisual} ${baseRh} ${barraFimVisual}`;
    const linhaLhVisual = `${barraInicioVisual} ${baseLh} ${barraFimVisual}`;

    // Montagem do cabeçalho unificado com o Arranjador anexado elegantemente
    let abcVisual = `X:1
T:${titulo}
C:${compositor} 
A:${arranjador}
M:${metroDinamico}
%%score { 1 | 2 
L:1/4
Q:1/4=${bpmVal}
K:${clave}
%%MIDI program 0
V:1 clef=treble
${linhaRhVisual}
V:2 clef=bass
${linhaLhVisual}`;

    let cuerpoRhAudio = baseRh;
    let cuerpoLhAudio = baseLh;

    if (querLoop && vezesRepetir > 1) {
        let arrayRh = [];
        let arrayLh = [];
        for (let i = 0; i < vezesRepetir; i++) {
            arrayRh.push(baseRh);
            arrayLh.push(baseLh);
        }
        cuerpoRhAudio = arrayRh.join(" | ");
        cuerpoLhAudio = arrayLh.join(" | ");
    }

    let abcAudio = `X:1
M:${metroDinamico}
L:1/4
Q:1/4=${bpmVal}
K:${clave}
%%MIDI program 0
V:1 clef=treble
|| ${cuerpoRhAudio} |]
V:2 clef=bass
|| ${cuerpoLhAudio} |]`;

    // Armazena o ABC atual na janela para uso global dos exportadores e travas de segurança
    window.abcGeradoAtual = abcVisual;
    
    renderizarDiretoDoAbc(abcVisual, abcAudio);
}

function renderizarDiretoDoAbc(abcVisual, abcAudio) {
    const codigoVisual = abcVisual || window.abcGeradoAtual || "";
    const codigoAudio = abcAudio || codigoVisual;

    if (synthControllerAtual) {
        try { 
            synthControllerAtual.stop(); 
            synthControllerAtual.close(); 
        } catch(e) {}
    }
    
    const playerDiv = document.getElementById("audio-player");
    if (playerDiv) playerDiv.innerHTML = "";

    const partituraDiv = document.getElementById("partitura");
    if (!partituraDiv) return;

    let visualObj = ABCJS.renderAbc("partitura", codigoVisual, { responsive: "resize" })[0];
    let audioVisualObj = ABCJS.renderAbc(document.createElement("div"), codigoAudio)[0];

    if (ABCJS.synth.supportsAudio() && visualObj && playerDiv) {
        const synthControl = new ABCJS.synth.SynthController();
        synthControllerAtual = synthControl;

        synthControl.load("#audio-player", null, { 
            displayPlay: true, 
            displayRestart: true, 
            displayProgress: true, 
            displayWarp: false 
        });

        const criarSynth = new ABCJS.synth.CreateSynth();
        
        criarSynth.init({ visualObj: audioVisualObj })
            .then(() => {
                return synthControl.setTune(audioVisualObj, false);
            })
            .then(() => {
                console.log("Mapeamento visual e reprodutor de áudio sincronizados.");
            })
            .catch(err => {
                console.error("Erro na síntese de áudio ABCJS:", err);
            });
    }
}

// ==========================================================================
// CONTROLE DOS MENUS HIERÁRQUICOS DE ESTILOS
// ==========================================================================
function inicializarMenusRitmo() {
    const catSelect = document.getElementById("ritmoCategoria");
    if (!catSelect) return;
    
    catSelect.innerHTML = "";
    Object.keys(BANCO_RITMOS).forEach(cat => {
        catSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
    atualizarSubcategorias();
}

function atualizarSubcategorias() {
    const catSelect = document.getElementById("ritmoCategoria");
    const subSelect = document.getElementById("ritmoSubcategoria");
    if (!catSelect || !subSelect) return;
    
    subSelect.innerHTML = "";
    const cat = catSelect.value;
    
    if (BANCO_RITMOS[cat]) {
        Object.keys(BANCO_RITMOS[cat]).forEach(sub => {
            subSelect.innerHTML += `<option value="${sub}">${sub}</option>`;
        });
    }
    atualizarVariacoes();
}

function atualizarVariacoes() {
    const catSelect = document.getElementById("ritmoCategoria");
    const subSelect = document.getElementById("ritmoSubcategoria");
    const varSelect = document.getElementById("ritmoVariacao");
    if (!catSelect || !subSelect || !varSelect) return;

    varSelect.innerHTML = "";
    const cat = catSelect.value;
    const sub = subSelect.value;

    if (BANCO_RITMOS[cat] && BANCO_RITMOS[cat][sub]) {
        Object.keys(BANCO_RITMOS[cat][sub]).forEach(v => {
            varSelect.innerHTML += `<option value="${v}">${v}</option>`;
        });
    }
    processarCifrasParaAbc();
}

// ==========================================================================
// MÓDULO DE REPERTÓRIO E EXPORTAÇÃO (CORRIGIDO SEM TEXTAREA)
// ==========================================================================
function adicionarMusicaAoRepertorio() {
    const titulo = document.getElementById("titulo") ? document.getElementById("titulo").value : "Sem Título";
    const abcCode = window.abcGeradoAtual || "";
    const cifrasRaw = document.getElementById("cifras") ? document.getElementById("cifras").value : "";

    bancoDeMusicasRepertorio.push({ titulo, abc: abcCode, txt: cifrasRaw });
    atualizarListaRepertorioVisual();
}

function atualizarListaRepertorioVisual() {
    const ul = document.getElementById("listaRepertorio");
    if (!ul) return;
    ul.innerHTML = "";
    if (bancoDeMusicasRepertorio.length === 0) {
        ul.innerHTML = `<li style="color: #94a3b8; font-style: italic;">Nenhuma música salva ainda...</li>`;
        return;
    }
    bancoDeMusicasRepertorio.forEach((m, idx) => {
        ul.innerHTML += `<li>📌 <strong>${m.titulo}</strong> (Posição: ${idx + 1})</li>`;
    });
}

function exportarArquivo(tipo, formato) {
    let conteudo = "";
    let nomeArquivo = "";

    if (tipo === 'individual') {
        const titulo = (document.getElementById("titulo") ? document.getElementById("titulo").value : "musica") || "musica";
        nomeArquivo = `${titulo.toLowerCase().replace(/\s+/g, '_')}.${formato}`;
        conteudo = (formato === 'abc') ? (window.abcGeradoAtual || "") : (document.getElementById("cifras") ? document.getElementById("cifras").value : "");
    } else {
        if (bancoDeMusicasRepertorio.length === 0) {
            alert("O repertório está vazio!");
            return;
        }
        nomeArquivo = `repertorio_completo.${formato}`;
        bancoDeMusicasRepertorio.forEach((musica, index) => {
            if (formato === 'abc') {
                let abcAjustado = musica.abc.replace(/X:\s*\d+/g, `X:${index + 1}`);
                conteudo += abcAjustado + "\n\n";
            } else {
                conteudo += `Title: ${musica.titulo}\nChords: ${musica.txt}\n\n---\n\n`;
            }
        });
    }

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo;
    link.click();
}

// INITIALIZER DE EVENT LISTENERS DO DOM
window.addEventListener("DOMContentLoaded", () => {
    if (typeof carregarPastaDeRitmos === 'function') {
        carregarPastaDeRitmos().then(() => {
            inicializarMenusRitmo();
            
            const catSelect = document.getElementById("ritmoCategoria");
            const subSelect = document.getElementById("ritmoSubcategoria");
            const varSelect = document.getElementById("ritmoVariacao");

            if (catSelect) catSelect.addEventListener("change", () => atualizarSubcategorias());
            if (subSelect) subSelect.addEventListener("change", () => atualizarVariacoes());
            if (varSelect) varSelect.addEventListener("change", () => processarCifrasParaAbc());

            const checkbox = document.getElementById("loopCheck");
            const inputVezes = document.getElementById("loopVezes");
            if (checkbox) checkbox.addEventListener("change", processarCifrasParaAbc);
            if (inputVezes) inputVezes.addEventListener("input", processarCifrasParaAbc);
            
            ["titulo", "compositor", "arranjador", "clave", "padraoBaixo", "cifras", "bpm"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener("input", processarCifrasParaAbc);
            });

            processarCifrasParaAbc();
        });
    }
});