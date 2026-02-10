<script setup lang="ts">
// i-carbon-code
import { customTabbarEnable, needHideNativeTabbar, tabbarCacheEnable } from './config'
import { setTabbarItem } from './i18n'
import { tabbarList, tabbarStore } from './store'
import TabbarItem from './TabbarItem.vue'

// #ifdef MP-WEIXIN
// 将自定义节点设置成虚拟的（去掉自定义组件包裹层），更加接近Vue组件的表现，能更好的使用flex属性
defineOptions({
  virtualHost: true,
})
// #endif

/**
 * 中间的鼓包tabbarItem的点击事件
 */
function handleClickBulge() {
  uni.showToast({
    title: '点击了中间的鼓包tabbarItem',
    icon: 'none',
  })
}

function handleClick(index: number) {
  // 点击原来的不做操作
  if (index === tabbarStore.curIdx) {
    return
  }
  if (tabbarList[index].isBulge) {
    handleClickBulge()
    return
  }
  const url = tabbarList[index].pagePath
  tabbarStore.setCurIdx(index)
  if (tabbarCacheEnable) {
    uni.switchTab({ url })
  }
  else {
    uni.navigateTo({ url })
  }
}
// #ifndef MP-WEIXIN || MP-ALIPAY
// 因为有了 custom:true， 微信里面不需要多余的hide操作
onLoad(() => {
  // 解决原生 tabBar 未隐藏导致有2个 tabBar 的问题
  needHideNativeTabbar
  && uni.hideTabBar({
    fail(err) {
      console.log('hideTabBar fail: ', err)
    },
    success(res) {
      // console.log('hideTabBar success: ', res)
    },
  })
})
// #endif

// #ifdef MP-ALIPAY
onMounted(() => {
  // 解决支付宝自定义tabbar 未隐藏导致有2个 tabBar 的问题; 注意支付宝很特别，需要在 onMounted 钩子调用
  customTabbarEnable // 另外，支付宝里面，只要是 customTabbar 都需要隐藏
  && uni.hideTabBar({
    fail(err) {
      console.log('hideTabBar fail: ', err)
    },
    success(res) {
      // console.log('hideTabBar success: ', res)
    },
  })
})
// #endif
const activeColor = 'var(--wot-color-theme, #4ea3ff)'
const inactiveColor = '#2b2b2b'
function getColorByIndex(index: number) {
  return tabbarStore.curIdx === index ? activeColor : inactiveColor
}

// 注意，上面处理的是自定义tabbar，下面处理的是原生tabbar，参考：https://unibest.tech/base/10-i18n
onShow(() => {
  setTabbarItem()
})
</script>

<template>
  <view v-if="customTabbarEnable" class="h-72px pb-safe">
    <view class="tabbar-shell" @touchmove.stop.prevent>
      <view class="tabbar-pill">
        <view
          v-for="(item, index) in tabbarList" :key="index"
          class="tabbar-item"
          :style="{ color: getColorByIndex(index) }"
          @click="handleClick(index)"
        >
          <view v-if="item.isBulge" class="relative">
            <view class="bulge">
              <TabbarItem :item="item" :index="index" class="text-center" is-bulge />
            </view>
          </view>
          <TabbarItem v-else :item="item" :index="index" class="text-center" />
        </view>
      </view>
      <view class="pb-safe" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.tabbar-shell {
  position: fixed;
  bottom: 10px;
  left: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}
.tabbar-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 540px;
  height: 60px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(14px) saturate(170%);
  -webkit-backdrop-filter: blur(14px) saturate(170%);
  box-shadow: 0 14px 32px rgba(58, 163, 255, 0.16);
}
.tabbar-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  transition: color 0.2s ease;
}
// 中间鼓包的样式
.bulge {
  position: absolute;
  top: -20px;
  left: 50%;
  transform-origin: top center;
  transform: translateX(-50%) scale(0.5) translateY(-33%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250rpx;
  height: 250rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  box-shadow: 0 4px 16px rgba(78, 163, 255, 0.15);

  &:active {
    transform: translateX(-50%) scale(0.5) translateY(-33%) scale(0.96);
    transition: transform 0.1s ease;
  }
}
</style>
