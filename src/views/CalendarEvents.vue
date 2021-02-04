<template>
  <q-page class="q-pa-md">
    <div class="row q-mt-lg q-mb-lg">
      <div class="text-subtitle2 text-grey-7">Upcoming events</div>
    </div>
    <div class="col">
      <q-card flat class="assignature-card q-mb-md">
        <q-card-section>
          <q-item>
            <q-item-section>February 14, 2020</q-item-section>
            <q-item-section avatar><em>12 days until</em></q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section>
          <q-list separator>
            <q-item>
              <q-item-section avatar>
                <div
                  class="bg-purple full-width"
                  style="padding: 4px;border-radius: 4px;"
                ></div>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-black"
                  ><div class="text-bold q-mb-sm">Parcial 1 Matematicas</div>
                  <div>14:30 P.M.</div></q-item-label
                >
              </q-item-section>
              <q-item-section avatar>
                <q-btn-group flat rounded>
                  <q-btn dense icon="close" class="text-red" size="sm" />
                  <q-btn dense icon="edit" class="text-warning" size="sm" />
                </q-btn-group>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="newEventDialog" persistent>
      <q-card style="min-width: 350px" class="assignature-card">
        <q-card-section>
          <div :class="`text-h6 gapp-font w700 text-${userData.profileColor}`">
            New event
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            label="Event name"
            filled
            :color="userData.profileColor"
            class="q-mb-md"
            v-model="newEvent.name"
          />
          <q-select
            filled
            label="Assignature"
            class="q-mb-md"
            :options="assignaturesList"
            :color="userData.profileColor"
            v-model="newEvent.assignature"
            map-options
            emit-value
          />
          <q-input
            filled
            v-model="newEvent.date"
            mask="date"
            :color="userData.profileColor"
            class="q-mb-md"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="newEvent.date"
                    :color="userData.profileColor"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Set"
                        :color="userData.profileColor"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            filled
            v-model="newEvent.time"
            :color="userData.profileColor"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time
                    v-model="newEvent.time"
                    :color="userData.profileColor"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Set"
                        :color="userData.profileColor"
                        flat
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" color="grey-6" v-close-popup />
          <q-btn
            flat
            label="Create"
            type="submit"
            :color="userData.profileColor"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: ["new"],
  data() {
    return {
      newEventDialog: false,
      assignaturesList: [],
      newEvent: {
        name: "",
        assignature: "",
        date: this.returnTodayDate(),
        time: "",
      },
    };
  },
  computed: {
    ...mapState("myAssignaturesStore", [
      "userData",
      "loadingStatus",
      "selectedAssignature",
      "openUserAssignatures",
    ]),
    ...mapState("authStore", ["browserMode", "newContent"]),
  },
  methods: {
    returnAssignaturesArray() {
      let options = [];
      this.openUserAssignatures.forEach((assignature) => {
        options.push({ label: assignature.name, value: assignature.id });
      });
      this.assignaturesList = options;
    },
    returnTodayDate() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = yyyy + "/" + mm + "/" + dd;
      return today;
    },
  },
  watch: {
    new: function() {
      // this.newE = "Create";
      this.returnAssignaturesArray();
      this.newEventDialog = true;
    },
  },
};
</script>
