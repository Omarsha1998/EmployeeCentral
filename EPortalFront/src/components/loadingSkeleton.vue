<template>
  <div>
    <template v-for="rowIndex in rowCount" :key="'row-' + rowIndex">
      <div
        :style="{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '50px',
        }"
        :animation="skeletonAnimation"
      >
        <!-- Skeleton loader for columns -->
        <template v-for="colIndex in columnCount" :key="'col-' + colIndex">
          <div :style="{ flex: 1, display: 'flex', justifyContent: 'center' }">
            <q-skeleton
              :style="{
                height: rowIndex === 1 ? '15px' : '35px',
                width: rowIndex === 1 ? '70%' : '85%',
              }"
              :animation="skeletonAnimation"
            />
          </div>
        </template>
      </div>
    </template>
  </div>

  <div v-if="mobile === true" class="q-pa-xs col-12 grid-style-transition">
    <q-card bordered flat>
      <template v-for="index in 6" :key="index">
        <div
          style="
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 5px;
          "
        >
          <q-skeleton
            :style="{ height: '25px', width: '120px' }"
            :animation="skeletonAnimation"
          />
          <q-skeleton
            :style="{ height: '25px', width: '135px' }"
            :animation="skeletonAnimation"
          />
        </div>
      </template>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 5px;
        "
      >
        <q-skeleton
          :style="{ height: '25px', width: '120px' }"
          :animation="skeletonAnimation"
        />
        <div>
          <q-skeleton
            :style="{ height: '30px', width: '135px' }"
            :animation="skeletonAnimation"
          />
          <q-skeleton
            :style="{ height: '30px', width: '135px' }"
            :animation="skeletonAnimation"
          />
        </div>
      </div>
    </q-card>
  </div>

  <div
    v-if="mobileApproved === true"
    class="q-pa-xs col-12 grid-style-transition"
  >
    <q-card bordered flat>
      <template v-for="index in 6" :key="index">
        <div
          style="
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 5px 5px 5px;
          "
        >
          <q-skeleton
            :style="{ height: '25px', width: '120px' }"
            :animation="skeletonAnimation"
          />
          <q-skeleton
            :style="{ height: '25px', width: '135px' }"
            :animation="skeletonAnimation"
          />
        </div>
      </template>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 5px 5px 5px;
        "
      >
        <q-skeleton
          :style="{ height: '25px', width: '120px' }"
          :animation="skeletonAnimation"
        />
        <div>
          <q-skeleton
            :style="{ height: '25px', width: '135px' }"
            :animation="skeletonAnimation"
          />
        </div>
      </div>
    </q-card>
  </div>

  <div v-if="formDetails === true">
    <template v-for="index in 7" :key="index">
      <q-skeleton
        :style="{ height: '55px', marginBottom: '10px' }"
        :animation="skeletonAnimation"
      />
    </template>

    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }"
    >
      <q-skeleton
        :style="{ height: '35px', width: '170px' }"
        :animation="skeletonAnimation"
      />
    </div>
  </div>

  <div v-if="detailsSkel" class="q-pa-xs col-12 grid-style-transition">
    <q-card bordered flat>
      <template v-for="index in 14" :key="index">
        <div
          style="
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 5px 5px 5px;
          "
        >
          <q-skeleton
            :style="{ height: '25px', width: '120px' }"
            :animation="skeletonAnimation"
          />
          <q-skeleton
            :style="{ height: '25px', width: '130px' }"
            :animation="skeletonAnimation"
          />
        </div>
      </template>
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    rowCount: {
      type: Number,
      default: 0,
    },
    columnCount: {
      type: Number,
      default: 0,
    },
    skeletonAnimations: {
      type: Array,
      default: () => [],
    },
    mobile: Boolean,
    mobileApproved: Boolean,
    formDetails: Boolean,
    detailsSkel: Boolean,
    overtimeForm: Boolean,
  },

  data() {
    return {
      skeletonAnimation: "fade",
    };
  },
};
</script>

<style>
/* Add any additional styles here */
</style>
