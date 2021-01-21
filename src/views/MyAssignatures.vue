<template>
  <q-page>
    <div class="row" v-for="(assignature, i) in 5" :key="i">
      <div class="col q-pa-md">
        <q-card class="my-card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Assignature name</div>
            <div class="text-subtitle2" v-for="(item, i) in 5" :key="i">
              Item - 00%
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat>Grades</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
