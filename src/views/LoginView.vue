<template>
  <div class="login-page min-h-screen flex justify-center items-center">
    <div
      class="login-box flex flex-col text-center border-2 border-gray px-6 py-3"
    >
      <div class="titles py-3 mb-3">
        <h1 class="box-title text-2xl font-bold">Kirish</h1>
        <p class="authors text-sm opacity-50">livecoders <b>TM</b></p>
      </div>
      <input
        v-model="id"
        class="user-id border-2 border-gray outline-none px-3 py-1 rounded"
        placeholder="ID ni kiriting"
        type="text"
      />
      <button
        @click="login()"
        class="login-btn transition-all hover:shadow my-3 p-2 rounded bg-blue text-white"
      >
        KIRISH
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      id: "",
    };
  },
  methods: {
    async login() {
      if (this.id.length < 1) {
        this.$toast.open({
          message: "Idni kiriting!",
          type: "warning",
          position: "top",
          duration: 3000,
        });
      }
    },
  },
};
</script>

<style></style>
