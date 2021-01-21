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
        email: "amilland29@gmail.com",
        pass: "123456",
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
      let v = this;

      v.xhrRequest = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(
          this.loginUserData.email,
          this.loginUserData.pass
        )
        .then(
          (resp) => {
            v.xhrRequest = false;
            localStorage.setItem("mgAppUid", resp.user.uid);
            this.$router.push("/my-assignatures");
          },
          (err) => {
            v.xhrRequest = false;
            alert(`Error - ${err.message}`);
          }
        );
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
            localStorage.setItem("mgAppUid", resp.user.uid);
            this.registerUserInDatabase(resp.user.uid);
          },
          (err) => {
            this.xhrRequest = false;
            alert(`Error - ${err.message}`);
          }
        );
    },
    registerUserInDatabase(uid) {
      let userData = {
        name: this.registerUserData.name,
        lastName: this.registerUserData.lastName,
        email: this.registerUserData.email,
        profileColor: "primary",
      };
      this.$http
        .post(`https://gradesapp-ccfd8.firebaseio.com/${uid}.json`, userData)
        .then(
          (response) => {
            this.$router.push("/my-assignatures");
          },
          (error) => {
            console.log(error);
          }
        );
    },
  },
};
</script>
