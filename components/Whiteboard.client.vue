<script lang="ts" setup>
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref(false);
const readonly = ref(true);
const tools = useTool();
const props = defineProps<{
  roomCode: string;
  userId?: string;
  refresh?: () => Promise<void>;
}>();
const roomCode = toRef(props, "roomCode");
const userId = toRef(props, "userId");
console.log(userId.value);
provide("roomCode", roomCode.value);  
provide("userId", userId.value);
const { send } = useWebSocket(
  `ws://${location.host}/api/ws/board?roomCode=${roomCode.value}&userId=${userId.value}`
);

const setCanvasSize = () => {
  if (canvas.value) {
    canvas.value.width = canvas.value.offsetWidth;
    canvas.value.height = canvas.value.offsetHeight;
  }
};
function onMouseDown(event: MouseEvent) {
  isDrawing.value = true;
  const { offsetX, offsetY } = event;
  if (tools.value.isEraserSelected) {
    erase(offsetX, offsetY);
    send(
      JSON.stringify({
        position: "initial",
        event: "erasing",
        offsetX,
        offsetY,
        width: tools.value.width,
        readonly: readonly.value,
      })
    );
  } else {
    ctx.value?.beginPath();
    ctx.value?.moveTo(offsetX, offsetY);
    send(
      JSON.stringify({
        position: "initial",
        event: "drawing",
        offsetX,
        offsetY,
        width: tools.value.width,
        readonly: readonly.value,
      })
    );
  }
}

function onMouseMove(event: MouseEvent) {
  if (isDrawing.value) {
    const { offsetX, offsetY } = event;

    if (tools.value.isEraserSelected) {
      erase(offsetX, offsetY);
      send(
        JSON.stringify({
          position: "moving",
          event: "erasing",
          offsetX,
          offsetY,
          width: tools.value.width,
          readonly: readonly.value,
        })
      );
    } else {
      send(
        JSON.stringify({
          position: "moving",
          event: "drawing",
          offsetX,
          offsetY,
          color: tools.value.color,
          width: tools.value.width,
          readonly: readonly.value,
        })
      );
      ctx.value?.lineTo(offsetX, offsetY);
      ctx.value?.stroke();
    }
  }
}

function onMouseUp(event: MouseEvent) {
  isDrawing.value = false;
}
function erase(x: number, y: number) {
  ctx.value?.save(); // Save the current context state
  ctx.value!.globalCompositeOperation = "destination-out"; // Set blend mode to erase

  ctx.value?.beginPath();
  ctx.value?.arc(x, y, tools.value.width / 2, 0, 2 * Math.PI);
  ctx.value?.stroke(); // Draw the outline stroke for the eraser
  ctx.value?.fill();

  ctx.value?.restore(); // Restore the previous context state
}
watch(setCanvasSize, () => {
  setCanvasSize();
});
watchEffect(
  () => {
    window.addEventListener("scroll", () => {
      send(
        JSON.stringify({
          event: "scroll",
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          readonly: readonly.value,
        })
      );
    });
    if (canvas.value) {
      ctx.value = canvas.value.getContext("2d");
    }
    if (!ctx.value) return;
    ctx.value!.lineWidth = tools.value.width;
    ctx.value!.strokeStyle = tools.value.color;
    ctx.value.lineCap = "round";
  },
  {
    flush: "post",
  }
);
function makeReadonly() {
  readonly.value = !readonly.value;

  send(
    JSON.stringify({
      readonly: readonly.value,
    })
  );
}
</script>

<template>
  <div>
    <Toolbar
      @readonly="makeReadonly"
      :readonly
      class="fixed left-1/2 transform -translate-x-1/2 top-0"
    />

    <div class="flex h-screen">
      <canvas
        ref="canvas"
        class="flex-1 dark:bg-[#323232] cursor-crosshair"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
      ></canvas>
    </div>
  </div>
</template>

<style></style>
