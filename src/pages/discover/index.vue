<script lang="ts" setup>
definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '%tabbar.discover%',
  },
})
</script>

<template>
  <view class="min-h-screen flex flex-col bg-#f5f9ff">
    <view class="glass-panel fixed left-0 right-0 top-0 z-1000 pt-safe">
      <view class="h-44px flex items-center justify-center">
        <text class="text-17px text-#1f2d3d font-500">发现</text>
      </view>
    </view>
    <view class="h-1px bg-#dbe9f7/60" />
    <view class="flex-1 pb-70px pt-44px pt-safe" />
  </view>
</template>
