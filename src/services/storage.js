// ============================================================
// storage.js — Persistência local (AsyncStorage)
// Toda chamada é protegida: se o storage falhar, o app continua
// funcionando apenas com o estado em memória.
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIXO = "@grovia:";

export const CHAVES = {
  ESTADO: `${PREFIXO}estado`,
  SESSAO: `${PREFIXO}sessao`,
};

export async function salvar(chave, valor) {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (e) {
    console.warn("[storage] falha ao salvar", chave, e?.message);
    return false;
  }
}

export async function ler(chave, padrao = null) {
  try {
    const bruto = await AsyncStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch (e) {
    console.warn("[storage] falha ao ler", chave, e?.message);
    return padrao;
  }
}

export async function remover(chave) {
  try {
    await AsyncStorage.removeItem(chave);
    return true;
  } catch (e) {
    console.warn("[storage] falha ao remover", chave, e?.message);
    return false;
  }
}

export async function limparTudo() {
  await Promise.all(Object.values(CHAVES).map(remover));
}

export default { CHAVES, salvar, ler, remover, limparTudo };
