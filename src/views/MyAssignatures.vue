<template>
  <q-page class="q-mt-md">
    <!-- ASSIGNATURES LISt -->
    <div class="row" v-for="(assignature, i) in assignatures" :key="i">
      <div class="col q-px-md q-py-sm">
        <q-card>
          <q-card-section :class="`bg-${assignature.color} text-white`">
            <div class="text-h6">{{ assignature.name }}</div>
          </q-card-section>

          <q-card-section>
            <div
              class="text-subtitle2"
              v-for="(item, i) in assignature.items"
              :key="i"
            >
              {{ item.name }} - {{ item.percentage * 100 }}%
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat @click="selectAssignature(i)">Grades</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <!-- END ASSIGNATURES LIST -->

    <!-- FLOATING BTN -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="accent"
        @click="newAssignatureDialog = true"
      />
    </q-page-sticky>
    <!-- FLOATING BTN -->

    <!-- CREATE ASSIGNATURE DIALOG -->
    <q-dialog v-model="newAssignatureDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">New assignature</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            filled
            autofocus
            label="Name"
            v-model="newAssignature.name"
            class="q-mb-md"
          />
          <q-select
            filled
            :options="colorOptions"
            label="Color"
            class="q-mb-md"
            v-model="newAssignature.color"
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
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Create" v-close-popup />
        </q-card-actions>
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
            {{ calculateFinalGrade(selectedAssignature.items).final }} -
            {{ calculateFinalGrade(selectedAssignature.items).letter }}
          </div>
        </q-card-section>

        <q-card-section v-for="(item, i) in selectedAssignature.items" :key="i">
          <div class="bg-white rounded-borders">
            <q-list bordered separator>
              <q-item :class="`bg-${selectedAssignature.color}-4`">
                <q-item-section>
                  <q-item-label
                    >{{ item.name }} -
                    {{ item.percentage * 100 }}%</q-item-label
                  >
                  <q-item-label caption
                    >Grade: {{ calculateAverage(item.grades) }}</q-item-label
                  >
                </q-item-section>
                <q-item-section avatar>
                  <q-btn-group flat>
                    <q-btn dense icon="delete" />
                    <q-btn dense icon="edit" />
                    <q-btn dense icon="add" class="on-right" />
                  </q-btn-group>
                </q-item-section>
              </q-item>

              <q-item v-for="(grade, i) in item.grades" :key="i">
                <q-item-section>
                  <q-item-label class="text-black">{{ grade }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn-group flat>
                    <q-btn dense icon="close" class="text-red" />
                    <q-btn dense icon="edit" :class="`text-warning`" />
                  </q-btn-group>
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
            />
            <q-fab-action
              label-class="bg-grey-3 text-grey-8"
              external-label
              label-position="left"
              color="warning"
              icon="edit"
              label="Edit assignature"
            />
            <q-fab-action
              label-class="bg-grey-3 text-grey-8"
              external-label
              label-position="left"
              color="info"
              icon="inventory_2"
              label="Close assignature"
            />
            <q-fab-action
              label-class="bg-grey-3 text-grey-8"
              external-label
              label-position="left"
              color="green"
              icon="mail"
              label="Add item"
            />
          </q-fab>
        </div>
      </q-card>
    </q-dialog>
    <!-- END ASSIGNATURE DIALOG -->
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      newAssignatureDialog: false,
      assignatureDialog: false,
      assignatureActions: false,
      selectedAssignature: {},
      newAssignature: {
        name: "",
        color: "",
      },
      assignatures: [
        {
          owner: "djahsvkdkajs12y8",
          name: "Math",
          status: "on-course",
          color: "red",
          items: [
            {
              name: "tests",
              percentage: 0.7,
              grades: [100, 90, 45],
            },
            {
              name: "homeworks",
              percentage: 0.3,
              grades: [90],
            },
          ],
        },
        {
          owner: "djahsvkdkajs12y8",
          name: "Science",
          status: "on-course",
          color: "pink",
          items: [
            {
              name: "tests",
              percentage: 0.5,
              grades: [10, 90, 45],
            },
            {
              name: "homeworks",
              percentage: 0.5,
              grades: [73],
            },
          ],
        },
      ],
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
          label: "cyan",
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
          label: "Verde claro",
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
    selectAssignature(index) {
      this.selectedAssignature = this.assignatures[index];
      this.assignatureDialog = true;
    },
    calculatePercentageValue(grades, perc) {
      let avg = this.calculateAverage(grades);
      return (avg * perc).toFixed(2);
    },
    calculateAverage(grades) {
      let sum = 0;
      grades.forEach((grade) => {
        sum += grade;
      });
      return (sum / grades.length).toFixed(2);
    },
    calculateFinalGrade(items) {
      if (items == undefined) return 0;
      let finalGrade = 0;
      items.forEach((ass) => {
        finalGrade += parseFloat(
          this.calculatePercentageValue(ass.grades, ass.percentage)
        );
      });
      return {
        final: finalGrade,
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
};
</script>
