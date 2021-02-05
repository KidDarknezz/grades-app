<template>
  <q-page>
    <q-banner
      inline-actions
      class="text-white bg-secondary"
      v-if="
        !$route.fullPath.includes('profile') && installBanner && browserMode
      "
    >
      <span class="text-subtitle2">Install this app.</span>
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
    <q-banner
      inline-actions
      class="text-white bg-info"
      v-if="updateBanner && newContent"
    >
      <span class="text-subtitle2">Update available. Relaunch to apply.</span>
      <template v-slot:action>
        <q-btn
          flat
          color="white"
          icon="close"
          size="sm"
          round
          @click="updateBanner = false"
        />
      </template>
    </q-banner>
    <div class="q-pa-md">
      <div class="row q-mt-lg q-mb-lg" v-if="userAssignatures.length > 0">
        <div class="text-subtitle2 text-grey-7">
          Open assignatures
        </div>
      </div>
      <template v-if="userAssignatures.length > 0">
        <div
          class="row bg-white q-py-lg q-pl-lg full-width assignature-card q-mb-md"
          v-for="(assignature, i) in userAssignatures"
          :key="i"
          @click="$router.push(`/selected-assignature/${assignature.id}`)"
        >
          <div class="col-xs-10">
            <div :class="`text-h6 w700 text-${assignature.color}`">
              {{ assignature.name }}
            </div>
          </div>
          <div class="col-xs-2">
            <q-btn
              :color="assignature.color"
              size="sm"
              icon="fas fa-arrow-right"
              class="full-width q-py-sm"
              style="border-radius: 25px 0px 0px 25px;"
              unelevated
            />
          </div>
          <div class="col-xs-12">
            <template v-if="assignature.items.length > 0">
              <div
                class="text-caption text-grey-6"
                v-for="(item, i) in assignature.items"
                :key="i"
              >
                {{ item.name }} - {{ item.percentage }}%
              </div>
            </template>
            <template v-else>
              <div class="text-caption text-grey-6">No items yet.</div>
            </template>
          </div>
        </div>
        <div class="q-py-lg" />
      </template>
      <template v-else>
        <div class="fixed-center full-width text-center">
          <i class="fas fa-graduation-cap fa-6x text-grey-4 q-mb-md"></i>
          <div class="text-h6 text-grey-5">
            No assignatures yet.
          </div>
        </div>
      </template>
    </div>

    <!-- CREATE ASSIGNATURE DIALOG -->
    <q-dialog v-model="newAssignatureDialog" persistent>
      <q-card style="min-width: 350px" class="assignature-card">
        <q-form
          @submit="
            submitAssignatureDialog({
              name: newAssignature.name,
              color: newAssignature.color,
            })
          "
        >
          <q-card-section>
            <div
              :class="`text-h6 gapp-font w700 text-${userData.profileColor}`"
            >
              {{ dialogText }} assignature
            </div>
          </q-card-section>

          <q-card-section>
            <q-input
              filled
              label="Name"
              :color="userData.profileColor"
              v-model="newAssignature.name"
              class="q-mb-md gapp-font"
              :rules="[
                (val) => (val !== null && val !== '') || 'Please insert a name',
              ]"
            />
            <q-select
              filled
              :options="colorOptions"
              :color="userData.profileColor"
              label="Color"
              class="q-mb-md gapp-font"
              v-model="newAssignature.color"
              emit-value
              map-options
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please select a color',
              ]"
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
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
              flat
              label="Cancel"
              @click="clearAssignatureDialog()"
              color="grey-6"
            />
            <q-btn
              flat
              :label="dialogText"
              type="submit"
              :color="userData.profileColor"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- END CREATE ASSIGNATURE DIALOG -->
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: ["new"],
  data() {
    return {
      installBanner: this.returnIfShowInstallPrompt(),
      updateBanner: true,
      dialogText: "",
      newAssignatureDialog: false,
      newAssignature: {
        name: "",
        color: "",
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
    ...mapActions("myAssignaturesStore", [
      "selectAssignature",
      "createNewAssignature",
    ]),
    ...mapActions("authStore", ["getDisplayMode"]),
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
    assignatureAction(action) {
      if (action == "edit") {
        this.dialogText = "Edit";
        this.newAssignatureDialog = true;
        this.newAssignature.name = this.selectedAssignature.name;
        this.newAssignature.color = this.selectedAssignature.color;
      }
      if (action == "new-assignature") {
        this.dialogText = "Create";
        this.newAssignatureDialog = true;
      }
    },
    submitAssignatureDialog(data) {
      if (this.dialogText == "Create") {
        this.createNewAssignature(data);
      }
      if (this.dialogText == "Edit") {
        this.editAssignature({
          assignature: this.selectedAssignature,
          newValues: data,
        });
      }
      this.clearAssignatureDialog();
    },

    clearAssignatureDialog() {
      this.newAssignatureDialog = false;
      this.newAssignature.name = "";
      this.newAssignature.color = "";
    },
  },
  computed: {
    ...mapState("myAssignaturesStore", [
      "userAssignatures",
      "userData",
      "loadingStatus",
      "selectedAssignature",
      "openUserAssignatures",
    ]),
    ...mapState("authStore", ["browserMode", "newContent"]),
  },
  mounted() {
    this.getDisplayMode();
    this.updateBanner = this.newContent;
  },
  watch: {
    new: function() {
      this.dialogText = "Create";
      this.newAssignatureDialog = true;
    },
  },
};
</script>
