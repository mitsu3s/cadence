/* eslint-disable react/no-unescaped-entities */

import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function TermsPage({ params }: Props) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  const isJapanese = lang === "ja";

  return (
    <div className="min-h-screen bg-black text-zinc-200 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] -z-10 opacity-40" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -z-10 opacity-30" />

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
            {isJapanese ? "利用規約" : "Terms of Service"}
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
                    Cadence（以下「本サービス」といいます）は、Cadence 運営者（以下「当方」といいます）が提供する、GitHub アカウントと連携してユーザーの開発活動を可視化するサービスです。本サービスの利用にあたっては、以下の利用規約（以下「本規約」といいます）が適用されます。
                  </p>
                  <p className="mb-0 leading-relaxed">
                    本サービスを利用するすべてのユーザー（以下「ユーザー」といいます）は、本規約に同意したものとみなされます。
                  </p>
                </div>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">第1条（適用）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>本規約は、ユーザーによる本サービスの利用に関する当方とユーザーとの一切の関係に適用されます。</li>
                    <li>当方が本サービス上で随時掲載する各種ルール、ガイドライン等は、その名称のいかんにかかわらず本規約の一部を構成するものとします。</li>
                    <li>本規約と前項のルール等の内容が矛盾する場合は、特段の定めがない限り、本規約の規定が優先して適用されるものとします。</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">第2条（サービスの内容）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>本サービスは、GitHub アカウントと連携し、ユーザーの開発活動を可視化するツールです。本サービスは主として以下の機能を提供します。</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>GitHub リポジトリのコミット履歴の可視化</li>
                        <li>開発リズム・勢いの分析</li>
                        <li>アクティビティストリークの追跡</li>
                        <li>時間帯別のコーディングパターンの表示</li>
                        <li>その他、当方が本サービス上で提供する関連機能</li>
                      </ul>
                    <li>本サービスは、GitHub の公開リポジトリへの読み取り専用アクセスのみを要求し、ユーザーのコードやデータを変更することはありません。</li>
                    <li>本サービスは、GitHub が提供する API およびその仕様に依存しており、GitHub 側の仕様変更・障害・サービス提供状況等により、本サービスの全部または一部が利用できなくなる場合があります。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第3条（アカウント）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>ユーザーは、自身の GitHub アカウントを使用して本サービスにログインします。</li>
                    <li>ユーザーは、自己の GitHub アカウントおよび本サービスの利用に関する認証情報の管理について、一切の責任を負うものとします。</li>
                    <li>当方は、ユーザーの GitHub アカウントのパスワード情報を取得または保存しません。</li>
                    <li>ユーザーは、自己のアカウントが第三者に使用されていることが判明した場合、直ちに当方にその旨を通知するとともに、当方からの指示がある場合にはこれに従うものとします。</li>
                    <li>当方は、ユーザーのアカウントに不正使用のおそれがあると判断した場合、当該アカウントの利用停止その他必要と判断する措置を講じることができます。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第4条（未成年による利用）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>ユーザーが未成年である場合、法定代理人の同意を得たうえで本サービスを利用するものとします。</li>
                    <li>当方は、ユーザーが本サービスを利用した時点で、ユーザーが法定代理人の同意を得ているものとみなすことができます。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第5条（禁止事項）</h2>
                  <p className="mb-4">
                    ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
                  </p>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>法令または公序良俗に違反する行為</li>
                    <li>犯罪行為に関連する行為</li>
                    <li>本サービスの運営・提供を妨害し、またはそのおそれのある行為</li>
                    <li>他のユーザーまたは第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害し、またはそのおそれのある行為</li>
                    <li>本サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
                    <li>不正アクセスをし、またはこれを試みる行為</li>
                    <li>本サービスに係るソフトウェアをリバースエンジニアリング、逆コンパイル、逆アセンブル等する行為</li>
                    <li>他のユーザーに関する個人情報等を、不正な手段または目的で収集・蓄積する行為</li>
                    <li>不正な目的を持って本サービスを利用する行為</li>
                    <li>GitHub の利用規約その他 GitHub が定める規則に違反する態様で本サービスを利用する行為</li>
                    <li>本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
                    <li>当方になりすます行為、または故意に虚偽の情報を送信する行為</li>
                    <li>反社会的勢力等への利益供与その他反社会的勢力に関与する行為</li>
                    <li>その他、当方が不適切と合理的に判断する行為</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第6条（本サービスの提供の停止等）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>当方は、以下のいずれかに該当すると判断した場合、ユーザーに事前に通知することなく、本サービスの全部または一部の提供を停止または中断することができます。</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                        <li>地震、落雷、火災、停電または天災等の不可抗力により、本サービスの提供が困難となった場合</li>
                        <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                        <li>本サービスが利用する第三者サービスに障害が発生した場合</li>
                        <li>その他、当方が本サービスの提供が困難であると合理的に判断した場合</li>
                      </ul>
                    <li>当方は、やむを得ない場合を除き、前項による停止または中断の実施について、事前または事後に、本サービス上での表示その他当方所定の方法によりユーザーに通知するよう努めるものとします。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第7条（利用制限および登録抹消）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>当方は、ユーザーが以下のいずれかに該当すると判断した場合、事前の通知なく、ユーザーに対して本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができます。</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>本規約のいずれかの条項に違反した場合</li>
                        <li>登録事項に虚偽の事実があることが判明した場合</li>
                        <li>本サービスを不正な目的で利用した場合</li>
                        <li>その他、当方が本サービスの利用を継続させることが適当でないと合理的に判断した場合</li>
                      </ul>
                    <li>当方は、本条に基づき当方が行った行為によりユーザーに生じた損害について、一切の責任を負いません。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第8条（利用料金）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>本サービスの利用は、現時点では無償とします。</li>
                    <li>当方は、将来、本サービスの全部または一部について有償化することがあります。その場合、当方はあらかじめ本サービス上での表示その他当方所定の方法により、料金内容および適用開始時期をユーザーに通知するものとします。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第9条（知的財産権等）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>本サービスおよび本サービスに関連して当方が提供するコンテンツ（プログラム、画像、デザイン、テキスト、ロゴ、各種データ等を含みますが、これらに限られません）に関する知的財産権その他一切の権利は、当方または当方にライセンスを許諾した第三者に帰属します。</li>
                    <li>ユーザーは、本規約に基づき、本サービスを日本国内において非独占的に利用する権利のみを許諾されるものとし、本サービスに関するいかなる権利も取得するものではありません。</li>
                    <li>ユーザーは、本サービスを通じて取得した情報を、当方の事前の承諾なく、複製、転載、公開、頒布、改変等してはなりません。ただし、ユーザー自身の GitHub アカウントに関する統計情報等を、個人的な利用または合理的な範囲で SNS 等で共有する行為はこの限りではありません。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第10条（保証の否認および免責）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>当方は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを、明示的にも黙示的にも保証しません。</li>
                    <li>当方は、本サービスに起因または関連してユーザーに生じたあらゆる損害について、一切の責任を負いません。ただし、本サービスに関する当方とユーザーとの間の契約（本規約を含みます）が日本の消費者契約法に定める消費者契約となる場合で、当方の故意または重過失に基づく損害については、この限りではありません。</li>
                    <li>前項ただし書の場合であっても、当方は、当方の故意または重過失がない限り、特別損害、間接損害、逸失利益、弁護士費用その他の付随的損害については、一切の賠償責任を負わないものとします。</li>
                    <li>前各項にかかわらず、当方がユーザーに対して損害賠償責任を負う場合であっても、その賠償額は、当方の故意または重過失がある場合を除き、ユーザーが当該損害発生月を含む過去3か月間に本サービスの利用対価として当方に現実に支払った金額（本サービスが無償で提供されている場合は 1万円）を上限とします。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第11条（個人情報の取扱い）</h2>
                  <p className="mb-4">
                    当方は、本サービスの利用によって取得するユーザーの個人情報について、「Cadence プライバシーポリシー」に従い、適切に取り扱うものとします。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第12条（サービス内容の変更・終了）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>当方は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。</li>
                    <li>当方は、事業上または技術上の理由等により、本サービスの全部または一部の提供を終了することができます。この場合、当方は合理的な範囲で事前に本サービス上での表示その他当方所定の方法によりユーザーに通知するものとします。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第13条（本規約の変更）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>当方は、次の各号のいずれかに該当する場合、本規約を変更することができます。</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>本規約の変更が、ユーザーの一般の利益に適合するとき</li>
                        <li>本規約の変更が、契約の目的に反せず、かつ変更の必要性、変更後の内容の相当性その他の事情に照らして合理的なものであるとき</li>
                      </ul>
                    <li>当方は、本規約を変更する場合、その効力発生日までに、本サービス上での表示その他当方所定の方法により、変更後の本規約の内容および効力発生日を周知するものとします。</li>
                    <li>変更後の本規約の効力発生日以降にユーザーが本サービスを利用した場合、または当方が別途定める期間内に登録抹消の手続を行わなかった場合、ユーザーは変更後の本規約に同意したものとみなします。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第14条（通知または連絡）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>ユーザーと当方との間の通知または連絡は、本サービス内のお知らせ機能、当方が運営する Web サイト上での表示、電子メール送信、または GitHub リポジトリの Issue 等、当方の定める方法により行うものとします。</li>
                    <li>当方は、ユーザーから別途届出のあった連絡先がない限り、ユーザーが GitHub に登録しているメールアドレスその他当方が把握する連絡先に通知または連絡を行うことができるものとし、当該通知または連絡は、発信時にユーザーに到達したものとみなします。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第15条（権利義務の譲渡）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>ユーザーは、当方の書面による事前の承諾なく、本規約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。</li>
                    <li>当方は、本サービスにかかる事業を第三者に譲渡した場合（事業譲渡、会社分割その他の事業再編を含みます）、当該事業譲渡に伴い、本規約上の地位、本規約に基づく権利および義務ならびにユーザーの登録情報その他の情報を当該第三者に承継させることができるものとし、ユーザーはあらかじめこれに同意するものとします。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第16条（分離可能性）</h2>
                  <p className="mb-4">
                    本規約のいずれかの条項またはその一部が、法令等により無効または執行不能と判断された場合であっても、本規約のその他の条項および一部が無効または執行不能とされていない部分は、継続して完全に効力を有するものとします。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第17条（準拠法・裁判管轄）</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                    <li>本サービスに関して紛争が生じた場合には、当方の所在地を管轄する日本の裁判所を第一審の専属的合意管轄裁判所とします。ただし、ユーザーが日本の消費者契約法上の消費者に該当する場合には、同法に反しない範囲で適用されるものとします。</li>
                  </ol>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">第18条（お問い合わせ）</h2>
                  <p className="mb-4">
                    本規約に関するお問い合わせは、本サービス内のお問い合わせフォームまたは GitHub リポジトリの Issue よりお願いいたします。
                  </p>
                </section>
            </>
            ) : (
              <>
                <div className="mb-10 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                  <p className="mb-4 leading-relaxed">
                    Cadence (hereinafter referred to as the "Service") is a service provided by the Cadence operator (hereinafter referred to as "we," "us," or "our") that visualizes users' development activities by integrating with GitHub accounts. These Terms of Service (hereinafter referred to as the "Terms") apply to the use of the Service.
                  </p>
                  <p className="mb-0 leading-relaxed">
                    All users (hereinafter referred to as "Users") who use the Service are deemed to have agreed to these Terms.
                  </p>
                </div>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 1 (Application)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>These Terms shall apply to all relationships between us and Users regarding the use of the Service.</li>
                    <li>Any rules, guidelines, or other provisions that we may post on the Service from time to time shall constitute part of these Terms, regardless of their titles.</li>
                    <li>In the event of any conflict between these Terms and the rules, etc. referred to in the preceding paragraph, the provisions of these Terms shall prevail unless otherwise specified.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 2 (Service Description)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>The Service is a tool that integrates with GitHub accounts to visualize Users' development activities. The Service primarily provides the following features:</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Visualization of GitHub repository commit history</li>
                        <li>Analysis of development rhythm and momentum</li>
                        <li>Tracking of activity streaks</li>
                        <li>Display of coding patterns by time of day</li>
                        <li>Other related features provided by us on the Service</li>
                      </ul>
                    <li>The Service requests read-only access to GitHub public repositories only and does not modify Users' code or data.</li>
                    <li>The Service depends on the API and specifications provided by GitHub, and all or part of the Service may become unavailable due to specification changes, failures, or service status on GitHub's side.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 3 (Account)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Users shall log in to the Service using their GitHub account.</li>
                    <li>Users shall be solely responsible for managing their GitHub account and authentication information related to the use of the Service.</li>
                    <li>We do not obtain or store Users' GitHub account password information.</li>
                    <li>If a User becomes aware that their account is being used by a third party, they shall immediately notify us and follow our instructions if provided.</li>
                    <li>If we determine that there is a risk of unauthorized use of a User's account, we may suspend the use of such account or take other measures deemed necessary.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 4 (Use by Minors)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>If a User is a minor, they shall use the Service with the consent of their legal guardian.</li>
                    <li>We may assume that a User has obtained the consent of their legal guardian when they use the Service.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 5 (Prohibited Actions)</h2>
                  <p className="mb-4">
                    Users shall not engage in any of the following actions when using the Service:
                  </p>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Actions that violate laws or public order and morals</li>
                    <li>Actions related to criminal activities</li>
                    <li>Actions that interfere with or are likely to interfere with the operation or provision of the Service</li>
                    <li>Actions that infringe or are likely to infringe upon the intellectual property rights, portrait rights, privacy, honor, or other rights or interests of other Users or third parties</li>
                    <li>Actions that place excessive load on the Service's network or systems</li>
                    <li>Unauthorized access or attempts thereof</li>
                    <li>Reverse engineering, decompiling, or disassembling software related to the Service</li>
                    <li>Collecting or accumulating personal information about other Users through improper means or for improper purposes</li>
                    <li>Using the Service for fraudulent purposes</li>
                    <li>Using the Service in a manner that violates GitHub's Terms of Service or other rules established by GitHub</li>
                    <li>Actions that cause disadvantage, damage, or discomfort to other Users or third parties</li>
                    <li>Impersonating us or intentionally transmitting false information</li>
                    <li>Providing benefits to antisocial forces or engaging in activities related to antisocial forces</li>
                    <li>Other actions that we reasonably deem inappropriate</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 6 (Suspension of Service)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>We may suspend or interrupt all or part of the Service without prior notice to Users if we determine that any of the following circumstances exist:</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>When performing maintenance or updates to the computer system related to the Service</li>
                        <li>When it becomes difficult to provide the Service due to force majeure such as earthquakes, lightning, fire, power outages, or natural disasters</li>
                        <li>When computers or communication lines stop due to accidents</li>
                        <li>When a failure occurs in third-party services used by the Service</li>
                        <li>When we reasonably determine that it is difficult to provide the Service for other reasons</li>
                      </ul>
                    <li>Except in unavoidable circumstances, we shall endeavor to notify Users of the suspension or interruption in advance or after the fact through display on the Service or other methods designated by us.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 7 (Usage Restrictions and Account Deletion)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>If we determine that a User falls under any of the following, we may restrict all or part of the User's use of the Service or delete their registration without prior notice:</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Violation of any provision of these Terms</li>
                        <li>Discovery of false information in registration details</li>
                        <li>Use of the Service for fraudulent purposes</li>
                        <li>Other cases where we reasonably determine that it is inappropriate to allow continued use of the Service</li>
                      </ul>
                    <li>We shall not be liable for any damages incurred by Users as a result of actions taken by us under this Article.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 8 (Usage Fees)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>The use of the Service is currently free of charge.</li>
                    <li>We may monetize all or part of the Service in the future. In such case, we shall notify Users of the fee structure and the effective date in advance through display on the Service or other methods designated by us.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 9 (Intellectual Property Rights)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>All intellectual property rights and other rights related to the Service and content provided by us in connection with the Service (including but not limited to programs, images, designs, text, logos, and various data) belong to us or third parties who have licensed us.</li>
                    <li>Users are granted only a non-exclusive right to use the Service in Japan under these Terms and do not acquire any rights to the Service.</li>
                    <li>Users shall not reproduce, reprint, publish, distribute, or modify information obtained through the Service without our prior consent. However, this does not apply to sharing statistical information about Users' own GitHub accounts for personal use or within a reasonable scope on social media, etc.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 10 (Disclaimer and Limitation of Liability)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>We do not guarantee, either explicitly or implicitly, that the Service is free from factual or legal defects (including defects related to safety, reliability, accuracy, completeness, effectiveness, fitness for a particular purpose, security, errors, bugs, rights infringement, etc.).</li>
                    <li>We shall not be liable for any damages incurred by Users arising from or related to the Service. However, if the contract between us and a User regarding the Service (including these Terms) constitutes a consumer contract as defined by the Consumer Contract Act of Japan, and damages are caused by our willful misconduct or gross negligence, this limitation shall not apply.</li>
                    <li>Even in the case of the proviso in the preceding paragraph, unless there is willful misconduct or gross negligence on our part, we shall not be liable for any special damages, indirect damages, lost profits, attorney's fees, or other incidental damages.</li>
                    <li>Notwithstanding the preceding paragraphs, even if we are liable to a User for damages, unless there is willful misconduct or gross negligence on our part, the amount of compensation shall be limited to the amount actually paid by the User to us as consideration for using the Service during the three months preceding the month in which the damage occurred (or 10,000 yen if the Service is provided free of charge).</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 11 (Handling of Personal Information)</h2>
                  <p className="mb-4">
                    We shall appropriately handle Users' personal information obtained through the use of the Service in accordance with the "Cadence Privacy Policy."
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 12 (Changes to or Termination of Service)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>We may change, add, or discontinue the content of the Service with prior notice to Users, and Users consent to this.</li>
                    <li>We may terminate all or part of the Service for business or technical reasons. In such case, we shall notify Users in advance to a reasonable extent through display on the Service or other methods designated by us.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 13 (Changes to Terms)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>We may change these Terms if any of the following applies:</li>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>When the change to the Terms is in the general interest of Users</li>
                        <li>When the change does not contradict the purpose of the contract and is reasonable in light of the necessity of the change, the appropriateness of the changed content, and other circumstances</li>
                      </ul>
                    <li>When changing these Terms, we shall publicize the changed Terms and their effective date through display on the Service or other methods designated by us by the effective date.</li>
                    <li>If a User uses the Service after the effective date of the changed Terms, or does not complete the account deletion procedure within the period separately determined by us, the User shall be deemed to have agreed to the changed Terms.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 14 (Notices and Communications)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Notices or communications between Users and us shall be made through notification features within the Service, display on websites operated by us, email transmission, GitHub repository Issues, or other methods designated by us.</li>
                    <li>Unless a User has separately notified us of their contact information, we may send notices or communications to the email address registered with GitHub or other contact information we have obtained, and such notices or communications shall be deemed to have reached the User at the time of transmission.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 15 (Assignment of Rights and Obligations)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Users may not assign their position under these Terms or rights or obligations under these Terms to third parties or use them as collateral without our prior written consent.</li>
                    <li>If we transfer the business related to the Service to a third party (including business transfers, company splits, and other business reorganizations), we may transfer our position under these Terms, rights and obligations under these Terms, and Users' registration information and other information to such third party, and Users consent to this in advance.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 16 (Severability)</h2>
                  <p className="mb-4">
                    Even if any provision of these Terms or part thereof is determined to be invalid or unenforceable under applicable laws, the remaining provisions of these Terms and the parts not determined to be invalid or unenforceable shall continue to be in full force and effect.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 17 (Governing Law and Jurisdiction)</h2>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>These Terms shall be governed by Japanese law.</li>
                    <li>In the event of any dispute regarding the Service, the Japanese court having jurisdiction over our location shall have exclusive agreed jurisdiction as the court of first instance. However, if a User qualifies as a consumer under the Consumer Contract Act of Japan, this shall apply to the extent that it does not conflict with such Act.</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-3">Article 18 (Contact)</h2>
                  <p className="mb-4">
                    For inquiries regarding these Terms, please use the contact form within the Service or submit an Issue on the GitHub repository.
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
