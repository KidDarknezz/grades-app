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
    <div class="row q-px-md q-pt-lg">
      <q-space />
      <q-btn
        label="Add item"
        flat
        icon-right="add"
        rounded
        :color="selectedAssignature.color"
        dense
        no-caps
      />
      <!-- <div class="text-subtitle2 full-width text-right">
        add item
      </div> -->
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
                    <q-item clickable>
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
        <q-card-section>
          <div class="text-subtitle2 w700">67</div>
        </q-card-section>
      </q-card>
    </div>
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
  },
  mounted() {
    if (!this.selectedAssignature.id) this.$router.push("/");
  },
};
</script>
