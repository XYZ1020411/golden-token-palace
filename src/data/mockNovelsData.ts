
import { Novel, NovelChapter } from "@/types/novel";

// All novels now have 1 billion chapters
export const CHAPTERS_COUNT = 100000000;

export const mockNovels: Novel[] = [
  {
    id: "1",
    title: "仙劍奇俠傳：雲海浮華",
    author: "軒轅劍",
    coverImage: "https://source.unsplash.com/random/300x400/?fantasy",
    tags: ["仙俠", "奇幻", "武俠"],
    rating: 4.8,
    chapters: CHAPTERS_COUNT,
    views: 564892,
    likes: 45328,
    summary: "六界風雲變幻，天下英雄薈萃。一名普通少年因機緣巧合得到上古神劍，從此踏上修仙之路，在危機四伏的世界中逐漸成長，最終成為守護世界和平的強者。",
    lastUpdated: "2025-05-05",
    isNew: false,
    isHot: true,
    isFeatured: true,
    type: "仙俠"
  },
  {
    id: "2",
    title: "霧雨江南：都市修真",
    author: "夢溪筆談",
    coverImage: "https://source.unsplash.com/random/300x400/?city,night",
    tags: ["都市", "修真", "都市異能"],
    rating: 4.6,
    chapters: CHAPTERS_COUNT,
    views: 423651,
    likes: 32541,
    summary: "在繁華都市中隱藏著無數不為人知的秘密。年輕醫生林風意外獲得古老醫術傳承，能夠看到常人無法看到的事物，從此踏上驚險刺激的都市修真之旅。",
    lastUpdated: "2025-05-05",
    isNew: false,
    isHot: true,
    isFeatured: false,
    type: "都市"
  },
  {
    id: "3",
    title: "星際漫遊：2199",
    author: "銀河使者",
    coverImage: "https://source.unsplash.com/random/300x400/?space",
    tags: ["科幻", "未來", "星際"],
    rating: 4.5,
    chapters: CHAPTERS_COUNT,
    views: 305687,
    likes: 24789,
    summary: "2199年，人類已經殖民多個星系。當一支神秘外星艦隊出現在太陽系邊緣，年輕艦長林宇和他的船員必須面對人類有史以來最大的威脅。",
    lastUpdated: "2025-05-05",
    isNew: true,
    isHot: false,
    isFeatured: true,
    type: "科幻"
  },
  {
    id: "4",
    title: "獵魔傳說",
    author: "暗夜獵手",
    coverImage: "https://source.unsplash.com/random/300x400/?dark,forest",
    tags: ["玄幻", "獵魔", "冒險"],
    rating: 4.7,
    chapters: CHAPTERS_COUNT,
    views: 387452,
    likes: 29874,
    summary: "在一個魔物肆虐的世界中，獵魔人艾爾文憑藉祖傳的獵魔技藝和智慧，與各種強大的魔物周旋。在獵殺魔物的過程中，他逐漸揭開了魔物出現背後的驚天陰謀。",
    lastUpdated: "2025-05-05",
    isNew: true,
    isHot: true,
    isFeatured: false,
    type: "奇幻"
  },
  {
    id: "5",
    title: "龍與魔法師",
    author: "法師協會",
    coverImage: "https://source.unsplash.com/random/300x400/?dragon",
    tags: ["魔法", "奇幻", "冒險"],
    rating: 4.4,
    chapters: CHAPTERS_COUNT,
    views: 254789,
    likes: 18965,
    summary: "少年安德魯在一次意外中發現自己擁有罕見的龍語魔法天賦，能夠與傳說中的龍族溝通。在魔法師學院的學習過程中，他發現了一個關於龍族滅絕的驚人秘密。",
    lastUpdated: "2025-05-05",
    isNew: false,
    isHot: false,
    isFeatured: true,
    type: "奇幻"
  },
];

export const mockChapters: NovelChapter[] = [
  {
    id: "1-1",
    title: "第一章：神秘的劍客",
    content: "山間霧氣繚繞，一名背負長劍的神秘人影緩步而行。他的步伐輕盈，仿佛與山林融為一體。這位年輕的劍客名叫李沉，出身於江湖中赫赫有名的青雲劍派，卻因為一場陰謀被逐出師門。\n\n如今的他，獨自游走於各大門派之間，尋找著當年真相。山路崎嶇，李沉順著小徑來到了一座古老的村莊——霧隱村。這裡常年被濃霧籠罩，據說隱藏著不少武林秘辛。\n\n「客官，獨自上山可要小心啊。」村口的老者提醒道，「最近山上出現了不少怪事。」\n\n李沉微微一笑，拱手致謝：「多謝提醒，老丈。不知可有客棧借宿？」\n\n「往前走，有家醉仙樓，是這附近最好的客棧了。」老者指了指前方。\n\n李沉點頭致謝，朝醉仙樓走去。就在此時，遠處傳來一陣打斗聲，李沉眉頭一皺，手按劍柄，迅速朝聲音來源處奔去...",
    publishDate: "2025-04-01",
    views: 45628
  },
  {
    id: "1-2",
    title: "第二章：醉仙樓風波",
    content: "醉仙樓內，觥籌交錯，熙熙攘攘的人群中，各種江湖傳言此起彼伏。\n\n李沉坐在角落，靜靜地品著一杯清酒，耳朵卻敏銳地捕捉著周圍的對話。最近，關於一把傳說中的神劍「天衛」的消息格外引人注目。據說，誰能得到這把劍，誰就能成為武林至尊。\n\n「聽說青雲劍派的掌門已經派出多名高手尋找天衛劍了。」一位豪客喝得滿臉通紅，大聲說道。\n\n李沉的手微微一顫，青雲劍派——那個曾視為家的地方，如今卻是他最不願提及的痛。\n\n就在此時，門外傳來一陣喧嘩，一群黑衣人魚貫而入，為首的是一位面色陰冷的中年男子。\n\n「聽說有人在尋找天衛劍？」中年人環顧四周，目光最終落在了李沉身上，「哦？這不是青雲劍派被逐出的叛徒李沉嗎？」\n\n整個酒樓瞬間安靜下來，所有人的目光都聚焦在了李沉身上。李沉緩緩放下酒杯，站起身來，「葉師兄，好久不見。」\n\n「別叫我師兄，叛徒！」葉霜劍眼中閃過一絲寒光，「師父已經下令，見你即殺！」\n\n話音未落，葉霜劍已經拔劍而出，直刺李沉咽喉！",
    publishDate: "2025-04-05",
    views: 42156
  },
];
