import axios from "axios";

export const api = axios.create({
  baseURL: "https://quizapp-server.herokuapp.com/",
});
