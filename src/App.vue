<template>
  <div class="container">
    <div id="canvas" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import temp from "@/example/temp8";

export default defineComponent({
  setup() {
    const data = reactive({
      show: true,
    });

    onMounted(() => {
      new temp({
        el: "canvas",
      }).render();
    });

    return { ...toRefs(data) };
  },
});
</script>

<style lang="sass">
.container {
  display: flex;
}
</style>
