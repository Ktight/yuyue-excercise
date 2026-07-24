<template>
  <div class="toolbar">
    <div class="toolbar__main"><slot /></div>
    <div v-if="$slots.actions" class="toolbar__actions"><slot name="actions" /></div>
  </div>
</template>

<style scoped>
.toolbar,
.toolbar__main,
.toolbar__actions {
  display: flex;
  align-items: end;
  gap: var(--space-3);
}
.toolbar {
  justify-content: space-between;
  margin-bottom: var(--space-5);
}
.toolbar__main {
  flex: 1;
  flex-wrap: wrap;
}
@media (max-width: 640px) {
  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }
  .toolbar__actions {
    align-items: stretch;
  }
}
</style>
