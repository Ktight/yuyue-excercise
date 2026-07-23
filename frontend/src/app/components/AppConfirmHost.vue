<script setup lang="ts">
import AppConfirm from './AppConfirm.vue';
import { confirmState, settleConfirmation } from './confirm.service';
</script>

<template>
  <AppConfirm
    :visible="confirmState.visible"
    :title="confirmState.options?.title"
    :message="confirmState.options?.message"
    :confirm-text="confirmState.options?.confirmText"
    :danger="confirmState.options?.danger"
    @confirm="settleConfirmation(true)"
    @cancel="settleConfirmation(false)"
  />
</template>
