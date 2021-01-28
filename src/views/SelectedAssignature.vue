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
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {};
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
