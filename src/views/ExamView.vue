<template>
  <div>
    <div class="exam-page mx-5">
      <div class="top border border-gray rounded p-4 py-6 mt-4">
        <h1 class="exam-name text-2xl font-bold">
          {{ exam.examName }} {{ exam.examClassNum }}
          <b class="opacity-70 text-base font-medium">({{ exam.examId }})</b>
        </h1>
        <div class="down flex flex-row items-center mt-3 mb-5">
          <p class="exam-pupils flex flex-row items-center mr-5">
            <ion-icon name="person-outline" class="mr-1"></ion-icon>
            {{ exam.examPupils }}
          </p>
          <p class="exam-timeout flex flex-row items-center mr-2">
            <ion-icon name="time-outline" class="mr-1"></ion-icon>
            {{ convertMsToTime(exam.examTimeOut) }}
          </p>
        </div>
        <div class="user">
          <p>
            Sizning ID: <b>{{ user.oneId }}</b>
          </p>
        </div>
        <button
          :disabled="loading"
          class="refresh-btn disabled:bg-gray btn text-white bg-blue rounded px-3 py-2 transition-all hover:shadow-lg mt-3"
          @click="reload()"
        >
          {{ loading ? "" : "Yangilash" }}
          <ion-icon name="refresh-outline" class="text-base"></ion-icon>
        </button>
      </div>

      <button
        v-show="scY"
        @click="toTop()"
        class="go-top bg-blue rounded px-4 py-3 position fixed right-4 top-4 z-50"
      >
        <ion-icon name="chevron-up-outline" class="mt-1 text-white"></ion-icon>
      </button>
      <div class="exam-questions sm:px-6 mt-5 flex flex-col">
        <h1 class="text-2xl font-bold mt-4">Savollar</h1>
        <div
          v-for="(question, index) in exam.examQuestions"
          :key="index"
          class="exam-question border-b border-gray py-8 font-roboto"
        >
          <h2 class="question-title text-xl mb-4">
            <b>{{ index + 1 }}.</b> {{ question.question }}
          </h2>
          <div class="exam-options space-y-3 flex flex-col">
            <div class="option relative w-full">
              <input
                class="absolute hidden"
                type="radio"
                :name="`answer-for-${index + 1} question`"
                :value="question.optionA"
                v-model="pupilAnswers[index].pupilAnswer"
                @change="changePupilAnswer(index, question.optionA)"
                :checked="question.optionA === pupilAnswers[index].pupilAnswer"
                :id="`${question.optionA}-${index + 1}`"
              />
              <label
                class="z-20 block cursor-pointer w-full p-4 hover:bg-slate-100 transition-all"
                :for="`${question.optionA}-${index + 1}`"
                >{{ question.optionA }}</label
              >
            </div>
            <div class="option relative w-full">
              <input
                class="absolute hidden"
                type="radio"
                :name="`answer-for-${index + 1} question`"
                :value="question.optionB"
                v-model="pupilAnswers[index].pupilAnswer"
                @change="changePupilAnswer(index, question.optionB)"
                :checked="question.optionB === pupilAnswers[index].pupilAnswer"
                :id="`${question.optionB}-${index + 1}`"
              />
              <label
                class="z-20 block cursor-pointer w-full p-4 hover:bg-slate-100 transition-all"
                :for="`${question.optionB}-${index + 1}`"
                >{{ question.optionB }}</label
              >
            </div>
            <div class="option relative w-full">
              <input
                class="absolute hidden"
                type="radio"
                :name="`answer-for-${index + 1} question`"
                :value="question.optionC"
                v-model="pupilAnswers[index].pupilAnswer"
                @change="changePupilAnswer(index, question.optionC)"
                :checked="question.optionC === pupilAnswers[index].pupilAnswer"
                :id="`${question.optionC}-${index + 1}`"
              />
              <label
                :for="`${question.optionC}-${index + 1}`"
                class="z-20 block  hover:bg-slate-100 transition-all cursor-pointer w-full p-4"
                >{{ question.optionC }}</label
              >
            </div>
            <div class="option relative w-full">
              <input
                class="absolute hidden"
                type="radio"
                :name="`answer-for-${index + 1} question`"
                :value="question.optionD"
                v-model="pupilAnswers[index].pupilAnswer"
                @change="changePupilAnswer(index, question.optionD)"
                :checked="question.optionD === pupilAnswers[index].pupilAnswer"
                :id="`${question.optionD}-${index + 1}`"
              />
              <label
                :for="`${question.optionD}-${index + 1}`"
                class="z-20 block cursor-pointer w-full p-4 hover:bg-slate-100 transition-all"
                >{{ question.optionD }}</label
              >
            </div>
          </div>
        </div>
      </div>
      <div class="btns my-4 space-x-2">
        <button
          :disabled="disableBtn"
          @click="leaveExam()"
          class="btn bg-red text-white rounded px-3 py-2 disabled:bg-gray"
        >
          Chiqish
        </button>
        <button
          @click="saveResults(exam.examId)"
          :disabled="disableBtn"
          class="btn bg-blue text-white rounded px-3 py-2 disabled:bg-gray"
        >
          Tugatish
        </button>
      </div>
      <div class="reminder mb-6">
        <p class="mb-4">
          <span class="text-red italic font-bold">Chiqish</span> tugmasini
          bosish orqali siz imtihondan chiqib ketasiz va natijalaringiz
          saqlanmaydi!
        </p>
        <p class="">
          <span class="text-blue italic font-bold">Tugatish</span> tugmasi bilan
          esa sizning natijalaringiz serverda saqlanadi va imtihondan chiqib
          ketasiz!
        </p>
      </div>
    </div>
    <footer class="authors bg-blue py-3 text-center text-white">
      <p>
        Powered by
        <a
          href="https://instagram.com/livecoders"
          target="_blank"
          class="underline"
          >livecoders <b>TM</b></a
        >
      </p>
      <p>
        Made by
        <a href="https://dasturchioka.uz" class="underline" target="_blank"
          >dasturchioka</a
        >
      </p>
    </footer>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { api } from "../plugins/api";
