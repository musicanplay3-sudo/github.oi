// acordes.js - Biblioteca de Acordes com as 7 Formas de Mão Esquerda (Oitavas Corrigidas)
const ESCALA_CIFRAS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const MAPA_ENARMONEOS = { "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#" };

const ACORDES = {
    // === ACORDES MAIORES ===
    "C":     { rh: ["C","E","G"],    m1: "C,",  m2: "[C,G,]",   m3: "[C,C]",   m4: "[C,,G,,C,]",    m5: "[C,E,G]",     m6: "[C,E,G,C]",     m7: "[C,G,E]" },
    "C#":    { rh: ["^C","F","^G"],  m1: "^C,", m2: "[^C,^G,]", m3: "[^C,^C]", m4: "[^C,,^G,,^C,]",  m5: "[^C,F,^G]",   m6: "[^C,F,^G,^C]",  m7: "[^C,^G,F]" },
    "D":     { rh: ["D","^F","A"],   m1: "D,",  m2: "[D,A,]",   m3: "[D,D]",   m4: "[D,,A,,D,]",    m5: "[D,^F,A]",    m6: "[D,^F,A,D]",    m7: "[D,A,^F]" },
    "D#":    { rh: ["^D","G","^A"],  m1: "^D,", m2: "[^D,^A,]", m3: "[^D,^D]", m4: "[^D,,^A,,^D,]",  m5: "[^D,G,^A]",   m6: "[^D,G,^A,^D]",  m7: "[^D,^A,G]" },
    "E":     { rh: ["E","^G","B"],   m1: "E,",  m2: "[E,B,]",   m3: "[E,E]",   m4: "[E,,B,,E,]",    m5: "[E,^G,B]",    m6: "[E,^G,B,E]",    m7: "[E,B,^G]" },
    "F":     { rh: ["F","A","C"],    m1: "F,",  m2: "[F,C]",    m3: "[F,F]",   m4: "[F,,C,F,]",     m5: "[F,A,C]",     m6: "[F,A,C,F]",     m7: "[F,C,A]" },
    "F#":    { rh: ["^F","^A","^C"], m1: "^F,", m2: "[^F,^C]",  m3: "[^F,^F]", m4: "[^F,,^C,^F,]",  m5: "[^F,^A,^C]",  m6: "[^F,^A,^C,^F]", m7: "[^F,^C,^A]" },
    "G":     { rh: ["G","B","D"],    m1: "G,",  m2: "[G,,D,]",  m3: "[G,,G,]", m4: "[G,,D,G,]",     m5: "[G,,B,,D]",   m6: "[G,,B,,D,G,]",  m7: "[G,,D,B,]" },
    "G#":    { rh: ["^G","C","^D"],  m1: "^G,", m2: "[^G,,^D,]",m3: "[^G,,^G,]",m4: "[^G,,^D,^G,]",  m5: "[^G,,C,^D]",  m6: "[^G,,C,^D,^G,]", m7: "[^G,,^D,C]" },
    "A":     { rh: ["A","^C","E"],   m1: "A,",  m2: "[A,,E,]",  m3: "[A,,A,]", m4: "[A,,E,A,]",     m5: "[A,,^C,E]",   m6: "[A,,^C,E,A,]",  m7: "[A,,E,^C]" },
    "A#":    { rh: ["^A","D","F"],   m1: "^A,", m2: "[^A,,F,]",  m3: "[^A,,^A,]",m4: "[^A,,F,^A,]",  m5: "[^A,,D,F]",   m6: "[^A,,D,F,^A,]", m7: "[^A,,F,D]" },
    "B":     { rh: ["B","^D","^F"],  m1: "B,",  m2: "[B,,^F,]", m3: "[B,,B,]", m4: "[B,,^F,B,]",    m5: "[B,,^D,^F]",  m6: "[B,,^D,^F,B,]",  m7: "[B,,^F,^D]" },

    // === ACORDES MENORES ===
    "Cm":    { rh: ["C","_E","G"],   m1: "C,",  m2: "[C,G,]",   m3: "[C,C]",   m4: "[C,,G,,C,]",    m5: "[C,_E,G]",    m6: "[C,_E,G,C]",    m7: "[C,G,_E]" },
    "Dm":    { rh: ["D","F","A"],    m1: "D,",  m2: "[D,A,]",   m3: "[D,D]",   m4: "[D,,A,,D,]",    m5: "[D,F,A]",     m6: "[D,F,A,D]",     m7: "[D,A,F]" },
    "Em":    { rh: ["E","G","B"],    m1: "E,",  m2: "[E,B,]",   m3: "[E,E]",   m4: "[E,,B,,E,]",    m5: "[E,G,B]",     m6: "[E,G,B,E]",     m7: "[E,B,G]" },
    "Am":    { rh: ["A","C","E"],    m1: "A,",  m2: "[A,,E,]",  m3: "[A,,A,]", m4: "[A,,E,A,]",     m5: "[A,,C,E]",    m6: "[A,,C,E,A,]",   m7: "[A,,E,C]" },
    "Bm":    { rh: ["B","D","^F"],   m1: "B,",  m2: "[B,,^F,]", m3: "[B,,B,]", m4: "[B,,^F,B,]",    m5: "[B,,D,^F]",   m6: "[B,,D,^F,B,]",  m7: "[B,,^F,D]" },

    // === VARIADOS E EXTENSÕES ===
    "G7":    { rh: ["G","B","D","F"],m1: "G,",  m2: "[G,,D,]",  m3: "[G,,G,]", m4: "[G,,D,G,]",     m5: "[G,,B,,D]",   m6: "[G,,B,,D,G,]",  m7: "[G,,D,B,]" },
    "Cmaj7": { rh: ["C","E","G","B"],m1: "C,",  m2: "[C,G,]",   m3: "[C,C]",   m4: "[C,,G,,C,]",    m5: "[C,E,G]",     m6: "[C,E,G,C]",     m7: "[C,G,E]" }
};