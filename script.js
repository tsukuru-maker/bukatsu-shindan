// ==================================================
// 部活キャラ診断
// ==================================================
//
// 判定方式：
//   1. 素点 = Σ(選択した選択肢の weights)
//   2. 正規化 = (素点 - 平均) / 標準偏差      ← z-score
//   3. 正規化スコアが最大の部活を結果とする
//
//   素点だけで比べると、配点の総量が多い部活が有利になり
//   結果の出現率が偏る（参照実装はここで 3.4 倍の偏りが出ていた）。
//   平均と分散は questions.js から解析的に計算できるので、
//   実行時に求めて正規化する。
// ==================================================


const RESULT_KEYS = resultOrder.slice();

const CARD = { W: 1080, H: 1350 };


// ==================================================
// 状態
// ==================================================

let currentQuestion = 0;
let answerHistory = [];
let lastOutcome = null;
let cardDataUrl = null;
let cardPromise = null;


// ==================================================
// 平均・分散（一様ランダム回答を仮定して解析的に求める）
// ==================================================

const MOMENTS = (function () {

    const mean = {};
    const variance = {};

    RESULT_KEYS.forEach(k => { mean[k] = 0; variance[k] = 0; });

    questions.forEach(q => {

        const n = q.options.length;

        RESULT_KEYS.forEach(k => {

            const vals = q.options.map(o => o.weights[k] || 0);

            const m = vals.reduce((a, b) => a + b, 0) / n;

            mean[k] += m;

            variance[k] +=
                vals.reduce((a, v) => a + (v - m) * (v - m), 0) / n;

        });

    });

    return { mean, variance };

})();


// ==================================================
// ユーティリティ
// ==================================================

function el(id) {
    return document.getElementById(id);
}


function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}


// 日本語は単語の途中でも改行されてしまう。
// データ中の「|」を「ここでなら折り返してよい」印として <wbr> に変換し、
// CSS 側で word-break: keep-all を当てることで、印の位置でだけ折り返させる。
function phrase(s) {
    return esc(s).replace(/\|/g, "<wbr>");
}


// 折り返し印を抜いた、素の文字列（読み上げ・シェア用）
function plain(s) {
    return String(s).replace(/\|/g, "");
}


function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


// ==================================================
// タイトル画面
// ==================================================

function showTitle() {

    const chips = RESULT_KEYS.map(k => {

        const r = results[k];

        return `<span class="club-chip">
                    <i style="background:${r.color}"></i>${esc(r.name)}
                </span>`;

    }).join("");


    el("app").innerHTML = `

        <div class="screen title-screen">

            <p class="title-kicker">10の質問・30秒</p>

            <h1 class="title-main">部活キャラ<br>診断</h1>

            <p class="title-sub">あなたの中に残ってる「部活の男」は、どれか。</p>

            <p class="title-note">
                ※ 実際に入っていた部活とは関係ありません。<br>
                あの頃の感覚だけで答えてください。
            </p>

            <div class="club-strip">${chips}</div>

            <button class="btn" onclick="startDiagnosis()">
                診断をはじめる
            </button>

            <p class="title-meta">全${questions.length}問 ／ 所要 30〜45秒</p>

        </div>

    `;

}


// ==================================================
// 診断開始
// ==================================================

function startDiagnosis() {

    currentQuestion = 0;

    answerHistory = [];

    lastOutcome = null;

    cardDataUrl = null;

    cardPromise = null;

    showQuestion();

}


// ==================================================
// 質問画面
// ==================================================

function showQuestion() {

    const q = questions[currentQuestion];

    const progress = (currentQuestion / questions.length) * 100;


    const optionsHTML = q.options.map((o, i) => `

        <button class="option" onclick="answerQuestion(${i})">

            <span class="option-num">${i + 1}</span>

            <span class="option-label">${phrase(o.label)}</span>

        </button>

    `).join("");


    const backHTML = currentQuestion > 0
        ? `<button class="back" onclick="goBack()">← 前の質問に戻る</button>`
        : "";


    el("app").innerHTML = `

        <div class="screen">

            <div class="q-header">

                <span>部活キャラ診断</span>

                <span class="q-count">
                    <b>${currentQuestion + 1}</b> / ${questions.length}
                </span>

            </div>

            <div class="progress">
                <i style="width:${progress}%"></i>
            </div>

            <h2 class="q-text">${phrase(q.text)}</h2>

            <div class="options">${optionsHTML}</div>

            ${backHTML}

        </div>

    `;

    window.scrollTo(0, 0);

}


