# Diretrizes de Contraste para o Projeto Instauto

## Introdução

Este documento fornece diretrizes para garantir que todas as interfaces do usuário do projeto Instauto atendam aos requisitos mínimos de contraste de acordo com as diretrizes WCAG (Web Content Accessibility Guidelines).

## Requisitos de Contraste

De acordo com as diretrizes WCAG 2.1, o contraste mínimo entre texto e fundo deve ser:

- **4.5:1** para texto normal (menos de 18pt ou menos de 14pt em negrito)
- **3:1** para texto grande (pelo menos 18pt ou 14pt em negrito)

## Paleta de Cores Acessível

### Cores Principais

- **Branco**: #FFFFFF
- **Azul Claro**: #EBF2FF
- **Amarelo Claro**: #FFFBEA
- **Azul**: #0047CC
- **Azul Escuro**: #003DA6
- **Amarelo**: #FFDE59
- **Amarelo Escuro**: #FFD429
- **Preto**: #0A0A0A

### Combinações Seguras

#### Para fundos escuros (azul, azul escuro):
- Use texto branco (#FFFFFF) para corpo de texto
- Use amarelo claro (#FFDE59) para destaques
- Use amarelo (#FFCC00) para botões e elementos interativos

#### Para fundos claros (branco, azul claro, amarelo claro):
- Use texto preto (#0A0A0A) para corpo de texto
- Use azul (#0047CC) para destaques e links
- Use azul escuro (#003DA6) para botões e elementos interativos

### Combinações Problemáticas a Evitar

- **Texto cinza claro em fundo branco**: Use pelo menos cinza #737373 (gray-500) em fundos brancos
- **Texto azul escuro em fundo azul**: Não use tons similares de azul para texto e fundo
- **Texto com opacidade reduzida**: Evite usar classes como `text-white/50` ou `text-black/50` que reduzem muito o contraste

## Implementação

### Utilitário de Verificação de Contraste

Foi implementado um utilitário `useContrastCheck` que pode ser usado para verificar o contraste entre cores:

```typescript
import useContrastCheck from '@/utils/useContrastCheck';

// No seu componente
useContrastCheck('blue', 'white'); // Verifica o contraste entre azul e branco
```

### Componente ContrastChecker

O componente `ContrastChecker` foi adicionado ao projeto para verificar automaticamente o contraste das combinações de cores mais comuns no projeto. Este componente é renderizado apenas em ambiente de desenvolvimento e exibe avisos no console quando encontra problemas de contraste.

Para adicionar novas combinações de cores para verificação, edite o array `colorPairs` no arquivo `src/components/ContrastChecker.tsx`.

## Melhores Práticas

1. **Sempre teste o contraste**: Use ferramentas como o [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) para verificar o contraste entre cores.

2. **Prefira classes de cores completas**: Em vez de usar opacidade (como `text-white/70`), use uma cor sólida com contraste adequado.

3. **Considere diferentes condições visuais**: Lembre-se de que pessoas com diferentes condições visuais podem perceber o contraste de maneira diferente.

4. **Teste em diferentes dispositivos**: O contraste pode parecer diferente em diferentes telas e condições de iluminação.

5. **Documente exceções**: Se houver um caso em que um contraste menor seja aceitável (como em ícones decorativos), documente-o.

## Referências

- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessible Color Generator](https://learnui.design/tools/accessible-color-generator.html) 