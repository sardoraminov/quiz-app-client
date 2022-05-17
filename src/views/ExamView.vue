<template>
  <div class="exam-page mx-3">
    <h1 class="exam-name mt-6 text-2xl font-bold">
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
      @click="leaveExam()"
      class="btn bg-red text-white rounded px-3 py-2"
    >
      Chiqish
    </button>
    <button
      v-show="scY"
      @click="toTop()"
      class="go-top bg-blue rounded px-4 py-3 position fixed right-4 bottom-4 z-50"
    >
      <ion-icon name="chevron-up-outline" class="mt-1 text-white"></ion-icon>
    </button>
  </div>
</template>

<script>
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../plugins/api";
import Cookie from "js-cookie";
import { convertMsToTime } from "@/utils/convertMsToTime";
export default {
  name: "exam",
  props: ["id"],
  setup(props) {
    let exam = reactive(JSON.parse(Cookie.get("exam")));
    let user = JSON.parse(Cookie.get("user"));

    let pupilAnswers = reactive([]);

    let topBtnVisible = ref(false);
    let scTimer = ref(0);
    let scY = ref(0);

    const checkExam = () => {
      api.get(`/exams/available/${props.id}`).then((res) => {
        if (res.data.status === "ok") {
          return;
        } else {
          Cookie.remove("exam");
          Cookie.remove("exam_token");
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
      api.put(`/exams/${props.id}/pupilLeave`).then((res) => {
        if (res.data.status === "ok") {
          api.put(`/users/${user.oneId}/free`).then((res) => {
            Cookie.set("user", JSON.stringify(res.data.user));
            console.log(res.data);
          });
          Cookie.remove("exam");
          Cookie.remove("exam_token");
          window.location.href = "/discover";
        } else {
          console.log(res.data.msg);
        }
      });
    };
    const getUser = async () => {
      api.get(`/users/${Cookie.get("user_oneId")}`).then((res) => {
        Cookie.set("user", JSON.stringify(res.data));
        console.log(res.data);
      });
    };
    const getExam = async () => {
      api.get(`/exams/${props.id}`).then((res) => {
        Cookie.remove("exam");
        Cookie.set("exam", JSON.stringify(res.data));
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
    const generateUserAnswers = () => {
      for (let i = 0; i < exam.examQuestions.length; i++) {
        pupilAnswers.push({
          questionId: exam.examQuestions[i + 1],
          question: exam.examQuestions[i].question,
          answer: "",
          examId: exam.examId,
          pupilId: user.oneId,
        });
      }
    };

    onBeforeMount(() => {
      calculateTime();
      window.addEventListener("scroll", handleScroll);
      getExam();
      checkExam();
      getUser();
      generateUserAnswers();
      console.log(pupilAnswers);
    });

    return {
      exam,
      leaveExam,
      topBtnVisible,
      scY,
      toTop,
      convertMsToTime,
      user,
    };
  },
};
</script>

<style></style>
