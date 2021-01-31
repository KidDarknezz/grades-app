<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-grey-2 text-black">
      <q-toolbar v-if="!$route.fullPath.includes('selected-assignature')">
        <q-toolbar-title>
          <div class="text-h6 w700">
            <span :class="`text-${userData.profileColor}`">my</span>Grades-
          </div>
        </q-toolbar-title>
        <q-btn
          icon-right="get_app"
          label="Install"
          flat
          color="secondary"
          rounded
          size="sm"
          @click="prompt.prompt()"
          v-if="$route.fullPath.includes('profile') && browserMode"
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
    <q-page-container class="bg-grey-2">
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
  props: ["prompt"],
  data() {
    return {
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
  },
  computed: {
    ...mapState("myAssignaturesStore", ["userData", "loadingStatus"]),
    ...mapState("authStore", ["browserMode"]),
  },
  mounted() {
    this.getUserInfoAndAssignatures(localStorage.getItem("mgAppUid"));
  },
};
</script>
