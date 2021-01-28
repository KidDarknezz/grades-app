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
        class="q-mb-lg"
        size="md"
        color="white"
        to="/my-assignatures"
      />
      <div class="text-h4 w700 text-white text-center full-width">
        89.56
      </div>
      <div class="text-h6 w600 text-white text-center full-width">
        Final Grade: A
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
  computed: {
    ...mapState("myAssignaturesStore", ["userData", "selectedAssignature"]),
  },
  mounted() {
    if (!this.selectedAssignature.id) this.$router.push("/");
  },
};
</script>
