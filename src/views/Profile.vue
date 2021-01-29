<template>
  <q-page class="q-mt-md">
    <q-form @submit="editProfileActions()">
      <div class="text-h6 text-center text-bold">
        My Profile
      </div>
      <div class="text-caption text-center q-mb-lg text-grey-6">
        {{ userData.email }}
      </div>
      <div class="row q-mb-lg">
        <q-space />
        <q-img
          v-if="isEditActive"
          :src="require(`@/assets/avatars/${info.profileAvatar}.png`)"
          width="100px"
          class="text-center"
        />
        <q-img
          v-if="userData.profileAvatar && !isEditActive"
          :src="require(`@/assets/avatars/${userData.profileAvatar}.png`)"
          width="100px"
          class="text-center"
        />
        <q-space />
      </div>
      <div class="row q-px-md q-mb-md">
        <q-space />
        <q-btn
          icon-right="login"
          label="Logout"
          flat
          dense
          color="red-5"
          size="sm"
          rounded
          @click="logoutCurrentUser()"
        />
      </div>
      <div class="row" v-if="!isEditActive">
        <div class="col-xs-6 q-px-md">
          <q-input
            label="Name"
            filled
            class="full-width q-mb-md"
            disable
            :value="userData.name"
          />
        </div>
        <div class="col-xs-6 q-px-md">
          <q-input
            label="Last name"
            filled
            class="full-width q-mb-md"
            disable
            :value="userData.lastName"
          />
        </div>
        <div class="col-xs-12 q-px-md">
          <q-select
            label="Profile color"
            class="full-width q-mb-md"
            :value="userData.profileColor"
            :options="colorOptions"
            disable
            filled
            emit-value
            map-options
          />
        </div>
        <div class="col-xs-12 q-px-md">
          <q-select
            label="Profile avatar"
            class="full-width q-mb-md"
            :value="userData.profileAvatar"
            :options="avatarOptions"
            disable
            filled
            emit-value
            map-options
          />
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-xs-6 q-px-md">
          <q-input
            filled
            v-model="info.name"
            label="Name"
            class="full-width q-mb-md"
            :color="userData.profileColor"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please insert a name',
            ]"
          />
        </div>
        <div class="col-xs-6 q-px-md">
          <q-input
            filled
            v-model="info.lastName"
            label="Last name"
            :color="userData.profileColor"
            class="full-width q-mb-md"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please insert a name',
            ]"
          />
        </div>
        <div class="col-xs-12 q-px-md">
          <q-select
            label="Profile color"
            class="full-width q-mb-md"
            :color="userData.profileColor"
            v-model="info.profileColor"
            :options="colorOptions"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please select an option',
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
        <div class="col-xs-12 q-px-md">
          <q-select
            label="Profile avatar"
            class="full-width q-mb-md"
            :color="userData.profileColor"
            v-model="info.profileAvatar"
            :options="avatarOptions"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please select an option',
            ]"
            filled
            emit-value
            map-options
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section avatar>
                  <q-avatar size="30px" class="q-mb-sm bg-white">
                    <img
                      :src="require(`@/assets/avatars/${scope.opt.value}.png`)"
                    />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="scope.opt.label" />
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
      <div class="row q-px-md q-mb-md">
        <div class="text-caption text-grey-4 column flex-center">
          v. 1.2.1
        </div>
        <q-space />
        <q-btn
          class="w700"
          :label="!isEditActive ? 'Edit' : 'Save'"
          :color="userData.profileColor"
          push
          type="submit"
          unelevated
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
        profileAvatar: "",
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
      avatarOptions: [
        {
          label: "Artist - Male",
          value: "001-artist",
        },
        {
          label: "Artist - Female",
          value: "002-artist",
        },
        {
          label: "Astronaut - Male",
          value: "003-astronaut",
        },
        {
          label: "Astronaut - Female",
          value: "004-astronaut",
        },
        {
          label: "Carnival - Male",
          value: "005-carnival-mask",
        },
        {
          label: "Carnival - Female",
          value: "006-carnival-mask",
        },
        {
          label: "Doctor - Male",
          value: "007-doctor",
        },
        {
          label: "Doctor - Female",
          value: "008-doctor",
        },
        {
          label: "Judge - Male",
          value: "009-judge",
        },
        {
          label: "Judge - Female",
          value: "010-judge",
        },
        {
          label: "Operator - Male",
          value: "011-operator",
        },
        {
          label: "Moderator - Female",
          value: "012-moderator",
        },
        {
          label: "Pharmacist - Male",
          value: "013-Pharmacist",
        },
        {
          label: "Pharmacist - Female",
          value: "014-Pharmacist",
        },
        {
          label: "Captain - Male",
          value: "015-captain",
        },
        {
          label: "Pilot - Female",
          value: "016-pilot",
        },
        {
          label: "Postman - Male",
          value: "018-postman",
        },
        {
          label: "Post Office - Female",
          value: "017-post-office",
        },
        {
          label: "Seaman - Male",
          value: "019-seaman",
        },
        {
          label: "Navy - Female",
          value: "020-navy",
        },
      ],
    };
  },
  methods: {
    ...mapActions("myAssignaturesStore", ["editProfileInfo"]),
    ...mapActions("authStore", ["logoutCurrentUser"]),
    editProfileActions() {
      if (!this.isEditActive) {
        this.info.name = this.userData.name;
        this.info.lastName = this.userData.lastName;
        this.info.profileColor = this.userData.profileColor;
        this.info.profileAvatar = this.userData.profileAvatar;
        this.isEditActive = true;
      } else {
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
