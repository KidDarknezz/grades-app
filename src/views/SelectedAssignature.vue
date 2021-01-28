<template>
  <q-page>
    <div
      :class="`row bg-${selectedAssignature.color} q-pt-md q-pb-xl q-px-md`"
      style="border-radius: 0px 0px 25px 25px;"
    >
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        class="q-mb-sm"
        size="md"
        color="white"
        to="/my-assignatures"
      />
      <q-space />
      <q-btn color="white" round flat icon="more_vert">
        <q-menu auto-close anchor="bottom middle" self="top end">
          <q-list style="min-width: 175px">
            <q-item clickable>
              <q-item-section
                ><span
                  :class="`gapp-font w600 text-${selectedAssignature.color}`"
                  >Edit assignature</span
                ></q-item-section
              >
            </q-item>
            <q-item
              clickable
              @click="
                archiveAssignature(selectedAssignature);
                $router.push('/my-assignatures');
              "
            >
              <q-item-section>
                <span class="gapp-font w600 text-grey-6"
                  >Close assignature</span
                >
              </q-item-section>
            </q-item>
            <q-item
              clickable
              @click="
                deleteAssignature(selectedAssignature);
                $router.push('/my-assignatures');
              "
            >
              <q-item-section>
                <span class="gapp-font w600">Delete assignature</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <div
        :class="
          `text-subtite2 full-width text-center w700 text-${selectedAssignature.color}-10 q-mb-md`
        "
      >
        {{ selectedAssignature.name }}
      </div>
      <div class="text-h4 w700 text-white text-center full-width">
        {{ calculateFinalGrade(selectedAssignature.items).final }}
      </div>
      <div class="text-h6 w600 text-white text-center full-width">
        Final Grade: {{ calculateFinalGrade(selectedAssignature.items).letter }}
      </div>
    </div>
    <div class="row q-px-md q-pt-lg q-mb-md">
      <q-space />
      <q-btn
        label="Add item"
        flat
        icon-right="add"
        rounded
        :color="selectedAssignature.color"
        dense
        no-caps
        @click="
          dialogText = 'Create';
          newItemDialog = true;
        "
      />
    </div>
    <div class="q-pa-md">
      <q-card
        class="bg-white assignature-card q-mb-md"
        flat
        v-for="(item, i) in selectedAssignature.items"
        :key="i"
      >
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 w700">
                {{ item.name }} - {{ item.percentage }}%
              </div>
              <div class="text-subtitle2 w600" v-if="item.grades.length > 0">
                <span class="text-grey-7">Grade: </span>
                <span :class="`text-${selectedAssignature.color}`">{{
                  calculateAverage(item.grades)
                }}</span>
              </div>
            </div>

            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section
                        ><span
                          :class="
                            `gapp-font w600 text-${selectedAssignature.color}`
                          "
                          >Edit</span
                        ></q-item-section
                      >
                    </q-item>
                    <q-item clickable @click="itemAction(i, 'delete')">
                      <q-item-section>
                        <span class="gapp-font w600 text-grey-7">Delete</span>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none" v-if="item.grades.length > 0">
          <!-- <div class="text-subtitle2 w700">67</div> -->
          <q-list separator>
            <q-item v-for="(grade, j) in item.grades" :key="j">
              <q-item-section>
                <q-item-label class="text-black">{{ grade.grd }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-btn-group flat>
                  <q-btn
                    dense
                    icon="close"
                    class="text-red"
                    size="sm"
                    @click="gradeAction(i, j, 'delete')"
                  />
                  <q-btn
                    dense
                    icon="edit"
                    class="text-warning"
                    size="sm"
                    @click="gradeAction(i, j, 'edit')"
                  />
                </q-btn-group>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn
            flat
            dense
            label="Add grade"
            :color="selectedAssignature.color"
            rounded
            no-caps
          />
        </q-card-actions>
      </q-card>
    </div>
    <!-- NEW ITEM DIALOG -->
    <q-dialog v-model="newItemDialog" persistent>
      <q-card style="min-width: 350px" class="assignature-card">
        <q-form
          @submit="
            submitItemDialog({
              name: newItem.name,
              percentage: newItem.percentage,
            })
          "
        >
          <q-card-section>
            <div
              :class="
                `text-h6 gapp-font w700 text-${selectedAssignature.color}`
              "
            >
              {{ dialogText }} item
            </div>
          </q-card-section>

          <q-card-section>
            <q-input
              filled
              label="Name"
              :color="selectedAssignature.color"
              v-model="newItem.name"
              class="q-mb-md gapp-font"
              :rules="[
                (val) => (val !== null && val !== '') || 'Please insert a name',
              ]"
            />
            <q-input
              type="number"
              filled
              label="Percentage"
              :color="selectedAssignature.color"
              v-model="newItem.percentage"
              class="q-mb-md gapp-font"
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
            <q-btn
              flat
              label="Cancel"
              @click="clearItemDialog()"
              color="grey-6"
            />
            <q-btn
              flat
              :label="dialogText"
              type="submit"
              :color="selectedAssignature.color"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- END NEW ITEM DIALOG -->
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      dialogText: "",
      newAssignatureDialog: false,
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
      selectedItem: {},
      selectedGrade: {},
    };
  },
  methods: {
    ...mapActions("myAssignaturesStore", [
      "selectAssignature",
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

    selectItem(index) {
      this.selectedItem = this.selectedAssignature.items[index];
      this.selectedItem.index = index;
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
    clearItemDialog() {
      this.newItemDialog = false;
      this.newItem.name = "";
      this.newItem.percentage = "";
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
    ...mapState("myAssignaturesStore", ["userData", "selectedAssignature"]),

    validPercentage() {
      let sum = 0;
      this.selectedAssignature.items.forEach((item) => {
        sum += parseInt(item.percentage);
      });
      if (this.dialogText == "Edit") sum -= this.selectedItem.percentage;
      return sum + parseInt(this.newItem.percentage);
    },
  },
  mounted() {
    if (!this.selectedAssignature.id) this.$router.push("/");
  },
};
</script>
