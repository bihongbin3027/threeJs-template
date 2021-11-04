<template>
  <div class="container">
    <div id="canvas" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import temp from "@/example/temp9";

export default defineComponent({
  setup() {
    let canvas: temp = null;
    const state = reactive({
      visible: false,
    });

    // 初始化
    onMounted(() => {
      canvas = new temp({
        el: "canvas",
      });
      canvas.render();
    });

    return { ...toRefs(state) };
  },
});
</script>

<style scoped lang="scss">
.container {
  position: relative;
  .console-view {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 1;
    background-color: #999;
    padding: 10px;
    font-size: 12px;
    ul {
      li {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
