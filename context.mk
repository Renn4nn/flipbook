# Visão Geral da Estrutura: Flipbook App

## Contexto
seguinte eu e minha equipe estamos fazendo uma aplicação aonde o usuario faz um upload de um pdf e ele pode ler esse pdf como se fosse uma revista ou livro etc...mas queremos ir mais alem de apenas uma leitura, queremos que o usuario faça o upload do arquivo e depois gere um link daquele arquivo e ele pode compartilhar para outras pessoas vizualizar aquele mesmo arquivo. os arquivos serão salvos em uma pasta de um servidor local sendo assim não será necessário mongodb.


Este documento detalha o propósito de cada pasta e componente dentro dos diretórios `src/ui` e `src/app` do seu projeto.

## 📁 `src/app` (Rotas e Páginas da Aplicação)

Esta pasta utiliza o App Router do Next.js. Cada subpasta representa uma rota na sua aplicação, e os arquivos dentro delas definem a interface de usuário (UI) e o layout dessas rotas.

*   **`/` (Raiz)**
    *   `page.tsx` e `layout.tsx`: A página inicial (landing page ou redirecionamento) e o layout principal envolvente.
    *   `globals.css`: Os estilos globais da aplicação.
*   **`/view`**
    *   Esta é a rota dedicada à visualização dos flipbooks. Geralmente é a interface que os usuários finais (ou clientes) veem quando um documento é compartilhado.
    *   **`/view/[id]`**: Uma rota dinâmica. O `[id]` representa o identificador único de um documento. O `page.tsx` dentro desta pasta é responsável por buscar os dados do documento correspondente ao ID e renderizar o leitor (Flipbook) para aquele arquivo específico.
*   **`/workspace`**
    *   Esta é a área logada ou o painel de controle do usuário.
    *   `workspace.tsx` e `page.tsx`: Onde o usuário gerencia seus documentos, faz upload de novos arquivos (PDFs), visualiza as miniaturas dos flipbooks criados e acessa as configurações de compartilhamento. É a "área de trabalho" principal.

---

## 🧩 `src/ui` (Interface de Usuário)

Esta pasta concentra todos os blocos de construção visuais da sua aplicação, separados das rotas em si. Isso promove a reutilização de código e a manutenibilidade.

### 🧱 `/components` (Componentes Isolados)

Aqui residem os componentes funcionais e visuais reutilizáveis.

*   **`createbutton`**: Componente de botão estilizado, provavelmente usado para iniciar a ação de criar um novo flipbook (ex: botão flutuante ou botão principal no workspace).
*   **`file-picker`**: A interface de seleção e upload de arquivos. Provavelmente lida com o drag-and-drop ou seleção de PDFs do computador do usuário.
*   **`flipbook`**: **O coração da visualização**. Contém a lógica complexa (que trabalhamos anteriormente) para renderizar o PDF como um livro, lidar com as animações de virada de página (page turn), paginação 3D/CSS, e responsividade do leitor.
*   **`header`**: O componente de cabeçalho (barra superior) da aplicação, contendo menus, perfil do usuário ou títulos.
*   **`modal`**: Estrutura base para janelas modais (pop-ups sobrepostos).
    *   *`flipbook`*: Contém o `ModalFlipbook.tsx` (que você estava editando). É uma janela modal específica, possivelmente usada para pré-visualizar um flipbook dentro do workspace sem precisar navegar para uma nova página inteira.
*   **`sidebar`**: O menu de navegação lateral (barra lateral), muito comum em áreas de dashboard como o `/workspace`.
*   **`skeletons`**: Componentes de "carregamento" (loading states). Eles exibem uma silhueta cinza pulsante no formato do conteúdo que está sendo carregado, melhorando a percepção de performance (UX) antes dos dados do servidor chegarem.
*   **`slider`**: Um componente de controle deslizante. Pode ser usado para dar zoom nas páginas do flipbook, ou para a navegação rápida entre as páginas (uma barra de progresso interativa).
*   **`thumbnail`**: Componente responsável por exibir a capa ou a prévia em miniatura de um documento/flipbook, tipicamente usado nas listas ou grades do `/workspace`.

### 🖼️ `/layout` (Estruturas de Tela)

Componentes que definem a "casca" ou a estrutura de diferentes partes do site.

*   **`FlipBookLayout`**: O layout específico para quando um usuário está visualizando um flipbook (ex: na rota `/view/[id]`). Pode ocultar barras laterais e focar apenas no leitor e numa barra de navegação inferior/superior de leitura.
*   **`main`**: O layout principal padrão, provavelmente usado no `/workspace`, que coordena a posição da `sidebar`, do `header` e do conteúdo central.
*   **`logo`**: O componente visual do logotipo da aplicação, extraído para um layout para ser facilmente incluído no header, sidebar ou tela de login mantendo a consistência visual.

---

