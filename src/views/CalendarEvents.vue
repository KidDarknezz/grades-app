<template>
  <q-page class="q-pa-md">
    <div class="row q-mt-lg q-mb-lg">
      <div class="text-subtitle2 text-grey-7">Upcoming events</div>
    </div>
    <div class="col">
      <q-card flat class="assignature-card q-mb-md">
        <q-card-section>
          February 14, 2020 -
          <em class="text-caption">12 days until</em>
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
  </q-page>
</template>
