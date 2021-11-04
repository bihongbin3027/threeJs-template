<template>
  <div class="container">
    <div class="console-view">
      <ul>
        <li>
          <span>车身：</span>
          <select
            v-bind:value="car.shellValue"
            @change="switchbodyColor($event)"
          >
            <option
              v-for="(item, i) in car.shellColorList"
              :key="i"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
        </li>
        <li>
          <span>轮胎：</span>
          <select
            v-bind:value="car.tireValue"
            @change="switchTireColor($event)"
          >
            <option
              v-for="(item, i) in car.shellColorList"
              :key="i"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
        </li>
      </ul>
    </div>
    <div id="canvas" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import temp from "@/example/temp8";

export default defineComponent({
  setup() {
    let canvas: temp = null;
    const state = reactive({
      car: {
        shellValue: "#cd2e2b",
        tireValue: "#333333",
        shellColorList: [
          { label: "red", value: "#cd2e2b" },
          { label: "grey", value: "#333333" },
          { label: "volcano", value: "#ff9c6e" },
          { label: "orange", value: "#fa8c16" },
          { label: "calendula-gold", value: "#ad6800" },
          { label: "sunrise-yellow", value: "#fadb14" },
          { label: "lime", value: "#3f6600" },
        ],
      },
    });

    // 初始化
    onMounted(() => {
      canvas = new temp({
        el: "canvas",
      });
      canvas.render();
    });

    // 切换车身颜色
    const switchbodyColor = (event: Event) => {
      const value = (event.target as HTMLSelectElement).value;
      canvas.updateShellAttr({
        color: value,
      });
    };

    // 切换轮胎颜色
    const switchTireColor = (event: Event) => {
      const value = (event.target as HTMLSelectElement).value;
      canvas.updateTireAttr({
        color: value,
      });
    };

    return { ...toRefs(state), switchbodyColor, switchTireColor };
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
