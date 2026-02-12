<template>
  <q-virtual-scroll
    v-if="desktop"
    class="virtual-scroll"
    type="table"
    style="max-height: 580px"
    :virtual-scroll-item-size="48"
    :virtual-scroll-sticky-size-start="48"
    :virtual-scroll-sticky-size-end="32"
    :items="items"
  >
    <template v-slot:before>
      <thead class="sticky-thead">
        <tr>
          <th
            v-for="col in columns"
            :key="col.name"
            :style="{ width: 'calc(100% / ' + columns.length + ')' }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
    </template>

    <template v-slot="{ item: row, id }">
      <q-tr :key="id">
        <q-td
          v-for="(col, index) in columns"
          :key="index"
          class="text-center"
          :style="{
            width: col.width || 'auto',
            'white-space': col.name === 'Remarks' ? 'normal' : 'nowrap',
            'word-wrap': col.name === 'Remarks' ? 'break-word' : 'normal',
          }"
        >
          <renderCell
            :row="row"
            :col="col"
            :LeaveTypeLabels="LeaveTypeLabels"
          />
        </q-td>
      </q-tr>
    </template>
  </q-virtual-scroll>

  <q-table
    v-if="tableMobile === true"
    flat
    bordered
    :rows="items2"
    :columns="columns2"
    row-key="year"
    style="max-height: 450px; overflow-y: auto"
    class="virtual-scroll"
    virtual-scroll
    :rows-per-page-options="[0]"
    hide-pagination
  >
    <template v-slot:item="props">
      <div class="q-pa-xs col-12 grid-style-transition">
        <q-card
          bordered
          flat
          :class="{ 'bg-blue-1 text-black': props.rowIndex % 2 !== 1 }"
        >
          <q-list dense>
            <q-item
              v-for="col in props.cols.filter((col) => col.name !== 'desc')"
              :key="col.name"
            >
              <q-item-section>
                <q-item-label>{{ col.label + ":" }}</q-item-label>
              </q-item-section>
              <q-item-label
                class="text-bold text-black"
                caption
                style="padding-top: 7px"
              >
                <renderCell
                  :row="props.row"
                  :col="col"
                  :LeaveTypeLabels="LeaveTypeLabels"
                />
              </q-item-label>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>
  </q-table>

  <q-table
    v-if="tableMobile2 === true"
    grid
    flat
    bordered
    card-class="bg-primary text-white"
    :rows="items"
    :columns="columns"
    row-key="id"
    hide-bottom
    style="max-height: 450px; overflow-y: auto"
    class="virtual-scroll"
    virtual-scroll
    :rows-per-page-options="[0]"
    hide-pagination
  >
    <template v-slot:item="props">
      <div class="q-pa-xs col-12 grid-style-transition">
        <q-card
          bordered
          flat
          :class="{ 'bg-blue-1 text-black': props.rowIndex % 2 !== 1 }"
        >
          <q-list dense>
            <q-item
              v-for="col in props.cols.filter((col) => col.name !== 'desc')"
              :key="col.name"
            >
              <q-item-section>
                <q-item-label>{{ col.label + ":" }}</q-item-label>
              </q-item-section>
              <q-item-label
                class="text-bold text-black"
                caption
                style="padding-top: 7px"
              >
                <renderCell
                  :row="props.row"
                  :col="col"
                  :LeaveTypeLabels="LeaveTypeLabels"
                />
              </q-item-label>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>
  </q-table>
</template>

<script>
import renderCell from "../components/helpers/renderCell.vue";

export default {
  props: {
    items: Array,
    columns: Array,
    items2: Array,
    columns2: Array,
    LeaveTypeLabels: Object,
    tableMobile: Boolean,
    desktop: Boolean,
    tableMobile2: Boolean,
  },
  data() {
    return {};
  },

  components: {
    renderCell,
  },

  methods: {},
};
</script>

<style></style>
