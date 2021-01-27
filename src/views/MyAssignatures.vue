<template>
  <q-page class="q-mt-md">
    <!-- ASSIGNATURES LISt -->
    <template v-if="openUserAssignatures.length > 0">
      <div
        class="row"
        v-for="(assignature, i) in openUserAssignatures"
        :key="i"
      >
        <div class="col q-px-md q-py-sm">
          <q-card @click="selectAssignature(i)">
            <q-card-section :class="`bg-${assignature.color} text-white`">
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

    <!-- FLOATING BTN -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="accent"
        @click="assignatureAction('new-assignature')"
      />
    </q-page-sticky>
    <!-- FLOATING BTN -->

    <!-- CREATE ASSIGNATURE DIALOG -->
    <q-dialog v-model="newAssignatureDialog" persistent>
      <q-card style="min-width: 350px">
        <q-form
          @submit="
            submitAssignatureDialog({
              name: newAssignature.name,
              color: newAssignature.color,
            })
          "
        >
          <q-card-section>
            <div class="text-h6">{{ dialogText }} assignature</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              filled
              autofocus
              label="Name"
              v-model="newAssignature.name"
              class="q-mb-md"
              :rules="[
                (val) => (val !== null && val !== '') || 'Please insert a name',
              ]"
            />
            <q-select
              filled
              :options="colorOptions"
              label="Color"
              class="q-mb-md"
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
            <q-btn flat label="Cancel" @click="clearAssignatureDialog()" />
            <q-btn flat :label="dialogText" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- END CREATE ASSIGNATURE DIALOG -->

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
                <q-item-section avatar>
                  <q-btn-group flat>
                    <q-btn
                      dense
                      icon="delete"
                      @click="itemAction(i, 'delete')"
                    />
                    <q-btn dense icon="edit" @click="itemAction(i, 'edit')" />
                    <q-btn
                      dense
                      icon="add"
                      class="on-right"
                      @click="gradeAction(i, {}, 'new-grade')"
                    />
                  </q-btn-group>
                </q-item-section>
              </q-item>

              <q-item v-for="(grade, j) in item.grades" :key="j">
                <q-item-section>
                  <q-item-label class="text-black">{{
                    grade.grd
                  }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn-group flat>
                    <q-btn
                      dense
                      icon="close"
                      class="text-red"
                      @click="gradeAction(i, j, 'delete')"
                    />
                    <q-btn
                      dense
                      icon="edit"
                      :class="`text-warning`"
                      @click="gradeAction(i, j, 'edit')"
                    />
                  </q-btn-group>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <div class="row q-my-xl" />
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
              color="warning"
              icon="edit"
              label="Edit assignature"
              @click="assignatureAction('edit')"
            />
            <q-fab-action
              label-class="bg-grey-3 text-grey-8"
              external-label
              label-position="left"
              color="info"
              icon="inventory_2"
              label="Close assignature"
              @click="closeAssignature()"
            />
            <q-fab-action
              label-class="bg-grey-3 text-grey-8"
              external-label
              label-position="left"
              color="green"
              icon="add"
              label="Add item"
              @click="
                dialogText = 'Create';
                newItemDialog = true;
              "
            />
          </q-fab>
        </div>
      </q-card>
    </q-dialog>
    <!-- END ASSIGNATURE DIALOG -->

    <!-- NEW ITEM DIALOG -->
    <q-dialog v-model="newItemDialog" persistent>
      <q-card style="min-width: 350px">
        <q-form
          @submit="
            submitItemDialog({
              name: newItem.name,
              percentage: newItem.percentage,
            })
          "
        >
          <q-card-section>
            <div class="text-h6">{{ dialogText }} item</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              filled
              autofocus
              label="Name"
              v-model="newItem.name"
              class="q-mb-md"
              :rules="[
                (val) => (val !== null && val !== '') || 'Please insert a name',
              ]"
            />
            <q-input
              type="number"
              filled
              label="Percentage"
              v-model="newItem.percentage"
              class="q-mb-md"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please insert a value',
                (val) =>
                  (val > 0 && val <= 100) ||
                  'Please insert a value between 1 and 100',
                (val) =>
                  validPercentage <= 100 || 'Total percentage is above 100',
              ]"
            />
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" @click="clearItemDialog()" />
            <q-btn flat :label="dialogText" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- END NEW ITEM DIALOG -->

    <!-- NEW GRADE DIALOG -->
    <q-dialog v-model="newGradeDialog">
      <q-card style="min-width: 350px">
        <q-form @submit="submitGradeDialog(newGrade.grade)">
          <q-card-section>
            <div class="text-h6">{{ dialogText }} grade</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              filled
              autofocus
              type="number"
              label="Grade"
              v-model="newGrade.grade"
              class="q-mb-md"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please insert a value',
                (val) =>
                  (val > 0 && val <= 100) ||
                  'Please insert a value between 1 and 100',
              ]"
            />
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" @click="clearGradeDialog()" />
            <q-btn flat :label="dialogText" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- END NEW GRADE DIALOG -->

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
  data() {
    return {
      dialogText: "",
      newAssignatureDialog: false,
      assignatureDialog: false,
      assignatureActions: false,
      newAssignature: {
        name: "",
        color: "",
      },
      newItemDialog: false,
      newItem: {
        name: "",
        percentage: "",
      },
      newGradeDialog: false,
      newGrade: {
        grade: "",
      },
      selectedAssignature: {},
      selectedItem: {},
      selectedGrade: {},
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
      "createNewAssignature",
      "createNewItem",
      "createNewGrade",
      "deleteAssignature",
      "deleteItem",
      "deleteGrade",
      "editItem",
      "archiveAssignature",
      "editAssignature",
      "editGrade",
    ]),

    selectGrade(index) {
      this.selectedGrade = this.selectedItem.grades[index];
      this.selectedGrade.index = index;
    },
    selectItem(index) {
      this.selectedItem = this.selectedAssignature.items[index];
      this.selectedItem.index = index;
    },
    selectAssignature(index) {
      this.selectedAssignature = this.openUserAssignatures[index];
      this.selectedAssignature.index = index;
      this.assignatureDialog = true;
    },
    itemAction(index, action) {
      if (action == "edit") {
        this.dialogText = "Edit";
        this.selectItem(index);
        this.newItem.name = this.selectedItem.name;
        this.newItem.percentage = this.selectedItem.percentage;
        this.newItemDialog = true;
      }
      if (action == "delete") {
        this.selectItem(index);
        this.deleteItem({
          itm: this.selectedItem,
          ass: this.selectedAssignature,
        });
      }
    },
    gradeAction(i, j, action) {
      this.selectItem(i);
      if (action == "new-grade") {
        this.dialogText = "New";
        this.newGradeDialog = true;
      }
      if (action == "edit") {
        this.selectGrade(j);
        this.dialogText = "Edit";
        this.newGradeDialog = true;
        this.newGrade.grade = this.selectedGrade.grd;
      }
      if (action == "delete") {
        this.selectGrade(j);
        this.deleteGrade({
          ass: this.selectedAssignature,
          itm: this.selectedItem,
          grd: this.selectedGrade,
        });
      }
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
    submitItemDialog(data) {
      if (this.dialogText == "Create") {
        this.createNewItem({
          item: data,
          assId: this.selectedAssignature.id,
        });
      }
      if (this.dialogText == "Edit") {
        this.editItem({
          ass: this.selectedAssignature,
          itm: this.selectedItem,
          newValues: data,
        });
      }
      this.clearItemDialog();
    },
    submitGradeDialog(data) {
      if (this.dialogText == "New") {
        this.createNewGrade({
          ass: this.selectedAssignature,
          itm: this.selectedItem,
          grd: data,
        });
      }
      if (this.dialogText == "Edit") {
        this.editGrade({
          ass: this.selectedAssignature,
          itm: this.selectedItem,
          grd: this.selectedGrade,
          newValues: data,
        });
      }
      this.clearGradeDialog();
    },
    closeAssignature() {
      this.archiveAssignature(this.selectedAssignature);
      this.assignatureDialog = false;
    },
    clearItemDialog() {
      this.newItemDialog = false;
      this.newItem.name = "";
      this.newItem.percentage = "";
    },
    clearGradeDialog() {
      this.newGradeDialog = false;
      this.newGrade.grade = "";
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
};
</script>
