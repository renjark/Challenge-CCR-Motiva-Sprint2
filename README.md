# Grovia — Gestão de Vegetação em Rodovias

Aplicativo mobile para monitoramento, priorização e manutenção da vegetação nas rodovias concedidas à Motiva.
Challenge CCR / Motiva — FIAP · **Sprint 3: Protótipo Funcional Completo**

---

## Integrantes

| Nome | RM |
|---|---|
| Bernardo Silva Berwanger | 565776 |
| Gregory Debom Ferreira | 562346 |
| João Vitor Angeloti Sena | 563473 |
| Laís Krajner Lacerda | 563182 |
| Luana Magalhães Freire | 565305 |
| Pamella Souza da Silva Ferreira | 566172 |

---

## Decisão sobre stack

O grupo **manteve React Native + Expo** e não migrou para Flutter. A base construída nas Sprints 1 e 2 já estava
estável, a equipe tem domínio de JavaScript e o tempo da Sprint 3 foi investido em completar fluxos e estados em
vez de reescrever o que funcionava. Nenhuma justificativa de migração se aplica a esta entrega.

---

## Instalação e execução

Pré-requisitos: Node.js 18+, aplicativo **Expo Go** no celular ou emulador Android/iOS configurado.

```bash
git clone https://github.com/renjark/Challenge-CCR-Motiva.git
cd Challenge-CCR-Motiva
npx expo install react-native-web react-dom @expo/metro-runtime
npm install
npx expo start
```

Escaneie o QR Code com o Expo Go, ou pressione `a` (Android) / `i` (iOS) para abrir no emulador.

**Credenciais de acesso ao protótipo:** matrícula `565776` · senha `grovia123`
(a tela de login tem um atalho "Preencher credenciais de demonstração").

---

## Status atual de cada funcionalidade

Legenda: **Completo** = implementado e testado · **Parcial** = funciona com simulação · **Planejado** = Sprint 4

| # | Funcionalidade | Tela | Status | Observação |
|---|---|---|---|---|
| 1 | Login do supervisor | `LoginScreen` | Completo | Valida campos vazios e credencial inválida; sessão persiste entre aberturas |
| 2 | Painel com indicadores | `HomeScreen` | Completo | Contadores derivados dos dados reais, não mais fixos |
| 3 | Atalho de status → mapa filtrado | `HomeScreen` | Completo | Tocar em "Críticos" abre o mapa já filtrado |
| 4 | Mapa esquemático da rodovia | `MapaScreen` | Parcial | Faixa horizontal com segmentos coloridos; mapa geográfico fica para a Sprint 4 |
| 5 | Busca por km e rodovia | `MapaScreen` | Completo | Com estado vazio e ação de limpar |
| 6 | Filtro por status | `MapaScreen` | Completo | Todos / Críticos / Atenção / Em manutenção / OK |
| 7 | Ranking de urgência | `RankingScreen` | Completo | Ordenação automática por índice de urgência |
| 8 | Ação recomendada | `RankingScreen` | Completo | Detecta se o trecho líder já tem OS ativa |
| 9 | Detalhe do trecho | `DetalheTrechoScreen` | Completo | Status, medições, coordenadas e histórico em linha do tempo |
| 10 | Abertura de ordem de serviço | `DetalheTrechoScreen` | Completo | Prioridade, equipe e descrição; bloqueia OS duplicada |
| 11 | Lista de ordens de serviço | `OrdensScreen` | Completo | Filtros por status e "puxar para atualizar" |
| 12 | Ciclo de vida da OS | `DetalheOrdemScreen` | Completo | Aberta → em campo → concluída, com cancelamento |
| 13 | Registro de inspeção | `NovaInspecaoScreen` | Parcial | Classificação, medição, observação e GPS reais; **foto é simulada** |
| 14 | Captura de localização | `NovaInspecaoScreen` | Completo | Usa `expo-location`, com fallback para a coordenada do trecho |
| 15 | Registro fotográfico | `NovaInspecaoScreen` | Parcial | Placeholder com rótulo e horário; `expo-camera` entra na Sprint 4 |
| 16 | Central de notificações | `NotificacoesScreen` | Completo | Agrupa por data real, mantém não lidas, marca todas, limpa |
| 17 | Badge de não lidas | `Header` | Completo | Atualiza em tempo real a cada ação |
| 18 | Perfil do usuário | `PerfilScreen` | Completo | Dados do supervisor e números agregados |
| 19 | Cenários de teste | `PerfilScreen` | Completo | Liga erro de rede, base vazia e falha de escrita sem tocar no código |
| 20 | Persistência local | `services/storage.js` | Completo | AsyncStorage guarda sessão e estado; botão de restauração disponível |
| 21 | Notificações push | — | Planejado | `expo-notifications` está nas dependências, mas não é usado |
| 22 | Integração com API real | `services/mockApi.js` | Planejado | Camada já isolada para a troca |

---

## Cobertura de estados na camada de mock

A Sprint 3 evoluiu o mock para cobrir os cenários completos da solução, e não apenas o caminho feliz:

