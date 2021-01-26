<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated :class="`bg-${userData.profileColor} text-white`">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn dense flat round icon="menu" @click="drawer = !drawer" />
          {{ returnTitle }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="drawer" side="left" behavior="mobile" elevated>
      <q-scroll-area
        style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
      >
        <q-list padding>
          <q-item
            clickable
            v-ripple
            :active="$route.fullPath.includes('my-assignatures')"
            to="/my-assignatures"
          >
            <q-item-section avatar>
              <q-icon name="list_alt" />
            </q-item-section>

            <q-item-section>
              My assignatures
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="$route.fullPath.includes('closed-assignatures')"
            to="/closed-assignatures"
          >
            <q-item-section avatar>
              <q-icon name="inventory_2" />
            </q-item-section>

            <q-item-section>
              Closed assignatures
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="$route.fullPath.includes('profile')"
            to="/profile"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>

            <q-item-section>
              My account
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="logoutCurrentUser()">
            <q-item-section avatar>
              <q-icon name="login" />
            </q-item-section>

            <q-item-section>
              Logout
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">
            {{ userData.name }} {{ userData.lastName }}
          </div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    ...mapActions("myAssignaturesStore", ["getUserInfoAndAssignatures"]),
    ...mapActions("authStore", ["logoutCurrentUser"]),
  },
  computed: {
    ...mapState("myAssignaturesStore", ["userData"]),
    returnTitle() {
      let title = this.$route.fullPath;
      title = title.replace(/\//g, "");
      title = title.replace(/-/g, " ");
      let first = title[0].toUpperCase();
      title = title.substring(1);
      return `${first}${title}`;
    },
  },
  mounted() {
    this.getUserInfoAndAssignatures(localStorage.getItem("mgAppUid"));
  },
};
</script>
