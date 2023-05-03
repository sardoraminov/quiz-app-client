import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "deployment"
      ? "http://localhost:5000"
      : "https://quiz-app-server-mocha.vercel.app/",
});
