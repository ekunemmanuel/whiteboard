<script setup lang="ts">

const openDropdown = ref(false);
const isPenSelected = ref(true);
const isSelectingColor = ref(false);
const items = [
  [
    {
      slot: "thickness",
    },
  ],
];
const tools = useTool();
const isOpen = ref(false);
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
const route = useRoute();
const isCreate = route.name === "create";
const props = defineProps({
  readonly: {
    type: Boolean,
    default: true,
  },
});

const readOnly = toRef(props, "readonly");
const isReadonly = computed(() => {
  return isCreate || (route.name === "join" && !readOnly.value);
});

function selectedTool(tool: Tools) {
  if (tool === "pen") {
    isPenSelected.value = true;
    tools.value.isEraserSelected = false;
    isSelectingColor.value = false;
    openDropdown.value = false;
  } else if (tool === "strokeWidth") {
    tools.value.width;
  } else if (tool === "colorPalette") {
    isSelectingColor.value = false;
    tools.value.color;
  } else if (tool === "eraser") {
    tools.value.isEraserSelected = true;
    isPenSelected.value = false;
    isSelectingColor.value = false;
    openDropdown.value = false;
  }
}
watch([isSelectingColor, openDropdown], () => {
  if (openDropdown.value) {
    isPenSelected.value = false;
    tools.value.isEraserSelected = false;
    isSelectingColor.value = false;
  } else {
    isPenSelected.value = true;
    tools.value.isEraserSelected = false;
    isSelectingColor.value = false;
  }

  if (isSelectingColor.value) {
    isPenSelected.value = false;
    tools.value.isEraserSelected = false;
  }
});
type Tools = "pen" | "eraser" | "strokeWidth" | "colorPalette";

const emit = defineEmits(["readonly"]);

function makeReadonly() {
  emit("readonly");
}
</script>

<template>
  <div class="p-[10px]">
    <div
      class="rounded-lg p-[2px] ring-1 ring-gray-200 dark:ring-gray-800 shadow w-max bg-white dark:bg-gray-900"
    >
      <div class="flex items-center gap-[5px]">
        <UTooltip text="Home">
          <UButton
            icon="material-symbols:home-rounded"
            aria-label="Home"
            to="/"
          />
        </UTooltip>
        <UTooltip text="Read Only" v-if="isCreate">
          <UButton
            icon="material-symbols:lock"
            aria-label="lock"
            :color="readOnly ? 'primary' : 'gray'"
            :variant="readOnly ? 'solid' : 'ghost'"
            @click="makeReadonly"
          />
        </UTooltip>
        <div v-if="isReadonly" class="flex items-center gap-[5px]">
          <UTooltip text="Brush Tool">
            <UButton
              icon="material-symbols:brush"
              aria-label="Brush"
              :color="isPenSelected ? 'primary' : 'gray'"
              :variant="isPenSelected ? 'solid' : 'ghost'"
              @click="selectedTool('pen')"
            />
          </UTooltip>

          <UDropdown
            v-model:open="openDropdown"
            :items="items"
            :popper="{ placement: 'bottom' }"
          >
            <UTooltip text="Brush Width">
              <UButton
                icon="fluent:line-thickness-24-regular"
                color="gray"
                :variant="openDropdown ? 'solid' : 'ghost'"
                aria-label="Thickness"
              />
            </UTooltip>

            <template #thickness>
              1
              <URange
                @change="selectedTool('strokeWidth')"
                v-model="tools.width"
                :min="1"
                :max="100"
              />
              {{ tools.width }}
            </template>
          </UDropdown>

          <UTooltip text="Color Palette">
            <div
              class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 rounded-md p-1.5 shadow-sm ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400"
              :class="[
                isSelectingColor
                  ? 'bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 ring-1 ring-inset'
                  : '',
              ]"
            >
              <label
                for="color"
                class="size-[20px] rounded-md block ring-gray-300 dark:ring-gray-700 ring-1 ring-inset"
                :style="{ backgroundColor: tools.color }"
                @click="isSelectingColor = true"
              ></label>
              <UInput
                v-model="tools.color"
                @change="selectedTool('colorPalette')"
                class="invisible size-[0]"
                type="color"
                id="color"
              />
            </div>
          </UTooltip>

          <UTooltip text="Eraser Tool">
            <UButton
              icon="material-symbols:ink-eraser"
              :color="tools.isEraserSelected ? 'primary' : 'gray'"
              :variant="tools.isEraserSelected ? 'solid' : 'ghost'"
              aria-label="Eraser"
              @click="selectedTool('eraser')"
            />
          </UTooltip>
        </div>

        <UTooltip text="Message Tool">
          <UChip inset text="3" size="2xl" :show="true">
            <UButton
              icon="ic:round-chat-bubble"
              color="gray"
              variant="ghost"
              aria-label="Message"
              @click="isOpen = true"
            />
          </UChip>
        </UTooltip>

        <UTooltip text="Toggle Dark Mode">
          <UToggle
            v-model="isDark"
            on-icon="i-heroicons-moon-20-solid"
            off-icon="i-heroicons-sun-20-solid"
          />
        </UTooltip>
      </div>
    </div>
    <Message :isOpen @close="isOpen = false"/>
  </div>
</template>
<style scoped></style>
