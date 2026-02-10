<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '%tabbar.me%',
  },
})

const userStore = useUserStore()
const profile = computed(() => {
  const u = userStore.userInfo
  return {
    nickname: u.nickname || 'devin',
    username: u.username || 'devin',
    avatar: u.avatar || '/static/images/default-avatar.png',
    phone: (u.phone as string) || '+86 / 190****2755',
  }
})

const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44

const actionButtons = [
  { id: 1, title: '设置照片', icon: '📷' },
  { id: 2, title: '编辑信息', icon: '✏️' },
  { id: 3, title: '设置', icon: '⚙️' },
]

function openMenu() {
  uni.showActionSheet({
    itemList: ['编辑资料', '设置', '退出登录（模拟）'],
    success(res) {
      const idx = res.tapIndex
      if (idx === 0)
        uni.navigateTo({ url: '/pages/profile/edit' })
      else if (idx === 1)
        uni.switchTab({ url: '/pages/discover/index' })
      else
        uni.showToast({ title: '退出登录（模拟）', icon: 'none' })
    },
  })
}

function tapAction(item: { title: string }) {
  if (item.title === '编辑信息') {
    uni.navigateTo({ url: '/pages/profile/edit' })
    return
  }
  if (item.title === '设置') {
    uni.switchTab({ url: '/pages/discover/index' })
    return
  }
  if (item.title === '设置照片') {
    uni.chooseImage({
      count: 1,
      success(res) {
        const file = res.tempFilePaths?.[0]
        if (file)
          userStore.setUserAvatar(file)
      },
    })
    return
  }
}

function addPost() {
  uni.showActionSheet({
    itemList: ['选择照片/视频', '拍摄（模拟）'],
    success(res) {
      if (res.tapIndex === 0) {
        uni.chooseImage({
          count: 1,
          success() {
            uni.showToast({ title: '已添加到动态（模拟）', icon: 'none' })
          },
        })
      }
      else {
        uni.showToast({ title: '拍摄（模拟）', icon: 'none' })
      }
    },
  })
}

function searchSim() {
  uni.showToast({ title: '搜索（模拟）', icon: 'none' })
}
</script>

<template>
  <view class="min-h-screen flex flex-col bg-#f2f2f2">
    <view class="fixed left-0 right-0 top-0 z-1000 bg-#f2f2f2 pt-safe">
      <view class="h-44px flex items-center justify-between px-4">
        <text class="text-18px text-#111 font-600" />
        <view class="flex items-center gap-3 text-18px text-#444">
          <text @click="searchSim">🔍</text>
          <text @click="openMenu">⋮</text>
        </view>
      </view>
      <view class="h-1px bg-#e6e6e6" />
    </view>

    <scroll-view class="no-bounce flex-1" :style="{ paddingTop: `${headerPadTop}px` }" scroll-y>
      <view class="flex flex-col items-center pt-6">
        <image :src="profile.avatar" class="h-96px w-96px rounded-full" />
        <text class="mt-3 text-18px text-#1f1f1f font-600">{{ profile.nickname }}</text>
        <text class="mt-1 text-12px text-#9b9b9b">{{ profile.phone }}</text>
      </view>

      <view class="mx-4 mt-4 flex justify-between gap-2">
        <view
          v-for="item in actionButtons"
          :key="item.id"
          class="flex flex-1 flex-col items-center justify-center rounded-14px bg-white py-3 text-12px text-#333"
          @click="tapAction(item)"
        >
          <text class="text-18px">{{ item.icon }}</text>
          <text class="mt-1">{{ item.title }}</text>
        </view>
      </view>

      <view class="mx-4 mt-3 overflow-hidden rounded-16px bg-white">
        <view class="flex items-center gap-3 px-4 py-3">
          <text class="text-16px">📞</text>
          <view class="min-w-0 flex flex-1 flex-col gap-1">
            <text class="text-14px text-#1f1f1f font-600">+86 / 86-2/62-3843</text>
            <text class="text-12px text-#9b9b9b">手机</text>
          </view>
        </view>
      </view>

      <view class="mt-4 flex justify-center gap-12px px-4 text-14px text-#9b9b9b">
        <text class="text-#3aa3ff font-600">动态</text>
        <text>已归档的动态</text>
      </view>
      <view class="mx-4 mt-2 h-2px bg-#3aa3ff" style="width: 48px;" />

      <view class="mt-10 flex flex-col items-center text-#9b9b9b">
        <text class="text-16px">暂无贴文</text>
        <text class="mt-2 text-12px">发布照片和视频将显示在您的个人资料上</text>
        <view class="mt-6 rounded-20px bg-#3aa3ff px-6 py-2 text-14px text-white" @click="addPost">
          添加贴文
        </view>
      </view>

      <view class="h-90px" />
    </scroll-view>
  </view>
</template>
