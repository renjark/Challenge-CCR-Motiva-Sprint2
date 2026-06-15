# 🌿 Grovia — Gestão de Vegetação em Rodovias

Solução mobile para monitoramento e gestão da vegetação nas rodovias concedidas à Motiva.

---

## 👥 Integrantes

| Nome | RM |
|---|---|
| Bernardo Silva Berwanger | 565776 |
| Gregory Debom Ferreira | 562346 |
| João Vitor Angeloti Sena | 563473 |
| Laís Krajner Lacerda | 563182 |
| Luana Magalhães Freire | 565305 |
| Pamella Souza da Silva Ferreira | 566172 |

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ instalado
- Expo CLI: `npm install -g expo-cli`
- Aplicativo **Expo Go** no celular (Android ou iOS) **ou** emulador configurado

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/renjark/Challenge-CCR-Motiva.git
cd Challenge-CCR-Motiva

# 2. Instale as dependências
npm install

npx expo install expo-font @expo/vector-icons

# 3. Inicie o servidor de desenvolvimento
npx expo start

# 4. Escaneie o QR Code com o Expo Go (celular)
#    ou pressione 'a' para Android / 'i' para iOS (emulador)
```

---

## 📱 Telas Implementadas (Sprint 2)

| Tela | Rota | Descrição |
|---|---|---|
| **Início** | `/` (tab) | Dashboard com status dos trechos, manutenções pendentes e alertas recentes |
| **Mapa da Rodovia** | `/mapa` (tab) | Visualização dos trechos coloridos por urgência, seleção de trecho |
| **Ranking de Urgência** | `/ranking` (tab) | Lista priorizada automaticamente por nível de urgência |
| **Notificações** | `/notificacoes` (stack) | Central de alertas automáticos |
| **Detalhe do Trecho** | `/detalhe` (stack) | Histórico completo, dados do trecho e acionamento de equipe |

---

## 🗃️ Mock de Dados

Os dados mockados estão em `src/data/mockData.js` e simulam o comportamento real da API. Estrutura:

### `trechos[]`
Representa cada trecho de 1km da rodovia monitorada.

```js
{
  id: "t001",
  km_inicio: 78,
  km_fim: 79,
  status: "critico",        // "critico" | "atencao" | "ok"
  urgencia: 98,             // 0-100, usado no ranking
  rodovia: "SP-280",
  ultima_inspecao: "2026-06-10",
  inspector: "Carlos M.",
  anomalia: "Placa obstruída — vegetação cobrindo sinalização",
  historico: [
    { data, tipo, status, obs }  // "inspecao" | "manutencao"
  ]
}
```

### `notificacoes[]`
Alertas automáticos gerados por anomalias detectadas.

```js
{
  id: "n001",
  data: "2026-06-13",
  hora: "09:32",
  tipo: "critico",          // define a cor do badge
  titulo: "KM 78 - placa obstruída",
  descricao: "Vegetação cobrindo sinalização",
  trecho_id: "t001",
  lida: false
}
```

### `dashboard`
Resumo agregado exibido na tela inicial.

```js
{
  criticos: 7,
  atencao: 12,
  ok: 34,
  manutencoes_pendentes: 19,
  ultima_manutencao: "15/05/2026"
}
```

---

## ✅ Fluxo Completo Demonstrado

**Fluxo: Supervisor identifica trecho crítico e aciona equipe**

1. Supervisor abre o app → vê no **Dashboard** que há 7 trechos críticos
2. Navega para **Ranking de Urgência** → KM 78–79 aparece em #1
3. Toca no trecho → abre **Detalhe do Trecho** com histórico de inspeções
4. Toca em **"Acionar equipe de manutenção"** → confirmação via Alert
5. Sistema registra o acionamento no histórico do trecho
6. Uma nova **notificação** é criada automaticamente confirmando o envio
7. O badge de notificações no header é atualizado em tempo real

---

## 🛠️ Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| React Native + Expo | Base do app multiplataforma |
| Expo Router / React Navigation | Navegação por tabs e stack |
| Context API | Gerenciamento de estado global (substitui Redux para este porte) |
| AsyncStorage | Persistência local (base para suporte offline) |
| @expo/vector-icons (Ionicons) | Ícones consistentes em iOS e Android |
| expo-location | GPS para vincular inspeções a coordenadas |
| expo-camera | Registro fotográfico dos trechos |
| expo-notifications | Alertas locais automáticos |

