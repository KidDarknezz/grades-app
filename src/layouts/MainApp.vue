<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-grey-2 text-black">
      <q-toolbar v-if="!$route.fullPath.includes('selected-assignature')">
        <q-toolbar-title>
          <!-- <q-btn dense flat round icon="menu" @click="drawer = !drawer" /> -->
          <div class="text-h6 w700">
            <span :class="`text-${userData.profileColor}`">my</span>Grades
          </div>
        </q-toolbar-title>
        <q-btn
          rounded
          flat
          label="Install"
          unelevated
          color="secondary"
          icon-right="get_app"
          no-caps
          to="/profile"
          v-if="$route.fullPath.includes('profile') && mode == 'browser tab'"
          @click="deferredPrompt.prompt()"
        />
        <q-btn
          flat
          round
          dense
          :color="userData.profileColor"
          icon="add"
          @click="createNewAssignature = !createNewAssignature"
          v-if="$route.fullPath.includes('my-assignatures')"
        />
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
          <q-avatar
            size="60px"
            class="q-mb-sm bg-white"
            v-if="userData.profileAvatar"
          >
            <img
              :src="require(`@/assets/avatars/${userData.profileAvatar}.png`)"
            />
          </q-avatar>
          <div class="text-weight-bold">
            {{ userData.name }} {{ userData.lastName }}
          </div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container class="bg-grey-2">
      <q-banner
        inline-actions
        class="text-white bg-secondary q-mb-md"
        v-if="
          !$route.fullPath.includes('profile') &&
            installBanner &&
            mode == 'browser tab'
        "
      >
        <span class="text-subtitle2">You can install this app.</span>
        <template v-slot:action>
          <q-btn
            rounded
            flat
            color="white"
            label="Install"
            size="sm"
            icon-right="get_app"
            to="/profile"
          />
          <q-btn
            round
            flat
            color="white"
            icon="close"
            size="sm"
            @click="hideInstallBanner()"
          />
        </template>
      </q-banner>
      <transition name="fade">
        <router-view :new="createNewAssignature" />
      </transition>
    </q-page-container>
    <div
      class="row fixed-bottom bg-grey-2 q-py-xs"
      v-if="!$route.fullPath.includes('selected-assignature')"
    >
      <div class="col">
        <div class="justify-center row">
          <q-btn
            flat
            round
            dense
            icon="list_alt"
            size="lg"
            :color="
              $route.fullPath.includes('my-assignatures')
                ? userData.profileColor
                : 'black'
            "
            to="/my-assignatures"
          />
        </div>
      </div>
      <div class="col">
        <div class="justify-center row">
          <q-btn
            flat
            round
            dense
            icon="inventory_2"
            size="lg"
            :color="
              $route.fullPath.includes('closed-assignatures')
                ? userData.profileColor
                : 'black'
            "
            to="/closed-assignatures"
          />
        </div>
      </div>
      <div class="col">
        <div class="justify-center row">
          <q-btn
            flat
            round
            dense
            size="lg"
            :color="
              $route.fullPath.includes('profile')
                ? userData.profileColor
                : 'black'
            "
            to="/profile"
          >
            <q-avatar size="40px">
              <q-img
                v-if="userData.profileAvatar"
                :src="require(`@/assets/avatars/${userData.profileAvatar}.png`)"
              />
            </q-avatar>
          </q-btn>
        </div>
      </div>
    </div>
    <!-- LOADING DIALOG -->
    <q-dialog
      v-model="loadingStatus"
      persistent
      maximized
      transition-show="fade"
      transition-hide="fade"
    >
      <q-card class="bg-white">
        <div class="fixed-center full-width text-center">
          <div class="text-h5 w700 gapp-font q-mb-md">
            <span :class="`text-${colors[randomColorIndex]}`">my</span>Grades
          </div>
          <q-spinner-dots :color="colors[randomColorIndex]" size="3em" />
        </div>
      </q-card>
    </q-dialog>
    <!-- END LOADING DIALOG -->
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      installBanner: this.returnIfShowInstallPrompt(),
      mode: "",
      deferredPrompt: "",
      drawer: false,
      createNewAssignature: false,
      randomColorIndex: this.returnRandomNumber(),
      colors: [
        "red",
        "pink",
        "purple",
        "deep-purple",
        "indigo",
        "blue",
        "light-blue",
        "cyan",
        "teal",
        "green",
        "light-green",
        "lime",
        "yellow",
        "amber",
        "orange",
        "deep-orange",
        "brown",
        "grey",
        "blue-grey",
      ],
    };
  },
  methods: {
    ...mapActions("myAssignaturesStore", ["getUserInfoAndAssignatures"]),
    ...mapActions("authStore", ["logoutCurrentUser"]),

    returnRandomNumber() {
      return Math.floor(Math.random() * Math.floor(19));
    },
    returnIfShowInstallPrompt() {
      if (localStorage.getItem("mgAppInstallPrompt") == "true") {
        return true;
      } else {
        return false;
      }
    },
    hideInstallBanner() {
      this.installBanner = false;
      localStorage.setItem("mgAppInstallPrompt", false);
    },
    returnDisplayMode() {
      window.addEventListener("DOMContentLoaded", () => {
        let displayMode = "browser tab";
        if (navigator.standalone) {
          displayMode = "standalone-ios";
        }
        if (window.matchMedia("(display-mode: standalone)").matches) {
          displayMode = "standalone";
        }
        this.mode = displayMode;
      });
    },
  },
  computed: {
    ...mapState("myAssignaturesStore", ["userData", "loadingStatus"]),
  },
  mounted() {
    this.returnDisplayMode();
    this.getUserInfoAndAssignatures(localStorage.getItem("mgAppUid"));
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      // Update UI to notify the user they can add to home screen

      // addBtn.addEventListener('click', (e) => {
      //   // hide our user interface that shows our A2HS button
      //   addBtn.style.display = 'none';
      //   // Show the prompt
      //   deferredPrompt.prompt();
      //   // Wait for the user to respond to the prompt
      //   deferredPrompt.userChoice.then((choiceResult) => {
      //       if (choiceResult.outcome === 'accepted') {
      //         console.log('User accepted the A2HS prompt');
      //       } else {
      //         console.log('User dismissed the A2HS prompt');
      //       }
      //       deferredPrompt = null;
      //     });
      // });
    });
  },
};
</script>
