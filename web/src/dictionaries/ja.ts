export const ja = {
  common: {
    signIn: "ログイン",
    signInWithGithub: "GitHubでログイン",
    signOut: "ログアウト",
    documentation: "ドキュメント",
    backToApp: "アプリに戻る",
    loading: "読み込み中...",
    features: "機能",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
  },
  landingPage: {
    hero: {
      badge: "v1.0 リリース",
      title: "開発のリズムを\n可視化する",
      subtitle: "Coding Rhythm",
      description: "Cadenceは、GitHubのアクティビティを見やすく、実用的なインサイトとして提供するツールです。開発のリズムを理解し、ストリークを維持し、エンジニアリングのフローを最適化しましょう。",
      cta: "GitHubでログイン",
      readDocs: "ドキュメントを読む",
    },
    features: {
      momentum: {
        title: "開発ペースの可視化",
        description: "開発の勢いを時系列で可視化します。最も生産性の高い時間帯や曜日を特定し、スケジュールを最適化できます。",
      },
      streak: {
        title: "ストリーク分析",
        description: "コーディングの継続日数を途切れさせないようにしましょう。開発プロセスをゲーム化し、一貫した習慣を構築します。",
      },
      insights: {
        title: "詳細なインサイト",
        description: "複数のリポジトリを連携し、すべてのプロジェクトにわたるエンジニアリングのインパクトを一元管理できます。",
      },
    },
    footer: {
      copyright: "© 2025 Mitsuki Sugihara.",
    },
  },
  sidebar: {
    repository: "リポジトリ",
    selectRepository: "リポジトリを選択",
    timeRange: "期間",
    days: "日",
  },
  dashboard: {
    title: "ダッシュボード",
    overview: "開発アクティビティ：{repo}",
    stats: {
      totalCommits: "総コミット数",
      currentStreak: "継続日数",
      longestStreak: "最長記録",
      dailyAverage: "1日平均",
      totalActivity: "アクティビティ量",
      commitsPushed: "プッシュされたコミット",
      prActivity: "PRアクティビティ",
    },
    rhythm: {
      title: "開発の勢い",
      description: "時間帯別のアクティビティ",
    },
    timeline: {
      title: "今日のアクティビティ",
      emptyState: "今日のアクティビティはありません。",
    },
  },
  docs: {
    sidebar: {
      gettingStarted: "はじめに",
      introduction: "イントロダクション",
      quickStart: "クイックスタート",
    },
    introduction: {
      title: "イントロダクション",
      subtitle: "Cadenceは、開発のリズムやペースを可視化し、ストリークを追跡し、ワークフローを最適化するための「開発リズム可視化ツール」です。",
      description: "GitHubのアクティビティを分析することで、Cadenceはあなたのエンジニアリング習慣に関する実用的なインサイトを提供します。一貫性を向上させたい個人の開発者であれ、プロジェクトの速度を把握したいチームリーダーであれ、Cadenceは美しく分かりやすいダッシュボードで必要なデータを提供します。",
      features: {
        title: "主な機能",
        momentum: {
          title: "開発ペースの可視化",
          description: "開発の勢いを可視化し、生産性の高い期間を特定します。",
        },
        streak: {
          title: "ストリーク分析",
          description: "コーディングの継続を維持し、一貫した開発習慣を構築します。",
        },
        multiRepo: {
          title: "マルチリポジトリ対応",
          description: "複数のリポジトリを接続し、シームレスに切り替えることができます。",
        },
        realtime: {
          title: "リアルタイム更新",
          description: "GitHubにコードをプッシュすると、即座にアクティビティが反映されます。",
        },
      },
    },
    quickStart: {
      title: "クイックスタート",
      subtitle: "1分以内にCadenceを使い始めましょう。",
      steps: {
        step1: {
          title: "GitHubでログイン",
          description: "ダッシュボードまたはランディングページの「ログイン」ボタンをクリックします。CadenceはGitHub OAuthを使用して安全に認証し、リポジトリデータにアクセスします。",
          note: "注意: 公開リポジトリの読み取り権限と基本的なプロフィール情報のみを要求します。",
        },
        step2: {
          title: "Cadenceアプリのインストール",
          description: "Cadence GitHub Appのインストールを求められます。これにより、コードをプッシュした際にWebhookイベントを受け取り、ダッシュボードを常に最新の状態に保つことができます。",
          subDescription: "すべてのリポジトリにインストールするか、特定のリポジトリを選択するかを選べます。",
        },
        step3: {
          title: "リポジトリの選択",
          description: "ログイン後、サイドバーのドロップダウンを使用して、接続されているリポジトリを切り替えます。ダッシュボードは自動的に更新され、選択したプロジェクトのリズムが表示されます。",
        },
      },
    },
  },
};
