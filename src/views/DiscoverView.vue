<template>
  <div class="discover-page mx-3">
    <div class="authors m-1 text-center text-sm">
      <a href="https://dasturchioka.uz" target="_blank" class="author text-blue"
        >dasturchioka &copy;</a
      >
    </div>
    <div
      class="user-container text-white flex sm:flex-row sm:items-center sm:justify-between flex-col ite flex-wrap bg-blue rounded p-5"
    >
      <div class="names flex flex-col mb-3">
        <div class="id flex flex-row items-center mb-3">
          <p
            class="bg-white text-blue btn cursor-pointer rounded py-2 px-3 transition-all hover:shadow-lg"
          >
            {{ user.oneId }}
          </p>
        </div>
        <h1 class="fullname text-2xl font-bold">{{ user.fullname }}</h1>
        <p class="classNum">{{ user.classNum }} - sinf</p>
      </div>
      <button
        @click="logout()"
        class="logout bg-white text-blue rounded px-3 py-2 font-bold transition-all hover:shadow-lg"
      >
        Chiqish
      </button>
    </div>
    <div class="exam-container my-5">
      <div class="exams">
        <h1 class="title text-2xl ml-3 font-bold">Imtihonlar</h1>
        <input
          v-model="search"
          type="text"
          placeholder="Izlash..."
          class="border-2 border-gray outline-none px-3 py-2 transition-all focus:border-blue rounded w-full mt-2 mb-5"
        />
        <div class="loading text-center mt-9 text-xl" v-if="loading">
          Loading...
        </div>
        <div
          class="text-center mt-9 text-xl"
          v-else-if="filteredList.length === 0"
        >
          <div v-if="search">
            <b class="text-blue">{{ search }}</b> bo'yicha imtihon topilmadi :(
          </div>
          <div v-else>Hozircha imtihonlar mavjud emas!</div>
        </div>
        <div v-else class="exams-group">
          <div class="exams-con grid grid-cols-auto gap-5">
            <div
              v-for="(exam, index) in filteredList"
              :key="index"
              class="exam border border-gray rounded p-4 relative"
            >
              <div class="titles">
                <h1 class="exam-name text-xl font-bold">
                  {{ exam.name }} {{ exam.classNum }}
                </h1>
                <p class="exam-oneId text-sm opacity-80">{{ exam.oneId }}</p>
              </div>

              <div class="exam-info mt-4 flex flex-col items-start">
                <div v-if="exam.timeOut === 0">
                  <p class="text-red font-bold">Imtihon tugadi</p>
                </div>
                <div v-else class="flex flex-col">
                  <div class="flex flex-row items-center">
                    <p class="count-of-pupils flex flex-row items-center">
                      <img class="w-5 mr-1" :src="UserIco" alt="user" />
                      {{ exam.pupils }}
                    </p>
                    <p class="flex flex-row items-center ml-4">
                      <img :src="TimeIco" class="w-5 mr-1" alt="time" />
                      {{ convertMsToTime(exam.timeOut) }}
                    </p>
                  </div>
                  <button
                    @click="enterExam(exam.oneId)"
                    :disabled="disableBtn"
                    class="enter-exam btn bg-blue text-white mt-2 rounded px-3 py-2 font-bold transition hover:shadow-lg disabled:bg-gray"
                  >
                    Kirish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "../plugins/api";
import { ref, reactive, onBeforeMount, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import { convertMsToTime } from "@/utils/convertMsToTime";
import PlusIco from "@/assets/plus.svg";
import UserIco from "@/assets/user.svg";
import TimeIco from "@/assets/time.svg";
export default {
  name: "Discover",
  setup() {
    const store = useStore();
    const router = useRouter();

    let user = reactive(JSON.parse(Cookie.get("user")));

    let exams = reactive(store.state.exams);

    let search = ref("");
    let loading = ref(false);
    let disableBtn = ref(false);

    const getExams = async () => {
      loading.value = true;
      store.dispatch("fetchExams").then(() => {
        loading.value = false;
        exams = store.state.exams;
      });
    };

    const checkUser = async () => {
      api.get(`/users/available/${user.oneId}`).then((res) => {
        if (res.data.status === "ok") {
          return;
        } else {
          Cookie.remove("user");
          Cookie.remove("auth_token");
          Cookie.remove("user_oneId");
          Cookie.remove("exam");
          Cookie.remove("exam_token");
          Cookie.remove("pupilAnswers");
          window.location.href = "/";
        }
      });
    };

    const enterExam = async (id) => {
      disableBtn.value = true;
      let cookieAvailable = Cookie.get("exam_token") ? true : false;
      api
        .get(`/users/enterexam/${id}`, {
          headers: {
            "Exam-token": cookieAvailable ? Cookie.get("exam_token") : "",
          },
        })
        .then((res) => {
          console.log(res.data);
          Cookie.set("exam", JSON.stringify(res.data));
          Cookie.set("exam_token", res.data.exam_token);
          let pupilAnswers = [];
          res.data.examQuestions.forEach((question, i) => {
            pupilAnswers.push({
              questionIndex: i,
              questionTitle: question.question,
              correctAnswer: question.answer,
              pupilAnswer: "",
              userId: user.oneId,
              examId: res.data.examId,
            });
          });
          Cookie.set("pupilAnswers", JSON.stringify(pupilAnswers));
          api
            .put(`/users/${user.oneId}/active`, {
              examName: `${res.data.examName}`,
              examClassNum: res.data.examClassNum,
            })
            .then((res) => {
              console.log(res.data);
              Cookie.remove("user");

              Cookie.set("user", JSON.stringify(res.data.user));
            });
        })
        .then(() => {
          window.location.href = `/exam/${id}`;
          disableBtn.value = false;
        });
    };

    const calculateTime = async () => {
      setInterval(() => {
        filteredList.value.forEach((exam) => {
          if (exam.timeOut === 0 || exam.timeOut < 0) {
            exam.finished = true;
          } else {
            exam.timeOut -= 1000;
          }
        });
      }, 1000);
    };

    const getUser = async () => {
      api.get(`/users/${user.oneId}`).then((res) => {
        Cookie.set("user", JSON.stringify(res.data));
        console.log(res.data);
      });
    };

    onBeforeMount(() => {
      getExams();
      calculateTime();
      getUser();
      checkUser();
    });

    let filteredList = computed(() => {
      return exams.filter((exam) => {
        return (
          exam.name.toLowerCase().includes(search.value.toLowerCase()) ||
          exam.oneId.toLowerCase().includes(search.value.toLowerCase())
        );
      });
    });

    const copy = (id) => {
      navigator.clipboard.writeText(id);
    };

    const logout = () => {
      Cookie.remove("auth_token");
      Cookie.remove("user");
      router.push("/login");
    };

    return {
      user,
      copy,
      exams,
      logout,
      search,
      filteredList,
      loading,
      convertMsToTime,
      PlusIco,
      UserIco,
      TimeIco,
      disableBtn,
      enterExam,
    };
  },
};
</script>

<style></style>
