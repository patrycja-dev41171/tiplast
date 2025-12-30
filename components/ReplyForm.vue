<script setup>
const props = defineProps({
  messageId: { type: Number, required: true },
  customerEmail: { type: String, required: true }, // dodajemy email klienta
});

const {addMessageReplies} = useMessagesReplies()

const emit = defineEmits(["sent"]);
const replyText = ref("");

const { getUser } = useAuth()
const user = ref(null);

onMounted(async () => {
  const { data } = await getUser();
  user.value = data.user;
});

const sendReply = async () => {
  if (!replyText.value.trim()) return alert("Wpisz treść odpowiedzi.");

  // 1️⃣ ZAPIS ODPOWIEDZI DO BAZY
  const { error: saveError } = await addMessageReplies({
    message_id: props.messageId,
    author_id: user.value.id,
    author_name: user.value.email,
    reply_text: replyText.value,
  });

  if (saveError) {
    console.error(saveError);
    return alert("Błąd zapisu do historii wiadomości.");
  }

  // 2️⃣ WYSYŁKA E-MAILA DO KLIENTA
  const { error: mailError } = await useFetch("/api/reply", {
    method: "POST",
    body: {
      email: props.customerEmail,
      reply_text: replyText.value,
    }
  });

  if (mailError?.value) {
    console.error(mailError.value);
    return alert("Odpowiedź zapisana, ale mail nie został wysłany!");
  }

  // 3️⃣ Czyszczenie formularza + event dla rodzica
  replyText.value = "";
  emit("sent");

  alert("Odpowiedź wysłana i zapisana!");
};
</script>


<template>
  <div class="reply-form">
    <h3>Odpowiedz</h3>

    <textarea v-model="replyText" rows="4"></textarea>

    <button @click="sendReply">Wyślij</button>
  </div>
</template>
