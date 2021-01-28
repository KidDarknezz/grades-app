<template>
  <q-page class="q-pa-md">
    <div class="row q-mt-lg q-mb-lg" v-if="openUserAssignatures.length > 0">
      <div class="text-subtitle2 text-grey-7">Open assignatures</div>
    </div>
    <template v-if="openUserAssignatures.length > 0">
      <div
        class="row bg-white q-py-lg q-pl-lg full-width assignature-card q-mb-md"
        @click="
          selectAssignature({ index: i, ass: openUserAssignatures[i] });
          $router.push('/selected-assignature');
        "
        v-for="(assignature, i) in openUserAssignatures"
        :key="i"
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

    <!-- LOADING DIALOG -->
    <q-dialog
      v-model="loadingStatus"
      persistent
      maximized
      transition-show="fade"
      transition-hide="fade"
    >
      <q-card :class="`bg-white text-grey-7`">
        <div class="fixed-center full-width text-center">
          <q-spinner color="grey-4" size="3em" class="q-mb-lg" />
          <div class="text-h5">Loading...</div>
        </div>
      </q-card>
    </q-dialog>
    <!-- END LOADING DIALOG -->
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: ["new"],
  data() {
    return {
      dialogText: "",
      newAssignatureDialog: false,
      assignatureActions: false,
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
      "deleteAssignature",
      "archiveAssignature",
      "editAssignature",
    ]),

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

    closeAssignature() {
      this.archiveAssignature(this.selectedAssignature);
      this.assignatureDialog = false;
    },

    clearAssignatureDialog() {
      this.newAssignatureDialog = false;
      this.newAssignature.name = "";
      this.newAssignature.color = "";
    },
    calculatePercentageValue(grades, perc) {
      let avg = this.calculateAverage(grades);
      return ((avg * perc) / 100).toFixed(2);
    },
    calculateAverage(grades) {
      let sum = 0;
      grades.forEach((grade) => {
        sum += parseFloat(grade.grd);
      });
      return (sum / grades.length).toFixed(2);
    },
    calculateFinalGrade(items) {
      if (items == undefined) return 0;
      let finalGrade = 0;
      items.forEach((itm) => {
        if (itm.grades.length > 0) {
          finalGrade += parseFloat(
            this.calculatePercentageValue(itm.grades, itm.percentage)
          );
        }
      });
      return {
        final: finalGrade.toFixed(2),
        letter: this.returnGradeInLetter(finalGrade),
      };
    },
    returnGradeInLetter(grade) {
      if (grade > 90) return "A";
      if (grade >= 81 && grade < 91) return "B";
      if (grade >= 71 && grade < 81) return "C";
      if (grade >= 61 && grade < 71) return "D";
      if (grade > 0 && grade < 61) return "F";
      else return "F";
    },
  },
  computed: {
    ...mapState("myAssignaturesStore", [
      "userData",
      "loadingStatus",
      "selectedAssignature",
      "openUserAssignatures",
    ]),

    validPercentage() {
      let sum = 0;
      this.selectedAssignature.items.forEach((item) => {
        sum += parseInt(item.percentage);
      });
      if (this.dialogText == "Edit") sum -= this.selectedItem.percentage;
      return sum + parseInt(this.newItem.percentage);
    },
  },
  watch: {
    new: function() {
      this.dialogText = "Create";
      this.newAssignatureDialog = true;
    },
  },
};
</script>
