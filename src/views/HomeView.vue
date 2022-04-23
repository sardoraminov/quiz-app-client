<template>
  <div class="start-page min-h-screen">
    <div
      class="register-form flex flex-col justify-evenly bg-blue min-h-[220px] text-center pb-4"
    >
      <span class="logo text-white font-light"
        >livecoders <b class="font-extrabold text-xs">TM</b></span
      >
      <div class="inputs">
        <input
          v-model="user.firstname"
          class="mx-3 py-2 px-4 rounded-md outline-none text-white placeholder:text-[#D7F2FA] bg-transparent border-white border-2 my-2"
          type="text"
          placeholder="Ism"
        />
        <input
          v-model="user.lastname"
          class="mx-3 py-2 px-4 rounded-md outline-none text-white placeholder:text-[#D7F2FA] bg-transparent border-white border-2 my-2"
          type="text"
          placeholder="Familiya"
        />
      </div>
    </div>
    <div
      class="text-center my-6 text-lg mt-8"
      v-if="user.firstname.length < 2 || user.lastname.length < 5"
    >
      Ism familiyangizni to'liq yozing!
    </div>
    <main v-else class="subjects-box py-6 px-7">
      <h1 class="title text-dark font-bold text-xl">Testlar</h1>
      <div class="reminder my-6">
        <div class="box flex flex-row items-center my-2">
          <div class="something available bg-green w-5 h-5 mr-2"></div>
          - Mavjud
        </div>
        <div class="box flex flex-row items-center my-2">
          <div class="something available bg-gray w-5 h-5 mr-2"></div>
          - Mavjud emas
        </div>
      </div>
      <div class="subjects grid grid-cols-auto relative gap-12 my-4 mt-11">
        <router-link
          v-for="(exam, index) in exams"
          :key="index"
          :to="
            exam.active
              ? `/test?subject=${exam.name}&pupil=${user.fullname}`
              : '#' + index
          "
          :class="[
            exam.active ? 'border-green' : 'border-gray',
            'subject relative border-[5px] rounded-md h-[230px] flex justify-center items-center',
          ]"
        >
          <p
            :class="[
              exam.active ? 'bg-green' : 'bg-gray',
              'subject-id font-bold absolute -top-3  -left-3 text-white px-3 py-[1.5px] rounded-full',
            ]"
          >
            0{{ index + 1 }}
          </p>
          <h2
            :class="[
              exam.active ? 'text-green' : 'text-gray',
              'text-2xl font-bold',
            ]"
          >
            {{ exam.name }}
          </h2>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "Home",
  setup() {
    const store = useStore();

    const user = reactive({
      firstname: "",
      lastname: "",
      fullname: computed(() => `${user.firstname} ${user.lastname}`),
    });

    const isFullname = ref(user.fullname.length > 2 ? true : false);


    onMounted(() => {
      setTimeout(() => {
        store.dispatch("fetchExams");
      }, 1000);
    });

    const exams = computed(() => {  
      return store.getters.getExams;
    });

    return {
      user,
      isFullname,
      exams,
    };
  },
};
</script>

<style></style>
