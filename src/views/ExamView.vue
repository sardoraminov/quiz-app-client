<template>
  <div>
    {{ JSON.stringify(exam) }}

    <button
      @click="leaveExam()"
      class="btn bg-red text-white rounded px-3 py-2"
    >
      Chiqish
    </button>
  </div>
</template>

<script>
import { onBeforeMount, onBeforeUnmount, onMounted, reactive } from "vue";
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

    const router = useRouter();
    const checkExam = () => {
      api.get(`/exams/available/${props.id}`).then((res) => {
        if (res.data.status === "ok") {
          return;
        } else {
          Cookie.remove("exam");
          window.location.href = "/discover";
        }
      });
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
      api
        .get(`/exams/${props.id}`)
        .then((res) => {
          Cookie.remove("exam");
          Cookie.set("exam", JSON.stringify(res.data));
        })
    };
    const calculateTime = async () => {
      setInterval(() => {
        let exam = JSON.parse(Cookie.get("exam"));
        if (exam.examTimeOut === 0 || exam.examTimeOut < 0) {
          exam.finished = true;
        } else {
          exam.examTimeOut -= 1000;
        }
      }, 1000);
    };
    onBeforeMount(() => {
      getExam();
      checkExam();
      getUser();
    });

    return { exam, leaveExam };
  },
};
</script>

<style></style>
