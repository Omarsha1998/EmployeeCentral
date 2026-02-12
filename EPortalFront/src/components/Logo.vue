<template>
  <q-card-section>
    <div class="avatar-container absolute-center bg-white">
      <img src="../assets/images/app-logo.png" alt="avatar" class="avatar-image" />
    </div>
  </q-card-section>
</template>

<script>
export default {
  name: "Logo"
};
</script>

<style scoped>
.avatar-container {
  width: 170px;
  height: 170px;
  overflow: hidden; /* Ensure the image doesn't overflow */
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Make sure the image covers the entire area */
}
</style>
