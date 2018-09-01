<!-- TODO: use slot templates when pixels finalized -->
<!-- https://alligator.io/vuejs/component-slots/ -->
<template>
  <div>
    <!-- Content is placed in the <slot> -->
    <slot name="header"></slot>
    <slot name="body"></slot>
  </div>
</template>

<script>
  export default {
    name: 'full-page-with-header'
  }
</script>
