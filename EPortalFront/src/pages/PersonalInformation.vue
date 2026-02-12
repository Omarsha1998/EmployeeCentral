<template>
  <q-pull-to-refresh @refresh="this.refresh()">
    <div class="q-pa-md" v-if="this.form.visible === true">
      <TitleForPage
        :title="'Personal Information'"
        :icon="'person'"
      ></TitleForPage>

      <div class="row justify-center" style="margin-bottom: 12px">
        <q-btn
          color="primary"
          label="EDIT"
          icon="edit"
          type="button"
          @click="this.showDialog()"
        ></q-btn>
      </div>
      <div class="borderStyle">
        <div
          class="row bg-white"
          v-for="(value, property) in view"
          :key="property"
        >
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <q-item-label class="cardStyle">
              <span style="font-weight: bold">
                {{ property.replaceAll("_", " ").toUpperCase() }}
                :
              </span>
            </q-item-label>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <q-item-label class="cardStyle">
              <span>
                {{ formatted(property, value) }}
              </span>
            </q-item-label>
          </div>
        </div>
      </div>
    </div>

    <q-dialog
      v-model="this.dialog.visible"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6 text-primary">EDIT</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form method="post" @submit.prevent="onSubmit" autocomplete="off">
            <div class="row bg-white">
              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Last Name"
                  maxlength="30"
                  v-model="edit.submit.last_name"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="First Name"
                  maxlength="40"
                  v-model="edit.submit.first_name"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Middle Name (Optional)"
                  maxlength="30"
                  v-model="edit.submit.middle_name"
                  lazy-rules
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Extension Name (Optional)"
                  maxlength="5"
                  v-model="edit.submit.extension_name"
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Nick Name (Optional)"
                  maxlength="15"
                  v-model="edit.submit.nick_name"
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  label="Personal Email"
                  maxlength="100"
                  v-model="edit.submit.personal_email"
                  :rules="[
                    (val) => !!val || 'This field is required',
                    isValidEmail,
                  ]"
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Mobile No"
                  maxlength="15"
                  v-model="edit.submit.mobile_no"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Telephone No (Optional)"
                  maxlength="15"
                  v-model="edit.submit.telephone_no"
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-select
                  class="marginLeftAndRight"
                  v-model="this.edit.submit.civil_status_id"
                  :options="edit.options.civil_status"
                  label="Civil Status"
                  emit-value
                  map-options
                  option-value="civil_status_id"
                  option-label="civil_status_name"
                  filter
                  lazy-rules
                  :rules="[(val) => val !== 0 || 'This field is required']"
                />
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-select
                  class="marginLeftAndRight"
                  v-model="this.edit.submit.religion_id"
                  :options="edit.options.religions"
                  label="Religion"
                  emit-value
                  map-options
                  option-value="religion_id"
                  option-label="religion_name"
                  filter
                  lazy-rules
                  :rules="[(val) => val !== 0 || 'This field is required']"
                />
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Contact Person Name"
                  maxlength="50"
                  v-model="edit.submit.contact_person_name"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Contact Person Address"
                  maxlength="150"
                  v-model="edit.submit.contact_person_address"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-input
                  class="marginLeftAndRight"
                  type="text"
                  label="Contact Person Contact No"
                  maxlength="15"
                  v-model="edit.submit.contact_person_contact_no"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 col-12">
                <q-select
                  class="marginLeftAndRight"
                  v-model="this.edit.submit.relationship_id"
                  :options="edit.options.relationships"
                  label="Relationship"
                  emit-value
                  map-options
                  option-value="relationship_id"
                  option-label="relationship"
                  filter
                  lazy-rules
                  :rules="[(val) => !!val || 'This field is required']"
                />
              </div>
            </div>

            <br />
            <br />

            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                <q-item-label class="text-primary" style="font-weight: bold">
                  CURRENT ADDRESS
                </q-item-label>
              </div>
            </div>
            <div class="row borderStyle">
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-input
                  id="txtCurrentAddressRoomOrFloorOrUnitNoAndBuildingName"
                  class="marginLeftAndRight"
                  type="text"
                  label="Room / Floor / Unit No. & Building Name"
                  maxlength="100"
                  v-model="
                    edit.submit.current_address
                      .room_or_floor_or_unit_no_and_building_name
                  "
                >
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-input
                  id="txtCurrentAddressHouseOrLotAndBlockNo"
                  class="marginLeftAndRight"
                  type="text"
                  label="House / Lot & Block No."
                  maxlength="100"
                  v-model="
                    edit.submit.current_address.house_or_lot_and_block_no
                  "
                >
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-input
                  id="txtCurrentAddressStreetName"
                  class="marginLeftAndRight"
                  type="text"
                  label="Street Name"
                  maxlength="100"
                  v-model="edit.submit.current_address.street_name"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-input
                  id="txtCurrentAddressSubdivision"
                  class="marginLeftAndRight"
                  type="text"
                  label="Subdivision"
                  maxlength="100"
                  v-model="edit.submit.current_address.sub_division"
                >
                </q-input>
              </div>

              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-select
                  id="drpCurrentAddressRegion"
                  class="marginLeftAndRight"
                  v-model="this.edit.submit.current_address.region_code"
                  :options="edit.options.current_address.regions"
                  label="Region"
                  emit-value
                  map-options
                  option-value="region_code"
                  option-label="region_name"
                  filter
                  lazy-rules
                  :rules="[(val) => !!val || 'This field is required']"
                />
              </div>

              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-select
                  id="drpCurrentAddressProvince"
                  class="marginLeftAndRight"
                  v-model="this.edit.submit.current_address.province_code"
                  :options="edit.options.current_address.provinces"
                  label="Province"
                  emit-value
                  map-options
                  option-value="province_code"
                  option-label="province_name"
                  filter
                  lazy-rules
                  :rules="[(val) => !!val || 'This field is required']"
                  :disable="edit.options.current_address.provinces === null"
                />
              </div>

              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-select
                  id="drpCurrentAddressCityOrMunicipality"
                  class="marginLeftAndRight"
                  v-model="
                    this.edit.submit.current_address.city_or_municipality_code
                  "
                  :options="
                    edit.options.current_address.cities_or_municipalities
                  "
                  label="City / Municipality"
                  emit-value
                  map-options
                  option-value="city_or_municipality_code"
                  option-label="city_or_municipality_name"
                  filter
                  lazy-rules
                  :rules="[(val) => !!val || 'This field is required']"
                  :disable="
                    edit.options.current_address.cities_or_municipalities ===
                    null
                  "
                />
              </div>

              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-input
                  id="txtCurrentAddressBarangay"
                  class="marginLeftAndRight"
                  type="text"
                  label="Barangay"
                  maxlength="50"
                  v-model="edit.submit.current_address.barangay"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>
              </div>
            </div>

            <br />
            <br />

            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                <q-item-label class="text-primary" style="font-weight: bold">
                  PERMANENT ADDRESS
                </q-item-label>
              </div>
            </div>

            <div class="row">
              <q-checkbox
                id="chkPermanentAddressIsSameAsCurrentAddress"
                v-model="
                  edit.submit.permanent_address.is_same_as_current_address
                "
                label="Same as Current Address"
                color="primary"
              />
            </div>

            <div
              class="row borderStyle"
              v-if="
                edit.submit.permanent_address.is_same_as_current_address ===
                false
              "
            >
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-input
                  id="txtPermanentAddressRoomOrFloorOrUnitNoAndBuildingName"
                  class="marginLeftAndRight"
                  type="text"
                  label="Room / Floor / Unit No. & Building Name"
                  maxlength="100"
                  v-model="
                    edit.submit.permanent_address
                      .room_or_floor_or_unit_no_and_building_name
                  "
                >
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-input
                  id="txtPermanentAddressHouseOrLotAndBlockNo"
                  class="marginLeftAndRight"
                  type="text"
                  label="House / Lot & Block No."
                  maxlength="100"
                  v-model="
                    edit.submit.permanent_address.house_or_lot_and_block_no
                  "
                >
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-input
                  id="txtPermanentAddressStreetName"
                  class="marginLeftAndRight"
                  type="text"
                  label="Street Name"
                  maxlength="100"
                  v-model="edit.submit.permanent_address.street_name"
                >
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-input
                  id="txtPermanentAddressSubdivision"
                  class="marginLeftAndRight"
                  type="text"
                  label="Subdivision"
                  maxlength="100"
                  v-model="edit.submit.permanent_address.sub_division"
                >
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-select
                  id="drpPermanentAddressRegion"
                  class="marginLeftAndRight"
                  v-model="this.edit.submit.permanent_address.region_code"
                  :options="edit.options.permanent_address.regions"
                  label="Region"
                  emit-value
                  map-options
                  option-value="region_code"
                  option-label="region_name"
                  filter
                  lazy-rules
                  :rules="[(val) => !!val || 'This field is required']"
                />
              </div>

              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-select
                  id="drpPermanentAddressProvince"
                  class="marginLeftAndRight"
                  v-model="this.edit.submit.permanent_address.province_code"
                  :options="edit.options.permanent_address.provinces"
                  label="Province"
                  emit-value
                  map-options
                  option-value="province_code"
                  option-label="province_name"
                  filter
                  lazy-rules
                  :rules="[(val) => !!val || 'This field is required']"
                  :disable="edit.options.permanent_address.provinces === null"
                />
              </div>

              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-select
                  id="drpPermanentAddressCityOrMunicipality"
                  class="marginLeftAndRight"
                  v-model="
                    this.edit.submit.permanent_address.city_or_municipality_code
                  "
                  :options="
                    edit.options.permanent_address.cities_or_municipalities
                  "
                  label="City / Municipality"
                  emit-value
                  map-options
                  option-value="city_or_municipality_code"
                  option-label="city_or_municipality_name"
                  filter
                  lazy-rules
                  :rules="[(val) => !!val || 'This field is required']"
                  :disable="
                    edit.options.permanent_address.cities_or_municipalities ===
                    null
                  "
                />
              </div>

              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <q-input
                  id="drpPermanentAddressBarangay"
                  class="marginLeftAndRight"
                  type="text"
                  label="Barangay"
                  maxlength="50"
                  v-model="edit.submit.permanent_address.barangay"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'This field is required',
                  ]"
                >
                </q-input>
              </div>
            </div>

            <br />
            <br />
            <br />

            <div class="footer">
              <div class="column example-row-equal-width">
                <div class="row">
                  <div class="col">
                    <q-btn
                      class="full-width"
                      color="primary"
                      label="SUBMIT"
                      type="submit"
                      id="btnSubmit"
                    ></q-btn>
                  </div>
                  <div class="col">
                    <q-btn
                      class="full-width"
                      color="negative"
                      label="CANCEL"
                      type="button"
                      @click="this.hideDialog()"
                    ></q-btn>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-pull-to-refresh>
