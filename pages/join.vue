<script lang="ts" setup>
const route = useRoute();
const roomCode = route.query.roomCode as string;
const userId = route.query.userId as string;
const { error, data, refresh } = useFetch("/api/room/users", {
  query: {
    roomCode,
  },
});
if (error.value || data.value?.users === undefined) {
  createError({
    message: "Error fetching users",
  });
}
useHead({
  title: "Interactive Whiteboard",
});
</script>

<template>
  <div class="relative">
    <Connection :roomCode :userId :refresh />
    <JoinWhiteboard :roomCode :userId  />
  </div>
</template>

<style scoped></style>