// ==================================================
// 回答
// ==================================================

function answerQuestion(optionIndex) {

    answerHistory[currentQuestion] = optionIndex;

    currentQuestion++;

    if (currentQuestion >= questions.length) {

        showLoading();

        // 描画を1フレーム待ってから結果へ
        requestAnimationFrame(() => {

            setTimeout(showResult, 260);

        });

    } else {

        showQuestion();

    }

}


function goBack() {

    if (currentQuestion <= 0) return;

    currentQuestion--;

    answerHistory[currentQuestion] = undefined;

    showQuestion();

}


function showLoading() {

    el("app").innerHTML = `

        <div class="screen">

            <div class="loading">
                <i></i>
                <span>判定しています…</span>
            </div>

        </div>

    `;

}


// ==================================================
// 集計
// ==================================================

function computeOutcome(history) {

    const raw = {};

    RESULT_KEYS.forEach(k => { raw[k] = 0; });


    questions.forEach((q, qi) => {

        const oi = history[qi];

        if (oi === undefined || oi === null) return;

        const w = q.options[oi].weights;

        RESULT_KEYS.forEach(k => { raw[k] += (w[k] || 0); });

    });


    // z-score 正規化
    const z = {};

    RESULT_KEYS.forEach(k => {

        const sd = Math.sqrt(MOMENTS.variance[k]);

        z[k] = sd > 0 ? (raw[k] - MOMENTS.mean[k]) / sd : 0;

    });


    // 表示用の一致度（z を 0〜100 に均す）
    const zs = RESULT_KEYS.map(k => z[k]);

    const zMin = Math.min.apply(null, zs);

    const zMax = Math.max.apply(null, zs);

    const span = zMax - zMin;


    const rows = RESULT_KEYS.map(k => ({

        key: k,

        raw: raw[k],

        z: z[k],

        fit: span > 0
            ? Math.max(4, Math.round(((z[k] - zMin) / span) * 100))
            : 100

    }));


    rows.sort((a, b) => b.z - a.z);


    // 同点は先に来たほうを上位に（resultOrder 順で安定）
    return { rows: rows, top: rows[0] };

}


// ==================================================
// 結果画面
// ==================================================

function showResult() {

    const outcome = computeOutcome(answerHistory);

    lastOutcome = outcome;

    renderResult(outcome, true);

}


function renderResult(outcome, showRanking) {

    const top = outcome.top;

    const r = results[top.key];


    const rankingHTML = showRanking ? `

        <div class="ranking">

            <div class="ranking-head">
                <span class="ranking-title">ALL RESULTS / 10</span>
                <span class="ranking-title">一致度</span>
            </div>

            ${outcome.rows.map((row, i) => {

                const info = results[row.key];

                return `

                    <div class="rank-row ${i === 0 ? "is-first" : ""}">

                        <div class="rank-info">

                            <span class="rank-name">
                                <span class="rank-index">${String(i + 1).padStart(2, "0")}</span>
                                <b>${esc(info.name)}</b>
                            </span>

                            <span class="rank-score">${row.fit}%</span>

                        </div>

                        <div class="rank-bar">
                            <i style="width:${row.fit}%;background:${info.color}"></i>
                        </div>

                    </div>

                `;

            }).join("")}

        </div>

    ` : "";


    el("app").innerHTML = `

        <div class="screen">

            <div class="result-hero" style="background:${r.color}">

                <span class="eyebrow">あなたは</span>

                <h1 class="result-name">${esc(r.name)}</h1>

                <p class="result-catch">${esc(r.catch)}</p>

            </div>

            <p class="result-desc">${esc(r.description)}</p>

            <div class="result-actions">

                <button class="btn btn--accent" id="btn-card" onclick="openCard()" disabled>
                    結果画像を準備中…
                </button>

                <button class="btn btn--ghost" onclick="shareToX()">
                    結果をXでポストする
                </button>

                <button class="btn btn--ghost" onclick="startDiagnosis()">
                    もう一度やってみる
                </button>

            </div>

            <p class="result-hint">
                画像を保存してからポストすると、そのまま添付できます。
            </p>

            ${rankingHTML}

            <div class="foot">
                部活キャラ診断 ／ 実際の部活経験とは関係ありません
            </div>

        </div>

    `;

    window.scrollTo(0, 0);

    prepareCard(r, top.fit);

}


