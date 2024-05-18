<script lang="ts" setup>
const props = defineProps<{
  roomCode: string;
  userId?: string;
  refresh?: () => Promise<void>;
}>();

const roomCode = toRef(props, "roomCode");
const userId = toRef(props, "userId");
const link = ref(
  `ws://${location.host}/api/ws/classroom?roomCode=${roomCode.value}&userId=${userId.value}`
);
const userLink = ref(
  `ws://${location.host}/api/ws/users?roomCode=${roomCode.value}&userId=${userId.value}`
);
const message = ref("");

const { status, data, send, ws } = useWebSocket(link.value, {});
const { status: userStatus, data: userData } = useWebSocket(userLink.value, {});

function sendMessage() {
  send(JSON.stringify({ userId: userId.value, message: message.value }));
  message.value = "";
}
onBeforeMount(() => {
  send(JSON.stringify({ userId: userId.value, message: "joined" }));
});

onActivated(() => {
  // send(JSON.stringify({ userId: userId.value, message: "joined" }));
});

onBeforeUnmount(() => {
  // send(JSON.stringify({ userId: userId.value, message: "left" }));
});
</script>
<template>
  <div>
    {{ status }}
  </div>
</template>

<style scoped></style>
