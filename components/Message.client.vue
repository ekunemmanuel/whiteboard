<script lang="ts" setup>
const props = defineProps<{
  isOpen: boolean;
  refresh?: () => Promise<void>;
}>();
const userId = inject<string>("userId");
const roomCode = inject<string>("roomCode");
console.log(userId, roomCode);

const isOpen = toRef(props, "isOpen");
const messaage = ref("");
const { send, data:messages, ws } = useWebSocket(
  `ws://${location.host}/api/ws/messaage?roomCode=${roomCode}&userId=${userId}`
);

ws.value!.onmessage = (event) => {
  console.log(event.data);
};
const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};
const sendMessage = () => {
  if (!messaage.value) return;
  send(messaage.value);
  messaage.value = "";
};
</script>

<template>
  <div>
    <USlideover v-model="isOpen">
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Ask you Question
            </h3>
            <UButton
              color="rose"
              icon="i-heroicons-x-mark-20-solid"
              variant="outline"
              @click="close"
            />
          </div>
        </template>
        {{ messages }}
        <template #footer>
          <div class="flex items-end justify-between gap-[10px]">
            <div class="flex-1">
              <UTextarea
                :maxrows="5"
                :rows="1"
                autoresize
                placeholder="Ask me your question..."
                v-model="messaage"
              />
            </div>
            <UButton @click="sendMessage" icon="ion:paper-plane" />
          </div>
        </template>
      </UCard>
    </USlideover>
  </div>
</template>

<style scoped></style>