// ==================================================
// 結果カード画像（canvas）
// ==================================================

async function ensureFonts() {

    if (!document.fonts || !document.fonts.load) return;

    try {

        await Promise.all([
            document.fonts.load('900 140px "Noto Sans JP"'),
            document.fonts.load('700 58px "Noto Sans JP"'),
            document.fonts.load('500 34px "Noto Sans JP"'),
            document.fonts.load('400 30px "Noto Sans JP"')
        ]);

        await document.fonts.ready;

    } catch (e) {
        // フォントが取れなくてもシステムフォントで描画を続行する
    }

}


// 1 文字ずつ足していき、幅を超えたら折り返す。
// ただし日本語は語の途中で切ると読みにくいので、
// 直前 LOOKBACK 文字以内に句読点があればそこまで戻して折る。
function wrapText(g, text, maxWidth) {

    const BREAK_AFTER = "、。！？）」";

    // どこまで戻って句読点を探すか。大きくするほど行が短くなる。
    const LOOKBACK = 14;

    const lines = [];

    let line = "";

    for (const ch of text) {

        const test = line + ch;

        if (g.measureText(test).width > maxWidth && line !== "") {

            let cut = line.length;

            for (let i = line.length - 1; i >= Math.max(0, line.length - LOOKBACK); i--) {
                if (BREAK_AFTER.indexOf(line[i]) >= 0) {
                    cut = i + 1;
                    break;
                }
            }

            lines.push(line.slice(0, cut));

            line = line.slice(cut) + ch;

        } else {

            line = test;

        }

    }

    if (line) lines.push(line);

    return lines;

}


function roundRect(g, x, y, w, h, r) {

    g.beginPath();

    g.moveTo(x + r, y);

    g.arcTo(x + w, y, x + w, y + h, r);

    g.arcTo(x + w, y + h, x, y + h, r);

    g.arcTo(x, y + h, x, y, r);

    g.arcTo(x, y, x + w, y, r);

    g.closePath();

}


async function drawCard(r, fit) {

    await ensureFonts();

    const W = CARD.W;
    const H = CARD.H;

    const c = document.createElement("canvas");

    c.width = W;
    c.height = H;

    const g = c.getContext("2d");

    const FONT = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif';


    // 背景
    g.fillStyle = "#F2EFE6";
    g.fillRect(0, 0, W, H);


    // 外枠
    g.strokeStyle = "#1F1B16";
    g.lineWidth = 3;
    g.strokeRect(40, 40, W - 80, H - 80);

    g.strokeStyle = "#D9D2C4";
    g.lineWidth = 1.5;
    g.strokeRect(54, 54, W - 108, H - 108);


    g.textAlign = "center";
    g.textBaseline = "alphabetic";


    // ヘッダー
    g.fillStyle = "#6B6357";
    g.font = `500 34px ${FONT}`;
    g.fillText("部活キャラ診断", W / 2, 152);

    g.fillStyle = "#9A9081";
    g.font = `400 18px ${FONT}`;
    g.fillText("KATSUBU CHARACTER DIAGNOSIS", W / 2, 194);


    // 部活名の帯
    const bandY = 260;
    const bandH = 330;

    g.fillStyle = r.color;
    roundRect(g, 100, bandY, W - 200, bandH, 20);
    g.fill();

    g.fillStyle = "#FFFFFF";
    g.font = `900 140px ${FONT}`;
    g.textBaseline = "middle";
    g.fillText(r.name, W / 2, bandY + bandH / 2 + 6);
    g.textBaseline = "alphabetic";


    // 一言ネタ
    g.fillStyle = "#1F1B16";
    g.font = `700 58px ${FONT}`;

    const catchLines = wrapText(g, r.catch, 880);
    let cy = 690;

    catchLines.forEach(line => {
        g.fillText(line, W / 2, cy);
        cy += 78;
    });


    // 区切り線
    const ruleY = cy + 4;

    g.strokeStyle = "#D9D2C4";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(340, ruleY);
    g.lineTo(740, ruleY);
    g.stroke();


    // 説明文（行数が 2〜3 行で変わるので、領域内で上下センターする）
    g.fillStyle = "#6B6357";
    g.font = `400 32px ${FONT}`;

    const descLines = wrapText(g, r.description, 840);
    const lh = 56;

    const regionTop = ruleY + 56;
    const regionBottom = 1120;
    const blockH = descLines.length * lh;

    let dy =
        regionTop +
        Math.max(0, (regionBottom - regionTop - blockH) / 2) +
        38;

    descLines.forEach(line => {
        g.fillText(line, W / 2, dy);
        dy += lh;
    });


    // フッター（共有リンク経由で一致度が不明なときは一致度の行を出さない）
    const hasFit = typeof fit === "number" && isFinite(fit);

    g.fillStyle = "#B8442C";
    g.font = `700 32px ${FONT}`;
    g.fillText("#部活キャラ診断", W / 2, hasFit ? 1180 : 1206);

    if (hasFit) {

        g.fillStyle = "#9A9081";
        g.font = `400 22px ${FONT}`;
        g.fillText(`あなたとの一致度 ${fit}%`, W / 2, 1234);

    }


    return c.toDataURL("image/png");

}


