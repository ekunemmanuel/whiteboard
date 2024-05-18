<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from "#ui/types";
const items = [
  {
    key: "create",
    label: "Create a Room",
    description: "Create a classroom",
  },
  {
    key: "join",
    label: "Join a Room",
    description: "Join a Room",
  },
];

const createState = reactive({
  name: undefined,
});

const joinState = reactive({
  code: undefined,
});

const validateName = (state: typeof createState): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: "name", message: "Required" });
  return errors;
};

const validateCode = (state: typeof joinState): FormError[] => {
  const errors = [];
  if (!state.code) errors.push({ path: "code", message: "Required" });
  return errors;
};

async function createRoom(event: FormSubmitEvent<typeof createState>) {
  try {
    const data = await $fetch("/api/room/create", {
      method: "POST",
      body: {
        roomName: event.data.name,
      },
    });
    if (data) {
      navigateTo({
        path: "/create",
        query: {
          roomName: data.roomName,
          roomCode: data.roomCode,
          creatorId: data.creatorId,
        },
      });
    }
  } catch (error: any) {
    alert(error.data.message);
    console.log(error.data.message);
  }
}

async function joinRoom(event: FormSubmitEvent<typeof joinState>) {
  try {
    const data = await $fetch("/api/room/join", {
      method: "POST",
      body: {
        roomCode: event.data.code,
      },
    });

    if (data) {
      navigateTo({
        path: "/join",
        query: {
          roomName: data.roomName,
          roomCode: data.roomCode,
          userId: data.userId,
        },
      });
    }
  } catch (error: any) {
    alert(error.data.message);
    console.log(error.data.message);
  }
}

useHead({
  title: "Interactive Whiteboard",
});
</script>

<template>
  <div class="grid place-items-center h-screen">
    <UTabs :items="items" class="max-w-[600px] w-full">
      <template #item="{ item }">
        <UCard>
          <template #header>
            <p
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ item.label }}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ item.description }}
            </p>
          </template>

          <div v-if="item.key === 'create'" class="space-y-3">
            <UForm
              :validate="validateName"
              :state="createState"
              class="space-y-4"
              @submit="createRoom"
            >
              <UFormGroup label="Room Name" name="name">
                <UInput v-model="createState.name" />
              </UFormGroup>

              <UButton type="submit"> Create </UButton>
            </UForm>
          </div>
          <div v-else-if="item.key === 'join'" class="space-y-3">
            <UForm
              :validate="validateCode"
              :state="joinState"
              class="space-y-4"
              @submit="joinRoom"
            >
              <UFormGroup label="Room Code" name="code">
                <UInput v-model="joinState.code" />
              </UFormGroup>

              <UButton type="submit"> Join </UButton>
            </UForm>
          </div>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>

<style scoped></style>
