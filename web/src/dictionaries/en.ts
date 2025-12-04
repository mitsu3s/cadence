export const en = {
  common: {
    signIn: "Sign in",
    signInWithGithub: "Sign in with GitHub",
    signOut: "Sign out",
    documentation: "Documentation",
    backToApp: "Back to App",
    loading: "Loading...",
    features: "Features",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
  },
  landingPage: {
    hero: {
      badge: "v1.0 is now live",
      title: "Visualize your \nCoding Rhythm",
      subtitle: "Coding Rhythm",
      description: "Cadence transforms your GitHub activity into beautiful, actionable insights. Understand your momentum, track your streaks, and optimize your developer flow.",
      cta: "Sign in with GitHub",
      readDocs: "Read Documentation",
    },
    features: {
      momentum: {
        title: "Momentum Tracking",
        description: "Visualize your coding velocity over time. Identify your most productive hours and days to optimize your schedule.",
      },
      streak: {
        title: "Streak Analysis",
        description: "Keep your coding streak alive. Gamify your development process and build consistent habits.",
      },
      insights: {
        title: "Deep Insights",
        description: "Connect multiple repositories and get a unified view of your engineering impact across all projects.",
      },
    },
    footer: {
      copyright: "© 2025 Mitsuki Sugihara.",
    },
  },
  sidebar: {
    repository: "Repository",
    selectRepository: "Select Repository",
    timeRange: "Time Range",
    days: "Days",
  },
  dashboard: {
    title: "Dashboard",
    overview: "Overview of development activity for {repo}",
    stats: {
      totalCommits: "Total Commits",
      currentStreak: "Streak",
      longestStreak: "Longest Streak",
      dailyAverage: "Daily Average",
      totalActivity: "Activity Volume",
      commitsPushed: "Commits Pushed",
      prActivity: "PR Activity",
    },
    rhythm: {
      title: "Momentum Flow",
      description: "Daily Rhythm",
    },
    timeline: {
      title: "Today's Events",
    },
  },
  docs: {
    sidebar: {
      gettingStarted: "Getting Started",
      introduction: "Introduction",
      quickStart: "Quick Start",
    },
    introduction: {
      title: "Introduction",
      subtitle: "Cadence is a developer rhythm visualizer that helps you understand your coding momentum, track streaks, and optimize your workflow.",
      description: "By analyzing your GitHub activity, Cadence provides actionable insights into your engineering habits. Whether you're an individual developer looking to improve consistency or a team lead wanting to understand project velocity, Cadence gives you the data you need in a beautiful, easy-to-understand dashboard.",
      features: {
        title: "Key Features",
        momentum: {
          title: "Momentum Tracking",
          description: "Visualize your coding velocity over time and identify your most productive periods.",
        },
        streak: {
          title: "Streak Analysis",
          description: "Keep your coding streak alive and build consistent development habits.",
        },
        multiRepo: {
          title: "Multi-Repo Support",
          description: "Connect and switch between multiple repositories seamlessly.",
        },
        realtime: {
          title: "Real-time Updates",
          description: "See your activity reflected instantly as you push code to GitHub.",
        },
      },
    },
    quickStart: {
      title: "Quick Start",
      subtitle: "Get up and running with Cadence in less than a minute.",
      steps: {
        step1: {
          title: "Sign in with GitHub",
          description: "Click the \"Sign in\" button on the dashboard or landing page. Cadence uses GitHub OAuth to securely authenticate you and access your repository data.",
          note: "Note: We only request read access to your public repositories and basic profile information.",
        },
        step2: {
          title: "Install the Cadence App",
          description: "You will be prompted to install the Cadence GitHub App. This allows us to receive webhooks when you push code, ensuring your dashboard is always up to date.",
          subDescription: "You can choose to install it on all repositories or select specific ones.",
        },
        step3: {
          title: "Select a Repository",
          description: "Once logged in, use the sidebar dropdown to switch between your connected repositories. Your dashboard will automatically update to show the rhythm for the selected project.",
        },
      },
    },
  },
};
