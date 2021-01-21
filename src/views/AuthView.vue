<template>
  <q-page>
    <div class="fixed-center full-width q-px-md">
      <div>
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
              type="password"
              label="Password"
              filled
              class="q-mb-md"
              v-model="loginUserData.pass"
            />
            <q-btn
              label="Login"
              class="full-width text-bold"
              color="primary"
              @click="loginUser()"
            />
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
              type="password"
              label="Password"
              filled
              class="q-mb-md"
              v-model="registerUserData.pass"
            />
            <q-btn
              class="full-width text-bold"
              color="primary"
              @click="registerUser()"
              :disable="xhrRequest"
            >
              <span v-if="!xhrRequest">Register</span>
              <q-spinner v-else color="white" />
            </q-btn>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import firebase from "firebase";

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
      xhrRequest: false,
    };
  },
  methods: {
    loginUser() {
      console.log("login the user", this.loginUserData);
    },
    registerUser() {
      let v = this;

      this.xhrRequest = true;
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.registerUserData.email,
          this.registerUserData.pass
        )
        .then(
          (resp) => {
            alert("registered successfully!");
            console.log(resp);
          },
          (err) => {
            this.xhrRequest = false;
            alert(`Error - ${err.message}`);
          }
        );
    },
  },
};
</script>
