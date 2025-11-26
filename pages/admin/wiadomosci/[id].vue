<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin-client",
});

const route = useRoute();
const { $supabase } = useNuxtApp();

const message = ref(null);
const replies = ref([]);
const loading = ref(true);

const fetchData = async () => {
  const id = route.params.id;

  const { data: msg } = await $supabase
    .from("messages")
    .select("*")
    .eq("id", id)
    .single();

  message.value = msg;

  const { data: rep } = await $supabase
    .from("messages_replies")
    .select("*")
    .eq("message_id", id)
    .order("created_at", { ascending: true });

  replies.value = rep ?? [];

  loading.value = false;
};

onMounted(fetchData);
</script>

<template>
  <div class="message-view" v-if="!loading">

    <!-- 🔙 Powrót -->
    <NuxtLink to="/admin/wiadomosci" class="back-btn">
      ← Powrót do listy
    </NuxtLink>

    <!-- 📨 Nagłówek -->
    <h1>Wiadomość od {{ message.email }}</h1>

    <!-- 📩 Treść wiadomości -->
    <div class="box main-message">
      <p><b>Data:</b> {{ new Date(message.created_at).toLocaleString() }}</p>
      <hr />
      <div v-html="message.message" class="message-content"></div>
    </div>

    <!-- 🔁 Lista odpowiedzi -->
    <!-- <div v-if="replies.length" class="replies">
      <h2>Historia odpowiedzi</h2>

      <div
        v-for="rep in replies"
        :key="rep.id"
        class="reply-item"
      >
        <div class="reply-header">
          <strong>{{ rep.author_name }}</strong>
          <span>{{ new Date(rep.created_at).toLocaleString() }}</span>
        </div>

        <div class="reply-body" v-html="rep.reply_text"></div>
      </div>
    </div> -->

    <!-- ✍️ Form do odpowiedzi -->
    <!-- <ReplyForm :messageId="message.id" @sent="fetchData" /> -->
  </div>
</template>

<style scoped lang="scss">
.message-view {
  max-width: 800px;
  margin: 0 0;
  padding: 20px;
  line-height: 2;
}

.back-btn {
  display: inline-block;
  margin-bottom: 15px;
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.back-btn:hover {
  text-decoration: underline;
}

h1 {
  font-size: 26px;
  margin-bottom: 20px;
}

.main-message {
    hr {margin: 10px 0;}
}

.box {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  margin-bottom: 30px;
}

.message-content p {
  margin: 8px 0;
}

.replies {
  margin-bottom: 40px;
}

.replies h2 {
  font-size: 20px;
  margin-bottom: 15px;
}

.reply-item {
  background: #f9fafb;
  border-left: 4px solid #2563eb;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 10px;
  color: #4b5563;
}

.reply-body {
  padding-left: 4px;
  white-space: pre-wrap;
}
</style>
