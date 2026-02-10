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
  <view class="tabbar-item-inner" :class="{ active: tabbarStore.curIdx === index }">
    <template v-if="item.iconType === 'uiLib'">
      <!-- TODO: 以下内容请根据选择的UI库自行替换 -->
      <!-- 如：<wd-icon name="home" /> (https://wot-design-uni.cn/component/icon.html) -->
      <!-- 如：<uv-icon name="home" /> (https://www.uvui.cn/components/icon.html) -->
      <!-- 如：<sar-icon name="image" /> (https://sard.wzt.zone/sard-uniapp-docs/components/icon)(sar没有home图标^_^) -->
      <!-- <wd-icon :name="item.icon" size="20" /> -->
    </template>
    <template v-if="item.iconType === 'unocss' || item.iconType === 'iconfont'">
      <view class="tabbar-icon-wrap">
        <view class="tabbar-active-circle" :class="{ active: tabbarStore.curIdx === index }" />
        <view class="tabbar-icon-box" :class="{ bulge: isBulge }">
          <view :class="[item.icon, isBulge ? 'text-44px' : 'text-24px']" class="tabbar-icon" />
          <template v-if="!isBulge && item.badge">
            <template v-if="item.badge === 'dot'">
              <view class="tabbar-badge h-8px w-8px rounded-full bg-#ff5a5f shadow-sm" />
            </template>
            <template v-else>
              <view class="tabbar-badge box-border h-18px min-w-18px center rounded-full bg-#ff5a5f px-1 text-center text-10px text-white shadow-sm">
                {{ item.badge > 99 ? '99+' : item.badge }}
              </view>
            </template>
          </template>
        </view>
      </view>
    </template>
    <template v-if="item.iconType === 'image'">
      <view class="tabbar-icon-wrap">
        <view class="tabbar-active-circle" :class="{ active: tabbarStore.curIdx === index }" />
        <view class="tabbar-icon-box" :class="{ bulge: isBulge }">
          <image :src="getImageByIndex(index, item)" mode="scaleToFill" :class="isBulge ? 'h-44px w-44px rounded-10px' : 'h-24px w-24px rounded-7px'" class="tabbar-icon" />
          <template v-if="!isBulge && item.badge">
            <template v-if="item.badge === 'dot'">
              <view class="tabbar-badge h-8px w-8px rounded-full bg-#ff5a5f shadow-sm" />
            </template>
            <template v-else>
              <view class="tabbar-badge box-border h-18px min-w-18px center rounded-full bg-#ff5a5f px-1 text-center text-10px text-white shadow-sm">
                {{ item.badge > 99 ? '99+' : item.badge }}
              </view>
            </template>
          </template>
        </view>
      </view>
    </template>
    <view v-if="!isBulge" class="tabbar-label">
      {{ getI18nText(item.text) }}
    </view>
  </view>
</template>

<style scoped lang="scss">
.tabbar-item-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}
.tabbar-item-inner.active {
  transform: translateY(-1px);
}
.tabbar-icon-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tabbar-icon-wrap::before {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.72), rgba(78, 163, 255, 0.12));
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow:
    0 10px 22px rgba(58, 163, 255, 0.16),
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    inset 0 -10px 18px rgba(78, 163, 255, 0.1);
  backdrop-filter: blur(10px) saturate(170%);
  -webkit-backdrop-filter: blur(10px) saturate(170%);
}
.tabbar-item-inner.active .tabbar-icon-wrap::before {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.82), rgba(78, 163, 255, 0.18));
  box-shadow:
    0 12px 26px rgba(58, 163, 255, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.92),
    inset 0 -12px 22px rgba(78, 163, 255, 0.14);
}
.tabbar-active-circle {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.7), rgba(78, 163, 255, 0.18) 55%, rgba(78, 163, 255, 0) 72%);
  box-shadow: 0 10px 20px rgba(58, 163, 255, 0.14);
  transform: scale(0.6);
  opacity: 0;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.tabbar-active-circle.active {
  transform: scale(1);
  opacity: 1;
}
.tabbar-icon-box {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tabbar-icon-box.bulge {
  width: 44px;
  height: 44px;
}
.tabbar-badge {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}
.tabbar-icon {
  position: relative;
  z-index: 1;
  transition: transform 0.2s ease;
  color: #2f9bff;
  filter: drop-shadow(0 6px 10px rgba(58, 163, 255, 0.22));
}
.tabbar-item-inner.active .tabbar-icon {
  transform: scale(1.08);
  color: #1d8fff;
}
.tabbar-label {
  margin-top: 2px;
  font-size: 11px;
  font-weight: 500;
  opacity: 0.75;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;
}
.tabbar-item-inner.active .tabbar-label {
  opacity: 1;
}
</style>
