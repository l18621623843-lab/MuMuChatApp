<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { useChatStore } from '@/store/chat'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'Contact',
  },
})

const chatStore = useChatStore()
chatStore.ensureSeeded()

const contactId = ref('')
const contact = computed(() => chatStore.getContact(contactId.value))

const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44

function startChat() {
  const c = contact.value
  if (!c)
    return
  const conv = chatStore.createOrGetDirectConversation(c.id)
  if (!conv)
    return
  uni.navigateTo({ url: `/pages/chat/detail?convId=${encodeURIComponent(conv.id)}` })
}

function showMore() {
  const actions = ['分享联系人', '备注', '删除联系人（模拟）']
  uni.showActionSheet({
    itemList: actions,
    success(res) {
      uni.showToast({ title: actions[res.tapIndex], icon: 'none' })
    },
  })
}

function tapField(label: string, value?: string) {
  if (!value) {
    uni.showToast({ title: `${label}：暂无`, icon: 'none' })
    return
  }
  uni.showActionSheet({
    itemList: ['复制', '模拟拨打/打开'],
    success(res) {
      if (res.tapIndex === 0) {
        uni.setClipboardData({ data: value })
      }
      else {
        uni.showToast({ title: `${label}：${value}`, icon: 'none' })
      }
    },
  })
}

function goBack() {
  uni.navigateBack()
}

function callSim() {
  uni.showToast({ title: '通话（模拟）', icon: 'none' })
}

function videoSim() {
  uni.showToast({ title: '视频（模拟）', icon: 'none' })
}

onLoad((query) => {
  contactId.value = `${query?.contactId || ''}`
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
        <view class="flex items-center gap-3 text-18px text-#444">
          <text>🔍</text>
          <text @click="showMore">⋮</text>
        </view>
      </view>
      <view class="h-1px bg-#e6e6e6" />
    </view>

    <scroll-view class="no-bounce flex-1" :style="{ paddingTop: `${headerPadTop}px` }" scroll-y>
      <view class="flex flex-col items-center bg-white py-6">
        <image v-if="contact?.avatar" :src="contact.avatar" class="h-96px w-96px rounded-full" />
        <view v-else class="h-96px w-96px flex items-center justify-center rounded-full bg-#3aa3ff text-40px text-white font-700">
          {{ (contact?.name || '?').slice(0, 1) }}
        </view>
        <text class="mt-3 text-18px text-#111 font-700">{{ contact?.name || '联系人' }}</text>
        <text class="mt-1 text-12px text-#9b9b9b">{{ contact?.lastSeenText || '' }}</text>

        <view class="mt-4 flex gap-10px">
          <view class="h-40px w-88px flex items-center justify-center rounded-20px bg-#3aa3ff text-14px text-white font-600" @click="startChat">
            发消息
          </view>
          <view class="h-40px w-88px flex items-center justify-center rounded-20px bg-#f2f2f2 text-14px text-#333 font-600" @click="callSim">
            通话
          </view>
          <view class="h-40px w-88px flex items-center justify-center rounded-20px bg-#f2f2f2 text-14px text-#333 font-600" @click="videoSim">
            视频
          </view>
        </view>
      </view>

      <view class="mt-3 bg-white">
        <view class="border-b-1 border-#ededed px-4 py-3" @click="tapField('手机号', contact?.phone)">
          <text class="text-12px text-#9b9b9b">手机号</text>
          <text class="mt-1 block text-14px text-#111 font-600">{{ contact?.phone || '—' }}</text>
        </view>
        <view class="border-b-1 border-#ededed px-4 py-3" @click="tapField('用户名', contact?.username)">
          <text class="text-12px text-#9b9b9b">用户名</text>
          <text class="mt-1 block text-14px text-#111 font-600">{{ contact?.username ? `@${contact.username}` : '—' }}</text>
        </view>
        <view class="px-4 py-3" @click="tapField('简介', contact?.bio)">
          <text class="text-12px text-#9b9b9b">简介</text>
          <text class="mt-1 block text-14px text-#111 font-600">{{ contact?.bio || '—' }}</text>
        </view>
      </view>

      <view class="h-90px" />
    </scroll-view>
  </view>
</template>
