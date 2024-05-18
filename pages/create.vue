<script lang="ts" setup>
// import Pusher from "pusher-js";
// Pusher.logToConsole = true;
// const messages = ref<string[]>([]);
// var pusher = new Pusher("aa7cbaf3ff15a472144e", {
//   cluster: "eu",
// });
// pusher.connection.bind("connected", function () {
//   console.log("Connected!");
// });
// var channel = pusher.subscribe("my-channel");
// channel.bind("my-event", function (data: any) {
//   console.log(data);

//   messages.value.push(JSON.stringify(data));
// });

const route = useRoute();
const routes = route.query;

const roomCode = routes.roomCode as string;
const userId = routes.creatorId as string;
const roomName = routes.roomName as string;
useHead({
  title: "Interactive Whiteboard",
});
</script>

<template>
  <div class="relative">
    {{ roomCode }}
    <br />
    {{ userId }}
    <br />
    {{ roomName }}

    <Connection :roomCode :userId />
    <Whiteboard :roomCode :userId  class="" />
  </div>
</template>

<style scoped></style>