import Cookie from "js-cookie";
import { convertMsToTime } from "@/utils/convertMsToTime";
export default {
  name: "exam",
  props: ["id"],
  setup(props) {
    let router = useRouter();

    let exam = reactive(JSON.parse(Cookie.get("exam")));
    let user = JSON.parse(Cookie.get("user"));

    let pupilAnswers = reactive(JSON.parse(Cookie.get("pupilAnswers")));

    let topBtnVisible = ref(false);
    let scTimer = ref(0);
    let scY = ref(0);

    let loading = ref(false);
    let disableBtn = ref(false);

    const checkExam = () => {
      disableBtn.value = true;
      api.get(`/exams/available/${props.id}`).then((res) => {
        if (res.data.status === "ok") {
          disableBtn.value = false;
          return;
        } else {
          disableBtn.value = false;
          Cookie.remove("exam");
          Cookie.remove("exam_token");
          Cookie.remove("pupilAnswers");
          window.location.href = "/discover";
        }
      });
    };

    const handleScroll = (e) => {
      if (scTimer.value) {
        return;
      }
      scTimer.value = setTimeout(() => {
        scY.value = window.scrollY;
        clearTimeout(scTimer.value);
        scTimer.value = 0;
      }, 100);
    };

    const leaveExam = async () => {
      disableBtn.value = true;
      api.put(`/exams/${props.id}/pupilLeave`).then((res) => {
        if (res.data.status === "ok") {
          api.put(`/users/${user.oneId}/free`).then((res) => {
            Cookie.set("user", JSON.stringify(res.data.user));
          });
          Cookie.remove("exam");
          Cookie.remove("exam_token");
          Cookie.remove("pupilAnswers");
          window.location.href = "/discover";
          disableBtn.value = false;
        } else {
          return;
        }
      });
    };
    const saveResults = async (id) => {
      disableBtn.value = true;
      api
        .post(`/exams/save_results/${id}`, { pupilAnswers, pupil: user.fullname, userId: user.oneId })
        .then((res) => {
          if (res.data.result) {
            Cookie.remove("exam");
            Cookie.remove("exam_token");
            Cookie.remove("pupilAnswers");
            window.location.href = "/discover";
            disableBtn.value = false;
          } else {
            return;
          }
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

    const getUser = async () => {
      api.get(`/users/${Cookie.get("user_oneId")}`).then((res) => {
        Cookie.set("user", JSON.stringify(res.data));
      });
    };
    const getExam = async () => {
      loading.value = true;
      api.get(`/exams/${props.id}`).then((res) => {
        Cookie.remove("exam");
        Cookie.set("exam", JSON.stringify(res.data));
        loading.value = false;
      });
    };
    const calculateTime = async () => {
      setInterval(() => {
        if (exam.examTimeOut === 0 || exam.examTimeOut < 0) {
          exam.finished = true;
        } else {
          exam.examTimeOut = exam.examTimeOut - 1000;
        }
      }, 1000);
    };

    const toTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    const changePupilAnswer = (index, answer) => {
      pupilAnswers[index].pupilAnswer = answer;
      Cookie.set("pupilAnswers", JSON.stringify(pupilAnswers));
    };

    watch(
      () => exam.examTimeOut,
      () => {
        if (exam.examTimeOut === 0 || exam.examTimeOut < 0) {
          exam.finished = true;
          leaveExam();
        }
      }
    );

    onMounted(() => {
      calculateTime();
      window.addEventListener("scroll", handleScroll);
      getExam();
      checkExam();
      getUser();
      checkUser();
    });

    const reload = () => {
      checkExam();
      checkUser();
      getUser();
      getExam();
    };

    return {
      exam,
      leaveExam,
      topBtnVisible,
      scY,
      toTop,
      convertMsToTime,
      user,
      getExam,
      loading,
      pupilAnswers,
      changePupilAnswer,
      disableBtn,
      saveResults,
      reload,
    };
  },
};
</script>

<style></style>
