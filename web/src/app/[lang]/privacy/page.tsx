/* eslint-disable react/no-unescaped-entities */

import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  const isJapanese = lang === "ja";

  return (
    <div className="min-h-screen bg-black text-zinc-200 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] -z-10 opacity-40" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10 opacity-30" />

      <div className="container mx-auto px-6 py-16 max-w-4xl relative z-10">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {dictionary.common.backToApp}
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 leading-normal pb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            {isJapanese ? "プライバシーポリシー" : "Privacy Policy"}
          </h1>
          <p className="text-sm text-zinc-500">
            {isJapanese ? "最終更新日: 2025年12月4日" : "Last Updated: December 4, 2025"}
          </p>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
          <div className="prose prose-invert prose-zinc max-w-none">
            {isJapanese ? (
              <>
                <div className="mb-10 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                  <p className="mb-4 leading-relaxed">
                    Cadence（以下「当サービス」といいます）は、Cadence 運営者（以下「当方」といいます）が提供するサービスです。当方は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
                  </p>
                  <p className="mb-0 leading-relaxed">
                    本プライバシーポリシー（以下「本ポリシー」といいます）は、当サービスがどのような個人情報を収集し、どのように利用・管理するかについて説明するものです。
                  </p>
                </div>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">1. 適用範囲</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>本ポリシーは、当サービスにおいて当方が取得するユーザーに関する情報の取扱いに適用されます。</li>
                    <li>当方は、日本の個人情報の保護に関する法律その他関連法令およびガイドラインを遵守し、本ポリシーに従って個人情報の適切な保護に努めます。</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">2. 収集する情報</h2>
                  <p className="mb-4">当サービスは、主として以下の情報を収集します。</p>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">2.1 GitHub アカウント情報</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>GitHub ユーザー名</li>
                    <li>プロフィール画像</li>
                    <li>メールアドレス（GitHub アカウントに登録され、API を通じて取得可能な場合に限ります）</li>
                    <li>GitHub ユーザー ID</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">2.2 リポジトリデータ</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>公開リポジトリのコミット履歴</li>
                    <li>プルリクエストのアクティビティ</li>
                    <li>リポジトリ名およびメタデータ</li>
                    <li>コミットのタイムスタンプ、頻度、その他開発活動に関する統計情報</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">2.3 利用状況データ</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>アクセスログ（IP アドレス、ブラウザ情報、OS 情報、リファラ、アクセス日時 等）</li>
                    <li>サービスの利用状況（閲覧ページ、利用時間、クリック履歴 等）</li>
                  </ul>

                  <p className="mb-4">上記は主な収集情報であり、当方は本ポリシーに定める目的の達成に必要な範囲で、これらと同種の情報を追加で取得する場合があります。</p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">3. 情報の利用目的</h2>
                  <p className="mb-4">当サービスは、収集した情報を以下の目的で利用します。</p>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>ユーザー認証およびアカウント管理のため</li>
                    <li>開発活動の可視化およびダッシュボード等の表示のため</li>
                    <li>本サービスの提供、維持および改善のため</li>
                    <li>本サービスの利用状況の分析、機能改善、新規機能の企画・開発のため</li>
                    <li>ユーザーサポートおよびお問い合わせ対応のため</li>
                    <li>本サービスの不正利用の防止、セキュリティの確保のため</li>
                    <li>利用規約違反への対応のため</li>
                    <li>本サービスに関する重要なお知らせ（仕様変更、停止、終了等）の通知のため</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">4. 利用目的の制限および変更</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>当方は、前条に定める利用目的の達成に必要な範囲を超えて個人情報を利用しません。</li>
                    <li>当方は、利用目的を変更する場合、その内容が変更前の利用目的と相当の関連性を有すると合理的に認められる範囲内で行うものとします。</li>
                    <li>利用目的を変更した場合、当方は変更後の利用目的を本サービス上での表示その他当方所定の方法により公表します。</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">5. 情報の保存と管理</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>収集した情報は、Google Cloud Platform（GCP）上に保存されます。データは原則として日本国内の GCP リージョン（asia-northeast1）に保存されます。</li>
                    <li>当方は、適切な技術的・組織的セキュリティ対策を講じ、不正アクセス、紛失、破壊、改ざん、漏洩などから個人情報を保護します。具体的には、アクセス権限の制限、通信経路および保存時の暗号化、ログ管理等の安全管理措置を実施します。</li>
                    <li>当方は、個人情報の取扱いを外部に委託する場合には、委託先に対して適切な監督を行います。</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">6. 第三者サービスとの連携</h2>
                  <p className="mb-4">当サービスは、以下の第三者サービスを利用しています。</p>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">6.1 Firebase Authentication</h3>
                  <p className="mb-4">
                    ユーザー認証に Firebase Authentication を使用しています。Firebase Authentication の利用に伴い、一部の情報が Google により取得・処理される場合があります。詳細は
                    <a href="https://firebase.google.com/support/privacy?hl=ja" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline ml-1">
                      Googleのプライバシーポリシー
                    </a>
                    をご確認ください。
                  </p>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">6.2 GitHub API</h3>
                  <p className="mb-4">
                    リポジトリデータの取得に GitHub API を使用しています。GitHub の利用に伴い、一部の情報が GitHub により取得・処理される場合があります。詳細は
                    <a href="https://docs.github.com/ja/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline ml-1">
                      GitHub のプライバシーステートメント
                    </a>
                    をご確認ください。
                  </p>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">6.3 Google Cloud Platform</h3>
                  <p className="mb-4">
                    データの保存および本サービスのホスティングに Google Cloud Platform を使用しています。
                  </p>

                  <p className="mb-4">
                    上記サービスの利用は、当方が本サービスの提供に必要な範囲で個人情報の取扱いを委託するものに該当し、法令上の第三者提供には該当しないものと解釈されます。当方は、これらのサービス提供者に対し、適切な契約および監督を行います。
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">7. 個人情報の第三者提供</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>当方は、次のいずれかに該当する場合を除き、ユーザーの個人情報を第三者に提供しません。</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>ユーザー本人の同意がある場合</li>
                        <li>法令に基づく場合</li>
                        <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                        <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                        <li>国の機関または地方公共団体等が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                        <li>事業の承継に伴って個人情報が提供される場合</li>
                      </ul>
                    <li>前項第6号の場合、当方は、事業承継先において本ポリシーと同水準の個人情報保護が図られるよう努めます。</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">8. Cookie の使用</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>当サービスは、ユーザー認証およびセッション管理等のために Cookie を使用します。Cookie は、ユーザーのブラウザに保存される小さなテキストファイルです。</li>
                    <li>ユーザーは、ブラウザの設定を変更することにより Cookie を無効にすることができます。ただし、Cookie を無効にした場合、本サービスの一部機能が利用できなくなる可能性があります。</li>
                  </ol>

                  <p className="mb-4">
                    ※現時点では、当サービスはアクセス解析ツール等によるトラッキング Cookie を使用していません。将来導入する場合には、本ポリシーの改定または別途の告知を行います。
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">9. データの保持期間</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>個人情報は、当サービスの提供に必要な期間、または法令で定められた期間保持します。</li>
                    <li>ユーザーがアカウントを削除した場合、関連する個人情報は、システム上の処理の都合上およびバックアップの関係等から、合理的な期間内に削除または匿名化されます。</li>
                    <li>不正利用の防止、セキュリティ確保および法令順守のため、アクセスログ等の一部の情報については、アカウント削除後も一定期間保存する場合があります。</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">10. ユーザーの権利</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>ユーザーは、自己の個人情報について、以下の権利を有します。</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>個人情報の開示を請求する権利</li>
                        <li>個人情報の訂正を請求する権利</li>
                        <li>個人情報の削除を請求する権利</li>
                        <li>個人情報の利用停止を請求する権利</li>
                      </ul>
                    <li>これらの権利を行使する場合は、本サービス内のお問い合わせフォームまたは GitHub リポジトリの Issue よりご連絡ください。</li>
                    <li>当方は、請求者が本人または正当な代理人であることを確認するため、必要に応じて本人確認書類の提出や追加情報の提供をお願いする場合があります。</li>
                    <li>法令に基づき開示等に応じる義務がない場合、または当方の業務の適正な実施に著しい支障を及ぼすおそれがある場合等には、請求にお応えできないことがあります。その場合は、その旨および理由を可能な範囲でお知らせします。</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">11. 国際的なデータ転送</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>当サービスは日本国内でホスティングされていますが、利用する第三者サービス（Firebase、GitHub 等）のサーバーが所在する国・地域において、データが保存・処理される場合があります。</li>
                    <li>当方は、これらの第三者サービスが各社のプライバシーポリシーおよび適用法令に従って適切なデータ保護措置を講じていることを確認したうえで利用します。</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">12. 子どものプライバシー</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>当サービスは、13歳未満の子供を対象としていません。</li>
                    <li>当方は、13歳未満の子供から意図的に個人情報を収集することはありません。</li>
                    <li>万一、13歳未満の子供から個人情報を収集していたことが判明した場合、当方は、当該情報の削除その他適切な対応を行います。</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">13. プライバシーポリシーの変更</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>当方は、必要に応じて本ポリシーを変更することがあります。</li>
                    <li>本ポリシーを変更する場合、当方は本サービス上での表示その他当方所定の方法により、変更後の内容および効力発生日を周知します。</li>
                    <li>本ポリシーに重要な変更がある場合（利用目的の大幅な追加等を含みます）には、ユーザーにとってわかりやすい方法で通知するよう努めます。</li>
                    <li>変更後の本ポリシーの効力発生日以降にユーザーが本サービスを利用した場合、ユーザーは変更後の本ポリシーに同意したものとみなされます。</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">14. お問い合わせ</h2>
                  <p className="mb-4">
                    本ポリシーに関するご質問やご意見は、本サービス内のお問い合わせフォームまたは GitHub リポジトリの Issue よりお願いいたします。
                  </p>
                </section>

              </>
            ) : (
              <>
                <div className="mb-10 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                  <p className="mb-4 leading-relaxed">
                    Cadence (hereinafter referred to as the "Service") is a service provided by the Cadence operator (hereinafter referred to as "we," "us," or "our"). We respect user privacy and are committed to protecting personal information.
                  </p>
                  <p className="mb-0 leading-relaxed">
                    This Privacy Policy (hereinafter referred to as the "Policy") explains what personal information the Service collects and how it is used and managed.
                  </p>
                </div>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">1. Scope of Application</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>This Policy applies to the handling of information about Users obtained by us through the Service.</li>
                    <li>We comply with the Act on the Protection of Personal Information of Japan and other related laws and guidelines, and strive to appropriately protect personal information in accordance with this Policy.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">2. Information We Collect</h2>
                  <p className="mb-4">The Service primarily collects the following information:</p>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">2.1 GitHub Account Information</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>GitHub username</li>
                    <li>Profile picture</li>
                    <li>Email address (only if registered with the GitHub account and obtainable through the API)</li>
                    <li>GitHub user ID</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">2.2 Repository Data</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Commit history of public repositories</li>
                    <li>Pull request activity</li>
                    <li>Repository names and metadata</li>
                    <li>Commit timestamps, frequency, and other statistical information related to development activities</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">2.3 Usage Data</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Access logs (IP address, browser information, OS information, referrer, access date and time, etc.)</li>
                    <li>Service usage (pages viewed, usage time, click history, etc.)</li>
                  </ul>

                  <p className="mb-4">The above represents the primary information collected. We may additionally obtain similar types of information to the extent necessary to achieve the purposes set forth in this Policy.</p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">3. Purpose of Use</h2>
                  <p className="mb-4">The Service uses collected information for the following purposes:</p>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>User authentication and account management</li>
                    <li>Visualization of development activities and display of dashboards</li>
                    <li>Provision, maintenance, and improvement of the Service</li>
                    <li>Analysis of Service usage, feature improvements, and planning and development of new features</li>
                    <li>User support and inquiry response</li>
                    <li>Prevention of unauthorized use of the Service and ensuring security</li>
                    <li>Response to violations of the Terms of Service</li>
                    <li>Notification of important notices regarding the Service (specification changes, suspension, termination, etc.)</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">4. Limitation and Changes to Purpose of Use</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>We will not use personal information beyond the scope necessary to achieve the purposes of use specified in the preceding Article.</li>
                    <li>When changing the purpose of use, we will do so within a scope reasonably recognized as having a considerable relationship with the purpose of use before the change.</li>
                    <li>If the purpose of use is changed, we will publicize the changed purpose of use through display on the Service or other methods designated by us.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">5. Data Storage and Management</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Collected information is stored on Google Cloud Platform (GCP). Data is stored in principle in the GCP region in Japan (asia-northeast1).</li>
                    <li>We implement appropriate technical and organizational security measures to protect personal information from unauthorized access, loss, destruction, alteration, and leakage. Specifically, we implement security management measures such as access control, encryption of communication paths and storage, and log management.</li>
                    <li>When outsourcing the handling of personal information to external parties, we provide appropriate supervision to such outsourcing parties.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">6. Third-Party Services</h2>
                  <p className="mb-4">The Service uses the following third-party services:</p>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">6.1 Firebase Authentication</h3>
                  <p className="mb-4">
                    We use Firebase Authentication for user authentication. Some information may be obtained and processed by Google in connection with the use of Firebase Authentication. For details, please refer to{" "}
                    <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                      Google's Privacy Policy
                    </a>
                    .
                  </p>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">6.2 GitHub API</h3>
                  <p className="mb-4">
                    We use the GitHub API to retrieve repository data. Some information may be obtained and processed by GitHub in connection with the use of GitHub. For details, please refer to{" "}
                    <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                      GitHub's Privacy Statement
                    </a>
                    .
                  </p>

                  <h3 className="text-xl font-semibold mb-3 text-zinc-100 mt-6">6.3 Google Cloud Platform</h3>
                  <p className="mb-4">
                    We use Google Cloud Platform for data storage and Service hosting.
                  </p>

                  <p className="mb-4">
                    The use of the above services constitutes outsourcing of the handling of personal information to the extent necessary for the provision of the Service, and is not considered provision to third parties under applicable laws. We enter into appropriate contracts with and supervise these service providers.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">7. Provision of Personal Information to Third Parties</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>We will not provide Users' personal information to third parties except in the following cases:</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>When the User has given consent</li>
                        <li>When required by law</li>
                        <li>When necessary for the protection of human life, body, or property and it is difficult to obtain the User's consent</li>
                        <li>When particularly necessary for improving public health or promoting the sound growth of children and it is difficult to obtain the User's consent</li>
                        <li>When it is necessary to cooperate with a national government agency or local government in performing affairs prescribed by law and obtaining the User's consent would interfere with the performance of such affairs</li>
                        <li>When personal information is provided in connection with business succession</li>
                      </ul>
                    <li>In the case of item 6 of the preceding paragraph, we will endeavor to ensure that the business successor provides the same level of personal information protection as this Policy.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">8. Use of Cookies</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>The Service uses cookies for user authentication and session management. Cookies are small text files stored in the User's browser.</li>
                    <li>Users can disable cookies by changing their browser settings. However, disabling cookies may prevent some features of the Service from functioning properly.</li>
                  </ol>

                  <p className="mb-4">
                    *At present, the Service does not use tracking cookies from access analysis tools, etc. If we introduce such tools in the future, we will revise this Policy or provide separate notice.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">9. Data Retention Period</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Personal information is retained for the period necessary to provide the Service or as required by law.</li>
                    <li>When a User deletes their account, related personal information will be deleted or anonymized within a reasonable period due to system processing requirements and backup considerations.</li>
                    <li>To prevent unauthorized use, ensure security, and comply with laws, some information such as access logs may be retained for a certain period even after account deletion.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">10. User Rights</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Users have the following rights regarding their personal information:</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Right to request disclosure of personal information</li>
                        <li>Right to request correction of personal information</li>
                        <li>Right to request deletion of personal information</li>
                        <li>Right to request suspension of use of personal information</li>
                      </ul>
                    <li>To exercise these rights, please contact us through the contact form within the Service or submit an Issue on the GitHub repository.</li>
                    <li>To verify that the requester is the User or a legitimate representative, we may request submission of identity verification documents or provision of additional information as necessary.</li>
                    <li>If there is no obligation to respond to disclosure requests under applicable laws, or if responding would significantly interfere with the proper conduct of our business, we may not be able to respond to the request. In such cases, we will inform the User of this fact and the reason to the extent possible.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">11. International Data Transfers</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>While the Service is hosted in Japan, data may be stored and processed in countries and regions where the servers of third-party services we use (Firebase, GitHub, etc.) are located.</li>
                    <li>We use these third-party services after confirming that they implement appropriate data protection measures in accordance with their respective privacy policies and applicable laws.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">12. Children's Privacy</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>The Service is not intended for children under 13 years of age.</li>
                    <li>We do not knowingly collect personal information from children under 13.</li>
                    <li>If we become aware that we have collected personal information from a child under 13, we will delete such information or take other appropriate measures.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">13. Changes to Privacy Policy</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>We may change this Policy as necessary.</li>
                    <li>When changing this Policy, we will publicize the changed content and effective date through display on the Service or other methods designated by us.</li>
                    <li>If there are significant changes to this Policy (including substantial additions to purposes of use), we will endeavor to notify Users in an easily understandable manner.</li>
                    <li>If a User uses the Service after the effective date of the changed Policy, the User shall be deemed to have agreed to the changed Policy.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">14. Contact</h2>
                  <p className="mb-4">
                    For questions or comments regarding this Policy, please use the contact form within the Service or submit an Issue on the GitHub repository.
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
