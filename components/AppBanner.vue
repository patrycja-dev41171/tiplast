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
  height: 60vh;
  background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.6),
      rgba(0, 0, 0, 0.3)
    ),
    url("/public/images/banner-home.webp");
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
    background-image: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.2)
      ),
      url("/public/images/banner-home.webp");
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
  h1 {
    font-size: 25px;
  }
  h2 {
    font-size: 20px;
  }
  @include md {
    h1 {
      font-size: 36px;
    }
  }
}
</style>
