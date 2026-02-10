<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'Edit',
  },
})

const userStore = useUserStore()

const form = reactive({
  nickname: '',
  username: '',
  bio: '',
  avatar: '',
})

const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44

const canSave = computed(() => !!form.nickname.trim())

function syncFromStore() {
  const u = userStore.userInfo
  form.nickname = u.nickname || 'devin'
  form.username = u.username || 'devin'
  form.avatar = u.avatar || '/static/images/default-avatar.png'
  form.bio = (u.bio as string) || ''
}

function save() {
  if (!canSave.value) {
    uni.showToast({ title: '昵称不能为空', icon: 'none' })
    return
  }
  userStore.setUserInfo({
    ...userStore.userInfo,
    nickname: form.nickname.trim(),
    username: form.username.trim(),
    avatar: form.avatar,
    bio: form.bio,
  })
  uni.showToast({ title: '已保存（模拟）', icon: 'none' })
  setTimeout(() => uni.navigateBack(), 350)
}

function pickAvatar() {
  uni.chooseImage({
    count: 1,
    success(res) {
      const file = res.tempFilePaths?.[0]
      if (file)
        form.avatar = file
    },
    fail() {
      uni.showToast({ title: '选择失败', icon: 'none' })
    },
  })
}

function goBack() {
  uni.navigateBack()
}

onShow(() => {
  syncFromStore()
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
        <text class="text-16px text-#111 font-700">编辑资料</text>
        <text class="text-14px font-700" :class="canSave ? 'text-#3aa3ff' : 'text-#b0b0b0'" @click="save">保存</text>
      </view>
      <view class="h-1px bg-#e6e6e6" />
    </view>

    <scroll-view class="no-bounce flex-1" :style="{ paddingTop: `${headerPadTop}px` }" scroll-y>
      <view class="flex flex-col items-center bg-white py-6">
        <image :src="form.avatar" class="h-96px w-96px rounded-full" />
        <view class="mt-3 rounded-18px bg-#3aa3ff px-5 py-2 text-14px text-white font-600" @click="pickAvatar">
          更换头像
        </view>
      </view>

      <view class="mt-3 bg-white">
        <view class="border-b-1 border-#ededed px-4 py-3">
          <text class="text-12px text-#9b9b9b">昵称</text>
          <input v-model="form.nickname" class="mt-1 text-14px text-#111 font-600" placeholder="请输入昵称" placeholder-class="text-#b0b0b0" />
        </view>
        <view class="border-b-1 border-#ededed px-4 py-3">
          <text class="text-12px text-#9b9b9b">用户名</text>
          <input v-model="form.username" class="mt-1 text-14px text-#111 font-600" placeholder="请输入用户名" placeholder-class="text-#b0b0b0" />
        </view>
        <view class="px-4 py-3">
          <text class="text-12px text-#9b9b9b">个人简介</text>
          <input v-model="form.bio" class="mt-1 text-14px text-#111 font-600" placeholder="介绍一下自己" placeholder-class="text-#b0b0b0" />
        </view>
      </view>

      <view class="h-90px" />
    </scroll-view>
  </view>
</template>
