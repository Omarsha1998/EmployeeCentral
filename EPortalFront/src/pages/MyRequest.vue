<template>
  <!---------------------------------------------------------------- COMPLY DIALOG FOR PENDING ---------------------------------------------------------------->
  <q-dialog
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="dialogComply"
    @hide="this.hideComplyDialog()"
  >
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6 text-primary">COMPLY</div>
      </q-card-section>
      <q-form
        method="post"
        @submit.prevent="this.submitComply()"
        autocomplete="off"
      >
        <div class="col-lg-6 col-md-12 col-sm-12 col-12">
          <q-select
            v-if="this.comply.view.field_name === 'CIVIL STATUS'"
            style="margin: 10px"
            v-model="comply.submit.value"
            :options="comply.view.options"
            label="Civil Status"
            emit-value
            map-options
            option-value="civil_status_id"
            option-label="civil_status_name"
            filter
            lazy-rules
            :rules="[
              (val) => val !== null || 'This field is required',
              (val) => val !== 0 || 'This field is required',
            ]"
          />
          <q-select
            v-else-if="this.comply.view.field_name === 'RELIGION'"
            style="margin: 10px"
            v-model="comply.submit.value"
            :options="comply.view.options"
            label="Religion"
            emit-value
            map-options
            option-value="religion_id"
            option-label="religion_name"
            filter
            lazy-rules
            :rules="[
              (val) => val !== null || 'This field is required',
              (val) => val !== 0 || 'This field is required',
            ]"
          />
          <q-select
            v-else-if="this.comply.view.field_name === 'RELATIONSHIP'"
            style="margin: 10px"
            v-model="comply.submit.value"
            :options="comply.view.options"
            label="Relationship"
            emit-value
            map-options
            option-value="relationship_id"
            option-label="relationship"
            filter
            lazy-rules
            :rules="[
              (val) => val !== null || 'This field is required',
              (val) => val !== 0 || 'This field is required',
            ]"
          />
          <q-input
            v-else-if="
              this.comply.view.field_name === 'BIRTH DATE' ||
              this.comply.view.field_name === 'MARRIAGE DATE' ||
              this.comply.view.field_name === 'FROM DATE' ||
              this.comply.view.field_name === 'TO DATE'
            "
            style="margin: 10px"
            type="date"
            :label="this.convertToCapitalizedCase(this.comply.view.field_name)"
            v-model="comply.submit.value"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'This field is required',
            ]"
          >
          </q-input>
          <q-file
            v-else-if="this.comply.view.field_name === 'MARRIAGE CERTIFICATE'"
            style="margin: 10px 10px"
            accept=".pdf"
            clearable
            v-model="comply.submit.value"
            label="Attach - Marriage Certificate"
            counter
            lazy-rules
            @rejected="this.onRejected"
            :rules="[
              (val) => (val && val !== null) || 'This field is required',
            ]"
            max-file-size="5242880"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            <template v-slot:hint>
              PDF file is only allowed to upload (5MB maximum file size)
            </template>
          </q-file>
          <q-file
            v-else-if="this.comply.view.field_name === 'BIRTH CERTIFICATE'"
            style="margin: 10px 10px"
            accept=".pdf"
            clearable
            v-model="comply.submit.value"
            :label="
              this.comply.file_name === undefined
                ? 'Attach - Birth Certificate'
                : 'Attach - Birth Certificate for ' + this.comply.file_name
            "
            counter
            lazy-rules
            @rejected="this.onRejected"
            :rules="[
              (val) => (val && val !== null) || 'This field is required',
            ]"
            max-file-size="5242880"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            <template v-slot:hint>
              PDF file is only allowed to upload (5MB maximum file size)
            </template>
          </q-file>
          <q-file
            v-else-if="this.comply.view.field_name === 'PRC ID'"
            style="margin: 10px 10px"
            accept=".pdf"
            clearable
            v-model="comply.submit.value"
            label="Attach - PRC ID "
            counter
            lazy-rules
            @rejected="this.onRejected"
            :rules="[
              (val) => (val && val !== null) || 'This field is required',
            ]"
            max-file-size="5242880"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            <template v-slot:hint>
              PDF file is only allowed to upload (5MB maximum file size)
            </template>
          </q-file>
          <q-file
            v-else-if="this.comply.view.field_name === 'TOR'"
            style="margin: 10px 10px"
            accept=".pdf"
            clearable
            v-model="comply.submit.value"
            label="Attach - TOR "
            counter
            lazy-rules
            @rejected="this.onRejected"
            :rules="[
              (val) => (val && val !== null) || 'This field is required',
            ]"
            max-file-size="5242880"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            <template v-slot:hint>
              PDF file is only allowed to upload (5MB maximum file size)
            </template>
          </q-file>
          <q-file
            v-else-if="this.comply.view.field_name === 'ATTACH DIPLOMA'"
            style="margin: 10px 10px"
            accept=".pdf"
            clearable
            v-model="comply.submit.value"
            label="Attach - Diploma "
            counter
            lazy-rules
            @rejected="this.onRejected"
            :rules="[
              (val) => (val && val !== null) || 'This field is required',
            ]"
            max-file-size="5242880"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            <template v-slot:hint>
              PDF file is only allowed to upload (5MB maximum file size)
            </template>
          </q-file>
          <q-file
            v-else-if="
              this.comply.view.field_name === 'TRAINING OR SEMINAR CERTIFICATE'
            "
            style="margin: 10px 10px"
            accept=".pdf"
            clearable
            v-model="comply.submit.value"
            :label="
              this.comply.file_name === undefined
                ? 'Attach - Training or Seminar Certificate'
                : 'Attach - Training or Seminar Certificate for ' +
                  this.comply.file_name
            "
            counter
            lazy-rules
            @rejected="this.onRejected"
            :rules="[
              (val) => (val && val !== null) || 'This field is required',
            ]"
            max-file-size="5242880"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            <template v-slot:hint>
              PDF file is only allowed to upload (5MB maximum file size)
            </template>
          </q-file>
          <q-select
            v-else-if="
              this.comply.view.field_name === '(CURRENT ADDRESS) REGION' ||
              this.comply.view.field_name === '(PERMANENT ADDRESS) REGION'
            "
            style="margin: 10px"
            v-model="comply.submit.value"
            :options="comply.view.options"
            :label="this.comply.view.field_name"
            emit-value
            map-options
            option-value="region_code"
            option-label="region_name"
            filter
            lazy-rules
            :rules="[
              (val) => val !== null || 'This field is required',
              (val) => val !== 0 || 'This field is required',
            ]"
          />
          <q-select
            v-else-if="
              this.comply.view.field_name === '(CURRENT ADDRESS) PROVINCE' ||
              this.comply.view.field_name === '(PERMANENT ADDRESS) PROVINCE'
            "
            style="margin: 10px"
            v-model="comply.submit.value"
            :options="comply.view.options"
            :label="this.comply.view.field_name"
            emit-value
            map-options
            option-value="province_code"
            option-label="province_name"
            filter
            lazy-rules
            :rules="[
              (val) => val !== null || 'This field is required',
              (val) => val !== 0 || 'This field is required',
            ]"
          />
          <q-select
            v-else-if="
              this.comply.view.field_name ===
                '(CURRENT ADDRESS) CITY / MUNICIPALITY' ||
              this.comply.view.field_name ===
                '(PERMANENT ADDRESS) CITY / MUNICIPALITY'
            "
            style="margin: 10px"
            v-model="comply.submit.value"
            :options="comply.view.options"
            :label="this.comply.view.field_name"
            emit-value
            map-options
            option-value="city_or_municipality_code"
            option-label="city_or_municipality_name"
            filter
            lazy-rules
            :rules="[
              (val) => val !== null || 'This field is required',
              (val) => val !== 0 || 'This field is required',
            ]"
          />
          <q-select
            v-else-if="
              this.comply.view.field_name ===
              '(PERMANENT ADDRESS) IS SAME AS CURRENT ADDRESS'
            "
            style="margin: 10px"
            v-model="this.comply.submit.value"
            :options="this.comply.view.options"
            label="(PERMANENT ADDRESS) IS SAME AS CURRENT ADDRESS"
            emit-value
            map-options
            option-value="value"
            option-label="label"
            filter
            lazy-rules
            :rules="[(val) => val !== 0 || 'This field is required']"
          />
          <q-input
            v-else-if="
              this.comply.view.field_name === 'FROM' ||
              this.comply.view.field_name === 'TO'
            "
            style="margin: 10px"
            type="number"
            v-model="comply.submit.value"
            :label="comply.view.field_name + ' (year)'"
            maxlength="4"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'This field is required',
              (val) => (val && val.length < 5) || 'Maximum digit is 4',
              (val) => (val && val.length > 3) || '4 digit is required',
            ]"
          >
          </q-input>
          <q-select
            v-else-if="this.comply.view.field_name === 'INSTITUTION'"
            style="margin: 10px"
            v-model="comply.submit.value"
            :options="comply.view.options"
            label="Institution"
            emit-value
            map-options
            option-value="school_id"
            option-label="school_name"
            filter
            lazy-rules
            :rules="[
              (val) => val !== null || 'This field is required',
              (val) => val !== 0 || 'This field is required',
            ]"
          />
          <q-select
            v-else-if="this.comply.view.field_name === 'DEGREE'"
            style="margin: 10px"
            v-model="comply.submit.value"
            :options="comply.view.options"
            label="Degree"
            emit-value
            map-options
            option-value="degree_id"
            option-label="degree_name"
            filter
            lazy-rules
            :rules="[
              (val) => val !== null || 'This field is required',
              (val) => val !== 0 || 'This field is required',
            ]"
          />
          <q-select
            v-else-if="this.comply.view.field_name === 'COURSE'"
            style="margin: 10px"
            v-model="comply.submit.value"
            :options="comply.view.options"
            label="Course"
            emit-value
            map-options
            option-value="course_id"
            option-label="course_name"
            filter
            lazy-rules
            :rules="[
              (val) => val !== null || 'This field is required',
              (val) => val !== 0 || 'This field is required',
            ]"
          />
          <q-select
            v-else-if="this.comply.view.field_name === 'MAJOR'"
            style="margin: 10px"
            v-model="comply.submit.value"
            :options="comply.view.options"
            label="Major"
            emit-value
            map-options
            option-value="major_id"
            option-label="major_name"
            filter
            lazy-rules
            :rules="[
              (val) => val !== null || 'This field is required',
              (val) => val !== 0 || 'This field is required',
            ]"
          />
          <q-select
            v-else-if="this.comply.view.field_name === 'EDUCATION'"
            style="margin: 10px"
            v-model="comply.submit.value"
            :options="comply.view.options"
            label="Highest Educational Attainment"
            emit-value
            map-options
            option-value="education_id"
            option-label="education_description"
            filter
            lazy-rules
            :rules="[
              (val) => val !== null || 'This field is required',
              (val) => val !== 0 || 'This field is required',
            ]"
          />
          <q-input
            v-else
            style="margin: 10px"
            filled
            autogrow
            v-model="comply.submit.value"
            :label="comply.view.field_name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'This field is required',
            ]"
          >
          </q-input>
        </div>

        <q-card-actions align="center">
          <q-btn color="primary" label="SUBMIT" type="submit" id="btnSubmit" />
          <q-btn
            color="negative"
            label="CANCEL"
            type="button"
            id="btnCancel"
            @click="this.hideComplyDialog()"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- COMPLY DIALOG FOR PENDING ---------------------------------------------------------------->

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
            row-key="id"
            :rows-per-page-options="[0]"
            style="cursor: pointer"
          >
            <template v-slot:body="props">
              <q-tr>
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

                <q-td key="action" :props="props">
                  <span
                    v-if="
                      props.row.hr_remarks !== null &&
                      props.row.is_complied === false
                    "
                  >
                    <q-btn
                      color="primary"
                      label="COMPLY"
                      type="button"
                      @click="
                        this.showComplyDialog(
                          props.row.id,
                          props.row.value === 'diploma.pdf'
                            ? 'ATTACH DIPLOMA'
                            : props.row.column_name,
                          props.row.column_name ===
                            'TRAINING OR SEMINAR CERTIFICATE'
                            ? props.row.value.replaceAll('.pdf', '')
                            : '',
                        )
                      "
                      :disable="props.row.disabled"
                    ></q-btn>
                  </span>
                  <span
                    v-else-if="
                      props.row.hr_remarks !== null &&
                      props.row.is_complied === true
                    "
                    style="color: green"
                  >
                    COMPLIED
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
              row-key="id"
              :rows-per-page-options="[0]"
              style="cursor: pointer"
            >
              <template v-slot:body="props">
                <q-tr>
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

                  <q-td key="action" :props="props">
                    <span
                      v-if="
                        props.row.hr_remarks !== null &&
                        props.row.is_complied === false
                      "
                    >
                      <q-btn
                        color="primary"
                        label="COMPLY"
                        type="button"
                        @click="
                          this.showComplyDialog(
                            props.row.id,
                            props.row.column_name,
                            item.sibling_or_child_full_name === undefined
                              ? props.row.value.replace('.pdf', '')
                              : item.sibling_or_child_full_name,
                          )
                        "
                      ></q-btn>
                    </span>
                    <span
                      v-else-if="
                        props.row.hr_remarks !== null &&
                        props.row.is_complied === true
                      "
                      style="color: green"
                    >
                      COMPLIED
                    </span>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
  <!---------------------------------------------------------------- PENDING DETAILS DIALOG ---------------------------------------------------------------->

  <!---------------------------------------------------------------- APPROVED DETAILS DIALOG ---------------------------------------------------------------->
  <q-dialog
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="dialogApprovedDetails"
    @hide="this.hideApprovedDetailsDialog()"
  >
    <q-card class="q-dialog-plugin">
      <q-card-actions align="right">
        <q-btn
          color="negative"
          label="CLOSE"
          @click="this.hideApprovedDetailsDialog()"
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
            :rows="approved.details.rows"
            :columns="
              request_type === 'edit'
                ? approved.details.edit.columns
                : approved.details.create.columns
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
                <q-td key="approvedBy" :props="props">
                  {{ props.row.approved_by }}
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
            v-for="item in this.approved.details.rows"
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
                  ? approved.details.edit.columns
                  : approved.details.create.columns
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
                  <q-td key="approvedBy" :props="props">
                    {{ props.row.approved_by }}
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
  <!---------------------------------------------------------------- APPROVED DETAILS DIALOG ---------------------------------------------------------------->

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

  <q-pull-to-refresh @refresh="this.refresh()">
    <TitleForPage :title="'My Request'" :icon="'notes'"></TitleForPage>

    <div class="q-pa-md">
      <div class="q-gutter-y-md">
        <q-card>
          <q-tabs
            v-model="this.tab"
            dense
            class="bg-white text-grey-7"
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
              name="approved"
              :label="'APPROVED (' + this.approved.total + ')'"
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
                  </q-tr>
                </template>
              </q-table>
            </q-tab-panel>

            <q-tab-panel name="approved">
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
                      v-model="this.approved.search.date_from"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'This field is required',
                        (val) =>
                          val <= this.approved.search.date_to ||
                          'DATE FROM MUST BE LOWER OR EQUAL TO DATE TO',
                      ]"
                    >
                    </q-input>
                  </div>
                  <div class="col-6 col-md-4">
                    <q-input
                      type="date"
                      label="DATE TO"
                      v-model="this.approved.search.date_to"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'This field is required',
                        (val) =>
                          val >= this.approved.search.date_from ||
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
                :rows="approved.header.rows"
                :columns="approved.header.columns"
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
                      showApprovedDetailsDialog(
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
  name: "MyRequest",
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
    myRequests() {
      return this.$store.getters["my_requests_module/my_requests"];
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
    this.approved.search.date_to = this.dateToday;
    this.approved.search.date_from = helperMethods.getDateMinusDays(
      this.minusDays,
    );
  },
  created: async function () {
    try {
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
    } catch (error) {
      $q.notify({
        type: "negative",
        message: error.message,
      });
    } finally {
      $q.loading.hide();
    }
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
      latest_selected_request_id: 0,
      description: null,
      tab: "pending",
      comply: {
        file_name: null,
        view: {
          field_name: null,
          options: {
            religion: null,
            civil_status: null,
          },
        },
        submit: {
          request_details_id: 0,
          value: null,
        },
      },
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
              {
                name: "action",
                required: false,
                label: "ACTION",
                align: "center",
                sortable: false,
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
              {
                name: "action",
                required: false,
                label: "ACTION",
                align: "center",
                sortable: false,
              },
            ],
          },
          rows: null,
        },
      },
      approved: {
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
                name: "approvedBy",
                required: true,
                label: "APPROVED BY",
                align: "center",
                sortable: true,
                field: (row) => row.approved_by,
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
                name: "approvedBy",
                required: true,
                label: "APPROVED BY",
                align: "center",
                sortable: true,
                field: (row) => row.approved_by,
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
    showDeleteDialog: function (requestID) {
      this.latest_selected_request_id = requestID;
      this.$refs.dialogDelete.show();
    },
    hideDeleteDialog: function () {
      helperMethods.deleteCookie("selected_employee_id");
      this.$refs.dialogDelete.hide();
    },
    getData: async function (dateRangeSearch) {
      try {
        const filterDates = {
          my_requests: {
            pending: {
              date_from:
                dateRangeSearch === null
                  ? helperMethods.getDateMinusDays(this.minusDays)
                  : dateRangeSearch.my_requests.pending.date_from,
              date_to:
                dateRangeSearch === null
                  ? this.dateToday
                  : dateRangeSearch.my_requests.pending.date_to,
            },
            approved: {
              date_from:
                dateRangeSearch === null
                  ? helperMethods.getDateMinusDays(this.minusDays)
                  : dateRangeSearch.my_requests.approved.date_from,
              date_to:
                dateRangeSearch === null
                  ? this.dateToday
                  : dateRangeSearch.my_requests.approved.date_to,
            },
          },
        };

        await this.$store.dispatch("my_requests_module/get", {
          employeeID: this.employeeID,
          dateRangeSearch: filterDates,
        });

        this.pending.minimum_date_with_pending_request =
          this.myRequests.minimum_date_with_pending_request === "1900-01-01"
            ? ""
            : helperMethods.removeTime(
                helperMethods.correctDate(
                  this.myRequests.minimum_date_with_pending_request,
                ),
              );

        this.pending.header.rows = this.myRequests.pending;
        this.approved.header.rows = this.myRequests.approved;
        this.pending.total = this.pending.header.rows.length;
        this.approved.total = this.approved.header.rows.length;
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
      let currentIndex = this.myRequests.pending.findIndex(
        (x) => x.request_id === requestID,
      );

      this.are_siblings_or_children =
        this.myRequests.pending[currentIndex].are_siblings_or_children;

      this.request_type = this.myRequests.pending[currentIndex].request_type;

      let response = [];
      for (const item of this.myRequests.pending[currentIndex].details) {
        item.disabled = false;
        response.push(item);
      }

      response = this.personalInformationConditions(response);
      response = this.educationalBackgroundConditions(response);

      this.pending.details.rows = response;

      let shouldHighLightedToRequester =
        this.myRequests.pending[currentIndex].should_high_lighted_to_requester;

      if (shouldHighLightedToRequester === true) {
        await this.requestNotHighLightedToRequester(requestID, currentIndex);
      }
    },
    personalInformationConditions(response) {
      let isContainCondition1 = response.some(
        this.condition("(CURRENT ADDRESS) REGION"),
      );
      let isContainCondition2 = response.some(
        this.condition("(CURRENT ADDRESS) PROVINCE"),
      );
      let isContainCondition3 = response.some(
        this.condition("(CURRENT ADDRESS) CITY / MUNICIPALITY"),
      );

      let isContainCondition4 = response.some(
        this.condition("(PERMANENT ADDRESS) REGION"),
      );
      let isContainCondition5 = response.some(
        this.condition("(PERMANENT ADDRESS) PROVINCE"),
      );
      let isContainCondition6 = response.some(
        this.condition("(PERMANENT ADDRESS) CITY / MUNICIPALITY"),
      );

      if (
        isContainCondition1 === true &&
        isContainCondition2 === true &&
        isContainCondition3 === true
      ) {
        response = this.disable("(CURRENT ADDRESS) PROVINCE", response);
        response = this.disable(
          "(CURRENT ADDRESS) CITY / MUNICIPALITY",
          response,
        );
      } else if (
        isContainCondition1 === false &&
        isContainCondition2 === true &&
        isContainCondition3 === true
      ) {
        response = this.disable(
          "(CURRENT ADDRESS) CITY / MUNICIPALITY",
          response,
        );
      }

      if (
        isContainCondition4 === true &&
        isContainCondition5 === true &&
        isContainCondition6 === true
      ) {
        response = this.disable("(PERMANENT ADDRESS) PROVINCE", response);
        response = this.disable(
          "(PERMANENT ADDRESS) CITY / MUNICIPALITY",
          response,
        );
      } else if (
        isContainCondition4 === false &&
        isContainCondition5 === true &&
        isContainCondition6 === true
      ) {
        response = this.disable(
          "(PERMANENT ADDRESS) CITY / MUNICIPALITY",
          response,
        );
      }

      return response;
    },
    educationalBackgroundConditions(response) {
      let isContainCondition1 = response.some(this.condition("COURSE"));
      let isContainCondition2 = response.some(this.condition("MAJOR"));

      if (isContainCondition1 === true && isContainCondition2 === true) {
        response = this.disable("MAJOR", response);
      }

      return response;
    },
    condition: function (columnName) {
      let response = (obj) =>
        obj.column_name === columnName &&
        obj.date_time_remarks !== null &&
        obj.remarks_by !== null &&
        obj.hr_remarks !== null &&
        obj.is_complied === false;
      return response;
    },
    disable: function (columnName, response) {
      let index = response.findIndex((x) => x.column_name === columnName);
      response[index].disabled = true;
      return response;
    },
    getApprovedDetails: function (requestID) {
      let currentIndex = this.myRequests.approved.findIndex(
        (x) => x.request_id === requestID,
      );

      this.are_siblings_or_children =
        this.myRequests.approved[currentIndex].are_siblings_or_children;

      this.request_type = this.myRequests.approved[currentIndex].request_type;

      let response = [];
      for (const item of this.myRequests.approved[currentIndex].details) {
        response.push(item);
      }
      this.approved.details.rows = response;
    },
    refresh: function () {
      helperMethods.refreshPage();
    },
    convertToReadableFormatDateTime: function (value) {
      return helperMethods.convertToReadableFormatDateTime(value);
    },
    showPendingDetailsDialog: async function (description, requestID) {
      this.description = description;
      this.latest_selected_request_id = requestID;
      this.getPendingDetails(requestID);
      this.$refs.dialogPendingDetails.show();
    },
    requestNotHighLightedToRequester: async function (requestID, currentIndex) {
      try {
        await this.$store.dispatch(
          "my_requests_module/requestNotHighLightedToRequester",
          { requestID: requestID, currentIndex: currentIndex },
        );
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      }
    },
    hidePendingDetailsDialog: function () {
      this.$refs.dialogPendingDetails.hide();
      $q.localStorage.remove("needToOpen");
      this.pending.header.rows = this.myRequests.pending;
    },
    showApprovedDetailsDialog: function (description, requestID) {
      this.description = description;
      this.latest_selected_request_id = requestID;
      this.getApprovedDetails(requestID);
      this.$refs.dialogApprovedDetails.show();
    },
    hideApprovedDetailsDialog: function () {
      this.$refs.dialogApprovedDetails.hide();
    },
    showComplyDialog: async function (id, columnName, fileName) {
      try {
        this.comply.submit.request_details_id = id;
        this.comply.view.field_name = columnName;
        this.comply.file_name = fileName !== "" ? fileName : null;
        if (columnName === "CIVIL STATUS") {
          let response = await this.$store.dispatch(
            "personal_informations_module/getAllCivilStatuses",
          );
          this.comply.view.options = response.data;
        } else if (columnName === "RELIGION") {
          let response = await this.$store.dispatch(
            "personal_informations_module/getAllReligions",
          );
          this.comply.view.options = response.data;
        } else if (columnName === "RELATIONSHIP") {
          let response = await this.$store.dispatch(
            "personal_informations_module/getAllRelationships",
          );
          this.comply.view.options = response.data;
        } else if (
          columnName === "(CURRENT ADDRESS) REGION" ||
          columnName === "(PERMANENT ADDRESS) REGION"
        ) {
          let response = await this.$store.dispatch(
            "personal_informations_module/getAllRegions",
          );
          this.comply.view.options = response.data;
        } else if (
          columnName === "(CURRENT ADDRESS) PROVINCE" ||
          columnName === "(PERMANENT ADDRESS) PROVINCE"
        ) {
          let response = await this.$store.dispatch(
            "my_requests_module/getAllProvinces",
            id,
          );
          this.comply.view.options = response.data;
        } else if (
          columnName === "(CURRENT ADDRESS) CITY / MUNICIPALITY" ||
          columnName === "(PERMANENT ADDRESS) CITY / MUNICIPALITY"
        ) {
          let response = await this.$store.dispatch(
            "my_requests_module/getAllCitiesOrMunicipalities",
            id,
          );
          this.comply.view.options = response.data;
        } else if (
          columnName === "(PERMANENT ADDRESS) IS SAME AS CURRENT ADDRESS"
        ) {
          this.comply.view.options = [
            {
              value: "FALSE",
              label: "NO",
            },
            {
              value: "TRUE",
              label: "YES",
            },
          ];
        } else if (columnName === "INSTITUTION") {
          let response = await this.$store.dispatch(
            "my_requests_module/getAllInstitutions",
          );
          this.comply.view.options = response.data;
        } else if (columnName === "DEGREE") {
          let response = await this.$store.dispatch(
            "my_requests_module/getAllDegrees",
          );
          this.comply.view.options = response.data;
        } else if (columnName === "COURSE") {
          let response = await this.$store.dispatch(
            "my_requests_module/getAllCourses",
          );
          this.comply.view.options = response.data;
        } else if (columnName === "MAJOR") {
          let response = await this.$store.dispatch(
            "my_requests_module/getAllMajors",
            id,
          );
          this.comply.view.options = response.data;
        } else if (columnName === "EDUCATION") {
          let response = await this.$store.dispatch(
            "highest_educational_attainment_module/getOptions",
            id,
          );
          this.comply.view.options = response.highest_educational_attainments;
        }
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        this.$refs.dialogComply.show();
      }
    },
    hideComplyDialog: function () {
      this.comply.view.field_name = null;
      this.comply.submit.request_details_id = 0;
      this.comply.submit.value = null;
      this.$refs.dialogComply.hide();
    },
    onRejected: function (rejectedFiles) {
      const errorsMap = {
        accept: "(.pdf) file is only allowed to upload.",
        "max-file-size":
          "The file size exceeded 5MB. Please reduce the file size.",
      };

      rejectedFiles.forEach((rejectedFile) => {
        const errorMessage = errorsMap[rejectedFile.failedPropValidation];

        if (!errorMessage) {
          return;
        }

        if (rejectedFile.failedPropValidation) {
          $q.notify({
            type: "negative",
            message: errorMessage,
          });
        }
      });
    },
    submitComply: async function () {
      try {
        document.getElementById("btnSubmit").disabled = true;
        let employeeID = this.employeeID;

        if (
          this.comply.view.field_name === "MARRIAGE CERTIFICATE" ||
          this.comply.view.field_name === "BIRTH CERTIFICATE" ||
          this.comply.view.field_name === "PRC ID" ||
          this.comply.view.field_name === "ATTACH DIPLOMA" ||
          this.comply.view.field_name === "TOR" ||
          this.comply.view.field_name === "TRAINING OR SEMINAR CERTIFICATE"
        ) {
          let attachFile = "";

          if (this.comply.view.field_name === "ATTACH DIPLOMA")
            this.comply.view.field_name = "DIPLOMA";

          if (
            this.comply.view.field_name === "MARRIAGE CERTIFICATE" ||
            this.comply.view.field_name === "DIPLOMA" ||
            this.comply.view.field_name === "TOR"
          ) {
            attachFile = this.comply.view.field_name
              .replaceAll(" ", "_")
              .toLowerCase();
          } else if (
            this.comply.view.field_name === "BIRTH CERTIFICATE" ||
            this.comply.view.field_name === "TRAINING OR SEMINAR CERTIFICATE"
          ) {
            attachFile = this.comply.file_name;
          } else if (this.comply.view.field_name === "PRC ID") {
            const arrayOfWords = this.description.split("license ");
            // Use a regular expression to find the word within <b> tags
            const match = arrayOfWords[1].match(/<b>([^<]+)<\/b>/);

            if (match && match.length > 1) attachFile = match[1];
          }

          const formData = new FormData();
          formData.append("request_id", this.latest_selected_request_id);
          formData.append("request_type", "create");
          formData.append("attach_file", attachFile);
          formData.append("employee_id", employeeID);
          formData.append(attachFile, this.comply.submit.value);

          await this.$store.dispatch("user_module/upload", formData);
        }

        await this.$store.dispatch("my_requests_module/submitComply", {
          employeeID: employeeID,
          body: this.comply.submit,
        });

        helperMethods.createCookie("notify_message", "Successfully submitted.");
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
        this.hideComplyDialog();
        document.getElementById("btnSubmit").disabled = false;
      }
    },
    rowSelected: function (row) {
      return row.request_id == this.latest_selected_request_id
        ? "rowSelected"
        : "";
    },
    rowStyle: function (row) {
      return row.should_high_lighted_to_requester === true
        ? "highlightedRow"
        : "notHighlightedRow";
    },
    convertToCapitalizedCase: function (value) {
      // Split the string into words
      const words = value.toLowerCase().split(" ");

      // Capitalize the first letter of each word
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }

      // Join the words back together
      return words.join(" ");
    },
    onSearch: async function () {
      try {
        document.getElementById("btnSearch").disabled = true;

        const dateRangeSearch = {
          my_requests: {
            pending: {
              date_from: this.pending.search.date_from,
              date_to: this.pending.search.date_to,
            },
            approved: {
              date_from: this.approved.search.date_from,
              date_to: this.approved.search.date_to,
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
          "my_requests_module/deleteRequest",
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
