<script lang="ts" setup>
// const tools = useTool();

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const setCanvasSize = () => {
  if (canvas.value) {
    canvas.value.width = canvas.value.offsetWidth;
    canvas.value.height = canvas.value.offsetHeight;
  }
};
const props = defineProps<{
  roomCode: string;
  userId?: string;
  refresh?: () => Promise<void>;
}>();
const roomCode = toRef(props, "roomCode");
const userId = toRef(props, "userId");
provide("roomCode", roomCode.value);  
provide("userId", userId.value);
const readOnly = ref(false);  
const { data, ws } = useWebSocket(`ws://${location.host}/api/ws/board?roomCode=${roomCode.value}&userId=${userId.value}`);


function erase(x: number, y: number, width: number) {
  ctx.value?.save(); // Save the current context state
  ctx.value!.globalCompositeOperation = "destination-out"; // Set blend mode to erase

  ctx.value?.beginPath();
  ctx.value?.arc(x, y, width / 2, 0, 2 * Math.PI);
  ctx.value?.stroke(); // Draw the outline stroke for the eraser
  ctx.value?.fill();

  ctx.value?.restore(); // Restore the previous context state
}
watch(setCanvasSize, () => {
  setCanvasSize();
});
watchEffect(
  () => {
    if (canvas.value) {
      ctx.value = canvas.value.getContext("2d");
    }
    if (!ctx.value) return;
    const parsedJson = JSON.parse(data.value);
    ctx.value!.lineWidth = parsedJson?.board?.width;
    ctx.value!.strokeStyle = parsedJson?.board?.color;
    ctx.value.lineCap = "round";
    readOnly.value = parsedJson?.board?.readonly;   
    if (parsedJson?.board?.event == "scroll") {
      window.scrollTo(parsedJson?.board?.scrollX, parsedJson?.board?.scrollY);  
    }
    if (parsedJson?.board?.position == "initial") {
      if (parsedJson?.board?.event == "drawing") {
        ctx.value!.beginPath();
        ctx.value!.moveTo(
          parsedJson?.board?.offsetX,
          parsedJson?.board?.offsetY
        );
      } else if (parsedJson?.board?.event == "erasing") {
        erase(
          parsedJson?.board?.offsetX,
          parsedJson?.board?.offsetY,
          parsedJson?.board?.width
        );
      }
    } else if (parsedJson?.board?.position == "moving") {
      if (parsedJson?.board?.event == "drawing") {
        ctx.value!.lineTo(
          parsedJson?.board?.offsetX,
          parsedJson?.board?.offsetY
        );
        ctx.value!.stroke();
      } else if (parsedJson?.board?.event == "erasing") {
        erase(
          parsedJson?.board?.offsetX,
          parsedJson?.board?.offsetY,
          parsedJson?.board?.width
        );
      }
    } else {
      ctx.value!.closePath();
    }
  },
  {
    flush: "post",
  }
);
</script>

<template>
  <div>
    <Toolbar
      :readOnly
      class="fixed left-1/2 transform -translate-x-1/2 top-0"
    />
    <div class="flex h-screen">
      <canvas
        ref="canvas"
        class="flex-1 dark:bg-[#323232] cursor-crosshair"
      ></canvas>
    </div>
  </div>
</template>

<style></style>