</template>

<script>
// -------------------- Notify plugins --------------------
import { useQuasar } from "quasar";
let $q;
// -------------------- Notify plugins --------------------

import helperMethods from "../helperMethods.js";
import TitleForPage from "../components/TitleForPage.vue";

export default {
  name: "PersonalInformation",
  components: {
    TitleForPage,
  },
  computed: {
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
    personalInformations() {
      return this.$store.getters[
        "personal_informations_module/personal_informations"
      ];
    },
  },
  watch: {
    "edit.submit.permanent_address.is_same_as_current_address"() {
      const currentAddress = this.edit.submit.current_address;
      const permanentAddress = this.edit.submit.permanent_address;

      if (
        permanentAddress.is_same_as_current_address === true &&
        this.notProceed() === true
      ) {
        permanentAddress.is_same_as_current_address = false;
        helperMethods.showErrorMessage(
          "Complete the Current Address details first",
          false,
        );
        return;
      }

      if (permanentAddress.is_same_as_current_address === true) {
        permanentAddress.room_or_floor_or_unit_no_and_building_name =
          currentAddress.room_or_floor_or_unit_no_and_building_name;
        permanentAddress.house_or_lot_and_block_no =
          currentAddress.house_or_lot_and_block_no;
        permanentAddress.street_name = currentAddress.street_name;
        permanentAddress.sub_division = currentAddress.sub_division;
        permanentAddress.region_code = currentAddress.region_code;
        permanentAddress.province_code = currentAddress.province_code;
        permanentAddress.city_or_municipality_code =
          currentAddress.city_or_municipality_code;
        permanentAddress.barangay = currentAddress.barangay;
        return;
      }

      if (
        permanentAddress.room_or_floor_or_unit_no_and_building_name ===
        currentAddress.room_or_floor_or_unit_no_and_building_name
      )
        permanentAddress.room_or_floor_or_unit_no_and_building_name = "";

      if (
        permanentAddress.house_or_lot_and_block_no ===
        currentAddress.house_or_lot_and_block_no
      )
        permanentAddress.house_or_lot_and_block_no = "";

      if (permanentAddress.street_name === currentAddress.street_name)
        permanentAddress.street_name = "";

      if (permanentAddress.sub_division === currentAddress.sub_division)
        permanentAddress.sub_division = "";

      if (permanentAddress.region_code === currentAddress.region_code)
        permanentAddress.region_code = "";

      if (permanentAddress.province_code === currentAddress.province_code)
        permanentAddress.province_code = "";

      if (
        permanentAddress.city_or_municipality_code ===
        currentAddress.city_or_municipality_code
      )
        permanentAddress.city_or_municipality_code = "";

      if (permanentAddress.barangay === currentAddress.barangay)
        permanentAddress.barangay = "";

      return;
    },
    async "edit.submit.current_address.region_code"() {
      const submit = this.edit.submit.current_address;
      const options = this.edit.options.current_address;
      if (submit.region_code !== "" && submit.region_code !== null)
        options.provinces = await this.getAllProvinces(submit.region_code);
    },
    async "edit.submit.current_address.province_code"() {
      const submit = this.edit.submit.current_address;
      const options = this.edit.options.current_address;
      if (submit.province_code !== "" && submit.province_code !== null)
        options.cities_or_municipalities =
          await this.getAllCitiesOrMunicipalities(submit.province_code);
    },
    async "edit.submit.permanent_address.region_code"() {
      const submit = this.edit.submit.permanent_address;
      const options = this.edit.options.permanent_address;
      if (submit.region_code !== "" && submit.region_code !== null)
        options.provinces = await this.getAllProvinces(submit.region_code);
    },
    async "edit.submit.permanent_address.province_code"() {
      const submit = this.edit.submit.permanent_address;
      const options = this.edit.options.permanent_address;
      if (submit.province_code !== "" && submit.province_code !== null)
        options.cities_or_municipalities =
          await this.getAllCitiesOrMunicipalities(submit.province_code);
    },
  },
  mounted: function () {
    $q = useQuasar();
  },
  created: async function () {
    try {
      await this.getData();
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
      form: {
        visible: false,
      },
      dialog: {
        visible: false,
      },
      view: {
        employee_id: null,
        last_name: null,
        first_name: null,
        middle_name: null,
        extension_name: null,
        nick_name: null,
        full_name: null,
        gender: null,
        personal_email: null,
        mobile_no: null,
        telephone_no: null,
        birth_date: null,
        age: null,
        place_of_birth: null,
        citizenship: null,
        civil_status: null,
        religion: null,
        tin: null,
        phil_health: null,
        pagibig_no: null,
        sss_no: null,
        atm_no: null,
        uerm_email: null,
        department_name: null,
        job_position: null,
        hired_date: null,
        regularized_date: null,
        contact_person_name: null,
        contact_person_address: null,
        contact_person_contact_no: null,
        relationship: null,
        current_address: null,
        permanent_address: null,
      },
      edit: null,
    };
  },
  methods: {
    getData: async function () {
      await this.$store.dispatch(
        "personal_informations_module/get",
        this.employeeID,
      );

      this.view.employee_id = this.employeeID;
      this.view.last_name = this.personalInformations.last_name;
      this.view.first_name = this.personalInformations.first_name;
      this.view.middle_name = this.personalInformations.middle_name;
      this.view.extension_name = this.personalInformations.extension_name;
      this.view.nick_name = this.personalInformations.nick_name;
      this.view.full_name = this.personalInformations.full_name;
      this.view.gender = this.personalInformations.gender;
      this.view.personal_email = this.personalInformations.personal_email;
      this.view.mobile_no = this.personalInformations.mobile_no;
      this.view.telephone_no = this.personalInformations.telephone_no;
      this.view.birth_date = this.personalInformations.birth_date;
      this.view.age = this.personalInformations.age;
      this.view.place_of_birth = this.personalInformations.place_of_birth;
      this.view.citizenship = this.personalInformations.citizenship;
      this.view.civil_status = this.personalInformations.civil_status;
      this.view.religion = this.personalInformations.religion;
      this.view.tin = this.personalInformations.tin;
      this.view.phil_health = this.personalInformations.phil_health;
      this.view.pagibig_no = this.personalInformations.pagibig_no;
      this.view.sss_no = this.personalInformations.sss_no;
      this.view.atm_no = this.personalInformations.atm_no;
      this.view.uerm_email = this.personalInformations.uerm_email;
      this.view.department_name = this.personalInformations.department_name;
      this.view.job_position = this.personalInformations.job_position;
      this.view.hired_date = this.personalInformations.hired_date;
      this.view.regularized_date = this.personalInformations.regularized_date;
      this.view.contact_person_name =
        this.personalInformations.contact_person_name;
      this.view.contact_person_address =
        this.personalInformations.contact_person_address;
      this.view.contact_person_contact_no =
        this.personalInformations.contact_person_contact_no;
      this.view.relationship = this.personalInformations.relationship;
      this.view.current_address = this.personalInformations.current_address;
      this.view.permanent_address = this.personalInformations.permanent_address;
      this.form.visible = true;
    },
    showDialog: async function () {
      this.dialog.visible = true;
      this.edit = this.getEditDefaultValues();
      this.edit.options.religions = await this.getAllReligions();
      this.edit.options.civil_status = await this.getAllCivilStatuses();
      this.edit.options.relationships = await this.getAllRelationships();

      this.edit.options.current_address.regions = await this.getAllRegions();
      this.edit.options.permanent_address.regions = await this.getAllRegions();

      const currentAddress = this.edit.submit.current_address;
      const permanentAddress = this.edit.submit.permanent_address;

      if (currentAddress.region_code !== "")
        this.edit.options.current_address.provinces =
          await this.getAllProvinces(currentAddress.region_code);

      if (currentAddress.province_code !== "")
        this.edit.options.current_address.cities_or_municipalities =
          await this.getAllCitiesOrMunicipalities(currentAddress.province_code);

      if (permanentAddress.region_code !== "")
        this.edit.options.permanent_address.provinces =
          await this.getAllProvinces(permanentAddress.region_code);

      if (permanentAddress.province_code !== "")
        this.edit.options.permanent_address.cities_or_municipalities =
          await this.getAllCitiesOrMunicipalities(
            permanentAddress.province_code,
          );
    },
    hideDialog: function () {
      this.dialog.visible = false;
    },
    getEditDefaultValues: function () {
      const response = {
        submit: {
          employee_id: this.employeeID,
          last_name: this.personalInformations.last_name,
          first_name: this.personalInformations.first_name,
          middle_name: this.personalInformations.middle_name,
          extension_name: this.personalInformations.extension_name,
          nick_name: this.personalInformations.nick_name,
          personal_email: this.personalInformations.personal_email,
          mobile_no: this.personalInformations.mobile_no,
          telephone_no: this.personalInformations.telephone_no,
          civil_status_id: this.personalInformations.civil_status_id,
          religion_id: this.personalInformations.religion_id,
          contact_person_name: this.personalInformations.contact_person_name,
          contact_person_address:
            this.personalInformations.contact_person_address,
          contact_person_contact_no:
            this.personalInformations.contact_person_contact_no,
          relationship_id: this.personalInformations.relationship_id,
          current_address: {
            room_or_floor_or_unit_no_and_building_name:
              this.personalInformations
                .current_address_room_or_floor_or_unit_no_and_building_name,
            house_or_lot_and_block_no:
              this.personalInformations
                .current_address_house_or_lot_and_block_no,
            street_name: this.personalInformations.current_address_street_name,
            sub_division:
              this.personalInformations.current_address_sub_division,
            region_code: this.personalInformations.current_address_region_code,
            province_code:
              this.personalInformations.current_address_province_code,
            city_or_municipality_code:
              this.personalInformations
                .current_address_city_or_municipality_code,
            barangay: this.personalInformations.current_address_barangay,
          },
          permanent_address: {
            is_same_as_current_address:
              this.personalInformations
                .permanent_address_is_same_as_current_address,
            room_or_floor_or_unit_no_and_building_name:
              this.personalInformations
                .permanent_address_room_or_floor_or_unit_no_and_building_name,
            house_or_lot_and_block_no:
              this.personalInformations
                .permanent_address_house_or_lot_and_block_no,
            street_name:
              this.personalInformations.permanent_address_street_name,
            sub_division:
              this.personalInformations.permanent_address_sub_division,
            region_code:
              this.personalInformations.permanent_address_region_code,
            province_code:
              this.personalInformations.permanent_address_province_code,
            city_or_municipality_code:
              this.personalInformations
                .permanent_address_city_or_municipality_code,
            barangay: this.personalInformations.permanent_address_barangay,
          },
        },
        options: {
          religions: null,
          civil_status: null,
          relationships: null,
          current_address: {
            regions: null,
            provinces: null,
            cities_or_municipalities: null,
          },
          permanent_address: {
            regions: null,
            provinces: null,
            cities_or_municipalities: null,
          },
        },
      };
      return response;
    },
    notProceed: function () {
      const currentAddress = this.edit.submit.current_address;
      if (
        currentAddress.street_name.length > 0 &&
        currentAddress.region_code.length > 0 &&
        currentAddress.province_code.length > 0 &&
        currentAddress.city_or_municipality_code.length > 0 &&
        currentAddress.barangay.length > 0 &&
        (currentAddress.room_or_floor_or_unit_no_and_building_name.length > 0 ||
          currentAddress.house_or_lot_and_block_no.length > 0)
      ) {
        return false;
      }

      return true;
    },
    formatted: function (columnName, columnValue) {
      if (columnName === "birth_date")
        return helperMethods.convertToReadableFormatDate(columnValue);
      else return columnValue;
    },
    isValidEmail(val) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid Email";
    },
    onSubmit: async function () {
      try {
        if (
          this.edit.submit.current_address
            .room_or_floor_or_unit_no_and_building_name.length === 0 &&
          this.edit.submit.current_address.house_or_lot_and_block_no.length ===
            0
        ) {
          helperMethods.showErrorMessage(
            "(Room / Floor /Unit No. & Building Name) or (House / Lot & Block No.) for Current Address is required",
            false,
          );
          return;
        }

        document.getElementById("btnSubmit").disabled = true;

        let response = await this.$store.dispatch(
          "personal_informations_module/createRequest",
          this.edit.submit,
        );

        $q.notify({
          type: "positive",
          message: response.data,
        });

        return this.$router.push("/my-request");
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
      } finally {
        document.getElementById("btnSubmit").disabled = false;
      }
    },
    getAllReligions: async function () {
      try {
        let response = await this.$store.dispatch(
          "personal_informations_module/getAllReligions",
        );
        return response.data;
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
        return null;
      }
    },
    getAllCivilStatuses: async function () {
      try {
        let response = await this.$store.dispatch(
          "personal_informations_module/getAllCivilStatuses",
        );
        return response.data;
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
        return null;
      }
    },
    getAllRelationships: async function () {
      try {
        let response = await this.$store.dispatch(
          "personal_informations_module/getAllRelationships",
        );
        return response.data;
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
        return null;
      }
    },
    getAllRegions: async function () {
      try {
        let response = await this.$store.dispatch(
          "personal_informations_module/getAllRegions",
        );
        return response.data;
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
        return null;
      }
    },
    getAllProvinces: async function (regionCode) {
      try {
        let response = await this.$store.dispatch(
          "personal_informations_module/getAllProvinces",
          regionCode,
        );
        return response.data;
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
        return null;
      }
    },
    getAllCitiesOrMunicipalities: async function (provinceCode) {
      try {
        let response = await this.$store.dispatch(
          "personal_informations_module/getAllCitiesOrMunicipalities",
          provinceCode,
        );
        return response.data;
      } catch (error) {
        let withRefresh = false;
        helperMethods.showErrorMessage(error, withRefresh);
        return null;
      }
    },
    refresh: function () {
      helperMethods.refreshPage();
    },
  },
};
</script>