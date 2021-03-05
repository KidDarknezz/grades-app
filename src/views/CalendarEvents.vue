<template>
  <q-page class="q-pa-md">
    <div class="row q-mt-lg q-mb-lg">
      <div class="text-subtitle2 text-grey-7">
        {{ upcomingOnly ? "Upcoming" : "Past" }} events
      </div>
      <q-space />
      <q-btn
        :label="upcomingOnly ? 'see past events' : 'see upcoming events'"
        flat
        size="sm"
        :color="userData.profileColor"
        rounded
        @click="upcomingOnly = !upcomingOnly"
      />
    </div>

    <q-card
      flat
      class="assignature-card q-mb-md"
      v-for="(event, i) in upcomingOnly
        ? returnUpcomingEvents
        : returnPastEvents"
      :key="i"
    >
      <q-card-section>
        <q-item>
          <q-item-section>{{
            formatDate("ddd MMMM Do YYYY", event[0].date, "YYYY/MM/DD")
          }}</q-item-section>
          <q-item-section avatar
            ><em>{{
              calculateRelativeTime("YYYYMMDD", event[0].date)
            }}</em></q-item-section
          >
        </q-item>
      </q-card-section>
      <q-card-section>
        <q-list separator>
          <q-item v-for="(e, i) in event" :key="i">
            <q-item-section avatar>
              <div
                :class="`bg-${e.parentColor} full-width`"
                style="padding: 4px; border-radius: 4px"
              ></div>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-black"
                ><div class="text-bold q-mb-sm">{{ e.name }}</div>
                <div>
                  {{ formatDate("hh:mm a", e.time, "hh:mm") }}
                </div></q-item-label
              >
            </q-item-section>
            <q-item-section avatar>
              <q-btn-group flat rounded v-if="upcomingOnly">
                <q-btn
                  dense
                  icon="close"
                  class="text-red"
                  size="sm"
                  @click="deleteExistingEvent(e.id)"
                />
                <!-- <q-btn dense icon="edit" class="text-warning" size="sm" /> -->
              </q-btn-group>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-dialog v-model="newEventDialog" persistent>
      <q-card style="min-width: 350px" class="assignature-card">
        <q-form
          @submit="
            createNewEvent(newEvent);
            cleanNewEventForm();
            newEventDialog = false;
          "
        >
          <q-card-section>
            <div
              :class="`text-h6 gapp-font w700 text-${userData.profileColor}`"
            >
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
              :rules="[
                (val) => (val !== null && val !== '') || 'Please insert a name',
              ]"
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
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  'Please select an assignature',
              ]"
            />
            <q-input
              filled
              v-model="newEvent.date"
              mask="date"
              :color="userData.profileColor"
              class="q-mb-md"
              readonly
              :rules="[
                (val) =>
                  val >= returnTodayDate() ||
                  'Cannot create events in the past',
              ]"
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
              readonly
              :rules="[
                (val) => (val !== null && val !== '') || 'Please select time',
              ]"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
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
        </q-form>
      </q-card>
    </q-dialog>
    <div style="height: 45px" />
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";

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
      upcomingOnly: true,
    };
  },
  computed: {
    ...mapState("myAssignaturesStore", [
      "userData",
      "loadingStatus",
      "openUserAssignatures",
      "myEvents",
    ]),

    sortEventsByDate() {
      let eventsByDate = {};
      this.myEvents.forEach((event) => {
        if (eventsByDate[`${event.date}`] === undefined) {
          eventsByDate[`${event.date}`] = [];
        }
        eventsByDate[`${event.date}`].push(event);
      });
      const orderedEventsByDate = Object.keys(eventsByDate)
        .sort()
        .reduce((obj, key) => {
          obj[key] = eventsByDate[key];
          return obj;
        }, {});
      return orderedEventsByDate;
    },
    returnUpcomingEvents() {
      const today = this.returnTodayDate();
      let upcoming = [];
      for (let event in this.sortEventsByDate) {
        if (event >= today) upcoming.push(this.sortEventsByDate[event]);
      }
      return upcoming;
    },
    returnPastEvents() {
      const today = this.returnTodayDate();
      let past = [];
      for (let event in this.sortEventsByDate) {
        if (event < today) past.push(this.sortEventsByDate[event]);
      }
      return past;
    },
  },
  methods: {
    ...mapActions("myAssignaturesStore", [
      "createNewEvent",
      "deleteExistingEvent",
    ]),

    returnAssignaturesArray() {
      let options = [];
      this.openUserAssignatures.forEach((assignature) => {
        options.push({
          label: assignature.name,
          value: { assId: assignature.id, assColor: assignature.color },
        });
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
    formatDate(format, date, currFormat) {
      return moment(date, currFormat).locale("en").format(format);
    },
    calculateRelativeTime(format, date) {
      if (
        this.formatDate("YYYYMMDD", date, "YYYY/MM/DD") ==
        this.formatDate("YYYYMMDD", this.returnTodayDate(), "YYYY/MM/DD")
      )
        return "Today";
      else return moment(date, format).fromNow();
    },
    cleanNewEventForm() {
      this.newEvent = {
        name: "",
        assignature: "",
        date: this.returnTodayDate(),
        time: "",
      };
    },
  },
  watch: {
    new: function () {
      this.returnAssignaturesArray();
      this.newEventDialog = true;
    },
  },
};
</script>
