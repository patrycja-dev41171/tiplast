<template>
  <div class="banner">
    <div class="container px-6 px-md-0">
      <h1 class="mb-3">Wysokiej jakości produkty z tworzyw sztucznych</h1>
      <h2 class="mb-4 mb-md-6">Zrównoważone materiały na każdą potrzebę</h2>
      <v-btn size="x-large" rounded="0" color="#32aa27" class="btn px-md-10">
        Zobacz nasze produkty
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/styles/variables";

.banner {
  width: 100vw;
  height: 80vh;
  background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.3)
    ),
    url("https://cdn.b12.io/client_media/dUM0XxWY/6cefe74c-e471-11ef-8fbe-0242ac110002-JPG-hero_image.jpeg");
  background-attachment: initial;
  background-size: cover;
  background-position: center;
  background-attachment: initial;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  @include md {
    background-attachment: fixed;
  }
}

.container {
  max-width: 1024px;
  width: 100%;
  margin: auto;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  .btn {
    font-weight: 800;
    font-size: 15px;
    letter-spacing: 1px;
    border-radius: 2px;
  }
  h1,
  h2 {
    letter-spacing: 0.6px;
  }
  @include md {
    h1 {
      font-size: 36px;
    }
  }
}
</style>
