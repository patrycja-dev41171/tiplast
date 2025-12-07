<template>
  <div class="about-container pa-6 mb-16">
    <div class="header d-md-flex">
      <div>
        <h4>Idealne do twojego ogrodu</h4>
        <h3>Nasze produkty</h3>
      </div>
      <div class="see-all">
        <NuxtLink href="/produkty">
          Zobacz wszystkie
          <v-icon icon="mdi-chevron-double-right" class="ml-2"></v-icon>
        </NuxtLink>
      </div>
    </div>
    <div class="products">
      <category-card v-for="obj in categories" :key="obj.id" :obj="obj" />
    </div>
  </div>
</template>

<script>
import { categories } from "../database/categories/categories";

export default {
  data() {
    return {
      categories,
    };
  },
};
</script>

<style scoped lang="scss">

.about-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 50px;
  div {
    width: 100%;
  }
  .header {
    width: 100%;
    margin-bottom: 30px;
    h4 {
      color: #32aa27;
      font-size: 17px;
      text-transform: uppercase;
    }
    h3 {
      margin: 15px 0 0;
      font-size: 26px;
      line-height: 32px;
    }
    @include md {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 40px;
    }
  }

  @include md {
    margin: 120px auto;
  }
}

.products {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  @include md {
    justify-content: space-between;
  }
}
.see-all {
  text-align: end;
  transition: color 0.3s ease;
  font-weight: 500;
  a:hover {
    color: #32aa27;
    cursor: pointer;
  }
}
</style>
