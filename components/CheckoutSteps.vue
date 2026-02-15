<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['change'])

const steps = [
  { id: 1, label: 'Dane adresowe' },
  { id: 2, label: 'Dostawa' },
  { id: 3, label: 'Płatność' }
]

const goToStep = (stepId) => {
  // można cofnąć się tylko do wcześniejszych
  if (stepId < props.currentStep) {
    emit('change', stepId)
  }
}
</script>

<template>
  <nav class="checkout-steps">
    <div
      v-for="step in steps"
      :key="step.id"
      class="step"
      :class="{
        active: step.id === currentStep,
        done: step.id < currentStep,
        disabled: step.id > currentStep
      }"
      @click="goToStep(step.id)"
    >
      <div class="circle">
        {{ step.id }}
      </div>
      <span class="label">{{ step.label }}</span>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.checkout-steps {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
}

.step {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: default;
  color: #9ca3af;

  &.done {
    cursor: pointer;
    color: #374151;

    .circle {
      background: #32aa27;
      color: #fff;
    }
  }

  &.active {
    color: #111827;

    .circle {
      background: #2563eb;
      color: #fff;
    }
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.circle {
  width: 28px;
  min-width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.label {
  font-size: 14px;
  font-weight: 500;
}
</style>
