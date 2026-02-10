<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useChatStore } from '@/store/chat'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'Calls',
  },
})

const chatStore = useChatStore()
chatStore.ensureSeeded()

const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44

const searchText = ref('')
const callList = computed(() => {
  const key = searchText.value.trim().toLowerCase()
  const seed = chatStore.contacts.map((c, idx) => ({
    id: `call_${c.id}`,
    contactId: c.id,
    name: c.name,
    avatar: c.avatar,
    time: idx % 2 ? '昨天' : '今天',
    type: idx % 3 === 0 ? '未接来电' : (idx % 3 === 1 ? '语音通话' : '视频通话'),
  }))
  if (!key)
    return seed
  return seed.filter(i => i.name.toLowerCase().includes(key))
})

function openCall(item: { contactId: string }) {
  uni.navigateTo({ url: `/pages/contacts/detail?contactId=${encodeURIComponent(item.contactId)}` })
}

function goBack() {
  uni.navigateBack()
}
</script>

<template>
  <view class="min-h-screen flex flex-col bg-#f2f2f2">
    <view class="fixed left-0 right-0 top-0 z-1000 bg-#f2f2f2 pt-safe">
      <view class="h-44px flex items-center justify-between px-3">
        <view class="flex items-center gap-2" @click="goBack">
          <text class="text-18px text-#3aa3ff">‹</text>
          <text class="text-14px text-#3aa3ff">返回</text>
        </view>
        <text class="text-16px text-#111 font-700">通话</text>
        <view class="flex items-center gap-3 text-18px text-#444">
          <text>⋮</text>
        </view>
      </view>
      <view class="h-1px bg-#e6e6e6" />
    </view>

    <scroll-view class="no-bounce flex-1" :style="{ paddingTop: `${headerPadTop}px` }" scroll-y>
      <view class="px-4 pt-3">
        <view class="flex items-center gap-2 rounded-20px bg-white px-4 py-2">
          <text class="text-14px text-#9b9b9b">🔍</text>
          <input v-model="searchText" class="flex-1 text-13px text-#333" placeholder="搜索通话" placeholder-class="text-#b0b0b0">
          <text v-if="searchText" class="px-1 text-14px text-#9b9b9b" @click="searchText = ''">✕</text>
        </view>
      </view>

      <view class="mt-3 bg-white">
        <view
          v-for="(item, idx) in callList"
          :key="item.id"
          class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f5f5f5"
          :class="idx === callList.length - 1 ? '' : 'border-b-1 border-#ededed'"
          @click="openCall(item)"
        >
          <image :src="item.avatar" class="h-44px w-44px rounded-full" />
          <view class="min-w-0 flex flex-1 flex-col gap-1">
            <view class="flex items-center justify-between gap-2">
              <text class="flex-1 truncate text-15px text-#1f1f1f font-600">{{ item.name }}</text>
              <text class="flex-shrink-0 text-11px text-#9b9b9b">{{ item.time }}</text>
            </view>
            <text class="truncate text-12px text-#9b9b9b">{{ item.type }}</text>
          </view>
        </view>
      </view>

      <view class="h-90px" />
    </scroll-view>
  </view>
</template>
