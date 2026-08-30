<script setup>
defineProps({
  size: {
    type: Number,
    default: 16,
  },
  fill: {
    type: String,
    default: 'currentColor',
  },
  stroke: {
    type: String,
    default: 'currentColor',
  },
  strokeWidth: {
    type: Number,
    default: 2,
  },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :fill="fill"
    :stroke="stroke"
    :stroke-width="strokeWidth"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2M4 6h6v12H4zm8 12V6h8v12z"
    />
    <path d="M6 8h2v2H6zm0 4h2v2H6z" />
  </svg>
</template>
