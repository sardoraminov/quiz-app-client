import { createStore } from "vuex";
import { api } from "../plugins/api";
import Cookies from "js-cookie";

export default createStore({
  state: {
    exams: [],
    loading: false,
    error: null,
    currentExam: {},
  },
  getters: {
    getExams: (state) => state.exams,
    getLoading: (state) => state.loading,
    getCurrentExam: (state) => state.currentExam,
  },
  mutations: {
    setExams(state, payload) {
      state.exams = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setCurrentExam(state, payload) {
      state.currentExam = payload;
    },
  },
  actions: {
    async fetchExams({ commit }, payload) {
      commit("setLoading", true);
      try {
        const response = await api.get(`/exams/forusers`);
        commit("setExams", response.data);
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        console.log(error);
      }
    },
    async enterExam({ commit }, payload) {
      commit("setLoading", true);
      try {
        const resp = await api.get(`/users/enterexam/${payload.oneId}`);
        commit("setCurrentExam", resp.data);
        commit("setLoading", false);
        Cookies.set("exam_token", resp.data.exam_token, { expires: "1d" });
        console.log(resp.data);
      } catch (error) {
        commit("setLoading", false);
        console.log(error);
      }
    },
  },
  modules: {},
});
