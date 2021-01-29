<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");

body {
  overscroll-behavior-y: contain;
}

#app {
  font-family: "Poppins", sans-serif;
}

.gapp-font {
  font-family: "Poppins", sans-serif;
}

.w600 {
  font-weight: 600 !important;
}
.w700 {
  font-weight: 700 !important;
}

.assignature-card {
  border-radius: 15px !important;
}
</style>
