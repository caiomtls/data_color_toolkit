/**
 * i18n — Internationalization module
 * Supports PT-BR and EN
 */

const translations = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.library': 'Library',
    'nav.colorTesting': 'Color Testing',

    // Home
    'home.title': 'Data Color',
    'home.titleAccent': 'Toolkit',
    'home.subtitle': 'A free, open-source tool for testing and refining color palettes for data visualization.',
    'home.library': 'Library',
    'home.libraryDesc': 'Explore our gallery of common chart types. Choose a template to start testing.',
    'home.libraryAction': 'Browse Gallery',
    'home.colorTesting': 'Color Testing',
    'home.colorTestingDesc': 'Apply your palettes to live, interactive visualizations in real-time.',
    'home.colorTestingAction': 'Start Testing',
    'home.export': 'Export',
    'home.exportDesc': 'Generate code snippets for Python, JSON, CSS, and more.',
    'home.exportAction': 'View Formats',

    // Library
    'library.title': 'Graph Library',
    'library.subtitle': 'Choose a visualization template to start testing your colors. All templates are rendered with neutral base styles to ensure accurate color evaluation.',
    'library.search': 'Search charts...',
    'library.filterAll': 'All Types',
    'library.useTemplate': '+ Use Template',
    'library.comparison': 'Comparison',
    'library.trend': 'Trend',
    'library.distribution': 'Distribution',
    'library.composition': 'Composition',
    'library.correlation': 'Correlation',
    'library.partToWhole': 'Part-to-Whole',
    'library.magnitude': 'Magnitude',

    // Charts — Comparison
    'chart.groupedBar.title': 'Grouped Bar Chart',
    'chart.groupedBar.desc': 'Compare quantities across categories with side-by-side bars. Ideal for testing high-contrast categorical palettes.',
    'chart.radar.title': 'Radar Chart',
    'chart.radar.desc': 'Display multivariate data on radial axes. Tests line color contrast and fill opacity distinguishability.',

    // Charts — Trend
    'chart.multiLine.title': 'Multi-Line Chart',
    'chart.multiLine.desc': 'Track multiple data series over time. Ideal for ensuring line colors maintain distinct identities.',
    'chart.slope.title': 'Slopegraph',
    'chart.slope.desc': 'Compare changes between two points. Excellent for testing line color distinguishability in close proximity.',
    'chart.mixed.title': 'Mixed (Bar + Line)',
    'chart.mixed.desc': 'Combine bar and line in one chart. Tests how different visual marks coexist with the same palette.',

    // Charts — Composition
    'chart.stackedArea.title': 'Stacked Area Chart',
    'chart.stackedArea.desc': 'Visualize part-to-whole over time. Best for testing sequential or diverging palettes for clarity.',
    'chart.stackedBar.title': 'Stacked Bar Chart',
    'chart.stackedBar.desc': 'Show cumulative totals by stacking bars. Tests color distinguishability in adjacent segments.',
    'chart.stackedBar100.title': '100% Stacked Bar',
    'chart.stackedBar100.desc': 'Normalize stacked bars to 100%. Tests proportional palette perception without magnitude bias.',

    // Charts — Part-to-Whole
    'chart.donut.title': 'Donut Chart',
    'chart.donut.desc': 'Display proportional composition in a ring. Tests categorical palette clarity in circular layout.',

    // Charts — Distribution
    'chart.box.title': 'Box Plot',
    'chart.box.desc': 'Show statistical distribution with quartiles and outliers. Tests stroke, fill, and median color visibility.',

    // Charts — Correlation
    'chart.scatter.title': 'Scatter Plot',
    'chart.scatter.desc': 'Show relationships between two variables. Evaluates color legibility with overlapping data points.',
    'chart.bubble.title': 'Bubble Chart',
    'chart.bubble.desc': 'Add a third dimension (size) to scatter. Tests how palette colors work at varying scales.',

    // Charts — Magnitude
    'chart.horizontalBar.title': 'Horizontal Bar Chart',
    'chart.horizontalBar.desc': 'Rank items by value with horizontal bars. Tests color distinguishability in ordered layouts.',
    'chart.polar.title': 'Polar Area Chart',
    'chart.polar.desc': 'Display magnitude on radial wedges. Tests color distinction in angular segment layouts.',

    // Charts — New additions
    'chart.pie.title': 'Pie Chart',
    'chart.pie.desc': 'Classic part-to-whole view. Tests how palette colors read as slices without gaps.',
    'chart.waterfall.title': 'Waterfall Chart',
    'chart.waterfall.desc': 'Show cumulative effect of sequential values. Tests color contrast between gains, losses and totals.',
    'chart.stepLine.title': 'Step Line Chart',
    'chart.stepLine.desc': 'Visualize data that changes discretely at set points. Tests color readability in staircase transitions.',
    'chart.heatmap.title': 'Heatmap',
    'chart.heatmap.desc': 'Show data density across a grid using color intensity. Tests the perceptual range of a single palette color.',

    // Testing
    'testing.graphSelection': 'Graph Selection',
    'testing.graphData': 'Graph Data',
    'testing.colorSequence': 'Color Sequence',
    'testing.tools': 'Tools',
    'testing.columns': 'Columns',
    'testing.series': 'Series',
    'testing.axes': 'Axes',
    'testing.profiles': 'Profiles',
    'testing.segments': 'Segments',
    'testing.groups': 'Groups',
    'testing.dataPoints': 'Data Points',
    'testing.steps': 'Steps',
    'testing.rows': 'Rows',
    'testing.dataGeneratedInternally': 'Data for this chart is generated dynamically without controls.',
    'testing.importCsv': 'Import CSV',
    'testing.addColor': 'Add Color',
    'testing.overview': 'Overview',
    'testing.swatchMatrix': 'Swatch Matrix',
    'testing.contrastChecker': 'Contrast Checker',
    'testing.exportData': 'Export Data',
    'testing.fullscreen': 'Fullscreen',
    'testing.zoom': 'Zoom',
    'testing.compareMultiple': 'Compare multiple',
    'testing.lowContrastWarning': 'Very similar to another color — may be hard to distinguish',
    'testing.cbNormal': 'Normal vision',
    'testing.cbProtanopia': 'Protanopia (red-blind)',
    'testing.cbDeuteranopia': 'Deuteranopia (green-blind)',
    'testing.cbTritanopia': 'Tritanopia (blue-blind)',
    'testing.cbAchromatopsia': 'Achromatopsia (grayscale)',
    'testing.visionLabel': 'Vision:',

    'export.python': 'Python Dict',
    'export.json': 'JSON',
    'export.css': 'CSS Variables',
    'export.hex': 'HEX List',
    'export.copy': 'Copy',
    'export.copied': 'Copied!',
    'export.downloadPng': 'Download PNG',
    'export.copyCssVars': 'CSS Vars',
    'export.copyJsArray': 'JS Array',
    'export.noChart': 'Switch to Preview first to export the chart.',
    'export.pngDownloaded': 'Chart downloaded as PNG!',

    // CSV Import
    'csv.title': 'Import CSV Data',
    'csv.desc': 'Paste CSV data with a header row. The first column is the label, the remaining columns are the series.',
    'csv.apply': 'Apply Data',
    'csv.success': 'Data imported from CSV!',
    'csv.errorEmpty': 'Please paste some CSV data first.',
    'csv.errorParse': 'Could not parse CSV. Check the format and try again.',

    // Footer
    'footer.text': 'Personal and free project · Open Source',
    'footer.docs': 'Documentation',
    'footer.changelog': 'Changelog',
    'footer.github': 'GitHub',
    'footer.license': 'License',

    // Contrast
    'contrast.ratio': 'Ratio',
    'contrast.normalAA': 'Normal AA',
    'contrast.normalAAA': 'Normal AAA',
    'contrast.largeAA': 'Large AA',
    'contrast.largeAAA': 'Large AAA',
    'contrast.pass': 'PASS',
    'contrast.fail': 'FAIL',
    'contrast.sampleText': 'Sample Text',
    'contrast.smallText': 'Small body text sample',

    // Palette / Auto-adjust
    'palette.selectPlaceholder': 'Select Palette...',
    'palette.apply': 'Apply',
    'palette.noSelection': 'Please select a palette first.',
    'palette.applied': 'Palette applied!',
    'autoAdjust.button': 'Auto Adjust',
    'autoAdjust.tooltip': 'Auto-adjust colors following data-vis best practices',
    'autoAdjust.title': 'Auto Color Adjustment',
    'autoAdjust.subtitle': 'Best practices applied automatically',
    'autoAdjust.comparison': 'Comparison',
    'autoAdjust.before': 'Before',
    'autoAdjust.after': 'After',
    'autoAdjust.rulesApplied': 'Applied Rules',
    'autoAdjust.perColor': 'Changes per color',
    'autoAdjust.noChange': 'No changes',
    'autoAdjust.cancel': 'Cancel',
    'autoAdjust.apply': 'Apply',
    'autoAdjust.success': 'Colors auto-adjusted!',
    'autoAdjust.rule.hue': 'Hue assignment',
    'autoAdjust.rule.hueDesc': 'Greedy bipartite matching assigns each color to the nearest even-spaced hue slot, preserving color families',
    'autoAdjust.rule.sat': 'Saturation 58–70%',
    'autoAdjust.rule.satDesc': 'Vivid enough to read on any background, not so vivid it causes vibration',
    'autoAdjust.rule.light': 'Theme-aware lightness',
    'autoAdjust.rule.lightDesc': 'Light mode: L 42–58%. Dark mode: L 55–72%. Guarantees readability on both backgrounds.',
    'autoAdjust.rule.alt': 'Accessibility stagger ±6%',
    'autoAdjust.rule.altDesc': 'Alternating lightness offset keeps adjacent colors distinguishable even in grayscale',
  },

  'pt-br': {
    // Nav
    'nav.home': 'Início',
    'nav.library': 'Biblioteca',
    'nav.colorTesting': 'Teste de Cores',

    // Home
    'home.title': 'Data Color',
    'home.titleAccent': 'Toolkit',
    'home.subtitle': 'Uma ferramenta gratuita e open-source para testar e refinar paletas de cores para visualização de dados.',
    'home.library': 'Biblioteca',
    'home.libraryDesc': 'Explore nossa galeria de tipos de gráficos. Escolha um template para começar.',
    'home.libraryAction': 'Ver Galeria',
    'home.colorTesting': 'Teste de Cores',
    'home.colorTestingDesc': 'Aplique suas paletas em visualizações interativas ao vivo, em tempo real.',
    'home.colorTestingAction': 'Começar',
    'home.export': 'Exportar',
    'home.exportDesc': 'Gere trechos de código para Python, JSON, CSS e mais.',
    'home.exportAction': 'Ver Formatos',

    // Library
    'library.title': 'Biblioteca de Gráficos',
    'library.subtitle': 'Escolha um template de visualização para testar suas cores. Todos os templates são renderizados com estilos neutros para avaliação precisa.',
    'library.search': 'Buscar gráficos...',
    'library.filterAll': 'Todos os Tipos',
    'library.useTemplate': '+ Usar Template',
    'library.comparison': 'Comparação',
    'library.trend': 'Tendência',
    'library.distribution': 'Distribuição',
    'library.composition': 'Composição',
    'library.correlation': 'Correlação',
    'library.partToWhole': 'Parte do Todo',
    'library.magnitude': 'Magnitude',

    // Charts — Comparação
    'chart.groupedBar.title': 'Barras Agrupadas',
    'chart.groupedBar.desc': 'Compare quantidades entre categorias com barras lado a lado. Ideal para testar paletas categóricas de alto contraste.',
    'chart.radar.title': 'Gráfico Radar',
    'chart.radar.desc': 'Exiba dados multivariáveis em eixos radiais. Testa contraste de linhas e distinção de preenchimento.',

    // Charts — Tendência
    'chart.multiLine.title': 'Linhas Múltiplas',
    'chart.multiLine.desc': 'Acompanhe múltiplas séries ao longo do tempo. Ideal para garantir identidade distinta entre linhas.',
    'chart.slope.title': 'Slopegraph',
    'chart.slope.desc': 'Compare mudanças entre dois pontos. Excelente para testar distinção de cores de linhas próximas.',
    'chart.mixed.title': 'Misto (Barra + Linha)',
    'chart.mixed.desc': 'Combine barra e linha no mesmo gráfico. Testa a coexistência de marcadores visuais na mesma paleta.',

    // Charts — Composição
    'chart.stackedArea.title': 'Área Empilhada',
    'chart.stackedArea.desc': 'Visualize parte-todo ao longo do tempo. Melhor para testar paletas sequenciais ou divergentes.',
    'chart.stackedBar.title': 'Barras Empilhadas',
    'chart.stackedBar.desc': 'Mostre totais acumulados empilhando barras. Testa distinção de cores em segmentos adjacentes.',
    'chart.stackedBar100.title': 'Barras 100%',
    'chart.stackedBar100.desc': 'Normalize barras empilhadas para 100%. Testa percepção proporcional sem viés de magnitude.',

    // Charts — Parte do Todo
    'chart.donut.title': 'Gráfico Donut',
    'chart.donut.desc': 'Exiba composição proporcional em anel. Testa clareza da paleta categórica em layout circular.',

    // Charts — Distribuição
    'chart.box.title': 'Box Plot',
    'chart.box.desc': 'Mostre distribuição estatística com quartis e outliers. Testa visibilidade de traço, preenchimento e mediana.',

    // Charts — Correlação
    'chart.scatter.title': 'Dispersão',
    'chart.scatter.desc': 'Mostre relações entre duas variáveis. Avalia legibilidade de cores com pontos sobrepostos.',
    'chart.bubble.title': 'Bolhas',
    'chart.bubble.desc': 'Adicione terceira dimensão (tamanho) à dispersão. Testa como as cores funcionam em escalas variadas.',

    // Charts — Magnitude
    'chart.horizontalBar.title': 'Barras Horizontais',
    'chart.horizontalBar.desc': 'Ordene itens por valor com barras horizontais. Testa distinção de cores em layouts ordenados.',
    'chart.polar.title': 'Área Polar',
    'chart.polar.desc': 'Exiba magnitude em fatias radiais. Testa distinção de cores em segmentos angulares.',

    // Gráficos — Novas adições
    'chart.pie.title': 'Gráfico de Pizza',
    'chart.pie.desc': 'Visão clássica de parte-para-todo. Testa como as cores da paleta aparecem em fatias sem espaços.',
    'chart.waterfall.title': 'Gráfico em Cascata',
    'chart.waterfall.desc': 'Mostra o efeito cumulativo de valores sequenciais. Testa contraste de cores entre ganhos, perdas e totais.',
    'chart.stepLine.title': 'Linha em Degraus',
    'chart.stepLine.desc': 'Visualize dados que mudam de forma discreta em pontos fixos. Testa legibilidade de cores em transições em escada.',
    'chart.heatmap.title': 'Mapa de Calor',
    'chart.heatmap.desc': 'Mostra densidade de dados numa grade usando intensidade de cor. Testa a amplitude perceptual de uma única cor da paleta.',

    // Testing
    'testing.graphSelection': 'Seleção de Gráfico',
    'testing.graphData': 'Dados do Gráfico',
    'testing.colorSequence': 'Sequência de Cores',
    'testing.tools': 'Ferramentas',
    'testing.columns': 'Colunas',
    'testing.series': 'Séries',
    'testing.axes': 'Eixos',
    'testing.profiles': 'Perfis',
    'testing.segments': 'Segmentos',
    'testing.groups': 'Grupos',
    'testing.dataPoints': 'Pontos de Dados',
    'testing.steps': 'Etapas',
    'testing.rows': 'Linhas',
    'testing.dataGeneratedInternally': 'Os dados deste gráfico são gerados dinamicamente sem controles.',
    'testing.importCsv': 'Importar CSV',
    'testing.addColor': 'Adicionar Cor',
    'testing.overview': 'Visão Geral',
    'testing.swatchMatrix': 'Matriz de Amostras',
    'testing.contrastChecker': 'Verificador de Contraste',
    'testing.exportData': 'Exportar Dados',
    'testing.fullscreen': 'Tela Cheia',
    'testing.zoom': 'Zoom',
    'testing.compareMultiple': 'Comparar múltiplos',
    'testing.lowContrastWarning': 'Muito similar a outra cor — pode ser difícil de distinguir',
    'testing.cbNormal': 'Visão normal',
    'testing.cbProtanopia': 'Protanopia (cego para vermelho)',
    'testing.cbDeuteranopia': 'Deuteranopia (cego para verde)',
    'testing.cbTritanopia': 'Tritanopia (cego para azul)',
    'testing.cbAchromatopsia': 'Acromasia (escala de cinza)',
    'testing.visionLabel': 'Visão:',

    // Export
    'export.python': 'Dict Python',
    'export.json': 'JSON',
    'export.css': 'Variáveis CSS',
    'export.hex': 'Lista HEX',
    'export.copy': 'Copiar',
    'export.copied': 'Copiado!',
    'export.downloadPng': 'Baixar PNG',
    'export.copyCssVars': 'Vars CSS',
    'export.copyJsArray': 'Array JS',
    'export.noChart': 'Volte para o Preview primeiro para exportar o gráfico.',
    'export.pngDownloaded': 'Gráfico baixado como PNG!',

    // CSV Import
    'csv.title': 'Importar Dados CSV',
    'csv.desc': 'Cole dados CSV com uma linha de cabeçalho. A primeira coluna é o rótulo; as demais são as séries.',
    'csv.apply': 'Aplicar Dados',
    'csv.success': 'Dados importados via CSV!',
    'csv.errorEmpty': 'Cole dados CSV antes de continuar.',
    'csv.errorParse': 'Não foi possível ler o CSV. Verifique o formato e tente novamente.',

    // Footer
    'footer.text': 'Projeto pessoal e gratuito · Open Source',
    'footer.docs': 'Documentação',
    'footer.changelog': 'Changelog',
    'footer.github': 'GitHub',
    'footer.license': 'Licença',

    // Contrast
    'contrast.ratio': 'Proporção',
    'contrast.normalAA': 'Normal AA',
    'contrast.normalAAA': 'Normal AAA',
    'contrast.largeAA': 'Grande AA',
    'contrast.largeAAA': 'Grande AAA',
    'contrast.pass': 'APROVADO',
    'contrast.fail': 'REPROVADO',
    'contrast.sampleText': 'Texto de Exemplo',
    'contrast.smallText': 'Exemplo de texto pequeno',

    // Palette / Auto-adjust
    'palette.selectPlaceholder': 'Selecionar Paleta...',
    'palette.apply': 'Aplicar',
    'palette.noSelection': 'Por favor selecione uma paleta primeiro.',
    'palette.applied': 'Paleta aplicada!',
    'autoAdjust.button': 'Auto Ajustar',
    'autoAdjust.tooltip': 'Ajustar cores automaticamente conforme boas práticas de visualização',
    'autoAdjust.title': 'Auto Ajuste de Cores',
    'autoAdjust.subtitle': 'Boas práticas aplicadas automaticamente',
    'autoAdjust.comparison': 'Comparação',
    'autoAdjust.before': 'Antes',
    'autoAdjust.after': 'Depois',
    'autoAdjust.rulesApplied': 'Regras Aplicadas',
    'autoAdjust.perColor': 'Alterações por cor',
    'autoAdjust.noChange': 'Sem alterações',
    'autoAdjust.cancel': 'Cancelar',
    'autoAdjust.apply': 'Aplicar',
    'autoAdjust.success': 'Cores ajustadas automaticamente!',
    'autoAdjust.rule.hue': 'Atribuição de matiz',
    'autoAdjust.rule.hueDesc': 'Correspondência gulosa atribui cada cor ao slot mais próximo de espaçamento uniforme, preservando famílias de cores',
    'autoAdjust.rule.sat': 'Saturação 58–70%',
    'autoAdjust.rule.satDesc': 'Viva o suficiente para qualquer fundo, sem causar vibração visual',
    'autoAdjust.rule.light': 'Luminosidade adaptada ao tema',
    'autoAdjust.rule.lightDesc': 'Modo claro: L 42–58%. Modo escuro: L 55–72%. Garante legibilidade em ambos os fundos.',
    'autoAdjust.rule.alt': 'Escalonamento de acessibilidade ±6%',
    'autoAdjust.rule.altDesc': 'Alternação de luminosidade mantém cores adjacentes distinguíveis mesmo em escala de cinza',
  },
};

let currentLang = localStorage.getItem('dct-lang') || 'pt-br';

export function t(key) {
  return translations[currentLang]?.[key] || translations['en'][key] || key;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('dct-lang', lang);
}

export function getAvailableLanguages() {
  return [
    { code: 'en', label: 'EN' },
    { code: 'pt-br', label: 'PT' },
  ];
}
