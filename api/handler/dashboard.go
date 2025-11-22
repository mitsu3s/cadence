package handler

import (
	"net/http"
)

func Dashboard() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/dashboard.html")

		// 今は埋め込みHTMLでOK。あとでテンプレートにしてもいい
		// 		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		// 		w.Write([]byte(`<!doctype html>
		// <html>
		//   <head>
		//     <meta charset="utf-8" />
		//     <title>cadence - dashboard</title>
		//     <style>
		//       body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
		//       h1 { margin-bottom: 12px; }
		//       table { border-collapse: collapse; margin-top: 16px; }
		//       th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
		//       th { background: #f4f4f4; }
		//       input { padding: 4px 6px; }
		//       .muted { color: #666; font-size: 12px; }
		//     </style>
		//   </head>
		//   <body>
		//     <h1>cadence dashboard</h1>
		//     <div>
		//       <label>Repo: </label>
		//       <input id="repo" value="mitsu3s/placekeeper" />
		//       <label>Days: </label>
		//       <input id="days" type="number" value="7" min="1" max="30" />
		//       <button onclick="loadStats()">Load</button>
		//     </div>
		//     <p class="muted">※ いまは手動でロードするやつ。後で自動更新にする。</p>
		//     <table id="tbl" style="display:none;">
		//       <thead>
		//         <tr><th>Date</th><th>Events</th></tr>
		//       </thead>
		//       <tbody></tbody>
		//     </table>
		//     <p id="empty" class="muted" style="display:none;">No data.</p>
		//     <script>
		//       async function loadStats() {
		//         const repo = document.getElementById('repo').value;
		//         const days = document.getElementById('days').value || 7;
		//         const res = await fetch('/stats/daily?repo=' + encodeURIComponent(repo) + '&days=' + days);
		//         if (!res.ok) {
		//           alert('failed to load');
		//           return;
		//         }
		//         const data = await res.json();
		//         const tbody = document.querySelector('#tbl tbody');
		//         tbody.innerHTML = '';
		//         if (!data.days || data.days.length === 0) {
		//           document.getElementById('tbl').style.display = 'none';
		//           document.getElementById('empty').style.display = 'block';
		//           return;
		//         }
		//         document.getElementById('tbl').style.display = 'table';
		//         document.getElementById('empty').style.display = 'none';
		//         data.days.forEach(d => {
		//           const tr = document.createElement('tr');
		//           const tdDate = document.createElement('td');
		//           const tdCount = document.createElement('td');
		//           tdDate.textContent = d.date;
		//           tdCount.textContent = d.count;
		//           tr.appendChild(tdDate);
		//           tr.appendChild(tdCount);
		//           tbody.appendChild(tr);
		//         });
		//       }
		//       // 最初に1回だけ読み込む
		//       loadStats();
		//     </script>
		//   </body>
		// </html>`))
	}
}
