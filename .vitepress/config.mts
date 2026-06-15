import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Skills123.cc',
  titleTemplate: ':title — AI Agent Skills 百科',
  description: 'AI Agent Skills 百科 — Anthropic + Codex 技能深度介绍、使用指南与案例分析，覆盖 Data、Sales、Finance、Marketing、Legal 等 14+ 插件领域',
  lang: 'zh-CN',
  base: '/',
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,

  rewrites: {
    'skills/community/serenity-skill.md': 'serenity-skill-landing.html',
  },

  sitemap: {
    hostname: 'https://skills123.cc',
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap' }],
    ['meta', { name: 'keywords', content: 'Claude Code, Codex, AI Skills, Plugins, Anthropic, OpenAI, MCP, AI Agent, 技能百科' }],
    ['meta', { name: 'author', content: 'Skills123.cc' }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Skills123.cc — AI Agent Skills 百科' }],
    ['meta', { property: 'og:description', content: 'Anthropic + Codex 技能深度介绍、使用指南与案例分析' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://skills123.cc' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Skills123.cc — AI Agent Skills 百科' }],
    ['meta', { name: 'twitter:description', content: 'Anthropic + Codex 技能深度介绍、使用指南与案例分析' }],
    ['meta', { name: 'twitter:image', content: '/og-image.png' }],

    // Plausible Analytics (placeholder — 替换为自己的 data-domain)
    // ['script', { src: 'https://plausible.io/js/script.js', 'data-domain': 'skills123.cc', defer: '' }],
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
          text: 'Marketing',
          items: [
            { text: 'Competitive Brief', link: '/skills/marketing/competitive-brief' },
          ],
        },
        {
          text: 'Community',
          items: [
            { text: 'Serenity Skill', link: '/skills/community/serenity-skill' },
          ],
        },
        {
          text: 'Legal',
          items: [
            { text: 'Review Contract', link: '/skills/legal/review-contract' },
          ],
        },
        {
          text: 'Customer Support',
          items: [
            { text: 'Ticket Triage', link: '/skills/customer-support/ticket-triage' },
          ],
        },
        {
          text: 'Design',
          items: [
            { text: 'Design Critique', link: '/skills/design/design-critique' },
          ],
        },
        {
          text: 'Operations',
          items: [
            { text: 'Process Documentation', link: '/skills/operations/process-documentation' },
          ],
        },
        {
          text: 'Small Business',
          items: [
            { text: 'Cash Flow Planning', link: '/skills/small-business/cash-flow-planning' },
          ],
        },
        {
          text: 'Enterprise Search',
          items: [
            { text: 'Search Strategy', link: '/skills/enterprise-search/search-strategy' },
            { text: 'Knowledge Synthesis', link: '/skills/enterprise-search/knowledge-synthesis' },
            { text: 'Source Management', link: '/skills/enterprise-search/source-management' },
          ],
        },
        {
          text: 'Human Resources',
          items: [
            { text: 'Draft Offer', link: '/skills/human-resources/draft-offer' },
            { text: 'Performance Review', link: '/skills/human-resources/performance-review' },
            { text: 'Comp Analysis', link: '/skills/human-resources/comp-analysis' },
          ],
        },
        {
          text: 'Product Management',
          items: [
            { text: 'Write Spec', link: '/skills/product-management/write-spec' },
            { text: 'Synthesize Research', link: '/skills/product-management/synthesize-research' },
            { text: 'Roadmap Update', link: '/skills/product-management/roadmap-update' },
          ],
        },
        {
          text: 'Bio-Research',
          items: [
            { text: 'Scientific Problem Selection', link: '/skills/bio-research/scientific-problem-selection' },
            { text: 'Single-Cell RNA QC', link: '/skills/bio-research/single-cell-rna-qc' },
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

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    footer: {
      message: 'Skills123.cc — AI Agent Skills 百科',
      copyright: '基于 MIT 协议开源 · 内容来自 <a href="https://github.com/anthropics/knowledge-work-plugins" target="_blank">Anthropic</a> 和 <a href="https://github.com/hashgraph-online/awesome-codex-plugins" target="_blank">开源社区</a>',
    },

    editLink: {
      pattern: 'https://github.com/gshappy365/skills123.cc/edit/main/:path',
      text: '在 GitHub 上编辑此页',
    },

    lastUpdated: true,
    lastUpdatedText: '最后更新',
  },
})
