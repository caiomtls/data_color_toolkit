# Data Color Toolkit

Uma ferramenta client-side para testar e refinar paletas de cores em diferentes tipos de visualização de dados. Feita para analistas de dados, designers e desenvolvedores que se preocupam com o comportamento das cores em contextos reais de gráficos.

**[Demo ao Vivo →](https://caiomtls.github.io/data_color_toolkit/)**

> [English version below](#english-version)

---

## Funcionalidades

**Biblioteca de Gráficos**
Galeria com 13+ tipos de gráfico — barras agrupadas, empilhadas, 100%, linhas múltiplas, área, dispersão, bolhas, box plot, slopegraph, donut, polar, radar e misto (barra + linha). Cada template abre diretamente na ferramenta de teste com os dados configurados.

**Teste de Cores**
Aplique sua paleta em gráficos interativos renderizados com Chart.js. Controle o número de colunas e séries em tempo real. Suporte a orientação vertical/horizontal nos gráficos de barras.

**Sequência de Cores**
Monte sua paleta manualmente: adicione, remova, reordene por drag & drop e edite com color picker nativo. Importe paletas prontas de um catálogo com 20+ opções categorizadas (categorical, sequential, diverging) — inclui Viridis, Plasma, Tableau 10, ColorBrewer, Wong (acessível) e outras.

**Auto Ajuste**
Ajusta automaticamente a paleta ativa seguindo boas práticas de visualização de dados: redistribuição de matiz, normalização de saturação (55–75%), normalização de luminosidade (42–62%) e alternância de L para distinção sem dependência de cor. Exibe um preview comparativo antes de aplicar.

**Matriz de Amostras**
Grid N×N com os ratios de contraste entre todos os pares de cores da paleta, com indicação de aprovação/reprovação no WCAG AA.

**Verificador de Contraste**
Scores WCAG 2.0 detalhados (Normal AA/AAA, Large AA/AAA) para os principais pares da paleta, com preview de texto real sobre cada cor.

**Exportar**
Copie a paleta como dict Python, JSON, variáveis CSS ou lista HEX pura.

**Modo escuro / claro** com transição suave, seletor de idioma (PT-BR / EN) e persistência de estado via localStorage.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Build | Vite 8 |
| Linguagem | JavaScript Vanilla — ES Modules, sem frameworks |
| Gráficos | Chart.js 4 + @sgratzl/chartjs-chart-boxplot + chartjs-plugin-stacked100 |
| Estilos | CSS Vanilla com Custom Properties |
| Ícones | Material Icons Outlined (Google Fonts) |
| Tipografia | Inter (Google Fonts) |
| Deploy | GitHub Pages via GitHub Actions |

Sem dependências de runtime além do Chart.js. Sem React, sem Vue, sem Tailwind.

---

## Começando

```bash
git clone https://github.com/caiomtls/data_color_toolkit.git
cd data_color_toolkit
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

O output vai para `dist/`. O `vite.config.js` já está configurado com o base path para GitHub Pages.

---

## Estrutura

```
├── index.html
├── vite.config.js
├── src/
│   ├── main.js                 # Entry point
│   ├── router.js               # SPA router (hash-based)
│   ├── store.js                # Estado global com localStorage
│   ├── i18n.js                 # Traduções PT-BR / EN
│   ├── charts/
│   │   └── chart-factory.js    # Configurações e renderização Chart.js
│   ├── components/
│   │   ├── header.js
│   │   ├── footer.js
│   │   └── toast.js
│   ├── pages/
│   │   ├── home.js
│   │   ├── library.js
│   │   └── testing.js          # Ferramenta principal
│   ├── styles/
│   │   ├── index.css           # Design tokens
│   │   ├── components.css
│   │   ├── layout.css
│   │   ├── home.css
│   │   ├── library.css
│   │   └── testing.css
│   └── utils/
│       ├── color.js            # Conversão HEX/RGB/HSL, contraste WCAG, auto-ajuste
│       ├── csv.js              # Parser de CSV
│       └── export.js           # Formatadores de exportação
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Licença

Apache License 2.0 — veja [LICENSE](LICENSE).

Se você fizer fork ou derivar trabalho deste projeto, mantenha o arquivo `NOTICE` com a atribuição ao autor original, indique os arquivos modificados e inclua uma cópia da licença.

---

<a name="english-version"></a>

# English Version

A client-side tool for testing and refining color palettes across different chart types. Built for data analysts, designers, and developers who care about how color choices perform in real visualization contexts.

**[Live Demo →](https://caiomtls.github.io/data_color_toolkit/)**

---

## Features

**Chart Library**
Gallery with 13+ chart types — grouped, stacked, 100% stacked bar, multi-line, area, scatter, bubble, box plot, slopegraph, donut, polar, radar, and mixed (bar + line). Each template opens directly in the testing tool.

**Color Testing**
Apply your palette to interactive Chart.js charts. Control columns and series count in real time. Vertical/horizontal orientation support for bar charts.

**Color Sequence**
Build your palette manually: add, remove, reorder via drag & drop, and edit with a native color picker. Import from a catalog of 20+ palettes across three categories (categorical, sequential, diverging) — includes Viridis, Plasma, Tableau 10, ColorBrewer, Wong (accessible) and others.

**Auto Adjust**
Automatically adjusts the active palette following data-vis best practices: hue redistribution, saturation normalization (55–75%), lightness normalization (42–62%), and lightness alternation for color-independent distinction. Shows a before/after preview before applying.

**Swatch Matrix**
N×N grid with contrast ratios for all color pairs, with WCAG AA pass/fail indicators.

**Contrast Checker**
Detailed WCAG 2.0 scores (Normal AA/AAA, Large AA/AAA) for the main color pairs, with real text previews on each color.

**Export**
Copy the palette as a Python dict, JSON, CSS variables, or a plain HEX list.

Light/dark mode with smooth transitions, language selector (PT-BR / EN), and state persistence via localStorage.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build | Vite 8 |
| Language | Vanilla JavaScript — ES Modules, no frameworks |
| Charts | Chart.js 4 + @sgratzl/chartjs-chart-boxplot + chartjs-plugin-stacked100 |
| Styling | Vanilla CSS with Custom Properties |
| Icons | Material Icons Outlined (Google Fonts) |
| Typography | Inter (Google Fonts) |
| Deploy | GitHub Pages via GitHub Actions |

No runtime dependencies beyond Chart.js. No React, no Vue, no Tailwind.

---

## Getting Started

```bash
git clone https://github.com/caiomtls/data_color_toolkit.git
cd data_color_toolkit
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Output goes to `dist/`. The `vite.config.js` is already configured with the correct base path for GitHub Pages.

---

## License

Apache License 2.0 — see [LICENSE](LICENSE).

If you fork or derive work from this project, keep the `NOTICE` file with attribution to the original author, state what files you changed, and include a copy of the license.
