<script lang="ts" setup>
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref(false);
const tools = useTool();

const { send } = useWebSocket(
  `ws://${location.host}/api/ws/board?roomCode=1234&userId=12345678`
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
  } else {
    ctx.value?.beginPath();
    console.log("onMouseDown", offsetX, offsetY);
    send(
      JSON.stringify({
        position: "initial",
        offsetX,
        offsetY,
      })
    );
    ctx.value?.moveTo(offsetX, offsetY);
  }
}

function onMouseMove(event: MouseEvent) {
  if (isDrawing.value) {
    const { offsetX, offsetY } = event;
    if (tools.value.isEraserSelected) {
      erase(offsetX, offsetY);
    } else {
      // setTimeout(() => {
        send(
          JSON.stringify({
            position: "moving",
            offsetX,
            offsetY,
          })
        );
      // }, 1000);
      // send(
      //   JSON.stringify({
      //     offsetX,
      //     offsetY,
      //   })
      // );
      console.log("onMouseMove", offsetX, offsetY);
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
</script>

<template>
  <div class="flex h-screen">
    <canvas
      ref="canvas"
      class="flex-1 dark:bg-[#323232] cursor-crosshair"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
    ></canvas>
  </div>
</template>

<style></style>
