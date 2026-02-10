<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useChatStore } from '@/store/chat'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '%tabbar.contacts%',
  },
})

const chatStore = useChatStore()
chatStore.ensureSeeded()
const { contactsBySections } = storeToRefs(chatStore)

const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44

const searchText = ref('')

const quickList = [
  { id: 1, title: '邀请朋友', color: '#5ab0ff', icon: '👥' },
  { id: 2, title: '最近的通话', color: '#4cd964', icon: '📞' },
  { id: 3, title: '新建群组', color: '#f0a045', icon: '👥' },
]

const contactSections = computed(() => {
  const key = searchText.value.trim().toLowerCase()
  if (!key)
    return contactsBySections.value
  return contactsBySections.value
    .map(s => ({ ...s, list: s.list.filter(c => c.name.toLowerCase().includes(key) || (c.phone || '').includes(key) || (c.username || '').toLowerCase().includes(key)) }))
    .filter(s => s.list.length)
})

function tapQuick(item) {
  if (item.title === '最近的通话') {
    uni.navigateTo({ url: '/pages/calls/index' })
    return
  }
  uni.showToast({ title: `${item.title}（模拟）`, icon: 'none' })
}

function tapContact(item: { id: string }) {
  uni.navigateTo({ url: `/pages/contacts/detail?contactId=${encodeURIComponent(item.id)}` })
}
</script>

<template>
  <view class="min-h-screen flex flex-col bg-#f2f2f2">
    <view class="fixed left-0 right-0 top-0 z-1000 bg-#f2f2f2 pt-safe">
      <view class="h-44px flex items-center justify-between px-4">
        <text class="text-18px text-#111 font-600">联系人</text>
        <text class="text-18px text-#444">⋮</text>
      </view>
      <view class="h-1px bg-#e6e6e6" />
    </view>

    <scroll-view
      class="no-bounce flex-1"
      :style="{ paddingTop: `${headerPadTop}px` }"
      scroll-y
    >
      <view class="mx-4 mt-3 flex items-center gap-2 rounded-20px bg-white px-4 py-2">
        <text class="text-14px text-#9b9b9b">🔍</text>
        <input v-model="searchText" class="flex-1 text-13px text-#333" placeholder="搜索联系人" placeholder-class="text-#b0b0b0">
        <text v-if="searchText" class="px-1 text-14px text-#9b9b9b" @click="searchText = ''">✕</text>
      </view>

      <view class="mx-4 mt-3 overflow-hidden rounded-16px bg-white">
        <view
          v-for="(item, idx) in quickList"
          :key="item.id"
          class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f5f5f5"
          :class="idx === quickList.length - 1 ? '' : 'border-b-1 border-#ededed'"
          @click="tapQuick(item)"
        >
          <view class="h-40px w-40px flex items-center justify-center rounded-12px text-16px text-white font-600" :style="{ backgroundColor: item.color }">
            {{ item.icon }}
          </view>
          <text class="text-15px text-#1f1f1f font-500">{{ item.title }}</text>
        </view>
      </view>

      <view class="mx-4 mt-3 overflow-hidden rounded-16px bg-white">
        <view
          v-for="section in contactSections"
          :key="section.letter"
        >
          <view class="bg-#f7f7f7 px-4 py-2 text-12px text-#3aa3ff font-500">
            {{ section.letter }}
          </view>
          <view
            v-for="(item, idx) in section.list"
            :key="item.id"
            class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f5f5f5"
            :class="idx === section.list.length - 1 ? '' : 'border-b-1 border-#ededed'"
            @click="tapContact(item)"
          >
            <image :src="item.avatar" class="h-44px w-44px rounded-full" />
            <view class="min-w-0 flex flex-1 flex-col gap-1">
              <text class="truncate text-15px text-#1f1f1f font-600">{{ item.name }}</text>
              <text class="truncate text-12px text-#9b9b9b">{{ item.lastSeenText }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
