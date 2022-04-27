<template>
  <div>
    <h1>Subject: {{ params.get("subject") }}</h1>
    <h1>Pupil: {{ params.get("pupil") }}</h1>
  </div>
</template>

<script>
export default {
  name: "Test",
  setup() {
    const params = new URL(window.location).searchParams;

    return { params };
  },
};
</script>

<style></style>
