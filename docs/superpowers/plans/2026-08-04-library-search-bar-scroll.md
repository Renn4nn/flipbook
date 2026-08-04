# Library Search Bar Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer a barra de pesquisa da biblioteca sair da área visível junto com o restante do conteúdo durante a rolagem.

**Architecture:** A alteração fica restrita ao CSS Module da página de biblioteca. A barra volta ao fluxo normal do documento; o componente React e a lógica de filtragem não mudam.

**Tech Stack:** Next.js 16, React 19, CSS Modules, Biome.

## Global Constraints

- Preservar a pesquisa por título, nome do arquivo e identificador.
- Preservar o botão de limpeza, os temas claro e escuro e o espaçamento existente.
- Não adicionar dependências ou alterar o componente React.

---

### Task 1: Restaurar a rolagem normal da barra de pesquisa

**Files:**
- Modify: `apps/web/src/app/library/library.module.css:17`
- Test: comportamento computado de `.searchBar` na página `/library`

**Interfaces:**
- Consumes: classe CSS Module `styles.searchBar` já aplicada em `library.tsx`.
- Produces: `.searchBar` com `position` computado como `static` e sem ancoragem ao topo.

- [ ] **Step 1: Registrar a falha atual no navegador**

Abrir `/library`, selecionar o elemento correspondente à barra de pesquisa e avaliar:

```javascript
getComputedStyle(document.querySelector('input[aria-label="Pesquisar livros"]')?.parentElement).position
```

Expected: retorna `sticky`, demonstrando o comportamento indesejado antes da alteração.

- [ ] **Step 2: Implementar a alteração mínima**

Remover somente estas declarações de `.searchBar`:

```css
position: sticky;
top: 0;
z-index: 20;
```

- [ ] **Step 3: Confirmar o comportamento corrigido no navegador**

Repetir a avaliação de estilo computado.

Expected: retorna `static`. Ao rolar o contêiner da biblioteca, a barra sai da área visível junto com os primeiros cartões.

- [ ] **Step 4: Executar as verificações do projeto**

Run:

```powershell
pnpm --filter web check-types
pnpm exec biome check apps/web/src/app/library/library.module.css
git diff --check
```

Expected: todos os comandos terminam com código de saída `0`.

- [ ] **Step 5: Revisar o diff**

Run:

```powershell
git diff -- apps/web/src/app/library/library.module.css
```

Expected: o diff remove apenas `position: sticky`, `top: 0` e `z-index: 20` de `.searchBar`.
