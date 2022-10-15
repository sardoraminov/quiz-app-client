<template>
  <div
    class="login-page min-h-screen flex flex-col justify-center items-center"
  >
    <div
      class="login-box flex flex-col text-center border-2 border-gray px-6 py-3"
    >
      <div class="titles py-3">
        <h1 class="box-title text-2xl font-bold">Kirish</h1>
      </div>
      <p class="error text-sm mb-2" v-if="err.isErr">{{ err.msg }}</p>
      <input
        v-model="id"
        class="user-id border-2 border-gray outline-none px-3 py-1 rounded transition-all focus:border-blue"
        placeholder="ID ni kiriting"
        type="text"
      />
      <button
        :disabled="disableBtn"
        @click="login()"
        class="login-btn transition-all hover:shadow my-3 p-2 rounded bg-blue text-white disabled:bg-gray"
      >
        KIRISH
      </button>
    </div>
    <div class="authors mt-4">
      
      <a href="https://dasturchioka.uz" target="_blank" class="ml-1"
        ><span class="text-blue font-bold">@</span> dasturchioka</a
      >
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { api } from "@/plugins/api";
import Cookie from "js-cookie";
import { useRouter } from "vue-router";
export default {
  name: "Login",
  setup() {
    document.title = "Kirish | @dasturchioka";
    const router = useRouter();
    let id = ref("");
    let err = reactive({
      isErr: false,
      msg: "",
    });
    let disableBtn = ref(false);

    const login = async () => {
      try {
        if (id.value.length < 1) {
          err.isErr = true;
          err.msg = "ID ni kiritish zarur";
          return;
        } else {
          disableBtn.value = true;
          const resp = await api.post("/users/login", { oneId: id.value });
          if (resp.data.status === "bad") {
            disableBtn.value = false;
            err.isErr = true;
            err.msg = resp.data.msg;
          } else {
            err.isErr = false;
            err.msg = "";
            Cookie.set("auth_token", resp.data.auth_token);
            Cookie.set("user_oneId", resp.data.user.oneId);
            Cookie.set("user", JSON.stringify(resp.data.user));
            disableBtn.value = false;
            router.push("/discover");
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    return { id, disableBtn, err, login };
  },
};
</script>

<style></style>
