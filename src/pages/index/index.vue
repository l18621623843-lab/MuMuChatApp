<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/store/chat'
import { tabbarStore } from '@/tabbar/store'

defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '%tabbar.wechat%',
  },
})

const chatStore = useChatStore()
chatStore.ensureSeeded()
const { sortedConversations, totalUnread, contacts } = storeToRefs(chatStore)

const searchText = ref('')
const chatList = computed(() => {
  const key = searchText.value.trim().toLowerCase()
  const list = sortedConversations.value
  if (!key)
    return list
  return list.filter(c => c.title.toLowerCase().includes(key) || c.lastMessage.toLowerCase().includes(key))
})
const contactsOnTelegram = computed(() => contacts.value.slice(0, 6))
const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44

watchEffect(() => {
  tabbarStore.setTabbarItemBadge(0, totalUnread.value)
})
function openChat(convId: string) {
  chatStore.openConversation(convId)
  uni.navigateTo({ url: `/pages/chat/detail?convId=${encodeURIComponent(convId)}` })
}
function longPressChat(convId: string) {
  const conv = chatStore.getConversation(convId)
  if (!conv)
    return
  const actions = [
    conv.unread ? '标记为已读' : '标记为未读',
    conv.pinned ? '取消置顶' : '置顶',
    conv.muted ? '取消静音' : '静音',
    '模拟收到消息',
    '删除',
  ]
  uni.showActionSheet({
    itemList: actions,
    success(res) {
      const idx = res.tapIndex
      const action = actions[idx]
      if (action === '标记为未读') {
        chatStore.markUnread(convId)
      }
      else if (action === '标记为已读') {
        chatStore.markRead(convId)
      }
      else if (action === '置顶' || action === '取消置顶') {
        chatStore.togglePin(convId)
      }
      else if (action === '静音' || action === '取消静音') {
        chatStore.toggleMute(convId)
      }
      else if (action === '模拟收到消息') {
        chatStore.simulateIncomingText(convId, '收到，我马上看。')
      }
      else if (action === '删除') {
        chatStore.deleteConversation(convId)
      }
    },
  })
}
function openAddMenu() {
  const actions = ['发起群聊', '添加朋友', '扫一扫', '模拟收到消息']
  uni.showActionSheet({
    itemList: actions,
    success(res) {
      const action = actions[res.tapIndex]
      if (action === '添加朋友') {
        uni.switchTab({ url: '/pages/contacts/index' })
      }
      else if (action === '模拟收到消息') {
        const first = sortedConversations.value[0]
        if (first)
          chatStore.simulateIncomingText(first.id, '你方便吗？')
      }
      else {
        uni.showToast({ title: action, icon: 'none' })
      }
    },
  })
}

function openContactsTab() {
  uni.switchTab({ url: '/pages/contacts/index' })
}
</script>

<template>
  <view class="min-h-screen flex flex-col bg-#f2f2f2">
    <view class="fixed left-0 right-0 top-0 z-1000 bg-#f2f2f2 pt-safe">
      <view class="h-44px flex items-center justify-between px-4">
        <text class="text-18px text-#3aa3ff font-700">MuMuChat</text>
        <view class="flex items-center gap-3 text-18px text-#444">
          <text>🔍</text>
          <text>🔒</text>
          <text @click="openAddMenu">⋮</text>
        </view>
      </view>
      <view class="h-1px bg-#e6e6e6" />
    </view>

    <scroll-view
      class="no-bounce flex-1"
      :style="{ paddingTop: `${headerPadTop}px` }"
      scroll-y
    >
      <view class="px-4 pt-3">
        <view class="flex items-center gap-2 rounded-20px bg-white px-4 py-2">
          <text class="text-14px text-#9b9b9b">🔍</text>
          <input v-model="searchText" class="flex-1 text-13px text-#333" placeholder="搜索" placeholder-class="text-#b0b0b0">
          <text v-if="searchText" class="px-1 text-14px text-#9b9b9b" @click="searchText = ''">✕</text>
        </view>
      </view>
      <view class="bg-white">
        <view
          v-for="(item, idx) in chatList"
          :key="item.id"
          class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f5f5f5"
          :class="idx === chatList.length - 1 ? '' : 'border-b-1 border-#ededed'"
          @click="openChat(item.id)"
          @longpress="longPressChat(item.id)"
        >
          <view class="relative h-50px w-50px" style="overflow: visible;">
            <image :src="item.avatar" class="block h-full w-full rounded-full" />
            <view v-if="item.unread" class="absolute right--2px top--2px h-18px min-w-18px flex items-center justify-center rounded-full bg-#ff4d4f px-1.5 text-11px text-white font-600 shadow">
              {{ item.unread > 99 ? '99+' : item.unread }}
            </view>
          </view>
          <view class="min-w-0 flex flex-1 flex-col gap-1 overflow-hidden">
            <view class="flex items-center justify-between gap-2">
              <view class="min-w-0 flex flex-1 items-center gap-1">
                <text class="flex-1 truncate text-15px text-#1f1f1f font-600">{{ item.title }}</text>
                <text v-if="item.muted" class="flex-shrink-0 text-12px text-#b0b0b0">🔕</text>
                <text v-if="item.pinned" class="flex-shrink-0 text-12px text-#b0b0b0">📌</text>
              </view>
              <text class="flex-shrink-0 text-11px text-#9b9b9b">{{ chatStore.conversationTimeLabel(item) }}</text>
            </view>
            <text class="truncate text-13px text-#9b9b9b">{{ item.lastMessage }}</text>
          </view>
        </view>
      </view>

      <view class="mt-4">
        <view class="px-4 py-2 text-12px text-#8f8f8f">
          您在 Telegram 上的联系人
        </view>
        <view class="bg-white">
          <view
            v-for="(contact, idx) in contactsOnTelegram"
            :key="contact.id"
            class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f5f5f5"
            :class="idx === contactsOnTelegram.length - 1 ? '' : 'border-b-1 border-#ededed'"
            @click="openContactsTab"
          >
            <image :src="contact.avatar" class="h-44px w-44px rounded-full" />
            <view class="min-w-0 flex flex-1 flex-col gap-1">
              <text class="truncate text-15px text-#1f1f1f font-600">{{ contact.name }}</text>
              <text class="truncate text-12px text-#9b9b9b">{{ contact.lastSeenText }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
