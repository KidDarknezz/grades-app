<template>
  <q-page>
    <div class="fixed-center full-width q-px-md">
      <div class="text-center q-mb-lg">
        logo goes here
      </div>
      <q-card class="full-width">
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Register" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login">
            <q-input
              type="text"
              label="Email"
              filled
              class="q-mb-md"
              v-model="loginUserData.email"
            />
            <q-input
              :type="isPwd ? 'password' : 'text'"
              label="Password"
              filled
              class="q-mb-md"
              v-model="loginUserData.pass"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <q-btn
              push
              class="full-width text-bold"
              color="primary"
              @click="loginUser(loginUserData)"
              :disable="loadingStatus"
            >
              <span v-if="!loadingStatus">Login</span>
              <q-spinner v-else color="white" size="1em" />
            </q-btn>
          </q-tab-panel>

          <q-tab-panel name="register">
            <q-input
              type="text"
              label="Name"
              filled
              class="q-mb-md"
              v-model="registerUserData.name"
            />
            <q-input
              type="text"
              label="Last name"
              filled
              class="q-mb-md"
              v-model="registerUserData.lastName"
            />
            <q-input
              type="text"
              label="Email"
              filled
              class="q-mb-md"
              v-model="registerUserData.email"
            />
            <q-input
              :type="isPwd ? 'password' : 'text'"
              label="Password"
              filled
              class="q-mb-md"
              v-model="registerUserData.pass"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <q-btn
              push
              class="full-width text-bold"
              color="primary"
              @click="registerUser(registerUserData)"
              :disable="loadingStatus"
            >
              <span v-if="!loadingStatus">Register</span>
              <q-spinner v-else color="white" size="1em" />
            </q-btn>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import firebase from "firebase";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      tab: "login",
      loginUserData: {
        email: "",
        pass: "",
      },
      registerUserData: {
        email: "",
        pass: "",
        name: "",
        lastName: "",
      },
      isPwd: true,
    };
  },
  methods: {
    ...mapActions("authStore", ["loginUser", "registerUser"]),
  },
  computed: {
    ...mapState("authStore", ["loadingStatus"]),
  },
  mounted() {
    if (localStorage.getItem("mgAppUid")) {
      this.$router.push("/my-assignatures");
    }
  },
};
</script>
