// ==================================================
// 部活キャラ診断：質問データ
// ==================================================
//
// ★このファイルは tools/design.py から自動生成されています。
//   直接編集せず、design.py を直して再生成してください。
//     python3 tools/design.py --write
//
// weights の数字が、その選択肢が各部活に与える影響です。
//   プラス = その部活に近づく / マイナス = 遠ざかる
//
// 10問 × 4択。所要時間の目標は 30〜45秒。
//
// 配点の設計方針：
//   ・各選択肢のプラス配点の合計は必ず 6（+3/+2/+1 の組み合わせ）
//   ・その結果、10部活のプラス合計がほぼ均等（23〜25）になる
//   ・マイナス配点は候補プールから自動割当て（各部活が均等になる）
//   ・編集後は tools/simulate.py で出現率を必ず検証すること
// ==================================================

const questions = [

    {
        text: "一番きつい練習のとき、|どうしてた？",
        options: [
            {
                label: "声を出して、|周りを巻き込んでた",
                weights: { yakyu: 3, soccer: 0, basket: 2, takkyu: 0, rikujo: -1, judo: 0, kendo: 0, suisou: 1, bijutsu: -1, kitaku: 0 }
            },
            {
                label: "黙々と、|自分のペースで|最後までやった",
                weights: { yakyu: -1, soccer: 0, basket: 0, takkyu: 2, rikujo: 3, judo: 1, kendo: 0, suisou: -1, bijutsu: 0, kitaku: 0 }
            },
            {
                label: "要領よく抜いて、|ここぞというときだけ|本気を出した",
                weights: { yakyu: 0, soccer: 3, basket: 0, takkyu: 1, rikujo: 0, judo: -1, kendo: -1, suisou: 0, bijutsu: 1, kitaku: 1 }
            },
            {
                label: "言われたとおり、|最後まで黙ってやった",
                weights: { yakyu: 0, soccer: -1, basket: -1, takkyu: 0, rikujo: 0, judo: 2, kendo: 3, suisou: 0, bijutsu: 0, kitaku: 1 }
            },
        ]
    },

    {
        text: "自分の実力について、|当時どう思ってた？",
        options: [
            {
                label: "周りより上だと思ってた",
                weights: { yakyu: 0, soccer: 2, basket: 3, takkyu: 0, rikujo: 0, judo: 0, kendo: 1, suisou: 0, bijutsu: -1, kitaku: -1 }
            },
            {
                label: "中の上。|目立たないけど、|そこそこ",
                weights: { yakyu: 2, soccer: 0, basket: 1, takkyu: 3, rikujo: 0, judo: 0, kendo: -1, suisou: 0, bijutsu: 0, kitaku: -1 }
            },
            {
                label: "下の方だったけど、|それでよかった",
                weights: { yakyu: -1, soccer: 0, basket: -1, takkyu: 0, rikujo: 0, judo: 0, kendo: 0, suisou: 2, bijutsu: 1, kitaku: 3 }
            },
            {
                label: "実力の割に、|評価されてなかった",
                weights: { yakyu: -1, soccer: 3, basket: 0, takkyu: 0, rikujo: 1, judo: 2, kendo: 0, suisou: -1, bijutsu: 0, kitaku: 0 }
            },
        ]
    },

    {
        text: "後輩が入ってきたとき、|どんな先輩だった？",
        options: [
            {
                label: "厳しくした。|自分がそうされたから",
                weights: { yakyu: 0, soccer: 0, basket: 1, takkyu: -1, rikujo: 0, judo: 3, kendo: 2, suisou: 0, bijutsu: 0, kitaku: -1 }
            },
            {
                label: "優しくした。|自分がされて|嫌だったから",
                weights: { yakyu: 0, soccer: 1, basket: 0, takkyu: 1, rikujo: 0, judo: -1, kendo: -1, suisou: 3, bijutsu: 1, kitaku: 0 }
            },
            {
                label: "距離を置いてた。|興味がなかった",
                weights: { yakyu: 0, soccer: -1, basket: 0, takkyu: 1, rikujo: 1, judo: 0, kendo: 0, suisou: -1, bijutsu: 1, kitaku: 3 }
            },
            {
                label: "面倒を見すぎて、|自分の練習が|疎かになった",
                weights: { yakyu: 0, soccer: -1, basket: 1, takkyu: 0, rikujo: 0, judo: 0, kendo: 3, suisou: 2, bijutsu: -1, kitaku: 0 }
            },
        ]
    },

    {
        text: "試合や本番の前日、|何をしてた？",
        options: [
            {
                label: "準備を全部整えて、|早く寝た",
                weights: { yakyu: 0, soccer: -1, basket: 0, takkyu: 3, rikujo: 2, judo: 0, kendo: 1, suisou: 0, bijutsu: 0, kitaku: -1 }
            },
            {
                label: "頭の中で、|動きを何度も|確認してた",
                weights: { yakyu: 1, soccer: 3, basket: 2, takkyu: -1, rikujo: -1, judo: 0, kendo: 0, suisou: 0, bijutsu: 0, kitaku: 0 }
            },
            {
                label: "誰かと電話して、|気を紛らわせてた",
                weights: { yakyu: 0, soccer: 0, basket: 0, takkyu: 0, rikujo: -1, judo: -1, kendo: 0, suisou: 3, bijutsu: 2, kitaku: 1 }
            },
            {
                label: "特別なことは|何もしてなかった",
                weights: { yakyu: 1, soccer: 0, basket: 1, takkyu: 0, rikujo: -1, judo: 1, kendo: -1, suisou: 0, bijutsu: 0, kitaku: 3 }
            },
        ]
    },

    {
        text: "顧問の先生とは、|どんな関係だった？",
        options: [
            {
                label: "よく怒られた",
                weights: { yakyu: 2, soccer: 0, basket: 0, takkyu: -1, rikujo: 1, judo: 3, kendo: 0, suisou: 0, bijutsu: -1, kitaku: 0 }
            },
            {
                label: "認めてもらえてた",
                weights: { yakyu: 0, soccer: 2, basket: 3, takkyu: 1, rikujo: 0, judo: -1, kendo: 0, suisou: 0, bijutsu: 0, kitaku: -1 }
            },
            {
                label: "あまり話したことがない",
                weights: { yakyu: -1, soccer: 0, basket: -1, takkyu: 1, rikujo: 0, judo: 0, kendo: 0, suisou: 0, bijutsu: 3, kitaku: 2 }
            },
            {
                label: "味方でいてくれた",
                weights: { yakyu: 0, soccer: 0, basket: -1, takkyu: 0, rikujo: 0, judo: -1, kendo: 2, suisou: 3, bijutsu: 1, kitaku: 0 }
            },
        ]
    },

    {
        text: "部活で一番|覚えてるのは？",
        options: [
            {
                label: "先輩に怒られたこと",
                weights: { yakyu: 1, soccer: 0, basket: 0, takkyu: -1, rikujo: 0, judo: 2, kendo: 3, suisou: -1, bijutsu: 0, kitaku: 0 }
            },
            {
                label: "試合に|出られなかったこと",
                weights: { yakyu: -1, soccer: 3, basket: 1, takkyu: 1, rikujo: 0, judo: 0, kendo: -1, suisou: 0, bijutsu: 0, kitaku: 1 }
            },
            {
                label: "文化祭や発表会の本番",
                weights: { yakyu: 0, soccer: 0, basket: -1, takkyu: 0, rikujo: 0, judo: -1, kendo: 0, suisou: 3, bijutsu: 2, kitaku: 1 }
            },
            {
                label: "引退の日",
                weights: { yakyu: 3, soccer: 0, basket: 1, takkyu: 1, rikujo: 1, judo: 0, kendo: 0, suisou: -1, bijutsu: -1, kitaku: 0 }
            },
        ]
    },

    {
        text: "部活の仲間とは、|どう付き合ってた？",
        options: [
            {
                label: "毎日つるんでた。|今も付き合いがある",
                weights: { yakyu: 3, soccer: 1, basket: 2, takkyu: -1, rikujo: -1, judo: 0, kendo: 0, suisou: 0, bijutsu: 0, kitaku: 0 }
            },
            {
                label: "仲は良かったけど、|一線は引いてた",
                weights: { yakyu: -1, soccer: -1, basket: 0, takkyu: 3, rikujo: 1, judo: 0, kendo: 2, suisou: 0, bijutsu: 0, kitaku: 0 }
            },
            {
                label: "ごく一部のやつとだけ、|深く付き合ってた",
                weights: { yakyu: 0, soccer: 0, basket: -1, takkyu: 0, rikujo: 3, judo: 1, kendo: 0, suisou: -1, bijutsu: 2, kitaku: 0 }
            },
            {
                label: "部活の外に友達がいた",
                weights: { yakyu: -1, soccer: -1, basket: 0, takkyu: 0, rikujo: 0, judo: 0, kendo: 0, suisou: 1, bijutsu: 2, kitaku: 3 }
            },
        ]
    },

    {
        text: "部活で|褒められたとしたら、|何だった？",
        options: [
            {
                label: "声が大きい、|雰囲気を明るくするとか",
                weights: { yakyu: 3, soccer: 0, basket: 2, takkyu: 0, rikujo: -1, judo: 0, kendo: 0, suisou: 1, bijutsu: -1, kitaku: 0 }
            },
            {
                label: "センスがある、|覚えが早いとか",
                weights: { yakyu: 0, soccer: 3, basket: 1, takkyu: 2, rikujo: 0, judo: 0, kendo: -1, suisou: 0, bijutsu: 0, kitaku: -1 }
            },
            {
                label: "真面目だ、|手を抜かないとか",
                weights: { yakyu: 0, soccer: 0, basket: 0, takkyu: 0, rikujo: 3, judo: 2, kendo: 1, suisou: 0, bijutsu: -1, kitaku: -1 }
            },
            {
                label: "器用だ、|裏方を任せられるとか",
                weights: { yakyu: 0, soccer: -1, basket: -1, takkyu: 0, rikujo: 0, judo: 0, kendo: 0, suisou: 2, bijutsu: 3, kitaku: 1 }
            },
        ]
    },

    {
        text: "結局、|その部活を続けた|理由は？",
        options: [
            {
                label: "仲間がいたから",
                weights: { yakyu: 3, soccer: 1, basket: 2, takkyu: -1, rikujo: -1, judo: 0, kendo: 0, suisou: 0, bijutsu: 0, kitaku: 0 }
            },
            {
                label: "うまくなりたかったから",
                weights: { yakyu: 0, soccer: 0, basket: 0, takkyu: 3, rikujo: 2, judo: 1, kendo: -1, suisou: -1, bijutsu: 0, kitaku: 0 }
            },
            {
                label: "親や先生に|期待されてたから",
                weights: { yakyu: -1, soccer: 0, basket: 0, takkyu: 2, rikujo: 0, judo: 1, kendo: 3, suisou: 0, bijutsu: 0, kitaku: -1 }
            },
            {
                label: "入る理由も、|やめる理由も、|特に無かった",
                weights: { yakyu: 0, soccer: -1, basket: 0, takkyu: 0, rikujo: 1, judo: -1, kendo: 0, suisou: 0, bijutsu: 2, kitaku: 3 }
            },
        ]
    },

    {
        text: "今、|あの頃を振り返ると？",
        options: [
            {
                label: "あれがあったから、|今がある",
                weights: { yakyu: 2, soccer: 0, basket: 0, takkyu: -1, rikujo: 0, judo: 3, kendo: 1, suisou: 0, bijutsu: -1, kitaku: 0 }
            },
            {
                label: "もっと上手くなれた|はずだと思う",
                weights: { yakyu: 0, soccer: 2, basket: 1, takkyu: -1, rikujo: 3, judo: 0, kendo: 0, suisou: -1, bijutsu: 0, kitaku: 0 }
            },
            {
                label: "よくやったな、と|自分を褒めたい",
                weights: { yakyu: 0, soccer: 0, basket: 0, takkyu: 0, rikujo: 2, judo: 1, kendo: 3, suisou: 0, bijutsu: 0, kitaku: 0 }
            },
            {
                label: "文化祭の展示は、|今でも覚えてる",
                weights: { yakyu: 0, soccer: 0, basket: -1, takkyu: 0, rikujo: 0, judo: -1, kendo: 0, suisou: 2, bijutsu: 3, kitaku: 1 }
            },
        ]
    },

];
