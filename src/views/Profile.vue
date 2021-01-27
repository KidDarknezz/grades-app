<template>
  <q-page class="q-mt-md q-px-md">
    <q-form @submit="editProfileActions()">
      <div class="text-h6 text-center text-bold q-mb-lg">
        My Profile
      </div>
      <div class="row" v-if="!isEditActive">
        <q-input
          label="Name"
          filled
          class="full-width q-mb-md"
          disable
          :value="userData.name"
        />
        <q-input
          label="Last name"
          filled
          class="full-width q-mb-md"
          disable
          :value="userData.lastName"
        />
        <q-select
          label="Profile color"
          class="full-width q-mb-md"
          :value="userData.profileColor"
          :options="colorOptions"
          disable
          filled
          emit-value
          map-options
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section avatar>
                <q-icon name="palette" :color="scope.opt.value" />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.label" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="row" v-else>
        <q-input
          filled
          v-model="info.name"
          label="Name"
          class="full-width q-mb-md"
          :rules="[
            (val) => (val !== null && val !== '') || 'Please insert a name',
          ]"
        />
        <q-input
          filled
          v-model="info.lastName"
          label="Last name"
          class="full-width q-mb-md"
          :rules="[
            (val) => (val !== null && val !== '') || 'Please insert a name',
          ]"
        />
        <q-select
          label="Profile color"
          class="full-width q-mb-md"
          v-model="info.profileColor"
          :options="colorOptions"
          :rules="[
            (val) => (val !== null && val !== '') || 'Please select an option',
          ]"
          filled
          emit-value
          map-options
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section avatar>
                <q-icon name="palette" :color="scope.opt.value" />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.label" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="row">
        <q-space />
        <q-btn
          :label="!isEditActive ? 'Edit' : 'Save'"
          :color="userData.profileColor"
          push
          type="submit"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      isEditActive: false,
      info: {
        name: "",
        lastName: "",
        profileColor: "",
      },
      colorOptions: [
        {
          label: "Red",
          value: "red",
        },
        {
          label: "Pink",
          value: "pink",
        },
        {
          label: "Purple",
          value: "purple",
        },
        {
          label: "Deep Purple",
          value: "deep-purple",
        },
        {
          label: "Indigo",
          value: "indigo",
        },
        {
          label: "Blue",
          value: "blue",
        },
        {
          label: "Light Blue",
          value: "light-blue",
        },
        {
          label: "Cyan",
          value: "cyan",
        },
        {
          label: "Teal",
          value: "teal",
        },
        {
          label: "Green",
          value: "green",
        },
        {
          label: "Light Green",
          value: "light-green",
        },
        {
          label: "Lime",
          value: "lime",
        },
        {
          label: "Yellow",
          value: "yellow",
        },
        {
          label: "Amber",
          value: "amber",
        },
        {
          label: "Orange",
          value: "orange",
        },
        {
          label: "Deep Orange",
          value: "deep-orange",
        },
        {
          label: "Brown",
          value: "brown",
        },
        {
          label: "Grey",
          value: "grey",
        },
        {
          label: "Blue Grey",
          value: "blue-grey",
        },
      ],
    };
  },
  methods: {
    ...mapActions("myAssignaturesStore", ["editProfileInfo"]),
    editProfileActions() {
      if (!this.isEditActive) this.isEditActive = true;
      else {
        this.editProfileInfo(this.info);
        this.isEditActive = false;
      }
    },
  },
  computed: {
    ...mapState("myAssignaturesStore", ["userData", "loadingStatus"]),
  },
};
</script>
