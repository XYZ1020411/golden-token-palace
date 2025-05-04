
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Book, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateNovelChapter } from "@/services/novelService";

interface Chapter {
  id: number;
  title: string;
  content: string;
  date: string;
  isToday: boolean;
}

const DailyNovel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [hasReadToday, setHasReadToday] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Novel background and initial setup
  const novelBackground = "末日前1個月，我重生喚醒系統";

  useEffect(() => {
    // Load initial chapters
    const initialChapters: Chapter[] = [
      {
        id: 1,
        title: "第一章：重生之始",
        content: `我猛然驚醒，眼前是熟悉的天花板。難道是夢？不，這感覺太過真實。我起身環顧四周，這是我五年前的大學宿舍。

日曆顯示著2025年4月3日，而我清楚地記得，人類文明將在5月3日迎來毀滅性災難。

一個電子音突然在我腦海中響起：「重生系統已啟動，宿主擁有一個月時間改變末日命運。」

我的心跳加速，一個月，只有一個月的時間。而我擁有未來的記憶和這個神秘的系統。

「系統，你能做什麼？」我在心中默問。

「本系統可提供有限的能力強化及關鍵信息，但一切改變必須由宿主親自執行。」

我深吸一口氣，走向窗戶。窗外，陽光明媚，人們忙碌地穿梭在校園中，全然不知一個月後等待他們的命運。

重生前的記憶浮現在腦海：全球性的能源危機、突然出現的神秘病毒、各國之間的武力衝突，最終導致文明崩潰。

這一切都要從那個被稱為「曙光計劃」的科研項目開始...

我的使命已經明確：在這一個月內，我必須找到並阻止曙光計劃，拯救即將到來的末日。`,
        date: "2025-04-03",
        isToday: false
      },
      {
        id: 2,
        title: "第二章：尋找真相",
        content: `清晨，我打開了舊筆記本電腦，試圖查找任何關於「曙光計劃」的信息。重生前，這個計劃的大部分細節都被嚴格保密，直到一切為時已晚。

「系統，關於曙光計劃，你能提供什麼信息？」

「曙光計劃由國際能源聯盟秘密發起，表面目的是解決能源危機，實際上卻涉及禁忌技術實驗。項目負責人：安德森教授。」

安德森教授...這個名字在末日後赫赫有名，他被認為是災難的主要責任人，但在災難發生前，他只是一位低調的研究員。

我記得他在我所在的大學有過講座。或許...他現在就在學校？

我迅速打開大學網站查看近期活動，果然，三天後物理系將舉辦一場學術研討會，安德森教授是主講人之一。

這是一個接近他的機會。但直接接觸可能會打草驚蛇，我需要更多線索和準備。

「系統，我需要提升我的科學知識，尤其是物理學和能源技術方面。」

「知識強化需要消耗系統點數，目前您有100點。基礎物理學強化需50點，要繼續嗎？」

「確認。」

瞬間，無數物理學知識涌入我的大腦，從最基礎的牛頓定律到複雜的量子理論，清晰而有條理。這將幫助我理解曙光計劃的本質。

強化完成後，我開始計劃。先從圖書館和網絡收集安德森教授的所有公開研究資料，然後設法接觸他的學生或助手，最後才是在研討會上直接接觸。

但時間緊迫，一個月看似很長，實則轉瞬即逝。我必須同時制定備用計劃...万一我無法說服安德森教授停止研究，就必須考慮更激進的手段。

「為了拯救世界，我可以接受成為罪人。」我喃喃自語，內心卻充滿了矛盾和不安。`,
        date: "2025-04-04",
        isToday: false
      },
      {
        id: 3,
        title: "第三章：初次接觸",
        content: `研討會當天，我早早到達會場，選了一個靠前但不太顯眼的位置。四周都是物理系的學生和研究員，我混在其中顯得格格不入。

「放鬆點，你的物理知識已經足夠應對基本交流。」我告誡自己。

安德森教授身材瘦高，灰白的頭髮整齊地梳向后方，標誌性的黑框眼鏡后面是一雙銳利的眼睛。他的演講主題是「新型能源轉換技術的突破與展望」。

聽著他娓娓道來各種專業術語，普通學生或許只覺得這是常規的學術報告，但經過系統強化的我，從中捕捉到了危險信號。

他所描述的能量轉換方式，理論上可行，但實際操作將導致亞空間震盪...這正是末日災難的起因！

演講結束後的問答環節，我舉手提問：「教授，您的理論在亞空間穩定性方面做過測試嗎？按照海森堡不確定原理，能量轉換過程中可能出現無法預測的量子波動。」

全場安靜，安德森教授的目光鎖定在我身上，眼中閃過一絲驚訝。「有意思的問題。你是哪個研究組的？」

「我只是個對物理感興趣的學生。」我微笑著回答，心跳卻加速。

「亞空間穩定性當然在考慮範圍內，但理論模型表明風險極低。」他回答，然後迅速轉向下一個問題。

演講結束後，我刻意在走廊上遇到了安德森教授，假裝偶遇。「教授，您的演講太精彩了。我有一些額外的問題想請教，可以占用您一點時間嗎？」

他審視著我，似乎在評估我的意圖。「你叫什麼名字？」

「李明，計算機系的學生，但對物理很感興趣。」

「好吧，李明，跟我來辦公室談吧。」安德森教授意外地同意了。

這是個機會，也是危險的開始。如何在不暴露自己的情況下，說服他放棄研究？我跟隨他走向辦公室，同時在心中盤算著策略。`,
        date: "2025-04-06",
        isToday: false
      },
      {
        id: 4,
        title: "第四章：危險真相",
        content: `安德森教授的辦公室充滿了書籍和紙張，各種計算機顯示著複雜的模型和數據。他示意我坐下，自己則靠在書桌邊。

「你不是普通學生，」他直截了當地說，「你對亞空間穩定性的理解超出了本科生水平。說吧，你到底是誰？」

我決定冒險一試：「教授，如果我說我來自未來，知道曙光計劃最終會導致災難性後果，您會相信嗎？」

他笑了，但眼中沒有溫度。「時間旅行？這是科幻小說的題材。」

「那麼，」我拿出准備好的U盤，「這裡有一些數據和計算結果，展示了在大規模能量轉換過程中可能出現的亞空間撕裂。請看一下，然後再決定是否相信我。」

這些數據是我利用系統強化後的知識和學校超級計算機徹夜計算的結果。安德森教授接過U盤，插入電腦，當數據和模型呈現在屏幕上時，他的表情凝固了。

「這...不可能。我們的模型沒有考慮到這些變量。」他喃喃道。

「因為常規物理學忽略了多維空間互動效應，」我解釋，「但在能量達到臨界點後，這種效應變得顯著。教授，曙光計劃在理論上是完美的，但實際操作將引發災難。」

安德森教授沉默許久，然後抬頭看我：「你說你來自未來？具體說說，曙光計劃會造成什麼後果？」

我描述了末日的景象：全球範圍內的空間撕裂，物質退化，生命消亡。「最初只是局部現象，但很快就擴散全球，無法控制。在我的時間線，人類文明在一個月內崩潰。」

「如果你的計算是正確的，」安德森教授嚴肅地說，「那麼我們確實需要重新評估整個項目。但這需要更多證據和驗證。」

「我們沒有那麼多時間，」我急切地說，「曙光計劃的首次全功率測試定於五月初，對嗎？」

他的眼睛微微睜大：「這是機密信息。你怎麼知道的？」

「因為在我的時間線，那次測試就是終結的開始。」

安德森教授走向窗戶，背對著我。「假設我相信你，我該怎麼做？曙光計劃背後有強大的利益集團和政治力量，不是我一個人能決定終止的。」

「但您是科學負責人，您的意見至關重要。」我站起來，「請您至少推遲測試，直到完成更全面的安全評估。」

他轉身面對我：「我會考慮的。但你要明白，這個決定可能會毀掉我的職業生涯。」

「比起毀掉整個世界，那算不了什麼。」我真誠地回答。

離開辦公室時，我不確定自己是否成功說服了他。但至少，我已經播下了懷疑的種子。接下來，我需要更多盟友，更多證據，以及可能的話...一個阻止測試的備用計劃。`,
        date: "2025-04-08",
        isToday: false
      },
      {
        id: 5,
        title: "第五章：意外援手",
        content: `「系統，我需要找到安德森教授團隊中的關鍵人物。」

「分析中...發現核心成員：莉娜·趙，量子物理專家，負責曙光計劃的能量轉換算法。她對項目存有疑慮，可能成為潛在盟友。」

這是個好消息。根據系統提供的信息，莉娜·趙博士經常在校園咖啡館工作。我決定碰碰運氣。

果然，在文理學院旁的咖啡館，我發現了她。三十出頭的亞裔女性，專注地盯著筆記本電腦。我買了杯咖啡，裝作隨意地在她旁邊的座位坐下。

「Dr. 趙？」我小聲問道，「我是李明，有關曙光計劃，我有些重要事情需要與您討論。」

她警惕地看著我：「我不認識你，也不知道你在說什麼。」

「我知道您負責能量轉換算法，也知道您對項目穩定性有所保留。」我迅速說道，「安德森教授已經看了我提供的數據。您應該也看看。」

我把U盤放在桌上。她沒有立即拿起來，而是皺眉：「你到底是誰？」

「一個知道太多的人，」我苦笑，「或者說，一個試圖阻止災難的人。」

經過一番說服，她終于同意查看數據。當她看到模型結果時，臉色變得蒼白。

「這些數據...如果準確的話，意味著我們的算法存在致命缺陷。」她低聲說。

「不只是算法問題，」我解釋，「是整個理論框架忽略了多維空間互動。在小規模實驗中看不出問題，但全功率測試將觸發不可逆轉的連鎖反應。」

莉娜合上筆記本：「我需要重新運行所有模型，使用你的參數。如果結果一致...」她沒有說完，但我能感受到她的震驚和擔憂。

「時間緊迫，」我提醒她，「測試定於五月初。」

「我知道時間表，」她嘆息，「但即使數據確認風險，說服項目管理層推遲測試也不容易。國際能源危機正在加劇，政治壓力很大。」

「那麼我們需要更有力的證據和更多支持者。」我思考著，「您團隊中還有誰可能會支持我們？」

莉娜考慮了一會兒：「馬庫斯·韋恩，安全協議負責人。他一直主張謹慎行事。」

正當我們討論下一步計劃時，我的手機震動。是一條匿名短信：「知道你在做什麼。想要阻止末日，明天中午，物理系後花園見。」

我把短信給莉娜看，她臉色變得更加凝重。「有人在監視我們？但這信息...似乎是要幫助我們？」

「或者是陷阱，」我謹慎地說，「但我必須冒險一試。」

「我和你一起去，」莉娜堅定地說，「既然我已經卷入其中，就不會置身事外。」

我感到一絲希望。或許，在這場拯救世界的行動中，我並不孤單。`,
        date: "2025-04-10",
        isToday: false
      },
      {
        id: 6,
        title: "第六章：神秘人物",
        content: `物理系後花園，陽光透過樹葉斑駁地灑在地上。我和莉娜提前到達，警惕地觀察四周。

「你認為會是誰？」莉娜低聲問。

「不確定，但希望是朋友而非敵人。」

正午時分，一個穿著深色風衣的男子走近。他大約四十歲，眼神銳利，舉止謹慎。

「李明？」他問道，然後看向莉娜，略顯驚訝，「趙博士也在，有趣。」

「你是誰？」我直接問。

「名字不重要，」他說，「重要的是我們有共同的目標：阻止曙光計劃的災難性後果。」

「你怎麼知道這些？」莉娜質疑。

男子露出神秘的微笑：「讓我們只說，我擁有特殊的信息管道。李明先生不是唯一知道未來的人。」

我震驚地看著他：「你也是...」

「重生者？不完全是。我來自一個監測時間線變化的組織。在多數時間線中，曙光計劃導致了文明崩潰。你的出現創造了改變的可能性，所以我們決定介入。」

莉娜看起來困惑而懷疑：「這聽起來像科幻小說。有什麼證據嗎？」

男子從口袋中取出一個小型裝置：「這是量子場穩定器的原型，可以在小範圍內抵消亞空間撕裂效應。未來技術，在這個時代不可能存在。」

我檢查了設備，以我現有的知識無法解釋其工作原理，但它確實散發著微弱的能量場。

「如果你們真有這種技術，為什麼不直接阻止測試？」我問。

「時間干預有嚴格規則。直接行動可能導致更糟糕的後果。我們只能提供有限協助，主要變化必須由這個時間線的原住民引導。」他看著我們，「也就是你們。」

「那你能提供什麼幫助？」莉娜問。

「情報、技術建議，以及必要時的...特殊資源。」他遞給我一張卡片，上面只有一個加密通訊頻道，「需要時聯繫我。現在，我建議你們專注於兩件事：說服安全委員會推遲測試，以及準備一個技術方案，證明曙光計劃可以在安全範圍內重新設計。」

「安全委員會下周開會，」莉娜說，「但我們需要實質性證據。」

「我已經安排你們進入高級計算實驗室，」神秘男子說，「那裡有足夠的算力運行完整模擬。還有，小心國際能源聯盟的塞巴斯蒂安·霍夫。他在推動項目快速進行，不惜代價。」

「為什麼？」我問。

「政治和經濟原因。能源危機正在加劇全球衝突，霍夫代表的利益集團認為任何延遲都是不可接受的風險。」

離開前，神秘男子最后叮囑：「記住，你們的行動已經改變了時間線。保持警惕，特別是對那些突然對你產生興趣的人。時間到了，我必須離開。」

他迅速消失在人群中，留下我和莉娜思考著這場奇怪的會面和得到的信息。

「你相信他嗎？」莉娜問。

「不完全相信，但他知道太多內幕。而且...」我拿起量子場穩定器，「這個技術確實超前。」

「那麼，」莉娜深呼一口氣，「我們去計算實驗室？」

「是的，」我堅定地說，「是時候準備決定性證據了。」`,
        date: "2025-04-12",
        isToday: false
      },
      {
        id: 7,
        title: "第七章：計劃與背叛",
        content: `高級計算實驗室一整晚的工作後，我們終于完成了全面模擬。結果比我預期的還要糟糕：曙光計劃的能量轉換不僅會引發局部空間撕裂，還會導致次級量子共振，使效應迅速擴散至全球。

「這太可怕了，」莉娜盯著屏幕上的災難性預測，「我們必須立即告知安全委員會和安德森教授。」

「我會整理報告，」我說，「你能聯繫馬庫斯·韋恩嗎？安全協議負責人應該是我們的重要盟友。」

莉娜點頭，離開實驗室打電話。我則開始準備簡報材料，盡可能以簡明易懂的方式展示災難性後果。

半小時後，莉娜臉色蒼白地回來：「馬庫斯同意見面，但...他提到塞巴斯蒂安·霍夫昨天特別詢問了我們的行動。他怎麼會知道？」

「有人在監視我們，」我警惕地說，「可能就在團隊內部。快，把模擬數據備份到加密硬盤，我們必須保護這些證據。」

當我們正在備份時，實驗室大門突然打開。安德森教授走進來，身後跟著一個西裝筆挺的男子——那一定就是塞巴斯蒂安·霍夫。

「李明，趙博士，」安德森教授語氣嚴肅，「請解釋你們未經授權使用高級計算實驗室的行為。」

霍夫冷笑：「更重要的是，解釋為什麼你們在傳播關於曙光計劃的虛假信息，企圖破壞國家級能源安全項目。」

我站起來面對他們：「教授，這不是虛假信息。我們完成了最全面的模擬，證實了我之前的警告。曙光計劃在當前參數下運行會導致災難。」

「荒謬！」霍夫打斷我，「你們的模擬基於錯誤假設和不完整數據。安德森，我要求立即停止這種破壞活動，並對相關人員進行安全調查。」

安德森教授看上去很為難：「李明，我確實檢查了你之前的數據，發現了一些令人擔憂的問題。但霍夫先生的團隊提供了反駁證據，表明那只是極端邊緣案例，實際操作中不會發生。」

「他們錯了！」莉娜激動地說，指向屏幕，「看看這個完整模擬，考慮了所有變量和互動效應。災難風險是確定的！」

安德森教授走近屏幕，認真查看數據。我能看到他眼中的擔憂和動搖。

霍夫卻不為所動：「時間緊迫，安德森。全球能源儲備持續下降，政治局勢日益緊張。我們沒有奢侈在無端恐慌上浪費時間。委員會已經投票通過，測試將按計劃進行。」

「但如果有真實風險...」安德森教授遲疑道。

「風險總是存在的，」霍夫冷硬地說，「但機遇也是。想想看，成功後你將成為解決全球能源危機的英雄。」他轉向我們，「至於你們，立即停止這些未經授權的活動，否則將面臨嚴重後果。」

當他們離開後，莉娜絕望地看著我：「他們不會聽的。霍夫已經控制了決策過程。」

「那麼我們只能尋求外部幫助，」我決定道，「聯繫那個神秘人，同時準備將證據公之於眾。如果官方渠道失效，我們就訴諸公眾輿論。」

「這可能毀掉我們的職業生涯，」莉娜擔憂地說。

「如果不阻止測試，很快就不只是職業生涯的問題了，」我嚴肅地回應，「而是全人類的存亡。」`,
        date: "2025-04-15",
        isToday: false
      },
    ];
    
    // Check if today's chapter already exists
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const todayChapter = initialChapters.find(chapter => chapter.date === formattedToday);
    
    // If today's chapter doesn't exist, we'll mark this as a day where a new chapter can be generated
    setHasReadToday(!!todayChapter);
    setChapters(initialChapters);
  }, []);

  const generateTodayChapter = async () => {
    setIsGenerating(true);
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    try {
      // Get the previous chapter's content for context
      const lastChapter = chapters[chapters.length - 1];
      const previousContent = lastChapter ? lastChapter.content : "";
      
      // Generate new chapter using our AI service
      const response = await generateNovelChapter(chapters.length + 1, previousContent);
      
      if (response.status === 'error') {
        toast({
          title: "生成失敗",
          description: "無法生成今日章節，請稍後再試",
          variant: "destructive",
        });
        return;
      }
      
      // Create a new chapter with the generated content
      const newChapter: Chapter = {
        id: chapters.length + 1,
        title: `第${chapters.length + 1}章：末日倒計時`,
        content: response.content,
        date: formattedToday,
        isToday: true
      };

      // Add the new chapter to our list
      setChapters([...chapters, newChapter]);
      
      // Select the new chapter to read
      setSelectedChapter(newChapter);
      
      // Mark that user has read today's chapter
      setHasReadToday(true);
      
      // Show notification
      toast({
        title: "今日章節已生成",
        description: "新的章節已經添加到您的閱讀列表中。",
      });
    } catch (error) {
      console.error("生成章節時出錯:", error);
      toast({
        title: "生成失敗",
        description: "生成今日章節時發生錯誤，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReadChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
  };

  return (
    <MainLayout showBackButton>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">末日重生小說</h1>
          </div>
          
          {!selectedChapter && !hasReadToday && (
            <Button 
              onClick={generateTodayChapter} 
              className="flex items-center"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? "正在生成..." : "生成今日章節"}
            </Button>
          )}
        </div>

        {selectedChapter ? (
          <Card className="bg-white dark:bg-gray-950">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={handleBackToChapters}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回章節列表
                </Button>
              </div>
              <div className="text-center mt-2">
                <CardTitle>{selectedChapter.title}</CardTitle>
                <CardDescription>發布日期: {selectedChapter.date}</CardDescription>
                {selectedChapter.isToday && <Badge className="mt-2 bg-green-500">今日章節</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh] rounded-md p-4">
                <div className="prose dark:prose-invert max-w-none">
                  {selectedChapter.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-lg leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-white dark:bg-gray-950">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  小說背景
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{novelBackground}</p>
                <p className="mt-4 text-muted-foreground">
                  這是一個關於一名主角在末日前一個月重生，並被神秘系統賦予改變未來的能力的故事。
                  每天您都可以閱讀或生成一個新章節，跟隨主角的冒險旅程。
                </p>
              </CardContent>
            </Card>
            
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">章節列表</h2>
              {chapters.map((chapter) => (
                <Card key={chapter.id} className="bg-white dark:bg-gray-950 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle>{chapter.title}</CardTitle>
                    <CardDescription>發布日期: {chapter.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="line-clamp-2 text-muted-foreground">
                      {chapter.content.substring(0, 150)}...
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full flex justify-between items-center">
                      {chapter.isToday && <Badge className="bg-green-500">今日章節</Badge>}
                      <Button onClick={() => handleReadChapter(chapter)} className="ml-auto">
                        閱讀
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              {!hasReadToday && (
                <Card className="border-dashed border-2 bg-muted/50">
                  <CardHeader>
                    <CardTitle>今日章節尚未生成</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>點擊「生成今日章節」按鈕來繼續故事的發展。</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={generateTodayChapter} 
                      className="w-full"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Calendar className="h-4 w-4 mr-2" />
                      )}
                      {isGenerating ? "正在生成..." : "生成今日章節"}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default DailyNovel;
