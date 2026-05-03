# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [1.1.0] - 2026-04-30

### Adicionado
- Simulador de Daltonismo no preview do gráfico com quatro modos: Protanopia, Deuteranopia, Tritanopia e Acromasia — implementado com filtros SVG `feColorMatrix` sem dependências externas
- Alerta de similaridade perceptual na sequência de cores — detecta pares de cores com hue e luminosidade próximos usando distância HSL, em vez de ratio WCAG (inadequado para séries de dados)
- Sincronização automática entre a contagem de séries/colunas e a lista de cores — ao aumentar, novas cores são geradas com matizes distribuídos a partir do último item; ao reduzir, a lista é truncada

### Corrigido
- Tooltip dos botões do simulador de daltonismo renderizado via singleton JS com `position: fixed` no `<body>`, eliminando o corte causado por `overflow` nos containers pai
- Auto Ajuste: algoritmo recalibrado para operar em espaço HSL perceptual, com redistribuição de matiz proporcional ao tamanho da paleta

### Removido
- Importação de CSV (removida temporariamente; será reintroduzida com exemplos por tipo de gráfico)
- Botão de Download PNG (funcionalidade instável; removida até implementação adequada)

---

## [1.0.0] - 2026-04-26

### Adicionado
- Biblioteca com 13+ tipos de gráficos (barras agrupadas, empilhadas, 100%, linhas, área, dispersão, bolhas, box plot, slopegraph, donut, polar, radar, misto)
- Teste de Cores interativo com Chart.js — controle de séries e colunas em tempo real
- Sequência de Cores com drag & drop, color picker e 20+ paletas prontas (Viridis, Plasma, Tableau 10, ColorBrewer, Wong e outras)
- Auto Ajuste de paleta (redistribuição de matiz, normalização de saturação/luminosidade)
- Matriz de Amostras com ratios de contraste WCAG AA
- Verificador de Contraste WCAG 2.0 (Normal AA/AAA, Large AA/AAA)
- Exportação para Python dict, JSON, variáveis CSS e lista HEX
- Modo escuro / claro com transição suave
- Seletor de idioma PT-BR / EN
- Persistência de estado via localStorage
- Deploy automático via GitHub Actions + GitHub Pages
