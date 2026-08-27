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
    default: 'none',
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
      d="M11 2h2v3h-2zm0 5h2v4h-2zm0 6h2v4h-2zm0 6h2v3h-2zm-8.91 3H4.1L5.91 2H3.9zm16-20 1.81 20h2.01L20.1 2z"
    />
  </svg>
</template>
