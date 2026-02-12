<template>
  <div class="bgImageUERM row justify-center">
    <div class="column">
      <div class="row">
        <q-layout class="row justify-center items-center">
          <q-card
            style="margin: 15px"
            :style="{
              width: $q.screen.lt.sm
                ? '300px'
                : $q.screen.lt.md
                ? '350px'
                : '400px',
            }"
          >
            <div style="padding-top: 70px; padding-bottom: 75px">
              <Logo />
            </div>
            <q-card-section>
              <q-form
                id="frm"
                class="q-gutter-md"
                method="post"
                @submit.prevent="onSubmit"
                autocomplete="off"
              >
                <q-input
                  id="txtEmployeeID"
                  label="Employee ID"
                  v-model="user.employee_id"
                  standout="bg-primary text-white"
                  lazy-rules
                  class="q-pt-none q-pb-xs"
                  maxlength="20"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Employee ID is required',
                  ]"
                >
                </q-input>
                <q-input
                  label="Password"
                  :type="passwordVisible ? 'text' : 'password'"
                  v-model="user.password"
                  class="q-pt-none q-pb-xs"
                  maxlength="32"
                  standout="bg-primary text-white"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Password is required',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      v-if="!passwordVisible"
                      name="visibility_off"
                      class="cursor-pointer"
                      color="black-10"
                      @click="passwordVisible = !passwordVisible"
                    />
                    <q-icon
                      v-else
                      name="visibility"
                      class="cursor-pointer"
                      color="black-10"
                      @click="passwordVisible = !passwordVisible"
                    />
                  </template>
                </q-input>

                <div>
                  <q-checkbox
                    v-model="user.remember_me"
                    label="Remember Me"
                    color="primary"
                  />
                </div>

                <div>
                  <q-btn
                    class="full-width"
                    color="primary"
                    label="Login"
                    type="submit"
                    push
                  ></q-btn>

                  <div class="text-center q-mt-sm q-gutter-lg">
                    <br />

                    v {{ app_version }}
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-layout>
      </div>
    </div>
  </div>

  <q-dialog
    persistent
    :maximized="false"
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="dialogRememberMe"
  >
    <q-card class="q-dialog-plugin">
      <div class="q-card__section q-card__section--vert q-dialog__message">
        You have checked the "Remember Me" checkbox. You will stay logged in on
        this web browser for 3 days. If you log in to your account on another
        device, you will be automatically logged out of this web browser.
      </div>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="I understand"
          @click="this.$refs.dialogRememberMe.hide()"
          style="text-transform: none"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
// -------------------- Notify plugins --------------------
import { useQuasar } from "quasar";
let $q;
// -------------------- Notify plugins --------------------
import TitleWithAppName from "../components/TitleWithAppName.vue";
import Logo from "../components/Logo.vue";
import { QSpinnerIos } from "quasar";
import helperMethods from "../helperMethods.js";

export default {
  name: "Login",
  components: {
    Logo,
    TitleWithAppName,
  },
  data: function () {
    return {
      user: {
        employee_id: null,
        password: null,
        remember_me: null,
      },
      app_version: process.env.APP_VERSION,
      passwordVisible: false,
    };
  },
  mounted: function () {
    $q = useQuasar();
    this.onReset();
  },
  watch: {
    "user.remember_me"() {
      if (this.user.remember_me) this.$refs.dialogRememberMe.show();
    },
  },
  methods: {
    async onSubmit() {
      this.passwordVisible = false;

      this.$q.loading.show({
        spinner: QSpinnerIos,
        message: "Logging In",
        messageColor: "primary",
        backgroundColor: "grey-1",
        spinnerColor: "primary",
        customClass: "custom-loading-style",
        spinnerSize: "7em",
      });
      try {
        await helperMethods.delay(100);
        await this.$store.dispatch("user_module/login", {
          employeeID: this.user.employee_id,
          password: this.user.password,
          rememberMe: this.user.remember_me,
        });
        this.$q.loading.hide();
        return this.$router.push("/");
      } catch (error) {
        this.$q.loading.hide();
        this.onReset();
        const errorMessage =
          error.message || error.toString() || "An error occurred";

        this.$q.notify({
          type: "negative",
          message: errorMessage,
          timeout: 1500,
          progress: true,
        });
      }
    },
    onReset: function () {
      document.getElementById("frm").reset();
      this.user.employee_id = null;
      this.user.password = null;
      this.user.remember_me = false;
    },
  },

  async created() {
    if (this.$route.params?.userHash) {
      const decodedString = atob(this.$route.params?.userHash);
      this.$q.loading.show({
        spinner: QSpinnerIos,
        message: "Logging In",
        messageColor: "primary",
        backgroundColor: "grey-1",
        spinnerColor: "primary",
        customClass: "custom-loading-style",
        spinnerSize: "7em",
      });
      try {
        await this.$store.dispatch("user_module/loginViaPwHash", {
          employeeID: decodedString,
        });
        this.$q.loading.hide();
        this.$router.push("/");
      } catch (error) {
        console.error(error);
      }
    }
  },
};
</script>
