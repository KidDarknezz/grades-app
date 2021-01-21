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
            <q-input type="text" label="Email" filled class="q-mb-md" />
            <q-input type="password" label="Password" filled class="q-mb-md" />
            <q-btn
              label="Login"
              class="full-width text-bold"
              color="primary"
              to="/my-assignatures"
            />
          </q-tab-panel>

          <q-tab-panel name="register">
            <q-input type="text" label="Name" filled class="q-mb-md" />
            <q-input type="text" label="Last name" filled class="q-mb-md" />
            <q-input type="text" label="Email" filled class="q-mb-md" />
            <q-input type="password" label="Password" filled class="q-mb-md" />
            <q-btn
              label="Register"
              class="full-width text-bold"
              color="primary"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      tab: "login",
    };
  },
};
</script>
