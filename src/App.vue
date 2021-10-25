<template>
  <div id="app">hello</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import temp from '@/example/temp7';

export default defineComponent({
  setup() {
    const data = reactive({
      show: true,
    });
    new temp().render();
    return { ...toRefs(data) };
  },
});
</script>
