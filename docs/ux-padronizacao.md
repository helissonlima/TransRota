# Padronizacao de UX - TransRota

Este documento define os padroes visuais e de interacao para as telas de listagem do sistema.

## Objetivo

Evitar ajustes manuais pagina por pagina.
As paginas devem consumir componentes e presets centralizados para manter consistencia.

## Fonte Unica de Verdade

Componente central:

- `apps/web/src/components/ui/view-toggle.tsx`

Hook central de estado/persistencia:

- `apps/web/src/lib/use-persisted-view-mode.ts`

Preset central de estrutura visual de cards:

- `apps/web/src/lib/ux-card-presets.ts`

Componente central de feedback (loading/empty):

- `apps/web/src/components/ui/state-feedback.tsx`

Exports principais:

- `ViewModeToggle`
- `VIEW_TOGGLE_PRESETS`
- `ViewToggle` (wrapper legado para grid/list)

Hook principal:

- `usePersistedViewMode`

Preset principal de card:

- `uxSelectableCardClass`
- `UX_CARD_SECTION`

Componente principal de estado:

- `EmptyStateCard`
- `SkeletonRows`

## Presets Oficiais de Visualizacao

- `VIEW_TOGGLE_PRESETS.gridList`: grade/lista
- `VIEW_TOGGLE_PRESETS.cardsList`: cards/lista
- `VIEW_TOGGLE_PRESETS.listCards`: lista/cards
- `VIEW_TOGGLE_PRESETS.tableCards`: tabela/cards

Regra:

- Sempre usar um preset existente.
- Se surgir novo caso de uso, criar preset no arquivo central em vez de copiar botoes na pagina.
- Sempre usar `usePersistedViewMode` para estado de visualizacao quando houver persistencia por tenant.
- Evitar copiar blocos de classes para cards interativos; usar `uxSelectableCardClass` e `UX_CARD_SECTION`.
- Evitar duplicar blocos de loading/vazio; usar `EmptyStateCard` e `SkeletonRows`.
- Na aba Armazem/Relatorios de Produtos, usar vinculo real fornecedor-produto (`supplier.products`) e agregar estoque por produto para evitar duplicidade por localizacao.

## Regras de Interacao

1. Todo item de lista/tabela/card deve abrir detalhe no clique.
2. A mudanca de modo de visualizacao nao pode alterar os dados, apenas a forma de exibir.
3. Estados obrigatorios em ambos os modos:

- loading
- vazio
- selecionado (quando aplicavel)

4. Acoes criticas (excluir, confirmar, pagar etc.) devem manter comportamento identico entre os modos.

## Regras de Layout

1. Toggle de visualizacao deve ficar na toolbar da secao.
2. A ordem dos modos deve seguir o contexto:

- operacional: `listCards`
- analitico/comparativo: `tableCards`
- visao comercial: `cardsList`

3. Labels padrao:

- `Lista`
- `Cards`
- `Tabela`
- `Grade`

## Como Usar

Exemplo cards/lista:

```tsx
import {
  ViewModeToggle,
  VIEW_TOGGLE_PRESETS,
} from "@/components/ui/view-toggle";
import { usePersistedViewMode } from "@/lib/use-persisted-view-mode";

const [viewMode, setViewMode] = usePersistedViewMode<"cards" | "list">({
  defaultMode: "cards",
  allowedModes: ["cards", "list"],
  storageKeyBase: "view-mode:orders",
});

<ViewModeToggle
  mode={viewMode}
  onChange={setViewMode}
  options={VIEW_TOGGLE_PRESETS.cardsList}
/>;
```

Exemplo tabela/cards:

```tsx
const [viewMode, setViewMode] = usePersistedViewMode<"table" | "cards">({
  defaultMode: "table",
  allowedModes: ["table", "cards"],
  storageKeyBase: "view-mode:fiscal",
});

<ViewModeToggle
  mode={viewMode}
  onChange={setViewMode}
  options={VIEW_TOGGLE_PRESETS.tableCards}
/>;
```

## Checklist de Implementacao para Novas Paginas

1. Definir tipo de modo (`"list" | "cards"`, `"table" | "cards"`, etc.).
2. Incluir `ViewModeToggle` com preset oficial.
3. Garantir clique no item abre detalhe em todos os modos.
4. Garantir loading e empty state em todos os modos.
5. Rodar `npx tsc --noEmit`.

## Status da Adocao

Paginas ja migradas para o padrao central:

- Vendas
- Rotas
- KM Diario
- Compras
- Checklists
- Financeiro Fiscal
- Frota
- Motoristas

Paginas com card mode usando preset visual central:

- Compras
- KM Diario
- Checklists (Execucoes em cards)
- Financeiro Fiscal

Paginas com empty/loading state centralizado:

- Vendas
- KM Diario
- Checklists
- Financeiro Fiscal
- Frota
- Motoristas
- Rotas
- Produtos (empty state do catalogo)
