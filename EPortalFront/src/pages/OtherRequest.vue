<template>
  <!---------------------------------------------------------------- PENDING DETAILS DIALOG ---------------------------------------------------------------->
  <q-dialog
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="dialogPendingDetails"
    @hide="this.hidePendingDetailsDialog()"
  >
    <q-card class="q-dialog-plugin">
      <q-card-actions align="right">
        <q-btn
          color="negative"
          label="DELETE THIS REQUEST"
          @click="this.showDeleteDialog(this.latest_selected_request_id)"
        />
        <q-btn
          color="negative"
          label="CLOSE"
          @click="this.hidePendingDetailsDialog()"
        />
      </q-card-actions>

      <div class="q-card__section q-card__section--vert q-dialog__message">
        <span style="font-weight: bold">
          Request ID : {{ this.latest_selected_request_id }}
        </span>
        <br />
        <span v-html="description"></span>
        <div v-if="are_siblings_or_children === false">
          <q-table
            separator="cell"
            flat
            bordered
            title=""
            :rows="pending.details.rows"
            :columns="
              request_type === 'edit'
                ? pending.details.edit.columns
                : pending.details.create.columns
            "
            selection="multiple"
            v-model:selected="this.selected"
            row-key="id"
            :rows-per-page-options="[0]"
            style="cursor: pointer"
          >
            <template v-slot:body="props">
              <q-tr>
                <q-td class="text-center bg-white">
                  <q-checkbox dense v-model="props.selected" />
                </q-td>

                <q-td key="columnName" :props="props" style="width: 20%">
                  {{ props.row.column_name }}
                </q-td>

                <q-td key="from" :props="props" v-if="request_type === 'edit'">
                  <div v-if="props.row.from === null">
                    <span style="color: red">NO PREVIOUS DATA</span>
                  </div>
                  <div v-else-if="props.row.column_name === 'PRC ID'">
                    <a
                      :href="
                        this.url_prc_id +
                        this.latest_selected_request_id +
                        '&statusID=0&folder=from'
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="props.row.column_name === 'MARRIAGE CERTIFICATE'"
                  >
                    <a
                      :href="
                        this.url_marriage_certificate +
                        this.latest_selected_request_id +
                        '&statusID=0&folder=from'
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div v-else>
                    {{ props.row.from }}
                  </div>
                </q-td>

                <q-td key="to" :props="props" v-if="request_type === 'edit'">
                  <div v-if="props.row.column_name === 'PRC ID'">
                    <a
                      :href="
                        this.url_prc_id +
                        this.latest_selected_request_id +
                        '&statusID=0&folder=' +
                        (props.row.from === null ? 'value' : 'to')
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="props.row.column_name === 'MARRIAGE CERTIFICATE'"
                  >
                    <a
                      :href="
                        this.url_marriage_certificate +
                        this.latest_selected_request_id +
                        '&statusID=0&folder=' +
                        (props.row.from === null ? 'value' : 'to')
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="props.row.column_name === 'BIRTH CERTIFICATE'"
                  >
                    <a
                      :href="
                        this.url_birth_certificate +
                        this.latest_selected_request_id +
                        '&statusID=0&folder=value&fileName=' +
                        props.row.to.trim()
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div v-else>
                    {{ props.row.to }}
                  </div>
                </q-td>

                <q-td
                  key="value"
                  :props="props"
                  v-if="request_type === 'create'"
                >
                  <div v-if="props.row.column_name === 'MARRIAGE CERTIFICATE'">
                    <a
                      :href="
                        this.url_marriage_certificate +
                        this.latest_selected_request_id +
                        '&statusID=0&folder=value'
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="props.row.column_name === 'BIRTH CERTIFICATE'"
                  >
                    <a
                      :href="
                        this.url_birth_certificate +
                        this.latest_selected_request_id +
                        '&statusID=0&folder=value&fileName=' +
                        props.row.value.trim()
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="
                      (props.row.column_name === 'TOR' ||
                        props.row.column_name === 'DIPLOMA') &&
                      (props.row.value === 'tor.pdf' ||
                        props.row.value === 'diploma.pdf')
                    "
                  >
                    <a
                      :href="
                        this.url_tor_or_diploma +
                        this.latest_selected_request_id +
                        '&statusID=0&folder=value&document=' +
                        props.row.column_name.trim().toLowerCase()
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="
                      props.row.column_name ===
                      'TRAINING OR SEMINAR CERTIFICATE'
                    "
                  >
                    <a
                      :href="
                        this.url_training_or_seminar_certificate +
                        this.latest_selected_request_id +
                        '&statusID=0&folder=value'
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="
                      props.row.editable_by_hr === true &&
                      (props.row.column_name === 'DEGREE' ||
                        props.row.column_name === 'COURSE' ||
                        props.row.column_name === 'MAJOR')
                    "
                  >
                    <q-input
                      v-model="props.row.value"
                      standout="bg-primary text-white"
                      lazy-rules
                      class="q-pt-none q-pb-xs"
                      maxlength="200"
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'This field is required',
                      ]"
                    >
                    </q-input>
                  </div>
                  <div v-else>
                    {{ props.row.value }}
                  </div>
                </q-td>

                <q-td key="hrRemarks" :props="props">
                  {{ props.row.hr_remarks }}
                </q-td>

                <q-td key="remarksBy" :props="props">
                  {{ props.row.remarks_by }}
                </q-td>

                <q-td key="dateTimeRemarks" :props="props">
                  <span v-if="props.row.date_time_remarks !== null">
                    {{
                      convertToReadableFormatDateTime(
                        props.row.date_time_remarks,
                      )
                    }}
                  </span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div v-else>
          <div
            v-for="item in this.pending.details.rows"
            :key="item.sibling_or_child_full_name"
          >
            <br />
            <b>{{ item.sibling_or_child_full_name }}</b>
            <q-table
              separator="cell"
              flat
              bordered
              title=""
              :rows="item.table_rows"
              :columns="
                request_type === 'edit'
                  ? pending.details.edit.columns
                  : pending.details.create.columns
              "
              selection="multiple"
              v-model:selected="this.selected"
              row-key="id"
              :rows-per-page-options="[0]"
              style="cursor: pointer"
            >
              <template v-slot:body="props">
                <q-tr>
                  <q-td class="text-center bg-white">
                    <q-checkbox dense v-model="props.selected" />
                  </q-td>
                  <q-td key="columnName" :props="props" style="width: 20%">
                    {{ props.row.column_name }}
                  </q-td>

                  <q-td
                    key="from"
                    :props="props"
                    v-if="request_type === 'edit'"
                  >
                    <div v-if="props.row.from === null">
                      <span style="color: red">NO PREVIOUS DATA</span>
                    </div>
                    <div v-else>
                      {{ props.row.from }}
                    </div>
                  </q-td>

                  <q-td key="to" :props="props" v-if="request_type === 'edit'">
                    <div v-if="props.row.column_name === 'BIRTH CERTIFICATE'">
                      <a
                        :href="
                          this.url_birth_certificate +
                          this.latest_selected_request_id +
                          '&statusID=0&folder=value&fileName=' +
                          props.row.to.trim()
                        "
                        target="_blank"
                        style="color: #1681ec"
                        >CLICK HERE</a
                      >
                    </div>
                    <div v-else>
                      {{ props.row.to }}
                    </div>
                  </q-td>

                  <q-td
                    key="value"
                    :props="props"
                    v-if="request_type === 'create'"
                  >
                    <div v-if="props.row.column_name === 'BIRTH CERTIFICATE'">
                      <a
                        :href="
                          this.url_birth_certificate +
                          this.latest_selected_request_id +
                          '&statusID=0&folder=value&fileName=' +
                          props.row.value.trim()
                        "
                        target="_blank"
                        style="color: #1681ec"
                        >CLICK HERE</a
                      >
                    </div>
                    <div v-else>
                      {{ props.row.value }}
                    </div>
                  </q-td>

                  <q-td key="hrRemarks" :props="props">
                    {{ props.row.hr_remarks }}
                  </q-td>

                  <q-td key="remarksBy" :props="props">
                    {{ props.row.remarks_by }}
                  </q-td>

                  <q-td key="dateTimeRemarks" :props="props">
                    <span v-if="props.row.date_time_remarks !== null">
                      {{
                        convertToReadableFormatDateTime(
                          props.row.date_time_remarks,
                        )
                      }}
                    </span>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>

        <!-- <div class="q-mt-md text-black">
        Selected: {{ JSON.stringify(this.selected) }}
        </div> -->

        <div v-if="selected.length > 0">
          <q-card-actions class="justify-center items-center">
            <div class="example-row-equal-width">
              <div class="row">
                <div class="col bg-white">
                  <q-btn
                    color="primary"
                    label="APPROVE"
                    type="button"
                    class="buttonBlock"
                    @click="this.showApproveDialog(employeeID)"
                  ></q-btn>
                </div>
                <div class="col bg-white">
                  <q-btn
                    color="positive"
                    label="SET REMARKS"
                    type="button"
                    class="buttonBlock"
                    @click="this.showSetRemarksDialog(employeeID)"
                  ></q-btn>
                </div>
              </div>
            </div>
          </q-card-actions>
        </div>
      </div>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- PENDING DETAILS DIALOG ---------------------------------------------------------------->

  <!---------------------------------------------------------------- MY APPROVED DETAILS DIALOG ---------------------------------------------------------------->
  <q-dialog
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="dialogMyApprovedDetails"
    @hide="this.hideMyApprovedDetailsDialog()"
  >
    <q-card class="q-dialog-plugin">
      <q-card-actions align="right">
        <q-btn
          color="negative"
          label="CLOSE"
          @click="this.hideMyApprovedDetailsDialog()"
        />
      </q-card-actions>
      <div class="q-card__section q-card__section--vert q-dialog__message">
        <span style="font-weight: bold">
          Request ID : {{ this.latest_selected_request_id }}
        </span>
        <br />
        <span v-html="description"></span>
        <div v-if="are_siblings_or_children === false">
          <q-table
            separator="cell"
            flat
            bordered
            title=""
            :rows="my_approved.details.rows"
            :columns="
              request_type === 'edit'
                ? my_approved.details.edit.columns
                : my_approved.details.create.columns
            "
            row-key="id"
            :rows-per-page-options="[0]"
            style="cursor: pointer"
          >
            <template v-slot:body="props">
              <q-tr>
                <q-td key="dateTimeApproved" :props="props">
                  {{
                    convertToReadableFormatDateTime(
                      props.row.date_time_approved,
                    )
                  }}
                </q-td>
                <q-td key="columnName" :props="props">
                  {{ props.row.column_name }}
                </q-td>

                <q-td key="from" :props="props" v-if="request_type === 'edit'">
                  <div v-if="props.row.from === null">
                    <span style="color: red">NO PREVIOUS DATA</span>
                  </div>
                  <div v-else-if="props.row.column_name === 'PRC ID'">
                    <a
                      :href="
                        this.url_prc_id +
                        this.latest_selected_request_id +
                        '&statusID=1&folder=from'
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="props.row.column_name === 'MARRIAGE CERTIFICATE'"
                  >
                    <a
                      :href="
                        this.url_marriage_certificate +
                        this.latest_selected_request_id +
                        '&statusID=1&folder=from'
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div v-else>
                    {{ props.row.from }}
                  </div>
                </q-td>

                <q-td key="to" :props="props" v-if="request_type === 'edit'">
                  <div v-if="props.row.column_name === 'PRC ID'">
                    <a
                      :href="
                        this.url_prc_id +
                        this.latest_selected_request_id +
                        '&statusID=1&folder=' +
                        (props.row.from === null ? 'value' : 'to')
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="props.row.column_name === 'MARRIAGE CERTIFICATE'"
                  >
                    <a
                      :href="
                        this.url_marriage_certificate +
                        this.latest_selected_request_id +
                        '&statusID=1&folder=' +
                        (props.row.from === null ? 'value' : 'to')
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="props.row.column_name === 'BIRTH CERTIFICATE'"
                  >
                    <a
                      :href="
                        this.url_birth_certificate +
                        this.latest_selected_request_id +
                        '&statusID=1&folder=value&fileName=' +
                        props.row.to.trim()
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div v-else>
                    {{ props.row.to }}
                  </div>
                </q-td>

                <q-td
                  key="value"
                  :props="props"
                  v-if="request_type === 'create'"
                >
                  <div v-if="props.row.column_name === 'MARRIAGE CERTIFICATE'">
                    <a
                      :href="
                        this.url_marriage_certificate +
                        this.latest_selected_request_id +
                        '&statusID=1&folder=value'
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="props.row.column_name === 'BIRTH CERTIFICATE'"
                  >
                    <a
                      :href="
                        this.url_birth_certificate +
                        this.latest_selected_request_id +
                        '&statusID=1&folder=value&fileName=' +
                        props.row.value.trim()
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="
                      (props.row.column_name === 'TOR' ||
                        props.row.column_name === 'DIPLOMA') &&
                      (props.row.value === 'tor.pdf' ||
                        props.row.value === 'diploma.pdf')
                    "
                  >
                    <a
                      :href="
                        this.url_tor_or_diploma +
                        this.latest_selected_request_id +
                        '&statusID=1&folder=value&document=' +
                        props.row.column_name.trim().toLowerCase()
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div
                    v-else-if="
                      props.row.column_name ===
                      'TRAINING OR SEMINAR CERTIFICATE'
                    "
                  >
                    <a
                      :href="
                        this.url_training_or_seminar_certificate +
                        this.latest_selected_request_id +
                        '&statusID=1&folder=value'
                      "
                      target="_blank"
                      style="color: #1681ec"
                      >CLICK HERE</a
                    >
                  </div>
                  <div v-else>
                    {{ props.row.value }}
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div v-else>
          <div
            v-for="item in this.my_approved.details.rows"
            :key="item.sibling_or_child_full_name"
          >
            <br />
            <b>{{ item.sibling_or_child_full_name }}</b>
            <q-table
              separator="cell"
              flat
              bordered
              title=""
              :rows="item.table_rows"
              :columns="
                request_type === 'edit'
                  ? my_approved.details.edit.columns
                  : my_approved.details.create.columns
              "
              row-key="id"
              :rows-per-page-options="[0]"
              style="cursor: pointer"
            >
              <template v-slot:body="props">
                <q-tr>
                  <q-td key="dateTimeApproved" :props="props">
                    {{
                      convertToReadableFormatDateTime(
                        props.row.date_time_approved,
                      )
                    }}
                  </q-td>
                  <q-td key="columnName" :props="props">
                    {{ props.row.column_name }}
                  </q-td>

                  <q-td
                    key="from"
                    :props="props"
                    v-if="request_type === 'edit'"
                  >
                    <div v-if="props.row.from === null">
                      <span style="color: red">NO PREVIOUS DATA</span>
                    </div>
                    <div v-else>
                      {{ props.row.from }}
                    </div>
                  </q-td>

                  <q-td key="to" :props="props" v-if="request_type === 'edit'">
                    <div v-if="props.row.column_name === 'BIRTH CERTIFICATE'">
                      <a
                        :href="
                          this.url_birth_certificate +
                          this.latest_selected_request_id +
                          '&statusID=1&folder=value&fileName=' +
                          props.row.to.trim()
                        "
                        target="_blank"
                        style="color: #1681ec"
                        >CLICK HERE</a
                      >
                    </div>
                    <div v-else>
                      {{ props.row.to }}
                    </div>
                  </q-td>

                  <q-td
                    key="value"
                    :props="props"
                    v-if="request_type === 'create'"
                  >
                    <div v-if="props.row.column_name === 'BIRTH CERTIFICATE'">
                      <a
                        :href="
                          this.url_birth_certificate +
                          this.latest_selected_request_id +
                          '&statusID=1&folder=value&fileName=' +
                          props.row.value.trim()
                        "
                        target="_blank"
                        style="color: #1681ec"
                        >CLICK HERE</a
                      >
                    </div>
                    <div v-else>
                      {{ props.row.value }}
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- MY APPROVED DETAILS DIALOG ---------------------------------------------------------------->

  <!---------------------------------------------------------------- PLEASE CHECK ALL FIELDS DIALOG ---------------------------------------------------------------->
  <q-dialog
    ref="dialogPleaseCheckAllFields"
    @hide="this.$refs.dialogPleaseCheckAllFields.hide()"
  >
    <q-card class="q-dialog-plugin">
      <div class="q-card__section q-card__section--vert q-dialog__message">
        Please check all fields. This is required.
      </div>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="OK"
          @click="this.$refs.dialogPleaseCheckAllFields.hide()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- PLEASE CHECK ALL FIELDS DIALOG ---------------------------------------------------------------->

  <!---------------------------------------------------------------- PLEASE CHECK ALL FIELDS PER PERSON DIALOG ---------------------------------------------------------------->
  <q-dialog
    ref="dialogPleaseCheckAllFieldsPerPerson"
    @hide="this.$refs.dialogPleaseCheckAllFieldsPerPerson.hide()"
  >
    <q-card class="q-dialog-plugin">
      <div class="q-card__section q-card__section--vert q-dialog__message">
        Please check all fields per person. This is required.
      </div>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="OK"
          @click="this.$refs.dialogPleaseCheckAllFieldsPerPerson.hide()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- PLEASE CHECK ALL FIELDS PER PERSON DIALOG ---------------------------------------------------------------->

  <!---------------------------------------------------------------- APPROVE DIALOG FOR PENDING ---------------------------------------------------------------->
  <q-dialog ref="dialogApprove" @hide="this.hideApproveDialog()">
    <q-card class="q-dialog-plugin">
      <div class="q-card__section q-card__section--vert q-dialog__message">
        Are you sure you want to approve?
      </div>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="YES"
          class="btnYes"
          @click="this.approveRequest()"
        />
        <q-btn color="negative" label="NO" @click="this.hideApproveDialog()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- APPROVE DIALOG FOR PENDING ---------------------------------------------------------------->

  <!---------------------------------------------------------------- DELETE DIALOG FOR PENDING ---------------------------------------------------------------->
  <q-dialog ref="dialogDelete" @hide="this.hideDeleteDialog()">
    <q-card class="q-dialog-plugin">
      <div class="q-card__section q-card__section--vert q-dialog__message">
        Are you sure you want to delete this request?
      </div>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="YES"
          class="btnYes"
          @click="this.deleteRequest()"
        />
        <q-btn color="negative" label="NO" @click="this.hideDeleteDialog()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- DELETE DIALOG FOR PENDING ---------------------------------------------------------------->

  <!---------------------------------------------------------------- SET REMARKS DIALOG FOR PENDING ---------------------------------------------------------------->
  <q-dialog ref="dialogSetRemarks" @hide="this.hideSetRemarksDialog()">
    <q-card class="q-dialog-plugin">
      <q-form
        method="post"
        @submit.prevent="this.setHRRemarks()"
        autocomplete="off"
      >
        <div class="col-lg-6 col-md-12 col-sm-12 col-12">
          <q-item-label class="cardStyle"
            >Please fill up your Remarks, before clicking the SUBMIT button.
          </q-item-label>
          <q-input
            style="margin: 10px"
            filled
            autogrow
            v-model="hr_remarks"
            label="Remarks"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'This field is required',
            ]"
          >
          </q-input>
        </div>

        <q-card-actions align="right">
          <q-btn color="primary" label="SUBMIT" type="submit" />
          <q-btn
            color="negative"
            label="CANCEL"
            type="button"
            id="btnCancel"
            @click="this.hideSetRemarksDialog()"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- SET REMARKS DIALOG FOR PENDING ---------------------------------------------------------------->

  <q-pull-to-refresh @refresh="this.refresh()">
    <TitleForPage :title="'Other Request'" :icon="'mail'"></TitleForPage>

    <div class="q-pa-md">
      <div class="q-gutter-y-md">
        <q-card>
          <q-tabs
            v-model="this.tab"
            dense
            class="bg-grey-2 text-grey-7"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            inline-label
            outside-arrows
            mobile-arrows
          >
            <q-tab
              name="pending"
              :label="'PENDING (' + this.pending.total + ')'"
            />
            <q-tab
              name="myApproved"
              :label="'MY APPROVED (' + this.my_approved.total + ')'"
            />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="pending">
              <q-form
                class="q-gutter-md"
                method="post"
                @submit.prevent="onSearch"
                autocomplete="off"
              >
                <div class="row">
                  <q-item-label
                    >Pending Request :
                    {{ this.pending.minimum_date_with_pending_request }}
                  </q-item-label>
                </div>
                <div class="row">
                  <div class="col-6 col-md-4" style="margin-right: 20px">
                    <q-input
                      type="date"
                      label="DATE FROM"
                      v-model="this.pending.search.date_from"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'This field is required',
                        (val) =>
                          val <= this.pending.search.date_to ||
                          'DATE FROM MUST BE LOWER OR EQUAL TO DATE TO',
                      ]"
                    >
                    </q-input>
                  </div>
                  <div class="col-6 col-md-4">
                    <q-input
                      type="date"
                      label="DATE TO"
                      v-model="this.pending.search.date_to"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'This field is required',
                        (val) =>
                          val >= this.pending.search.date_from ||
                          'DATE TO MUST BE GREATER OR EQUAL TO DATE FROM',
                      ]"
                    >
                    </q-input>
                  </div>
                  <div class="col-6 col-md-3">
                    <q-btn
                      style="margin: 20px"
                      id="btnSearch"
                      color="primary"
                      label="SEARCH"
                      icon="search"
                      type="submit"
                    ></q-btn>
                  </div>
                </div>
              </q-form>

              <q-table
                separator="cell"
                flat
                bordered
                title=""
                :rows="pending.header.rows"
                :columns="pending.header.columns"
                v-model:selected="this.selected"
                row-key="request_id"
                virtual-scroll
                :rows-per-page-options="[0]"
                style="cursor: pointer; height: 400px"
                class="my-sticky-header-table"
              >
                <template v-slot:body="props">
                  <q-tr
                    :props="props"
                    :class="[rowSelected(props.row), rowStyle(props.row)]"
                    @click="
                      showPendingDetailsDialog(
                        props.row.description,
                        props.row.request_id,
                      )
                    "
                    style="height: auto"
                  >
                    <q-td key="requestID" :props="props">
                      #{{ props.row.request_id }}
                    </q-td>

                    <q-td key="stats" :props="props">
                      {{ props.row.stats }}
                    </q-td>

                    <q-td
                      key="requestedFields"
                      :props="props"
                      style="white-space: normal"
                    >
                      {{ props.row.requested_fields }}
                    </q-td>

                    <q-td key="dateTimeCreated" :props="props">
                      {{
                        convertToReadableFormatDateTime(
                          props.row.date_time_created,
                        )
                      }}
                    </q-td>

                    <q-td key="createdBy" :props="props">
                      {{ props.row.created_by }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-tab-panel>

            <q-tab-panel name="myApproved">
              <q-form
                class="q-gutter-md"
                method="post"
                @submit.prevent="onSearch"
                autocomplete="off"
              >
                <div class="row">
                  <div class="col-6 col-md-4" style="margin-right: 20px">
                    <q-input
                      type="date"
                      label="DATE FROM"
                      v-model="this.my_approved.search.date_from"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'This field is required',
                        (val) =>
                          val <= this.my_approved.search.date_to ||
                          'DATE FROM MUST BE LOWER OR EQUAL TO DATE TO',
                      ]"
                    >
                    </q-input>
                  </div>
                  <div class="col-6 col-md-4">
                    <q-input
                      type="date"
                      label="DATE TO"
                      v-model="this.my_approved.search.date_to"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'This field is required',
                        (val) =>
                          val >= this.my_approved.search.date_from ||
                          'DATE TO MUST BE GREATER OR EQUAL TO DATE FROM',
                      ]"
                    >
                    </q-input>
                  </div>
                  <div class="col-6 col-md-3">
                    <q-btn
                      style="margin: 20px"
                      id="btnSearch"
                      color="primary"
                      label="SEARCH"
                      icon="search"
                      type="submit"
                    ></q-btn>
                  </div>
                </div>
              </q-form>

              <q-table
                separator="cell"
                flat
                bordered
                title=""
                :rows="my_approved.header.rows"
                :columns="my_approved.header.columns"
                row-key="request_id"
                virtual-scroll
                :rows-per-page-options="[0]"
                style="cursor: pointer; height: 400px"
                class="my-sticky-header-table"
              >
                <template v-slot:body="props">
                  <q-tr
                    :props="props"
                    :class="
                      props.row.request_id == latest_selected_request_id
                        ? 'bg-primary text-white'
                        : 'bg-white text-black'
                    "
                    @click="
                      showMyApprovedDetailsDialog(
                        props.row.description,
                        props.row.request_id,
                      )
                    "
                    style="height: auto"
                  >
                    <q-td key="requestID" :props="props">
                      #{{ props.row.request_id }}
                    </q-td>

                    <q-td key="stats" :props="props">
                      {{ props.row.stats }}
                    </q-td>

                    <q-td
                      key="requestedFields"
                      :props="props"
                      style="white-space: normal"
                    >
                      {{ props.row.requested_fields }}
                    </q-td>

                    <q-td key="dateTimeCreated" :props="props">
                      {{
                        convertToReadableFormatDateTime(
                          props.row.date_time_created,
                        )
                      }}
                    </q-td>

                    <q-td key="createdBy" :props="props">
                      {{ props.row.created_by }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-pull-to-refresh>
</template>


<script>
// -------------------- Notify plugins --------------------
import { useQuasar } from "quasar";
let $q;
// -------------------- Notify plugins --------------------

import helperMethods from "src/helperMethods";
import { defineComponent } from "vue";
import TitleForPage from "../components/TitleForPage.vue";

export default defineComponent({
  name: "OtherRequest",
  components: {
    TitleForPage,
  },
  computed: {
    token() {
      return this.$store.getters["user_module/token"];
    },
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
    otherRequests() {
      return this.$store.getters["other_requests_module/other_requests"];
    },
    minusDays() {
      return 366;
    },
    dateToday() {
      return helperMethods.getDateToday();
    },
  },
  mounted: function () {
    $q = useQuasar();
    this.pending.search.date_to = this.dateToday;
    this.pending.search.date_from = helperMethods.getDateMinusDays(
      this.minusDays,
    );
    this.my_approved.search.date_to = this.dateToday;
    this.my_approved.search.date_from = helperMethods.getDateMinusDays(
      this.minusDays,
    );
  },
  created: async function () {
    this.url_marriage_certificate =
      process.env.BACKEND_REST_API_URL +
      helperMethods.getControllerBase() +
      "uploads/get-marriage-certificate?token=" +
      this.token +
      "&requestID=";
    this.url_prc_id =
      process.env.BACKEND_REST_API_URL +
      helperMethods.getControllerBase() +
      "uploads/get-prc-id?token=" +
      this.token +
      "&requestID=";
    this.url_tor_or_diploma =
      process.env.BACKEND_REST_API_URL +
      helperMethods.getControllerBase() +
      "uploads/get-tor-or-diploma?token=" +
      this.token +
      "&requestID=";
    this.url_birth_certificate =
      process.env.BACKEND_REST_API_URL +
      helperMethods.getControllerBase() +
      "uploads/get-birth-certificate?token=" +
      this.token +
      "&requestID=";
    this.url_training_or_seminar_certificate =
      process.env.BACKEND_REST_API_URL +
      helperMethods.getControllerBase() +
      "uploads/get-training-or-seminar-certificate?token=" +
      this.token +
      "&requestID=";

    const $q = this.$q;
    $q.loading.show({
      message: "RETRIEVING RECORDS. PLEASE WAIT ...",
    });
    await this.getData(null);
    $q.loading.hide();

    setTimeout(() => {
      let value = $q.localStorage.getItem("needToOpen");
      if (value !== null) {
        if (this.pending.header.rows.length === 0) {
          $q.localStorage.remove("needToOpen");
          return;
        }

        const arrayOfString = value.split(";");
        let description = arrayOfString[0];
        let requestID = helperMethods.toNumber(arrayOfString[1]);
        this.showPendingDetailsDialog(description, requestID);
      }
    }, 2);
  },
  data: function () {
    return {
      url_marriage_certificate: null,
      url_prc_id: null,
      url_tor_or_diploma: null,
      url_birth_certificate: null,
      url_training_or_seminar_certificate: null,
      request_type: null,
      are_siblings_or_children: false,
      selected: [],
      latest_selected_request_id: 0,
      description: null,
      hr_remarks: null,
      tab: "pending",
      pending: {
        total: 0,
        minimum_date_with_pending_request: null,
        search: {
          date_from: null,
          date_to: null,
        },
        header: {
          columns: [
            {
              name: "requestID",
              required: true,
              label: "Request ID",
              align: "left",
              sortable: true,
              field: (row) => row.request_id,
            },
            {
              name: "stats",
              required: true,
              label: "",
              align: "left",
              sortable: true,
              field: (row) => row.stats,
            },
            {
              name: "requestedFields",
              required: true,
              label: "Requested Fields",
              align: "left",
              sortable: true,
              style:
                "max-width: 200px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;",
              field: (row) => row.requested_fields,
            },
            {
              name: "dateTimeCreated",
              required: true,
              label: "Date Time Created",
              align: "left",
              sortable: true,
              field: (row) => row.date_time_created,
            },
            {
              name: "createdBy",
              required: true,
              label: "Requested By",
              align: "left",
              sortable: true,
              field: (row) => row.created_by,
            },
          ],
          rows: [],
        },
        details: {
          edit: {
            columns: [
              {
                name: "columnName",
                required: true,
                label: "COLUMN NAME",
                align: "center",
                sortable: true,
                field: (row) => row.column_name,
              },
              {
                name: "from",
                required: true,
                label: "FROM",
                align: "center",
                sortable: true,
                field: (row) => row.from,
              },
              {
                name: "to",
                required: true,
                label: "TO",
                align: "center",
                sortable: true,
                field: (row) => row.to,
              },
              {
                name: "hrRemarks",
                required: true,
                label: "HR REMARKS",
                align: "center",
                sortable: true,
                field: (row) => row.hr_remarks,
              },
              {
                name: "remarksBy",
                required: true,
                label: "REMARKS BY",
                align: "center",
                sortable: true,
                field: (row) => row.remarks_by,
              },
              {
                name: "dateTimeRemarks",
                required: true,
                label: "DATE TIME REMARKS",
                align: "center",
                sortable: true,
                field: (row) => row.date_time_remarks,
              },
            ],
          },
          create: {
            columns: [
              {
                name: "columnName",
                required: true,
                label: "COLUMN NAME",
                align: "center",
                sortable: true,
                field: (row) => row.column_name,
              },
              {
                name: "value",
                required: true,
                label: "VALUE",
                align: "center",
                sortable: true,
                field: (row) => row.value,
              },
              {
                name: "hrRemarks",
                required: true,
                label: "HR REMARKS",
                align: "center",
                sortable: true,
                field: (row) => row.hr_remarks,
              },
              {
                name: "remarksBy",
                required: true,
                label: "REMARKS BY",
                align: "center",
                sortable: true,
                field: (row) => row.remarks_by,
              },
              {
                name: "dateTimeRemarks",
                required: true,
                label: "DATE TIME REMARKS",
                align: "center",
                sortable: true,
                field: (row) => row.date_time_remarks,
              },
            ],
          },
          rows: null,
        },
      },
      my_approved: {
        total: 0,
        search: {
          date_from: null,
          date_to: null,
        },
        header: {
          columns: [
            {
              name: "requestID",
              required: true,
              label: "Request ID",
              align: "left",
              sortable: true,
              field: (row) => row.request_id,
            },
            {
              name: "stats",
              required: true,
              label: "",
              align: "left",
              sortable: true,
              field: (row) => row.stats,
            },
            {
              name: "requestedFields",
              required: true,
              label: "Requested Fields",
              align: "left",
              sortable: true,
              style:
                "max-width: 200px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;",
              field: (row) => row.requested_fields,
            },
            {
              name: "dateTimeCreated",
              required: true,
              label: "Date Time Created",
              align: "left",
              sortable: true,
              field: (row) => row.date_time_created,
            },
            {
              name: "createdBy",
              required: true,
              label: "Requested By",
              align: "left",
              sortable: true,
              field: (row) => row.created_by,
            },
          ],
          rows: [],
        },
        details: {
          edit: {
            columns: [
              {
                name: "dateTimeApproved",
                required: true,
                label: "DATE TIME APPROVED",
                align: "center",
                sortable: true,
                field: (row) => row.date_time_approved,
              },
              {
                name: "columnName",
                required: true,
                label: "COLUMN NAME",
                align: "center",
                sortable: true,
                field: (row) => row.column_name,
              },
              {
                name: "from",
                required: true,
                label: "FROM",
                align: "center",
                sortable: true,
                field: (row) => row.from,
              },
              {
                name: "to",
                required: true,
                label: "TO",
                align: "center",
                sortable: true,
                field: (row) => row.to,
              },
            ],
          },
          create: {
            columns: [
              {
                name: "dateTimeApproved",
                required: true,
                label: "DATE TIME APPROVED",
                align: "center",
                sortable: true,
                field: (row) => row.date_time_approved,
              },
              {
                name: "columnName",
                required: true,
                label: "COLUMN NAME",
                align: "center",
                sortable: true,
                field: (row) => row.column_name,
              },
              {
                name: "value",
                required: true,
                label: "VALUE",
                align: "center",
                sortable: true,
                field: (row) => row.value,
              },
            ],
          },
          rows: null,
        },
      },
    };
  },
  methods: {
    getData: async function (dateRangeSearch) {
      try {
        const filterDates = {
          other_requests: {
            pending: {
              date_from:
                dateRangeSearch === null
                  ? helperMethods.getDateMinusDays(this.minusDays)
                  : dateRangeSearch.other_requests.pending.date_from,
              date_to:
                dateRangeSearch === null
                  ? this.dateToday
                  : dateRangeSearch.other_requests.pending.date_to,
            },
            my_approved: {
              date_from:
                dateRangeSearch === null
                  ? helperMethods.getDateMinusDays(this.minusDays)
                  : dateRangeSearch.other_requests.my_approved.date_from,
              date_to:
                dateRangeSearch === null
                  ? this.dateToday
                  : dateRangeSearch.other_requests.my_approved.date_to,
            },
          },
        };

        await this.$store.dispatch("other_requests_module/get", {
          employeeID: this.employeeID,
          dateRangeSearch: filterDates,
        });

        this.pending.minimum_date_with_pending_request =
          this.otherRequests.minimum_date_with_pending_request === "1900-01-01"
            ? ""
            : helperMethods.removeTime(
                helperMethods.correctDate(
                  this.otherRequests.minimum_date_with_pending_request,
                ),
              );

        this.pending.header.rows = this.otherRequests.pending;
        this.my_approved.header.rows = this.otherRequests.my_approved;
        this.pending.total = this.pending.header.rows.length;
        this.my_approved.total = this.my_approved.header.rows.length;
      } catch (error) {
        $q.notify({
          type: "negative",
          message: error.message,
        });
      } finally {
        $q.loading.hide();
      }
    },
    getPendingDetails: async function (requestID) {
      let currentIndex = this.otherRequests.pending.findIndex(
        (x) => x.request_id === requestID,
      );

      this.are_siblings_or_children =
        this.otherRequests.pending[currentIndex].are_siblings_or_children;

      this.request_type = this.otherRequests.pending[currentIndex].request_type;

      let response = [];
      for (const item of this.otherRequests.pending[currentIndex].details) {
        response.push(item);
      }

      this.pending.details.rows = response;

      let shouldHighLightedToHR =
        this.otherRequests.pending[currentIndex].should_high_lighted_to_hr;

      if (shouldHighLightedToHR === true) {
        await this.requestNotHighLightedToHR(requestID, currentIndex);
      }
    },
    getMyApprovedDetails: function (requestID) {
      let currentIndex = this.otherRequests.my_approved.findIndex(
        (x) => x.request_id === requestID,
      );

      this.are_siblings_or_children =
        this.otherRequests.my_approved[currentIndex].are_siblings_or_children;

      this.request_type =
        this.otherRequests.my_approved[currentIndex].request_type;

      let response = [];
      for (const item of this.otherRequests.my_approved[currentIndex].details) {
        response.push(item);
      }
      this.my_approved.details.rows = response;
    },
    refresh: function () {
      helperMethods.refreshPage();
    },
    convertToReadableFormatDateTime: function (value) {
      return helperMethods.convertToReadableFormatDateTime(value);
    },
    showApproveDialog: function (employeeID) {
      // check if all fields is checked
      if (
        this.request_type === "create" &&
        this.selected.length !== this.pending.details.rows.length &&
        this.are_siblings_or_children === false
      ) {
        this.$refs.dialogPleaseCheckAllFields.show();
      } else if (
        this.request_type === "create" &&
        this.are_siblings_or_children === true &&
        this.isSelectedLengthRowsValid() === false
      ) {
        this.$refs.dialogPleaseCheckAllFieldsPerPerson.show();
      } else {
        helperMethods.createCookie("selected_employee_id", employeeID);
        this.$refs.dialogApprove.show();
      }
    },
    isSelectedLengthRowsValid: function () {
      let totalRowsPerTable = this.pending.details.rows[0].table_rows.length;
      let remainder = this.selected.length % totalRowsPerTable;

      return remainder === 0 ? true : false;
    },
    hideApproveDialog: function () {
      helperMethods.deleteCookie("selected_employee_id");
      this.$refs.dialogApprove.hide();
    },
    showSetRemarksDialog: function (employeeID) {
      helperMethods.createCookie("selected_employee_id", employeeID);
      this.$refs.dialogSetRemarks.show();
    },
    hideSetRemarksDialog: function () {
      helperMethods.deleteCookie("selected_employee_id");
      this.$refs.dialogSetRemarks.hide();
      this.hr_remarks = null;
    },
    showPendingDetailsDialog: async function (description, requestID) {
      this.description = description;
      this.latest_selected_request_id = requestID;
      this.getPendingDetails(requestID);
      this.$refs.dialogPendingDetails.show();
    },
    requestNotHighLightedToHR: async function (requestID, currentIndex) {
      try {
        await this.$store.dispatch(
          "other_requests_module/requestNotHighLightedToHR",
          { requestID: requestID, currentIndex: currentIndex },
        );
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      }
    },
    showDeleteDialog: function (requestID) {
      this.latest_selected_request_id = requestID;
      this.$refs.dialogDelete.show();
    },
    hideDeleteDialog: function () {
      helperMethods.deleteCookie("selected_employee_id");
      this.$refs.dialogDelete.hide();
    },
    hidePendingDetailsDialog: function () {
      this.$refs.dialogPendingDetails.hide();
      this.selected = [];
      $q.localStorage.remove("needToOpen");
      this.pending.header.rows = this.otherRequests.pending;
    },
    showMyApprovedDetailsDialog: function (description, requestID) {
      this.description = description;
      this.latest_selected_request_id = requestID;
      this.getMyApprovedDetails(requestID);
      this.$refs.dialogMyApprovedDetails.show();
    },
    hideMyApprovedDetailsDialog: function () {
      this.$refs.dialogMyApprovedDetails.hide();
    },
    approveRequest: async function () {
      try {
        document.getElementsByClassName("btnYes").disabled = true;
        let ids = this.getIDs(this.selected);
        let employeeID = helperMethods.getCookie("selected_employee_id");

        let response = await this.$store.dispatch(
          "other_requests_module/approveRequest",
          {
            employeeID: employeeID,
            body: ids,
          },
        );

        helperMethods.createCookie("notify_message", response.data);
        helperMethods.createCookie("notify_type", "positive");
        helperMethods.refreshPage();
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        this.hideApproveDialog();
        document.getElementsByClassName("btnYes").disabled = false;
      }
    },
    setHRRemarks: async function () {
      try {
        document.getElementById("btnCancel").disabled = true;
        let ids = this.getIDs(this.selected);
        let employeeID = helperMethods.getCookie("selected_employee_id");
        const data = {
          ids: ids,
          hr_remarks: this.hr_remarks,
        };

        let response = await this.$store.dispatch(
          "other_requests_module/setHRRemarks",
          {
            employeeID: employeeID,
            body: data,
          },
        );

        helperMethods.createCookie("notify_message", response.data);
        helperMethods.createCookie("notify_type", "positive");

        $q.localStorage.remove("needToOpen");
        $q.localStorage.set(
          "needToOpen",
          this.description + ";" + this.latest_selected_request_id,
        );

        helperMethods.refreshPage();
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        this.hideSetRemarksDialog();
        document.getElementById("btnCancel").disabled = false;
      }
    },
    getIDs: function (selected) {
      let response = [];
      for (const index in selected) {
        const editableByHR = selected[index].editable_by_hr;
        const columnName = selected[index].column_name.trim();
        let value;
        if (selected[index].value !== undefined)
          value = selected[index].value.trim();
        const id = selected[index].id;

        if (
          editableByHR &&
          (columnName === "DEGREE" || columnName === "COURSE")
        )
          response.push({ id: id, column_name: columnName, value: value });
        else if (editableByHR && columnName === "MAJOR") {
          const indexContainCourseID = selected.findIndex((object) =>
            object.hasOwnProperty("course_id"),
          );

          if (
            !helperMethods.isValidNumber(
              selected[indexContainCourseID].course_id,
            )
          )
            selected[indexContainCourseID].course_id =
              selected[indexContainCourseID].value;

          const courseID = selected[indexContainCourseID].course_id;
          response.push({
            id: id,
            column_name: columnName,
            value: value,
            course_id: courseID,
          });
        } else response.push({ id: id });
      }
      return response;
    },
    rowSelected: function (row) {
      return row.request_id == this.latest_selected_request_id
        ? "rowSelected"
        : "";
    },
    rowStyle: function (row) {
      return row.should_high_lighted_to_hr === true
        ? "highlightedRow"
        : "notHighlightedRow";
    },
    onSearch: async function () {
      try {
        document.getElementById("btnSearch").disabled = true;

        const dateRangeSearch = {
          other_requests: {
            pending: {
              date_from: this.pending.search.date_from,
              date_to: this.pending.search.date_to,
            },
            my_approved: {
              date_from: this.my_approved.search.date_from,
              date_to: this.my_approved.search.date_to,
            },
          },
        };
        await this.getData(dateRangeSearch);
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        document.getElementById("btnSearch").disabled = false;
      }
    },
    deleteRequest: async function () {
      try {
        document.getElementsByClassName("btnYes").disabled = true;

        if (
          this.latest_selected_request_id === null ||
          this.latest_selected_request_id === undefined
        )
          throw "The value of latest_selected_request_id is null";

        const data = { requestID: this.latest_selected_request_id };

        let response = await this.$store.dispatch(
          "other_requests_module/deleteRequest",
          {
            employeeID: this.employeeID,
            body: data,
          },
        );

        helperMethods.createCookie("notify_message", response.data);
        helperMethods.createCookie("notify_type", "positive");
        helperMethods.refreshPage();
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        this.hideDeleteDialog();
        document.getElementsByClassName("btnYes").disabled = false;
      }
    },
  },
});
</script>
