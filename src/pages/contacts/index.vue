<script lang="ts" setup>
definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '%tabbar.contacts%',
  },
})

const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44
const refresherTriggered = ref(false)
const scrollTop = ref(0)
const isIndexBarTouching = ref(false)
const isRefreshing = ref(false)

const quickList = [
  { id: 1, title: '新的朋友', color: '#ffb74d', icon: '新' },
  { id: 2, title: '仅聊天的朋友', color: '#4ea3ff', icon: '聊' },
  { id: 3, title: '群聊', color: '#3ecf8e', icon: '群' },
  { id: 4, title: '标签', color: '#58c3ff', icon: '标' },
  { id: 5, title: '公众号', color: '#4a9cff', icon: '公' },
  { id: 6, title: '服务号', color: '#ff6b6b', icon: '服' },
]

const enterpriseList = [
  { id: 1, title: '企业微信联系人', color: '#4ea3ff', icon: '企' },
  { id: 2, title: '学校通知', color: '#4ea3ff', icon: '校' },
]

const contactSections = [
  {
    letter: 'A',
    list: [
      { id: 1, name: 'AO小雪 IT资料', avatar: '/static/images/avatar.jpg' },
      { id: 2, name: 'A德佑星为家陈蔚 / 3928565697', avatar: '/static/images/default-avatar.png' },
      { id: 3, name: 'A房东岁岁姐 / 3202496816', avatar: '/static/images/default-avatar.png' },
    ],
  },
  {
    letter: 'B',
    list: [
      { id: 4, name: '阿辉', avatar: '/static/images/avatar.jpg' },
      { id: 5, name: '阿诺', avatar: '/static/images/default-avatar.png' },
    ],
  },
  {
    letter: 'C',
    list: [
      { id: 6, name: '陈言', avatar: '/static/images/default-avatar.png' },
      { id: 7, name: '陈墨', avatar: '/static/images/avatar.jpg' },
    ],
  },
]

const indexLetters = ['↑', '☆', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#']
const scrollIntoView = ref('')
function tapQuick(item) {
  uni.showToast({ title: item.title, icon: 'none' })
}
function tapEnterprise(item) {
  uni.showToast({ title: item.title, icon: 'none' })
}
function tapContact(item) {
  uni.showToast({ title: item.name, icon: 'none' })
}
function tapIndex(letter: string) {
  if (letter === '↑' || letter === '☆') {
    scrollIntoView.value = 'top'
    return
  }
  scrollIntoView.value = `section-${letter}`
}

function onRefresherRefresh() {
  // 防止快速滑动时的冲突
  if (scrollTop.value > 5) {
    refresherTriggered.value = false
    return
  }
  // 防止在索引栏操作时触发刷新
  if (isIndexBarTouching.value) {
    refresherTriggered.value = false
    return
  }
  // 防止重复触发
  if (isRefreshing.value) {
    return
  }

  isRefreshing.value = true
  refresherTriggered.value = true

  // 模拟刷新数据
  setTimeout(() => {
    refresherTriggered.value = false
    isRefreshing.value = false
    uni.showToast({
      title: '刷新成功',
      icon: 'none',
      duration: 1500,
    })
  }, 1200)
}
function onScroll(e: any) {
  const newScrollTop = e.detail?.scrollTop || 0
  scrollTop.value = newScrollTop
}
</script>

<template>
  <view class="min-h-screen flex flex-col bg-#f5f9ff">
    <view class="glass-panel fixed left-0 right-0 top-0 z-1000 pt-safe">
      <view class="h-44px flex items-center justify-between px-4">
        <text class="text-17px text-#1f2d3d font-600">通讯录</text>
        <view class="flex items-center gap-3 text-#1f2d3d">
          <text class="text-18px active:scale-95 transition-transform">🔍</text>
          <text class="text-18px active:scale-95 transition-transform">＋</text>
        </view>
      </view>
    </view>
    <scroll-view class="no-bounce relative flex-1 pb-70px" :style="{ paddingTop: `${headerPadTop}px` }" scroll-y :scroll-into-view="scrollIntoView" refresher-enabled :refresher-triggered="refresherTriggered" refresher-background="#eaf4ff" refresher-default-style="none" :refresher-threshold="70" @refresherrefresh="onRefresherRefresh" @scroll="onScroll">
      <view v-show="refresherTriggered" class="flex items-center justify-center py-4">
        <view class="glass-loading flex items-center gap-3 rounded-full px-5 py-2.5 text-13px text-#5a7a9a">
          <view class="flex items-center gap-1.5">
            <view class="h-7px w-7px rounded-full bg-#4ea3ff animate-bounce" />
            <view class="h-7px w-7px rounded-full bg-#6db4ff animate-bounce [animation-delay:150ms]" />
            <view class="h-7px w-7px rounded-full bg-#8bc5ff animate-bounce [animation-delay:300ms]" />
          </view>
          <text class="font-500">正在刷新...</text>
        </view>
      </view>
      <view id="top" class="glass-card mx-3 rounded-17px overflow-hidden">
        <view
          v-for="item in quickList"
          :key="item.id"
          class="flex items-center gap-3 px-4 py-3 active:bg-#f0f6ff/50 transition-colors"
          @click="tapQuick(item)"
        >
          <view class="h-42px w-42px flex items-center justify-center rounded-13px text-15px text-white shadow-sm" :style="{ backgroundColor: item.color }">
            {{ item.icon }}
          </view>
          <text class="text-14px text-#1f2d3d">{{ item.title }}</text>
        </view>
      </view>

      <view class="glass-card mx-3 mt-3 rounded-17px overflow-hidden">
        <view class="bg-#f5f9ff/75 px-4 py-2 text-12px text-#7a8391">
          我的企业及企业联系人
        </view>
        <view v-for="item in enterpriseList" :key="item.id" class="flex items-center gap-3 px-4 py-3 active:bg-#f0f6ff/50 transition-colors" @click="tapEnterprise(item)">
          <view class="h-42px w-42px flex items-center justify-center rounded-13px text-15px text-white shadow-sm" :style="{ backgroundColor: item.color }">
            {{ item.icon }}
          </view>
          <text class="text-14px text-#1f2d3d">{{ item.title }}</text>
        </view>
      </view>

      <view class="glass-card mx-3 mt-3 rounded-17px overflow-hidden">
        <view
          v-for="section in contactSections"
          :key="section.letter"
        >
          <view :id="`section-${section.letter}`" class="bg-#f5f9ff/75 px-4 py-1.5 text-12px text-#7a8391 font-500">
            {{ section.letter }}
          </view>
          <view
            v-for="item in section.list"
            :key="item.id"
            class="flex items-center gap-3 px-4 py-3 active:bg-#f0f6ff/50 transition-colors"
            @click="tapContact(item)"
          >
            <image :src="item.avatar" class="h-42px w-42px rounded-13px" />
            <text class="text-14px text-#1f2d3d">{{ item.name }}</text>
          </view>
        </view>
      </view>

    </scroll-view>
    <view class="fixed right-2 z-1000" :style="{ top: `${headerPadTop + 10}px` }" @touchstart.stop="isIndexBarTouching = true" @touchend.stop="isIndexBarTouching = false" @touchcancel.stop="isIndexBarTouching = false" @touchmove.stop>
      <view class="glass-panel flex flex-col items-center gap-0.5 rounded-13px px-2 py-2 text-10px text-#7a8391">
        <text v-for="letter in indexLetters" :key="letter" class="py-0.5 active:text-#4ea3ff active:scale-110 transition-all" @click="tapIndex(letter)">
          {{ letter }}
        </text>
      </view>
    </view>
  </view>
</template>
