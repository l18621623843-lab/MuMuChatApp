<script setup lang="ts">
import type { CustomTabBarItem } from './types'
import { getI18nText } from './i18n'
import { tabbarStore } from './store'

defineProps<{
  item: CustomTabBarItem
  index: number
  isBulge?: boolean
}>()

function getImageByIndex(index: number, item: CustomTabBarItem) {
  if (!item.iconActive) {
    console.warn('image 模式下，需要配置 iconActive (高亮时的图片），否则无法切换高亮图片')
    return item.icon
  }
  return tabbarStore.curIdx === index ? item.iconActive : item.icon
}
</script>

<template>
  <view class="flex flex-col items-center justify-center transition-all">
    <template v-if="item.iconType === 'uiLib'">
      <!-- TODO: 以下内容请根据选择的UI库自行替换 -->
      <!-- 如：<wd-icon name="home" /> (https://wot-design-uni.cn/component/icon.html) -->
      <!-- 如：<uv-icon name="home" /> (https://www.uvui.cn/components/icon.html) -->
      <!-- 如：<sar-icon name="image" /> (https://sard.wzt.zone/sard-uniapp-docs/components/icon)(sar没有home图标^_^) -->
      <!-- <wd-icon :name="item.icon" size="20" /> -->
    </template>
    <template v-if="item.iconType === 'unocss' || item.iconType === 'iconfont'">
      <view class="glass-tabbar-icon-wrapper" :class="{ 'active': tabbarStore.curIdx === index }">
        <view :class="[item.icon, isBulge ? 'text-44px' : 'text-22px']" class="transition-all relative z-1" />
      </view>
    </template>
    <template v-if="item.iconType === 'image'">
      <view class="glass-tabbar-icon-wrapper" :class="{ 'active': tabbarStore.curIdx === index }">
        <image :src="getImageByIndex(index, item)" mode="scaleToFill" :class="isBulge ? 'h-44px w-44px rounded-10px' : 'h-26px w-26px rounded-7px'" />
      </view>
    </template>
    <view v-if="!isBulge" class="mt-4px text-10px font-500 transition-all">
      {{ getI18nText(item.text) }}
    </view>
    <!-- 角标显示 -->
    <view v-if="item.badge">
      <template v-if="item.badge === 'dot'">
        <view class="absolute right-0 top-0 h-8px w-8px rounded-full bg-#ff5a5f shadow-sm" />
      </template>
      <template v-else>
        <view class="absolute top-0 box-border h-18px min-w-18px center rounded-full bg-#ff5a5f px-1 text-center text-10px text-white shadow-sm -right-2">
          {{ item.badge > 99 ? '99+' : item.badge }}
        </view>
      </template>
    </view>
  </view>
</template>
