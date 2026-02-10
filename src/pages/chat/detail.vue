<script lang="ts" setup>
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, nextTick, ref } from 'vue'
import { useChatStore } from '@/store/chat'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'Chat',
  },
})

const chatStore = useChatStore()
chatStore.ensureSeeded()

const convId = ref('')
const draft = ref('')
const scrollIntoView = ref('')

const conversation = computed(() => chatStore.getConversation(convId.value))
const messages = computed(() => chatStore.getMessages(convId.value))

const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44
const bottomSafe = (_sys.safeAreaInsets && _sys.safeAreaInsets.bottom) || 0

function syncScrollToBottom() {
  const last = messages.value[messages.value.length - 1]
  if (!last)
    return
  scrollIntoView.value = `m_${last.id}`
}

async function send() {
  const text = draft.value.trim()
  if (!text)
    return
  chatStore.sendText(convId.value, text)
  draft.value = ''
  await nextTick()
  syncScrollToBottom()
  setTimeout(async () => {
    chatStore.simulateIncomingText(convId.value, '收到。')
    chatStore.openConversation(convId.value)
    await nextTick()
    syncScrollToBottom()
  }, 700)
}

function openProfile() {
  const conv = conversation.value
  if (!conv)
    return
  if (conv.peerContactId) {
    uni.navigateTo({ url: `/pages/contacts/detail?contactId=${encodeURIComponent(conv.peerContactId)}` })
  }
  else {
    uni.showToast({ title: '群资料（模拟）', icon: 'none' })
  }
}

function simulateIncoming() {
  chatStore.simulateIncomingText(convId.value, '我这边可以。')
  chatStore.openConversation(convId.value)
  nextTick(() => syncScrollToBottom())
}

function goBack() {
  uni.navigateBack()
}

onLoad((query) => {
  convId.value = `${query?.convId || ''}`
  chatStore.openConversation(convId.value)
  nextTick(() => syncScrollToBottom())
})

onShow(() => {
  if (convId.value)
    chatStore.openConversation(convId.value)
})
</script>

<template>
  <view class="min-h-screen flex flex-col bg-#f2f2f2">
    <view class="fixed left-0 right-0 top-0 z-1000 bg-#f2f2f2 pt-safe">
      <view class="h-44px flex items-center justify-between px-3">
        <view class="flex items-center gap-2" @click="goBack">
          <text class="text-18px text-#3aa3ff">‹</text>
          <text class="text-14px text-#3aa3ff">返回</text>
        </view>
        <view class="min-w-0 flex flex-1 flex-col items-center" @click="openProfile">
          <text class="max-w-220px truncate text-15px text-#111 font-600">{{ conversation?.title || '会话' }}</text>
          <text class="text-11px text-#9b9b9b">{{ conversation?.isGroup ? '群组 · 点击查看' : '点击查看资料' }}</text>
        </view>
        <view class="flex items-center gap-3 text-18px text-#444">
          <text @click="simulateIncoming">＋</text>
          <text>⋮</text>
        </view>
      </view>
      <view class="h-1px bg-#e6e6e6" />
    </view>

    <scroll-view
      class="no-bounce flex-1"
      :style="{ paddingTop: `${headerPadTop}px`, paddingBottom: `${64 + bottomSafe}px` }"
      scroll-y
      :scroll-into-view="scrollIntoView"
      scroll-with-animation
    >
      <view class="px-3 py-4">
        <view
          v-for="m in messages"
          :id="`m_${m.id}`"
          :key="m.id"
          class="mb-2 flex"
          :class="m.outgoing ? 'justify-end' : 'justify-start'"
        >
          <view class="max-w-80% rounded-14px px-3 py-2 text-14px leading-20px shadow-sm" :class="m.outgoing ? 'bg-#3aa3ff text-white' : 'bg-white text-#222'">
            <text v-if="conversation?.isGroup && !m.outgoing" class="mb-1 block text-11px text-#3aa3ff font-600">{{ m.senderName }}</text>
            <text>{{ m.text }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="fixed bottom-0 left-0 right-0 z-1000 bg-white" :style="{ paddingBottom: `${bottomSafe}px` }">
      <view class="h-1px bg-#e6e6e6" />
      <view class="flex items-end gap-2 px-3 py-2">
        <view class="flex-1 rounded-18px bg-#f2f2f2 px-3 py-2">
          <input
            v-model="draft"
            class="text-14px text-#333"
            placeholder="消息"
            placeholder-class="text-#b0b0b0"
            confirm-type="send"
            @confirm="send"
          >
        </view>
        <view class="h-36px w-64px flex items-center justify-center rounded-18px bg-#3aa3ff text-14px text-white font-600" @click="send">
          发送
        </view>
      </view>
    </view>
  </view>
</template>