| Estado | Como é coberto | Onde observar |
|---|---|---|
| Sucesso | Base com 10 trechos, 4 ordens, 4 equipes e 6 notificações | Todas as telas |
| Carregando | Latência simulada de ~650 ms em toda leitura | Spinner de tela cheia e botões com indicador |
| Erro de rede | Interruptor "Simular falha de rede" no Perfil | `ErrorState` com "Tentar novamente" |
| Lista vazia | Interruptor "Simular base vazia" no Perfil | `EmptyState` em painel, mapa, ranking, ordens |
| Falha ao salvar | Interruptor "Simular falha ao salvar" no Perfil | Toast de erro ao abrir OS, concluir OS ou registrar inspeção |
| Vazio natural | Trecho KM 164–165 nasce sem histórico | Detalhe do trecho |
| Fluxo alternativo | OS cancelada, equipes indisponíveis, OS duplicada bloqueada | Ordens, modal de abertura de OS |

---

## Arquitetura

```
App.js                      navegação (stack + 5 abas) e porta de autenticação
src/
  styles/theme.js           tokens de cor, tipografia, espaçamento e sombra
  data/mockData.js          base de dados mockada
  services/
    mockApi.js              acesso a dados: latência, erro, vazio, escrita
    storage.js              AsyncStorage protegido por try/catch
  context/AppContext.js     estado global, ações e dados derivados
  components/               14 componentes reutilizados por todas as telas
  screens/                  10 telas
docs/TESTES-MANUAIS.md      documento de testes da Sprint 3
```

**Princípio adotado:** nenhuma tela importa `mockData` ou `AsyncStorage` diretamente. Tudo passa pelo
`AppContext`, que por sua vez fala apenas com `services/`. Quando a API real entrar na Sprint 4, só
`mockApi.js` muda.

**Consistência visual:** nenhum arquivo de tela declara cor em hexadecimal. Todas consomem `theme.js`,
e os elementos repetidos (botão, card, etiqueta de status, estados de erro e vazio, barra de urgência,
filtros, toast) vivem em `components/`.

---

## Testes manuais

O documento completo está em [`docs/TESTES-MANUAIS.md`](docs/TESTES-MANUAIS.md): 44 casos cobrindo 10 fluxos,
com cenário testado, resultado esperado, resultado obtido e status.

**Resultado:** 41 aprovados, 3 reprovados (93,2%).

---

## Pendências identificadas

### Falhas abertas (detalhadas no documento de testes)

| ID | Pendência | Severidade |
|---|---|---|
| CT-5.6 | O modal de abertura de OS fecha quando a escrita falha e descarta o que já foi preenchido | Média |
| CT-6.4 | Campo de altura não aceita vírgula como separador decimal e não explica o formato | Baixa |
| CT-9.4 | Limpeza de notificações é irreversível, sem opção de desfazer | Baixa |

### Limitações conhecidas

- **Foto simulada.** A captura gera um placeholder com rótulo e horário; não há imagem real nem upload.
- **Mapa esquemático.** A faixa horizontal representa a sequência de trechos, não a geografia. As coordenadas
  já estão no mock, aguardando o componente de mapa.
- **Notificações apenas internas.** Não há push quando o app está fechado.
- **Usuário único.** Só existe o perfil de supervisor; o perfil de equipe de campo não foi modelado.
- **Sem testes automatizados.** Toda a verificação desta Sprint foi manual.
- **Ícone e splash padrão do Expo.** Os assets de marca não foram produzidos.

---

## Plano de ajustes para a Sprint 4

| Prioridade | Item | Entregável |
|---|---|---|
| 1 | Corrigir as três falhas abertas (CT-5.6, CT-6.4, CT-9.4) | Falhas fechadas e reexecução do documento de testes |
| 2 | Substituir `mockApi.js` pela API real da Motiva | Cliente HTTP com tratamento de erro, timeout e retry |
| 3 | Integrar `expo-camera` com compressão e upload | Foto real anexada à inspeção |
| 4 | Trocar a faixa esquemática por `react-native-maps` | Trechos desenhados sobre o mapa com as coordenadas existentes |
| 5 | Ativar `expo-notifications` | Alerta push quando um trecho vira crítico |
| 6 | Cobrir `mockApi` e as ações do `AppContext` com Jest | Suíte automatizada rodando em CI |
| 7 | Revisar acessibilidade (contraste e área de toque) | Ajustes de contraste na faixa do mapa e alvos de 48 dp |
| 8 | Indicador de dados em cache | Faixa informando quando o conteúdo exibido veio do armazenamento local |
| 9 | Produzir ícone, splash e adaptive icon | Assets de marca aplicados no `app.json` |

---

## Stack tecnológica

| Tecnologia | Uso |
|---|---|
| React Native 0.74 + Expo SDK 51 | Base multiplataforma |
| React Navigation (stack + bottom tabs) | Navegação e porta de autenticação |
| Context API | Estado global — dispensa Redux neste porte |
| AsyncStorage | Persistência da sessão e do estado |
| expo-location | GPS no registro de inspeção, com fallback |
| expo-camera | Declarado; integração prevista para a Sprint 4 |
| expo-notifications | Declarado; integração prevista para a Sprint 4 |
| @expo/vector-icons (Ionicons) | Iconografia consistente em iOS e Android |

---

## Vídeo de demonstração

O link do vídeo (até 3 minutos, não listado no YouTube) está no arquivo de entrega `ENTREGA-SPRINT3.txt`.
