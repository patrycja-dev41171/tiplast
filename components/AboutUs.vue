<template>
  <div id="o-nas" class="about-container d-flex flex-wrap pa-6 pa-md-0 mb-md-0">
    <div class="content pr-10">
      <h4>O nas</h4>
      <h3>
        Produkcja i sprzeda wysokiej jakości doniczek z tworzyw sztucznych
      </h3>
      <p>
        TIPLAST firma produkcyjna działająca na rynku produkcji tworzyw
        sztucznych od 2015 roku. Głównym asortymentem naszej oferty jest
        doniczka plastikowa tworzona metodą wtryskową. Materiały używane do
        produkcji pochodzą częściowo z recyklingu. Wszystkie produkty w naszej
        ofercie są tworzone przez nas co gwarantuje wysoką jakość wykonania.
        Jesteśmy otwarci na każdego klienta obsługujemy pojedyncze zamówienia
        jak i te hurtowe.
      </p>
      <p class="mt-3">
        W naszej ofercie znajdą państwo zamówno doniczki przemysłowe idealnie
        nadające się na rozsady jak również misy, które świetnie sprawdzą się
        jako dekoracja ogrodu i domu.
      </p>
      <v-list class="list pa-0 ma-0 mt-6">
        <v-list-item to="/produkty" class="list-item pa-0 ma-0">
          <v-icon color="#32aa27" icon="mdi-play" class="mr-4"></v-icon>
          Doniczki Produkcyjne</v-list-item
        >
        <v-list-item to="/produkty" class="list-item pa-0 ma-0">
          <v-icon color="#32aa27" icon="mdi-play" class="mr-4"></v-icon>
          Misy</v-list-item
        >
        <v-list-item to="/produkty" class="list-item pa-0 ma-0">
          <v-icon color="#32aa27" icon="mdi-play" class="mr-4"></v-icon>
          Misy Wiszące</v-list-item
        >
      </v-list>
      <p class="mt-10 link-content">Jesteś zainteresowany?</p>
      <NuxtLink href="/kontakt" class="link">Napisz do nas!</NuxtLink>
    </div>
    <div class="photo">
      <v-img
        aspect-ratio="16/9"
        cover
        src="/images/about-us.jpeg"
        class="img"
      ></v-img>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/styles/variables";

.about-container {
  scroll-margin-top: 100px;
  max-width: 1024px;
  width: 100%;
  margin: 20px auto;
  div {
    width: 100%;
    margin-bottom: 50px;
    @include md {
      width: 55%;
    }
    @include md {
      margin: 80px auto 0;
    }
  }
  .content {
    h4 {
      color: #32aa27;
      font-size: 17px;
      text-transform: uppercase;
    }
    h3 {
      margin: 15px 0;
      font-size: 26px;
      line-height: 32px;
    }
    @include md {
      margin-left: 0;
    }
  }
  .photo {
    width: 80%;
    display: flex;
    align-items: flex-end;
    margin-bottom: 0;
    @include sm {
      width: 40%;
    }
    @include md {
      align-items: flex-end;
      width: 350px;
      margin-right: 0;
    }
  }
}

.list-item {
  cursor: pointer;
  transition: 0.3s;
  font-weight: 500;

  &:hover {
    color: #32aa27;
  }
}

.link {
  text-decoration: underline;
  font-size: 17px;
  font-weight: 600;
  transition: 0.3s;
  &:hover {
    cursor: pointer;
    color: #32aa27;
  }
}

.link-content {
  font-size: 18px;
}
</style>
