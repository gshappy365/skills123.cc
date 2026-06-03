import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Skills123.cc',
  description: 'AI Agent Skills 百科 — Anthropic + Codex 技能深度介绍、使用指南与案例分析',
  lang: 'zh-CN',
  base: '/',
  cleanUrls: true,
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'keywords', content: 'Claude Code, Codex, AI Skills, Plugins, Anthropic, OpenAI, MCP' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Skills123.cc',

    search: {
      provider: 'local',
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '插件目录', link: '/plugins/' },
      { text: '技能百科', link: '/skills/' },
      { text: 'Codex 技能', link: '/codex/' },
      { text: '概念科普', link: '/concepts/' },
    ],

    sidebar: {
      '/plugins/': [
        {
          text: '插件目录',
          items: [
            { text: '概览', link: '/plugins/' },
            { text: 'Data', link: '/plugins/data' },
            { text: 'Sales', link: '/plugins/sales' },
            { text: 'Finance', link: '/plugins/finance' },
            { text: 'Marketing', link: '/plugins/marketing' },
            { text: 'Legal', link: '/plugins/legal' },
            { text: 'Customer Support', link: '/plugins/customer-support' },
            { text: 'Product Management', link: '/plugins/product-management' },
            { text: 'Productivity', link: '/plugins/productivity' },
            { text: 'Enterprise Search', link: '/plugins/enterprise-search' },
            { text: 'Design', link: '/plugins/design' },
            { text: 'Human Resources', link: '/plugins/human-resources' },
            { text: 'Operations', link: '/plugins/operations' },
            { text: 'Small Business', link: '/plugins/small-business' },
            { text: 'Bio Research', link: '/plugins/bio-research' },
            { text: 'Engineering', link: '/plugins/engineering' },
            { text: 'Partner Built', link: '/plugins/partner-built' },
          ],
        },
      ],
      '/skills/': [
        {
          text: 'Data',
          items: [
            { text: 'SQL Queries', link: '/skills/data/sql-queries' },
          ],
        },
        {
          text: 'Sales',
          items: [
            { text: 'Pipeline Review', link: '/skills/sales/pipeline-review' },
          ],
        },
        {
          text: 'Finance',
          items: [
            { text: 'Variance Analysis', link: '/skills/finance/variance-analysis' },
          ],
        },
        {
          text: 'Productivity',
          items: [
            { text: 'Memory Management', link: '/skills/productivity/memory-management' },
          ],
        },
      ],
      '/codex/': [
        {
          text: 'Codex 技能',
          items: [
            { text: '概览', link: '/codex/' },
            {
              text: '官方插件',
              items: [
                { text: 'GitHub', link: '/codex/official/github' },
                { text: 'Figma', link: '/codex/official/figma' },
                { text: 'Slack', link: '/codex/official/slack' },
                { text: 'Notion', link: '/codex/official/notion' },
                { text: 'Linear', link: '/codex/official/linear' },
              ],
            },
            {
              text: '社区精选',
              items: [
                { text: 'Caveman', link: '/codex/community/caveman' },
                { text: 'Planning with Files', link: '/codex/community/planning-with-files' },
                { text: 'Humanizer', link: '/codex/community/humanizer' },
              ],
            },
          ],
        },
      ],
      '/concepts/': [
        {
          text: '概念科普',
          items: [
            { text: '概览', link: '/concepts/' },
            { text: '什么是 Claude Cowork', link: '/concepts/what-is-cowork' },
            { text: '什么是 Claude Code', link: '/concepts/what-is-claude-code' },
            { text: '什么是 Codex', link: '/concepts/what-is-codex' },
            { text: 'MCP 协议', link: '/concepts/mcp-protocol' },
            { text: 'Skill vs Plugin', link: '/concepts/skill-vs-plugin' },
            { text: 'Standalone vs Supercharged', link: '/concepts/standalone-vs-supercharged' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gshappy365/skills123.cc' },
    ],

    footer: {
      message: 'Skills123.cc — AI Agent Skills 百科',
      copyright: '基于 MIT 协议开源',
    },

    editLink: {
      pattern: 'https://github.com/gshappy365/skills123.cc/edit/main/:path',
      text: '在 GitHub 上编辑此页',
    },

    lastUpdated: true,
    lastUpdatedText: '最后更新',
  },
})
