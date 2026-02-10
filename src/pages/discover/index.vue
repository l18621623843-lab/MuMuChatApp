<script lang="ts" setup>
definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '%tabbar.discover%',
  },
})

const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44

const mainSettings = [
  { id: 1, title: '账号', subtitle: '账号、用户名、个人简介', icon: '👤', color: '#5ab0ff' },
  { id: 2, title: '聊天设置', subtitle: '壁纸、深色模式、动画效果', icon: '💬', color: '#f0a045' },
  { id: 3, title: '隐私与安全', subtitle: '最后上线时间、登录设备、通行密钥', icon: '🛡️', color: '#4cd964' },
  { id: 4, title: '通知', subtitle: '声音、通话、标记', icon: '🔔', color: '#ff6b6b' },
  { id: 5, title: '数据和储存', subtitle: '媒体下载设置', icon: '💾', color: '#4ea3ff' },
  { id: 6, title: '聊天文件夹', subtitle: '将聊天分类到文件夹中', icon: '📁', color: '#4ea3ff' },
  { id: 7, title: '设备', subtitle: '管理已连接的设备', icon: '🖥️', color: '#4ea3ff' },
  { id: 8, title: '省电', subtitle: '低电量时降低功耗', icon: '🔋', color: '#f5a623' },
  { id: 9, title: '语言', subtitle: '简体中文 @zh_CN', icon: '🌐', color: '#8e8e93' },
]

const premiumSettings = [
  { id: 1, title: 'Telegram 大会员', icon: '⭐', color: '#8e6fff' },
  { id: 2, title: 'Telegram 星星', icon: '🌟', color: '#ffb300' },
  { id: 3, title: '我的 TON', icon: '💎', color: '#3aa3ff' },
  { id: 4, title: 'Telegram 企业版', icon: '🏢', color: '#ff9f43' },
  { id: 5, title: '发送礼物', icon: '🎁', color: '#ff6b6b' },
]

const helpSettings = [
  { id: 1, title: '帮助', icon: 'ℹ️', color: '#5ab0ff' },
  { id: 2, title: '向我们提问', icon: '💬', color: '#f0a045' },
  { id: 3, title: '常见问题', icon: '❓', color: '#4ea3ff' },
  { id: 4, title: 'Telegram 新功能', icon: '🆕', color: '#4cd964' },
  { id: 5, title: '隐私政策', icon: '✅', color: '#2ecc71' },
]

function openSettings(key: string, title: string) {
  uni.navigateTo({ url: `/pages/settings/detail?key=${encodeURIComponent(key)}&title=${encodeURIComponent(title)}` })
}

function tapMain(item: { title: string }) {
  const map: Record<string, string> = {
    账号: 'account',
    聊天设置: 'chat',
    隐私与安全: 'privacy',
    通知: 'notifications',
    数据和储存: 'data',
    设备: 'devices',
    语言: 'language',
  }
  openSettings(map[item.title] || 'account', item.title)
}

function tapHelp(item: { title: string }) {
  if (item.title === '帮助' || item.title === '向我们提问' || item.title === '常见问题' || item.title === 'Telegram 新功能')
    openSettings('help', item.title)
  else
    uni.showToast({ title: `${item.title}（模拟）`, icon: 'none' })
}

function toastSim(title: string) {
  uni.showToast({ title: `${title}（模拟）`, icon: 'none' })
}
</script>

<template>
  <view class="min-h-screen flex flex-col bg-#f2f2f2">
    <view class="fixed left-0 right-0 top-0 z-1000 bg-#f2f2f2 pt-safe">
      <view class="h-44px flex items-center justify-between px-4">
        <text class="text-18px text-#111 font-600">设置</text>
        <view class="flex items-center gap-3 text-18px text-#444">
          <text>🔍</text>
          <text>⋮</text>
        </view>
      </view>
      <view class="h-1px bg-#e6e6e6" />
    </view>

    <scroll-view class="no-bounce flex-1" :style="{ paddingTop: `${headerPadTop}px` }" scroll-y>
      <view class="px-4 pt-3">
        <view class="overflow-hidden rounded-16px bg-white">
          <view
            v-for="(item, idx) in mainSettings"
            :key="item.id"
            class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f5f5f5"
            :class="idx === mainSettings.length - 1 ? '' : 'border-b-1 border-#ededed'"
            @click="tapMain(item)"
          >
            <view class="h-40px w-40px flex items-center justify-center rounded-12px text-16px text-white" :style="{ backgroundColor: item.color }">
              {{ item.icon }}
            </view>
            <view class="min-w-0 flex flex-1 flex-col gap-1">
              <text class="truncate text-15px text-#1f1f1f font-600">{{ item.title }}</text>
              <text class="truncate text-12px text-#9b9b9b">{{ item.subtitle }}</text>
            </view>
          </view>
        </view>

        <view class="mt-3 overflow-hidden rounded-16px bg-white">
          <view
            v-for="(item, idx) in premiumSettings"
            :key="item.id"
            class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f5f5f5"
            :class="idx === premiumSettings.length - 1 ? '' : 'border-b-1 border-#ededed'"
            @click="toastSim(item.title)"
          >
            <view class="h-40px w-40px flex items-center justify-center rounded-12px text-16px text-white" :style="{ backgroundColor: item.color }">
              {{ item.icon }}
            </view>
            <text class="text-15px text-#1f1f1f font-600">{{ item.title }}</text>
          </view>
        </view>

        <view class="mt-3 overflow-hidden rounded-16px bg-white">
          <view
            v-for="(item, idx) in helpSettings"
            :key="item.id"
            class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f5f5f5"
            :class="idx === helpSettings.length - 1 ? '' : 'border-b-1 border-#ededed'"
            @click="tapHelp(item)"
          >
            <view class="h-40px w-40px flex items-center justify-center rounded-12px text-16px text-white" :style="{ backgroundColor: item.color }">
              {{ item.icon }}
            </view>
            <text class="text-15px text-#1f1f1f font-600">{{ item.title }}</text>
          </view>
        </view>

        <view class="pb-90px pt-6 text-center text-11px text-#b0b0b0">
          Telegram Android 客户端 v12.4 / (65) / 0<br>direct arm64-v8a
        </view>
      </view>
    </scroll-view>
  </view>
</template>
