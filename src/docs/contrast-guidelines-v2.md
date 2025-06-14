# Diretrizes de Contraste para o Projeto Instauto - V2

## Introdução

Este documento fornece diretrizes atualizadas para garantir que todas as interfaces do usuário do projeto Instauto atendam aos requisitos mínimos de contraste de acordo com as diretrizes WCAG (Web Content Accessibility Guidelines).

## Requisitos de Contraste

De acordo com as diretrizes WCAG 2.1, o contraste mínimo entre texto e fundo deve ser:

- **4.5:1** para texto normal (menos de 18pt ou menos de 14pt em negrito)
- **3:1** para texto grande (pelo menos 18pt ou 14pt em negrito)

## Paleta de Cores Padronizada

### Cores Principais

```javascript
colors: {
  brand: {
    light:  '#EAF4FF', // fundo azul claro
    yellow: '#FFFBEA',
    blue:   '#0A2ADA', // CTA / links escuros
    dark:   '#031023'  // herói noturno / footer
  },
  text: {
    base:   '#0F172A', // neutro 800
    light:  '#FFFFFF'
  }
}
```

### Atributos de Contraste

Para facilitar a aplicação de cores de texto adequadas com base no fundo, foram implementados atributos de contraste:

```css
[data-contrast="light"] { color: var(--tw-text-base); }
[data-contrast="dark"]  { color: var(--tw-text-light); }
```

### Combinações Seguras

#### Para fundos escuros (brand-dark, azul):
- Use `text-text-light` para corpo de texto
- Use `text-yellow-300` para destaques
- Use `text-brand-dark` para texto sobre botões amarelos

#### Para fundos claros (branco, brand-light, brand-yellow):
- Use `text-text-base` para corpo de texto
- Use `text-brand-blue` para destaques e links
- Use `text-gray-700` ou mais escuro para texto secundário

## Melhorias Implementadas

### 1. Padronização de Cores

- Adicionadas novas cores padronizadas no `tailwind.config.js`
- Implementadas variáveis CSS para cores de texto baseadas em contraste
- Substituídas referências diretas a cores por tokens padronizados

### 2. Correções de Contraste

- Substituídas todas as ocorrências de `text-white` em fundos claros
- Substituídas todas as ocorrências de `text-gray-800` em fundos escuros
- Melhorado o contraste de textos com opacidade reduzida (ex: `text-white/70` → `text-white`)
- Aumentada a opacidade em bordas para melhorar visibilidade (`border-white/20` → `border-white/40`)

### 3. Atributos de Contraste

- Adicionado `data-contrast="dark"` em seções com fundo escuro
- Adicionado `data-contrast="light"` em seções com fundo claro

### 4. Ferramentas de Verificação

#### Hook useContrastCheck

O hook `useContrastCheck` foi melhorado para:

1. Verificar automaticamente o contraste em toda a página
2. Destacar elementos com contraste insuficiente
3. Mostrar tooltips com informações de contraste
4. Permitir correção interativa de problemas

#### Componente ContrastChecker

O componente `ContrastChecker` foi atualizado para:

1. Usar o hook melhorado para verificar o DOM
2. Verificar combinações específicas de cores do projeto
3. Exibir avisos no console para problemas de contraste
4. Ser renderizado apenas em ambiente de desenvolvimento

## Como Usar

### Aplicando Atributos de Contraste

```jsx
<section className="bg-brand-dark" data-contrast="dark">
  <p>Este texto será branco automaticamente</p>
</section>

<section className="bg-brand-light" data-contrast="light">
  <p>Este texto será escuro automaticamente</p>
</section>
```

### Verificando Contraste

1. **Durante o desenvolvimento**:
   - O componente `ContrastChecker` é renderizado automaticamente em ambiente de desenvolvimento
   - Elementos com contraste insuficiente são destacados com borda vermelha
   - Passe o mouse sobre os elementos destacados para ver o valor de contraste

2. **Manualmente**:
   - Abra o console do navegador para ver avisos de contraste
   - Clique nos elementos destacados para remover o destaque
   - Use o hook `useContrastCheck` em componentes específicos para verificação localizada

## Boas Práticas

1. **Use os tokens de cor padronizados**:
   - `text-text-light` em vez de `text-white`
   - `text-text-base` em vez de `text-gray-800`
   - `text-brand-blue` em vez de `text-blue-600`

2. **Evite opacidade em texto**:
   - Em vez de `text-white/70`, use uma cor sólida como `text-gray-300`
   - Em vez de `text-black/50`, use uma cor sólida como `text-gray-600`

3. **Use atributos de contraste**:
   - Adicione `data-contrast="dark"` em seções com fundo escuro
   - Adicione `data-contrast="light"` em seções com fundo claro

4. **Teste em diferentes condições**:
   - Verifique o contraste em diferentes tamanhos de tela
   - Teste com diferentes níveis de brilho do monitor
   - Considere usuários com diferentes condições visuais

## Exemplos de Correções

### Antes:
```jsx
<div className="bg-white">
  <p className="text-gray-300">Texto com contraste insuficiente</p>
</div>
```

### Depois:
```jsx
<div className="bg-white" data-contrast="light">
  <p className="text-gray-700">Texto com contraste adequado</p>
</div>
```

### Antes:
```jsx
<button className="bg-blue-600 text-white/70">Botão com texto semi-transparente</button>
```

### Depois:
```jsx
<button className="bg-brand-blue text-text-light">Botão com texto sólido</button>
```

## Referências

- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessible Color Generator](https://learnui.design/tools/accessible-color-generator.html) 