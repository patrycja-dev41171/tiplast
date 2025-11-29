<template>
  <div class="faq-item" :class="{ open: isOpen }">
    <button class="faq-question" @click="toggle">
      <span>{{ question }}</span>
      <span class="faq-icon">{{ isOpen ? "−" : "+" }}</span>
    </button>

    <div
      ref="content"
      class="faq-content"
      :style="{ height: contentHeight, opacity: contentOpacity }"
    >
      <div class="faq-inner">
        <p>{{ answer }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { ref, nextTick } from "vue";

defineProps({
  question: String,
  answer: String
});

const isOpen = ref(false);
const content = ref(null);
const contentHeight = ref("0px");
const contentOpacity = ref(0);

const toggle = async () => {
  isOpen.value = !isOpen.value;

  await nextTick();

  if (isOpen.value) {
    // OTWIERANIE
    const height = content.value.scrollHeight + "px";
    contentHeight.value = height;
    contentOpacity.value = 1;

    // po animacji ustawiamy height na auto
    setTimeout(() => {
      if (isOpen.value) contentHeight.value = "auto";
    }, 300);
  } else {
    // ZAMYKANIE
    const height = content.value.scrollHeight + "px";

    // ustawiamy height na aktualną wartość
    contentHeight.value = height;
    contentOpacity.value = 1;

    await nextTick();

    // wymuszamy reflow i animujemy do 0
    requestAnimationFrame(() => {
      contentHeight.value = "0px";
      contentOpacity.value = 0;
    });
  }
};
</script>

<style scoped>
.faq-item {
  background: #5ab44317;
  border: 2px solid #e6e6e6;
  border-radius: 4px;
  margin-bottom: 14px;
  overflow: hidden;
  transition: border-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
}

.faq-item.open {
  border-color: #4CAF50;
}

.faq-question {
  width: 100%;
  background: transparent;
  padding: 14px 20px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  cursor: pointer;
  font-weight: 500;
}

.faq-icon {
  font-size: 28px;
  transition: transform 0.3s ease;
}

.faq-item.open .faq-icon {
  transform: rotate(180deg);
}

.faq-content {
  overflow: hidden;
  transition:
    height 0.3s ease,
    opacity 0.25s ease;
}

.faq-inner {
  padding: 0 20px 20px 20px;
  color: #555;
  line-height: 1.35;
}
</style>