function prepareCard(r, fit) {

    cardDataUrl = null;

    cardPromise = drawCard(r, fit)

        .then(url => {

            cardDataUrl = url;

            const btn = el("btn-card");

            if (btn) {

                btn.disabled = false;

                btn.textContent = "結果画像を保存する";

            }

        })

        .catch(() => {

            const btn = el("btn-card");

            if (btn) {

                btn.disabled = true;

                btn.textContent = "画像を作れませんでした";

            }

        });

}


function openCard() {

    if (!cardDataUrl) return;

    const name = lastOutcome ? lastOutcome.top.key : "result";

    const r = results[name];


    const wrap = document.createElement("div");

    wrap.className = "modal";

    wrap.id = "modal";

    wrap.innerHTML = `

        <div class="modal-inner">

            <img src="${cardDataUrl}" alt="${esc(r.name)} ${esc(r.catch)}">

            <div class="modal-actions">

                <button class="btn" onclick="downloadCard()">
                    画像を保存する
                </button>

                <button class="btn btn--ghost" onclick="closeCard()">
                    閉じる
                </button>

            </div>

        </div>

    `;

    wrap.addEventListener("click", e => {

        if (e.target === wrap) closeCard();

    });

    document.body.appendChild(wrap);

}


function closeCard() {

    const m = el("modal");

    if (m) m.remove();

}


function downloadCard() {

    if (!cardDataUrl || !lastOutcome) return;

    const r = results[lastOutcome.top.key];

    const a = document.createElement("a");

    a.href = cardDataUrl;

    a.download = `bukatsu-shindan-${lastOutcome.top.key}.png`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

}


// ==================================================
// X シェア
// ==================================================

function shareToX() {

    if (!lastOutcome) return;

    const r = results[lastOutcome.top.key];

    const text =
        `部活キャラ診断やったら「${r.name} ── ${r.catch}」だった。\n` +
        `#部活キャラ診断`;

    const url =
        location.origin + location.pathname;

    const intent =
        "https://twitter.com/intent/tweet" +
        `?text=${encodeURIComponent(text)}` +
        `&url=${encodeURIComponent(url)}`;

    window.open(intent, "_blank", "noopener,noreferrer");

}


// ==================================================
// URL パラメータからの復元（?r=yakyu）
// ==================================================

function restoreFromUrl() {

    const m = location.search.match(/[?&]r=([a-z]+)/i);

    if (!m) return false;

    const key = m[1];

    if (!results[key]) return false;


    // 共有リンク経由なので一致度は不明（null）＝カードからは一致度の行を省く
    lastOutcome = { top: { key: key, fit: null }, rows: [] };

    renderResult(lastOutcome, false);

    return true;

}


// ==================================================
// 起動
// ==================================================

(function init() {

    if (!restoreFromUrl()) showTitle();

})();
