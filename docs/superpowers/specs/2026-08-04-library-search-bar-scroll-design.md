# Barra de pesquisa da biblioteca com rolagem normal

## Objetivo

Fazer a barra de pesquisa da biblioteca permanecer no início do conteúdo e sair da área visível quando o usuário rolar a listagem para baixo.

## Alteração

Remover de `.searchBar`, em `apps/web/src/app/library/library.module.css`, as propriedades `position: sticky`, `top: 0` e `z-index: 20`. O posicionamento volta ao fluxo normal do documento sem necessidade de alterar o componente React.

## Comportamento preservado

- A pesquisa continua filtrando documentos pelo título, nome do arquivo e identificador.
- O botão para limpar a pesquisa e os estilos dos temas claro e escuro permanecem inalterados.
- O espaçamento entre a barra e a grade continua definido por `margin-bottom`.

## Verificação

- Uma checagem automatizada deve confirmar que `.searchBar` não usa posicionamento `sticky` ou `fixed`.
- A checagem de estilo do workspace web deve continuar sem erros causados pela alteração.
