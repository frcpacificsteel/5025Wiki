import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Pacific Steel 5025',
  description: 'Evergreen robotics knowledge for the whole team.',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/assets/logo-icon.svg' }]
  ],
  themeConfig: {
    logo: {
      light: '/assets/logo-horizontal-light.svg',
      dark: '/assets/logo-horizontal-dark.svg',
      alt: 'Pacific Steel 5025'
    },
    siteTitle: false,
    search: { provider: 'local' },
    nav: [
      { text: 'Systems', link: '/systems/' },
      { text: 'New coders', link: '/start/new-programmers' },
      { text: 'Report issue', link: '/start/report-a-problem' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/frcpacificsteel/5025Wiki', ariaLabel: 'Pacific Steel 5025 Wiki on GitHub' }
    ],
    sidebar: [
      {
        text: 'Start here',
        items: [
          { text: 'Welcome', link: '/' },
          { text: 'Robot system map', link: '/systems/' },
          { text: 'How to use this wiki', link: '/start/how-to-use' },
          { text: 'New programmer path', link: '/start/new-programmers' },
          { text: 'Workstation setup', link: '/start/workstation-setup' },
          { text: 'Report a robot problem', link: '/start/report-a-problem' }
        ]
      },
      {
        text: 'Programming foundations',
        collapsed: true,
        items: [
          { text: 'Java for robot code', link: '/programming/java-for-robotics' },
          { text: 'Project anatomy', link: '/programming/project-anatomy' },
          { text: 'Command-based architecture', link: '/programming/command-based' },
          { text: 'Subsystems and hardware IO', link: '/programming/subsystems-and-io' },
          { text: 'Commands and triggers', link: '/programming/commands-and-triggers' },
          { text: 'State machines', link: '/programming/state-machines' },
          { text: 'Configuration', link: '/programming/configuration' }
        ]
      },
      {
        text: 'Controls and estimation',
        collapsed: true,
        items: [
          { text: 'Units and coordinate frames', link: '/controls/units-and-frames' },
          { text: 'Feedback control', link: '/controls/feedback-control' },
          { text: 'Feedforward', link: '/controls/feedforward' },
          { text: 'Pose estimation', link: '/controls/pose-estimation' }
        ]
      },
      {
        text: 'Robot systems',
        collapsed: true,
        items: [
          { text: 'Drivetrain & swerve', link: '/systems/drivetrain/' },
          { text: 'Autonomous', link: '/systems/autonomous/' },
          { text: 'Mechanisms', link: '/systems/mechanisms/' },
          { text: 'Vision', link: '/systems/vision/' },
          { text: 'Controls', link: '/systems/controls/' },
          { text: 'Electrical & CAN', link: '/systems/electrical/' },
          { text: 'Telemetry', link: '/systems/telemetry/' }
        ]
      },
      {
        text: 'Team practice',
        collapsed: true,
        items: [
          { text: 'Build and integration', link: '/practice/' },
          { text: 'Testing changes', link: '/practice/testing' },
          { text: 'Programming', link: '/practice/programming' },
          { text: 'Simulation and tests', link: '/practice/simulation' },
          { text: 'Pit workflow', link: '/practice/pit-workflow' }
        ]
      },
      {
        text: 'Reference',
        collapsed: true,
        items: [
          { text: 'Safety', link: '/reference/safety' },
          { text: 'Troubleshooting', link: '/reference/troubleshooting' },
          { text: 'Glossary', link: '/reference/glossary' }
        ]
      },
      {
        text: 'Wiki essentials',
        collapsed: true,
        items: [
          { text: 'Contributing to the wiki', link: '/wiki-essentials/' },
          { text: 'Add or edit a page', link: '/wiki-essentials/pages' },
          { text: 'Markdown reference', link: '/wiki-essentials/markdown' },
          { text: 'Diagrams and components', link: '/wiki-essentials/diagrams-and-components' },
          { text: 'Navigation and assets', link: '/wiki-essentials/navigation-and-assets' },
          { text: 'Run the wiki locally', link: '/wiki-essentials/local-development' },
          { text: 'Review and publish', link: '/wiki-essentials/review-and-publish' }
        ]
      }
    ],
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    lastUpdated: { text: 'Updated' },
    editLink: {
      pattern: 'https://github.com/frcpacificsteel/5025Wiki/edit/main/docs/:path',
      text: 'Improve this page on GitHub'
    },
    footer: {
      message: 'Maintained by Pacific Steel 5025.',
      copyright: 'Team 5025 robotics reference'
    }
  }
})
