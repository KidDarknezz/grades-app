<template>
  <q-page class="q-mt-md">
    <!-- ASSIGNATURES LISt -->
    <template v-if="closedUserAssignatures.length > 0">
      <div
        class="row"
        v-for="(assignature, i) in closedUserAssignatures"
        :key="i"
      >
        <div class="col q-px-md q-py-sm">
          <q-card @click="selectAssignature(i)">
            <q-card-section class="bg-grey-4 text-white`">
              <div class="text-h6">
                {{ assignature.name }}
              </div>
            </q-card-section>

            <q-card-section>
              <template v-if="assignature.items.length > 0">
                <div
                  class="text-subtitle2"
                  v-for="(item, i) in assignature.items"
                  :key="i"
                >
                  {{ item.name }} - {{ item.percentage }}%
                </div>
              </template>
              <template v-else>
                <div class="text-subtitle2">No items yet.</div>
              </template>
            </q-card-section>
            <!-- <q-separator />
            <q-card-actions align="right">
              <q-btn flat @click="selectAssignature(i)">Grades</q-btn>
            </q-card-actions> -->
          </q-card>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-h6 fixed-center full-width text-center text-grey-4">
        No assignatures yet.
      </div>
    </template>

    <!-- END ASSIGNATURES LIST -->

    <!-- ASSIGNATURE DIALOG -->
    <q-dialog
      v-model="assignatureDialog"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card :class="`bg-${selectedAssignature.color} text-white`">
        <q-bar>
          <div class="text-h6">{{ selectedAssignature.name }}</div>
          <q-space />
          <q-btn dense flat icon="close" @click="assignatureDialog = false" />
        </q-bar>
        <q-card-section>
          <div class="text-h6 text-center">
            Final Grade:
            {{ calculateFinalGrade(selectedAssignature.items).final }}
            -
            {{ calculateFinalGrade(selectedAssignature.items).letter }}
          </div>
        </q-card-section>

        <q-card-section v-for="(item, i) in selectedAssignature.items" :key="i">
          <div class="bg-white rounded-borders">
            <q-list bordered separator>
              <q-item :class="`bg-${selectedAssignature.color}-4`">
                <q-item-section>
                  <q-item-label
                    >{{ item.name }} - {{ item.percentage }}%</q-item-label
                  >
                  <q-item-label caption v-if="item.grades.length > 0"
                    >Grade: {{ calculateAverage(item.grades) }}</q-item-label
                  >
                </q-item-section>
              </q-item>

              <q-item v-for="(grade, j) in item.grades" :key="j">
                <q-item-section>
                  <q-item-label class="text-black">{{
                    grade.grd
                  }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn-group flat> </q-btn-group>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <div class="fixed-bottom-right q-pa-lg">
          <q-fab
            v-model="assignatureActions"
            label="Actions"
            label-position="left"
            label-class="bg-grey-3 text-purple"
            external-label
            color="purple"
            icon="keyboard_arrow_up"
            direction="up"
            vertical-actions-align="right"
          >
            <q-fab-action
              label-class="bg-grey-3 text-grey-8"
              external-label
              label-position="left"
              color="red"
              icon="delete"
              label="Delete assignature"
              @click="
                deleteAssignature(selectedAssignature);
                assignatureDialog = false;
              "
            />
            <q-fab-action
              label-class="bg-grey-3 text-grey-8"
              external-label
              label-position="left"
              color="info"
              icon="inventory_2"
              label="Re-open assignature"
              @click="reopenAssignature()"
            />
          </q-fab>
        </div>
      </q-card>
    </q-dialog>
    <!-- END ASSIGNATURE DIALOG -->

    <!-- LOADING DIALOG -->
    <q-dialog
      v-model="loadingStatus"
      persistent
      maximized
      transition-show="fade"
      transition-hide="fade"
    >
      <q-card :class="`bg-accent text-white`">
        <div class="fixed-center full-width text-center">
          <q-spinner color="white" size="3em" class="q-mb-lg" />
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
  data() {
    return {
      assignatureDialog: false,
      assignatureActions: false,
      selectedAssignature: {},
      selectedItem: {},
      selectedGrade: {},
    };
  },
  methods: {
    ...mapActions("myAssignaturesStore", [
      "deleteAssignature",
      "unarchiveAssignature",
    ]),

    reopenAssignature() {
      this.unarchiveAssignature(this.selectedAssignature);
      this.assignatureDialog = false;
    },
    selectGrade(index) {
      this.selectedGrade = this.selectedItem.grades[index];
      this.selectedGrade.index = index;
    },
    selectItem(index, action) {
      this.selectedItem = this.selectedAssignature.items[index];
      this.selectedItem.index = index;
      if (action == "new-grade") this.newGradeDialog = true;
    },
    selectAssignature(index) {
      this.selectedAssignature = this.closedUserAssignatures[index];
      this.selectedAssignature.index = index;
      this.assignatureDialog = true;
    },
    itemAction(index, action) {
      if (action == "new-grade") {
        this.selectItem(index, action);
      }
      if (action == "edit") {
        this.dialogText = "Edit";
        this.selectItem(index, action);
        this.newItem.name = this.selectedItem.name;
        this.newItem.percentage = this.selectedItem.percentage;
        this.newItemDialog = true;
      }
      if (action == "delete") {
        this.selectItem(index, action);
        this.deleteItem({
          itm: this.selectedItem,
          ass: this.selectedAssignature,
        });
      }
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
      "closedUserAssignatures",
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
};
</script>
