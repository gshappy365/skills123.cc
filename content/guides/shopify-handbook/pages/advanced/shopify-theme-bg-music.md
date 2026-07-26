---
source_url: "https://shopify.baoea.com/advanced/shopify-theme-bg-music"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:41:43"
fetch_method: "http"
content_hash: "b67037ba30ed27c8e8ef73714edbee57999f294e1f1fbe4a24b4d7629025b2f0"
discovered_via: ["sitemap", "internal_link"]
---
```
{
  "name": "背景音乐播放器",
  "tag": "section",
  "class": "bg-music-section",
  "settings": [
    {
      "type": "header",
      "content": "播放器设置"
    },
    {
      "type": "checkbox",
      "id": "enable_music",
      "label": "启用背景音乐",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "auto_play",
      "label": "自动播放",
      "default": false,
      "info": "受浏览器政策限制，需要用户首次交互后才能播放"
    },
    {
      "type": "select",
      "id": "play_mode",
      "label": "播放模式",
      "default": "loop",
      "options": [
        { "value": "loop", "label": "循环播放" },
        { "value": "random", "label": "随机播放" },
        { "value": "single", "label": "单曲循环" },
        { "value": "once", "label": "播放一次" }
      ]
    },
    {
      "type": "range",
      "id": "default_volume",
      "label": "默认音量",
      "min": 0,
      "max": 100,
      "step": 5,
      "unit": "%",
      "default": 50
    },
    {
      "type": "header",
      "content": "播放器外观"
    },
    {
      "type": "select",
      "id": "player_theme",
      "label": "播放器主题",
      "default": "dark",
      "options": [
        { "value": "dark", "label": "深色主题" },
        { "value": "light", "label": "浅色主题" },
        { "value": "gradient", "label": "渐变主题" },
        { "value": "brand", "label": "品牌色主题" }
      ]
    },
    {
      "type": "select",
      "id": "player_position",
      "label": "播放器位置",
      "default": "bottom-left",
      "options": [
        { "value": "bottom-left", "label": "左下角" },
        { "value": "bottom-right", "label": "右下角" },
        { "value": "top-left", "label": "左上角" },
        { "value": "top-right", "label": "右上角" }
      ]
    },
    {
      "type": "select",
      "id": "player_size",
      "label": "播放器大小",
      "default": "medium",
      "options": [
        { "value": "small", "label": "小" },
        { "value": "medium", "label": "中" },
        { "value": "large", "label": "大" }
      ]
    },
    {
      "type": "checkbox",
      "id": "show_progress",
      "label": "显示播放进度",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_volume_control",
      "label": "显示音量控制",
      "default": true
    }
  ],
  "blocks": [
    {
      "type": "music_track",
      "name": "音乐曲目",
      "settings": [
        {
          "type": "text",
          "id": "track_name",
          "label": "曲目名称",
          "placeholder": "例如：品牌主题曲"
        },
        {
          "type": "text",
          "id": "artist_name",
          "label": "艺术家",
          "placeholder": "例如：XXXX"
        },
        {
          "type": "url",
          "id": "audio_url",
          "label": "音频文件链接",
          "info": "支持 MP3、OGG、AAC 格式，建议文件小于 5MB"
        },
        {
          "type": "image_picker",
          "id": "cover_image",
          "label": "封面图片（可选）"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "背景音乐播放器",
      "blocks": [
        {
          "type": "music_track",
    ...
```