## 🛠️ `src/lib` (Bibliotecas, APIs e Utilitários)

Esta pasta atua como o motor lógico da sua aplicação, contendo configurações de API, gerenciamento de estado global e tratamentos de erros. É dividida nas seguintes subpastas:

### 🌐 `/api` (Requisições e Comunicação com o Backend)

Centraliza toda a lógica de comunicação com o servidor e APIs externas usando o `axios`.

*   **`/config`**: Contém as configurações globais do Axios (`axios.ts`), como a base URL e interceptadores (interceptors) para lidar com tokens de autenticação ou cabeçalhos padrão.
*   **`/error`**: Contém utilitários para tratamento de erros, como o `asyncApiTryCatch`, que envelopa as chamadas para garantir que erros de requisição não quebrem a aplicação inesperadamente.
*   **`/request`**: O núcleo de disparos de requisições. Possui duas implementações principais:
    *   `index.ts` (`apiRequest`): Função base (wrapper do Axios) que realiza qualquer tipo de requisição (GET, POST, PUT, DELETE).
    *   `cached.ts` (`cachedApiRequest`): Usa a diretiva `'use cache'` do Next.js 15 e `cacheTag` para realizar chamadas em **Server Components**. Faz cache da resposta do lado do servidor para alta performance.
*   **`/actions`**: Contém Server Actions (`apiAction` em `index.ts`), utilizadas principalmente com forms ou mutações partindo de **Client Components**, podendo inclusive revalidar caches (`updateTag`).
*   **`/hooks`**: Hooks customizados do React (como `useApiResponse`) executados no **Client Side** que utilizam a nova API `use()` do React para resolver as promises vindas do servidor e disparar notificações (Toasts) automáticas de erro/sucesso.

### 🗄️ `/store` (Gerenciamento de Estado)

Hooks de gerenciamento de estado global da UI (provavelmente utilizando Context API ou Zustand).

*   `useFlipbook.ts`: Gerencia o estado do flipbook atual (página atual, zoom, etc).
*   `useFullScreen.ts`: Controla se o usuário está em tela cheia.
*   `useModal.ts`: Gerencia a abertura e fechamento de modais.
*   `useSidebarStore.ts`: Controla se a barra lateral do workspace está expandida ou minimizada.

### 🛡️ Outras Pastas

*   **`/error-boundary`**: Contém o `ErrorBoundary.tsx`, um componente do React para capturar e mostrar mensagens amigáveis em caso de quebras ("crashes") no frontend de forma isolada.
*   **`/types`**: Definições de tipos TypeScript (`action.ts`, `api.ts`) para garantir segurança de tipagem nas chamadas de API.

---

### 💡 Como e Quando Usar Cada Tipo de Requisição?

Na arquitetura atual da pasta `lib/api`, você tem três principais formas de realizar e consumir requisições. O uso correto depende do contexto (Server vs Client) e da ação (Leitura vs Escrita):

#### 1. `cachedApiRequest` (Leitura de Dados em Server Components)
*   **Onde usar:** Em arquivos marcados como Server Components (como o `page.tsx` padrão do App Router, ex: `/view/[id]/page.tsx`).
*   **Quando usar:** Quando você precisa **buscar** (fetch/GET) dados iniciais para renderizar a página antes de chegar ao navegador.
*   **Por que:** Ele utiliza a tag `'use cache'` que salva o resultado em cache no lado do servidor. Isso evita requisições duplicadas à API externa e deixa o carregamento da página absurdamente rápido.
*   **Exemplo Prático:** Buscar os detalhes de um Flipbook do banco de dados ao abrir um link de visualização.

#### 2. `apiAction` (Mutações - Criação, Atualização e Deleção)
*   **Onde usar:** Pode ser invocado a partir de botões ou formulários em Client Components.
*   **Quando usar:** Quando você precisa **enviar** dados para o servidor (ex: criar um novo flipbook, fazer upload de arquivo, excluir um documento, salvar configurações).
*   **Por que:** Ele já está preparado para realizar a ação (`apiRequest` POST/PUT/DELETE) e logo em seguida **invalidar as tags de cache** (`updateTag`). Assim, se você criou um flipbook novo, o cache da lista é "limpo" e as telas são atualizadas automaticamente com os dados frescos.

#### 3. `useApiResponse` com `apiRequest` (Leitura e Tratamento no Client Side)
*   **Onde usar:** Em componentes marcados com `'use client'`.
*   **Quando usar:** Geralmente quando se passa a `Promise` de um Server Component para um Client Component, ou para processar resultados pontuais.
*   **Por que:** O `useApiResponse` cuida de ler a promise (usando o moderno hook `use()`) e, de bônus, se houver qualquer erro na requisição (ex: acesso negado, erro no servidor), ele já dispara automaticamente um alerta flutuante (`toast.error`) na tela para o usuário, economizando várias linhas de boilerplate de tratamento de erro.
