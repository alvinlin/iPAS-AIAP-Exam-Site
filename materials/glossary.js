/*
 * 專有名詞解釋（glossary.js）— iPAS AI 應用規劃師教材共用腳本
 * 載入後自動掃描 <main> 內文，將辭典中的專有名詞加上虛線底線；
 * 滑鼠懸停、鍵盤 Tab focus 或觸控點按時顯示解釋泡泡。
 * 為避免滿版底線，每個名詞在每一章（h2 分章）只標示第一次出現。
 * 辭典異動只需編輯本檔，所有教材頁自動生效。
 */
(function () {
  'use strict';

  /* ========== 名詞辭典 ==========
   * 每筆為 [顯示名稱, 「別名1|別名2|…」(比對用), 解釋]
   * 英文別名採大小寫敏感比對，且前後不得緊鄰英數字（避免誤中 OpenAI、ChatGPT 等）。 */
  var TERMS = [
    // ―― 人工智慧基礎 ――
    ['人工智慧（Artificial Intelligence, AI）', '人工智慧|Artificial Intelligence|AI', '使機器能模擬人類智慧，執行學習、推理、感知與解決問題等任務的技術總稱。'],
    ['通用人工智慧（AGI）', '通用人工智慧|強人工智慧|AGI', '具備等同人類的廣泛認知能力、能跨領域自主學習與推理的 AI，目前尚未實現；相對於專精單一任務的弱 AI。'],
    ['圖靈測試（Turing Test）', '圖靈測試|Turing Test', '由圖靈提出的智慧判準：若人類無法分辨對話對象是機器或真人，即視為機器展現智慧。'],
    ['專家系統（Expert System）', '專家系統|Expert System', '以規則與知識庫模擬人類專家決策過程的早期 AI 系統，常用於醫療診斷、財務分析等專業領域。'],
    ['機器學習（Machine Learning）', '機器學習|Machine Learning', '讓電腦從資料中自動學習規律並據以預測或決策的方法，毋須針對每項任務逐一撰寫規則。'],
    ['深度學習（Deep Learning）', '深度學習|Deep Learning', '以多層人工神經網路為基礎的機器學習分支，擅長處理影像、語音、文字等非結構化資料。'],
    ['神經網路（Neural Network）', '神經網路|類神經網路|人工神經網路|Neural Network', '模仿生物神經元連結方式的運算模型，由輸入層、隱藏層與輸出層組成，是深度學習的基礎。'],
    ['監督式學習（Supervised Learning）', '監督式學習|Supervised Learning', '使用帶有標籤（正確答案）的資料訓練模型，常見任務為分類與迴歸。'],
    ['非監督式學習（Unsupervised Learning）', '非監督式學習|無監督學習|Unsupervised Learning', '使用無標籤資料讓模型自行發現結構或群集，常見任務為分群、降維與關聯規則。'],
    ['半監督式學習', '半監督式學習|Semi-supervised Learning', '同時利用少量標註資料與大量未標註資料訓練，可大幅降低人工標註成本。'],
    ['強化學習（Reinforcement Learning）', '強化學習|Reinforcement Learning', '代理人透過與環境互動、依獎勵訊號不斷調整策略的學習方式，常用於遊戲對弈與機器人控制。'],
    ['自監督學習（Self-supervised Learning）', '自監督學習|Self-supervised Learning', '從資料本身自動產生監督訊號（如遮蔽部分內容再預測），是大型語言模型預訓練的核心方法。'],
    ['GPU（圖形處理器）', 'GPU|圖形處理器', '擅長大規模平行運算的處理器，是深度學習訓練與推論的主要硬體。'],
    ['TensorFlow', 'TensorFlow', 'Google 開源的深度學習框架，支援訓練到部署的完整流程，常搭配 Keras 高階 API。'],
    ['PyTorch', 'PyTorch', 'Meta 開源的深度學習框架，以動態運算圖與易用性著稱，廣受研究與業界採用。'],
    ['基因演算法（Genetic Algorithm）', '基因演算法|遺傳演算法|Genetic Algorithm', '模擬生物演化（選擇、交配、突變）逐代尋找較佳解的啟發式最佳化演算法。'],

    // ―― 資料與大數據 ――
    ['結構化資料', '結構化資料', '以固定欄位、表格形式儲存的資料（如資料庫、試算表），易於查詢與統計分析。'],
    ['非結構化資料', '非結構化資料', '無固定格式的資料，如文字、影像、語音、影片；約占企業資料八成以上，須靠 AI 技術解析。'],
    ['半結構化資料', '半結構化資料', '介於結構化與非結構化之間、含部分組織性標記的資料，如 JSON、XML。'],
    ['ETL', 'ETL', 'Extract-Transform-Load：自來源系統擷取資料、經轉換清理後載入資料倉儲的標準流程。'],
    ['資料清理（Data Cleaning）', '資料清理|資料清洗|Data Cleaning', '處理缺失值、異常值、重複與格式錯誤，以提升資料品質的前置步驟。'],
    ['特徵工程（Feature Engineering）', '特徵工程|Feature Engineering', '從原始資料選取、轉換或建構對模型有用的特徵；特徵品質往往比演算法選擇更影響成效。'],
    ['資料標註（Data Labeling）', '資料標註|資料標記|Data Labeling', '為資料加上正確答案（標籤）供監督式學習使用，例如框出影像中的物件、標記文句情感。'],
    ['探索式資料分析（EDA）', '探索式資料分析|EDA', '不預設假設，以統計摘要與視覺化初步探索資料特性、發現模式與異常值。'],
    ['驗證式資料分析（CDA）', '驗證式資料分析|CDA', '以假設檢定等統計推論方法，驗證事先提出的假設是否成立。'],
    ['資料倉儲（Data Warehouse）', '資料倉儲|Data Warehouse', '整合多個來源、經清理轉換的集中式分析型資料庫，支援企業決策分析（OLAP）。'],
    ['資料湖（Data Lake）', '資料湖|Data Lake', '以原始格式存放大量結構化與非結構化資料的儲存庫，讀取時才定義結構（Schema-on-Read）。'],
    ['NoSQL', 'NoSQL', '非關聯式資料庫總稱，支援彈性資料模型與水平擴展，如文件型、鍵值型、欄族型與圖形資料庫。'],
    ['SQL', 'SQL', '結構化查詢語言，用於關聯式資料庫的查詢、新增、更新與刪除操作。'],
    ['大數據（Big Data）', '大數據|巨量資料|Big Data', '具大量（Volume）、高速（Velocity）、多樣（Variety）等特性，超出傳統工具處理能力的資料集。'],
    ['Hadoop', 'Hadoop', '開源大數據分散式框架，核心為 HDFS 分散式檔案系統與 MapReduce 運算模型。'],
    ['Spark', 'Spark', '以記憶體內運算著稱的大數據處理引擎，速度遠快於 MapReduce，支援批次、串流與機器學習。'],
    ['MapReduce', 'MapReduce', '將大規模運算拆為 Map（映射）與 Reduce（歸約）兩階段、在叢集上平行執行的分散式運算模型。'],
    ['Kafka', 'Kafka', '分散式訊息串流平台，以發布／訂閱模式高吞吐量地傳遞即時資料。'],
    ['資料探勘（Data Mining）', '資料探勘|Data Mining', '從大量資料中發掘隱含且有價值的模式與知識，如關聯規則、分群、異常偵測。'],
    ['關聯規則（Association Rule）', '關聯規則|購物籃分析|Apriori', '找出項目間共同出現關係的方法（如購物籃分析），以支持度、信賴度、提升度衡量規則強度。'],
    ['資料視覺化', '資料視覺化|Data Visualization', '以圖表呈現資料特徵與趨勢，幫助理解、發現洞察並與利害關係人溝通。'],
    ['串流處理（Stream Processing）', '串流處理|Stream Processing', '資料一到達即近乎即時處理的模式，適用於即時監控、詐欺偵測、動態推薦。'],
    ['批次處理（Batch Processing）', '批次處理|Batch Processing', '將累積一段時間的資料一次性處理，適合大量、對即時性要求低的工作。'],
    ['資料治理（Data Governance）', '資料治理|Data Governance', '確保資料品質、安全與合規使用的管理制度，涵蓋權責分工、標準與資料生命週期管理。'],
    ['時間序列（Time Series）', '時間序列|Time Series', '按時間先後排列的資料序列；分析方法如 ARIMA、LSTM，用於預測趨勢與季節性。'],
    ['知識圖譜（Knowledge Graph）', '知識圖譜|Knowledge Graph', '以節點（實體）與邊（關係）表示知識的圖形結構，支援語意搜尋與推理。'],
    ['A/B 測試', 'A/B測試|A/B 測試|AB測試', '將使用者隨機分組、比較不同版本成效的線上實驗方法，以資料驗證決策。'],

    // ―― 統計 ――
    ['標準差（Standard Deviation）', '標準差|Standard Deviation', '衡量資料離散程度的指標，為變異數的平方根；數值越大代表資料越分散。'],
    ['常態分布（Normal Distribution）', '常態分布|常態分配|Normal Distribution', '呈鐘形、左右對稱的機率分布，平均數＝中位數＝眾數；許多統計方法以其為前提。'],
    ['假設檢定（Hypothesis Testing)', '假設檢定|Hypothesis Testing', '以樣本資料檢驗對母體之假設是否成立的統計程序，涉及虛無假設、對立假設與顯著水準。'],
    ['p 值（p-value）', 'p值|P值|p-value', '虛無假設為真時，觀察到目前或更極端結果的機率；小於顯著水準（如 0.05）即拒絕虛無假設。'],
    ['信賴區間（Confidence Interval）', '信賴區間|Confidence Interval', '以樣本估計母體參數時，在指定信心水準（如 95%）下涵蓋真值的區間範圍。'],
    ['相關係數（Correlation Coefficient）', '相關係數|Correlation', '衡量兩變數線性關係強弱與方向的統計量，介於 −1 至 1；注意相關不等於因果。'],
    ['貝氏定理（Bayes’ Theorem）', '貝氏定理|Bayes', '由先驗機率與新證據更新得到後驗機率的公式，是單純貝氏分類器與貝氏推論的基礎。'],

    // ―― 機器學習模型與評估 ――
    ['迴歸分析（Regression）', '迴歸分析|迴歸|Regression', '建立特徵與連續目標值關係以進行預測的監督式方法，如房價、銷售量預測。'],
    ['線性迴歸（Linear Regression）', '線性迴歸|Linear Regression', '以線性方程式擬合特徵與連續目標關係的基本迴歸模型，常以最小平方法求解。'],
    ['邏輯斯迴歸（Logistic Regression）', '邏輯斯迴歸|邏輯迴歸|羅吉斯迴歸|Logistic Regression', '名為迴歸、實為分類方法：以 Sigmoid 函數輸出屬於某類別的機率。'],
    ['分類演算法（Classification）', '分類演算法|Classification', '預測離散類別標籤的監督式任務，如垃圾郵件判別、疾病診斷、信用評等。'],
    ['分群（Clustering）', '分群|聚類|Clustering', '將相似資料自動歸為同組的非監督式任務，如客戶分群、文件主題分組。'],
    ['降維（Dimensionality Reduction）', '降維|維度縮減|Dimensionality Reduction', '在保留主要資訊下減少特徵數量，可對抗維度災難並利於視覺化。'],
    ['主成分分析（PCA）', '主成分分析|PCA', '將高維資料投影至變異量最大且彼此正交之主成分的線性降維方法。'],
    ['決策樹（Decision Tree）', '決策樹|Decision Tree', '以樹狀結構依特徵條件逐層分割資料的模型，規則直觀易解釋，但單棵樹容易過擬合。'],
    ['隨機森林（Random Forest）', '隨機森林|Random Forest', '由多棵決策樹投票或平均而成的 Bagging 集成模型，可有效降低過擬合。'],
    ['支援向量機（SVM）', '支援向量機|SVM', '尋找使類別間隔最大化之決策超平面的分類方法，可透過核技巧處理非線性問題。'],
    ['K-近鄰（KNN）', 'K-近鄰|K近鄰|KNN', '依最接近的 K 個鄰居多數決（或平均）進行預測的簡單方法，屬於惰性學習。'],
    ['K-means（K-平均）', 'K-means|K-平均|K平均', '指定群數 K 後反覆更新群中心並重新分配資料點的經典分群演算法。'],
    ['單純貝氏（Naive Bayes）', '單純貝氏|樸素貝氏|Naive Bayes', '基於貝氏定理並假設特徵條件獨立的分類器，計算快速，常用於文字分類。'],
    ['集成學習（Ensemble Learning）', '集成學習|Ensemble', '結合多個模型的預測以獲得優於單一模型效能的方法，如 Bagging、Boosting、Stacking。'],
    ['Bagging', 'Bagging', '以自助抽樣產生多份訓練子集、平行訓練多個模型再彙總結果，主要用於降低變異。'],
    ['Boosting', 'Boosting', '依序訓練一系列弱模型、每輪聚焦修正前一輪的錯誤，逐步提升整體效能。'],
    ['XGBoost（梯度提升）', 'XGBoost|梯度提升|Gradient Boosting', '高效的梯度提升決策樹方法，內建正則化與平行運算，是結構化資料的常勝模型。'],
    ['過擬合（Overfitting）', '過擬合|過度擬合|Overfitting', '模型過度記憶訓練資料（含雜訊），訓練集表現佳但對新資料泛化能力差。'],
    ['欠擬合（Underfitting）', '欠擬合|Underfitting', '模型太簡單而無法捕捉資料規律，導致訓練與測試表現皆不佳。'],
    ['泛化能力（Generalization）', '泛化能力|泛化|Generalization', '模型對未見過資料仍能準確預測的能力，是機器學習追求的核心目標。'],
    ['交叉驗證（Cross-Validation）', '交叉驗證|Cross-Validation', '將資料分成 K 折、輪流作為驗證集的評估方式，比單次切分更可靠。'],
    ['混淆矩陣（Confusion Matrix）', '混淆矩陣|Confusion Matrix', '以 TP、FP、TN、FN 彙整分類結果的表格，是計算各項評估指標的基礎。'],
    ['準確率（Accuracy）', '準確率|Accuracy', '預測正確樣本占全部樣本的比例；在類別不平衡時可能嚴重誤導。'],
    ['精確率（Precision）', '精確率|Precision', '被預測為正類的樣本中實際為正類的比例，重視「不誤報」。'],
    ['召回率（Recall）', '召回率|查全率|Recall', '實際為正類的樣本中被成功找出的比例，重視「不漏報」。'],
    ['F1 分數（F1-score）', 'F1-score|F1 Score|F1分數|F1', '精確率與召回率的調和平均數，用於在兩者間取得平衡的綜合指標。'],
    ['ROC 曲線', 'ROC曲線|ROC', '描繪不同閾值下真陽性率對偽陽性率變化的曲線，評估分類器整體判別能力。'],
    ['AUC', 'AUC', 'ROC 曲線下面積，越接近 1 判別能力越好；0.5 等同隨機猜測。'],
    ['損失函數（Loss Function）', '損失函數|Loss Function', '衡量模型預測與真實值差距的函數，訓練即在最小化損失，如 MSE、交叉熵。'],
    ['梯度下降（Gradient Descent）', '梯度下降|Gradient Descent', '沿損失函數梯度反方向逐步更新參數以逼近最小值的最佳化演算法。'],
    ['學習率（Learning Rate）', '學習率|Learning Rate', '每次參數更新的步伐大小：太大不易收斂、太小訓練緩慢，是關鍵超參數。'],
    ['反向傳播（Backpropagation）', '反向傳播|Backpropagation', '由輸出層往回逐層計算梯度並更新權重的神經網路訓練演算法。'],
    ['激活函數（Activation Function）', '激活函數|活化函數|啟動函數|Activation Function', '為神經網路引入非線性的函數（如 ReLU、Sigmoid、Tanh），使其能學習複雜關係。'],
    ['超參數（Hyperparameter）', '超參數|Hyperparameter', '訓練前由人工設定、而非從資料學得的參數（如學習率、層數、K 值），常以網格搜尋調校。'],
    ['正則化（Regularization）', '正則化|Regularization', '在損失中加入懲罰項（L1、L2）或以 Dropout 等手段限制模型複雜度、抑制過擬合。'],
    ['Dropout', 'Dropout', '訓練時隨機停用部分神經元，迫使網路不依賴特定節點，是常用的防過擬合技巧。'],
    ['批次正規化（Batch Normalization）', '批次正規化|Batch Normalization', '對每層輸入做標準化，以穩定並加速深度網路訓練。'],
    ['特徵縮放（Feature Scaling）', '特徵縮放|歸一化|Min-Max', '將各特徵調整到相近尺度（如 Z-score 標準化、Min-Max 縮放），避免大尺度特徵主導模型。'],
    ['資料增強（Data Augmentation）', '資料增強|Data Augmentation', '以旋轉、裁切、加噪、同義改寫等方式擴增訓練資料，提升模型泛化能力。'],
    ['異常偵測（Anomaly Detection）', '異常偵測|Anomaly Detection', '找出與多數資料模式顯著不同之樣本的技術，應用於詐欺偵測、設備故障預警。'],
    ['推薦系統（Recommender System）', '推薦系統|協同過濾', '依用戶偏好與行為預測其感興趣項目的系統，常用協同過濾與內容式推薦方法。'],

    // ―― 深度學習架構 ――
    ['卷積神經網路（CNN）', '卷積神經網路|CNN', '以卷積層萃取局部特徵、池化層縮減尺寸的網路架構，是影像辨識的主力。'],
    ['池化（Pooling）', '池化|Pooling', '對特徵圖區域取最大值或平均值以縮小尺寸，保留重要特徵並提升平移不變性。'],
    ['循環神經網路（RNN）', '循環神經網路|遞迴神經網路|RNN', '具循環連結、能記憶先前輸入的網路，適合序列資料，但有梯度消失問題。'],
    ['長短期記憶網路（LSTM）', 'LSTM|長短期記憶', '改良 RNN 的長短期記憶網路，以輸入、遺忘、輸出三閘門控制記憶流動，緩解梯度消失。'],
    ['梯度消失（Vanishing Gradient）', '梯度消失', '深層網路反向傳播時梯度逐層縮小、前層幾乎無法更新的問題；可用 ReLU、殘差連結、LSTM 緩解。'],
    ['Transformer', 'Transformer', '完全基於自注意力機制的架構，可平行處理序列並捕捉長距離依賴，是大型語言模型的基礎。'],
    ['注意力機制（Attention）', '注意力機制|自注意力|Self-Attention|Attention', '讓模型處理每個元素時，動態聚焦於輸入中最相關部分的機制。'],
    ['BERT', 'BERT', 'Google 提出的雙向 Transformer 編碼器預訓練模型，擅長文本理解類任務（分類、問答、擷取）。'],
    ['GPT', 'GPT', '生成式預訓練 Transformer（解碼器架構），以自迴歸方式逐一生成文字，是 ChatGPT 的基礎。'],
    ['遷移學習（Transfer Learning）', '遷移學習|Transfer Learning', '將預訓練模型學到的知識移轉到新任務，僅需少量資料微調即可獲得良好效果。'],
    ['生成對抗網路（GAN）', '生成對抗網路|GAN', '由生成器與判別器相互對抗訓練的生成模型，可產生高度逼真的影像。'],
    ['變分自編碼器（VAE）', '變分自編碼器|VAE', '將輸入編碼為機率分布再解碼重建的生成模型，可學習資料的潛在空間。'],
    ['自編碼器（Autoencoder）', '自編碼器|Autoencoder', '以「編碼—壓縮—解碼」重建輸入的神經網路，用於降維、去噪與異常偵測。'],
    ['擴散模型（Diffusion Model）', '擴散模型|Diffusion Model', '先逐步加噪、再學習逆向去噪以生成內容的模型，是 Stable Diffusion 等圖像生成工具的核心。'],
    ['電腦視覺（Computer Vision）', '電腦視覺|Computer Vision', '讓機器理解影像與影片內容的技術領域，涵蓋影像分類、物件偵測、影像分割等。'],
    ['物件偵測（Object Detection）', '物件偵測|Object Detection', '同時判斷影像中物體類別並以邊界框定位位置的任務，代表模型如 YOLO、Faster R-CNN。'],
    ['YOLO', 'YOLO', '單階段即時物件偵測模型，一次前向傳播同時輸出所有物體的位置與類別，速度快。'],
    ['影像分割（Image Segmentation）', '影像分割|語意分割', '對影像逐像素分類的任務：語意分割區分類別，實例分割進一步區分個體。'],
    ['自然語言處理（NLP）', '自然語言處理|NLP', '讓電腦理解、分析與生成人類語言的技術，涵蓋翻譯、摘要、情感分析、問答等。'],
    ['語音辨識（Speech Recognition）', '語音辨識|Speech Recognition', '將語音訊號轉為文字（STT）的技術，應用於語音助理、會議逐字稿、字幕生成。'],
    ['光學字元辨識（OCR）', '光學字元辨識|OCR', '從影像中辨識並擷取文字的技術，如掃描文件數位化、車牌與發票辨識。'],
    ['馬可夫決策過程（MDP）', '馬可夫決策過程|MDP', '以狀態、行動、轉移機率與獎勵描述序列決策問題的數學框架，是強化學習的理論基礎。'],
    ['Q-learning', 'Q-learning|Q學習', '不需環境模型、透過更新狀態–行動價值（Q 值）學習最佳策略的強化學習演算法。'],

    // ―― 生成式 AI ――
    ['生成式 AI（Generative AI）', '生成式 AI|生成式AI|Generative AI', '能根據輸入生成全新內容（文字、圖像、音訊、影片、程式碼）的 AI，代表如 ChatGPT、Stable Diffusion。'],
    ['鑑別式 AI（Discriminative AI）', '鑑別式 AI|鑑別式AI|Discriminative AI', '學習類別間決策邊界以進行分類或預測的 AI，如影像辨識、垃圾郵件過濾、信用評分。'],
    ['大型語言模型（LLM）', '大型語言模型|LLM', '以海量文本預訓練、參數規模龐大的語言模型，具備理解、生成與少樣本學習能力。'],
    ['提示詞（Prompt）', '提示詞|Prompt|prompt', '使用者輸入給生成式 AI 的指令、問題或情境描述；提示品質直接影響輸出結果。'],
    ['提示工程（Prompt Engineering）', '提示工程|Prompt Engineering', '設計與優化提示詞以引導模型產生預期輸出的技巧，如指定角色、提供範例、要求格式。'],
    ['零樣本學習（Zero-shot）', '零樣本|Zero-shot', '不提供任何範例、僅以指令讓模型直接完成任務的提示方式。'],
    ['少樣本學習（Few-shot）', '少樣本|Few-shot', '在提示中提供少量示範例子讓模型模仿，通常比零樣本效果更佳。'],
    ['思維鏈（Chain-of-Thought, CoT）', '思維鏈|Chain-of-Thought|CoT', '引導模型先逐步寫出推理過程再給答案的提示技巧，可顯著提升複雜推理的正確率。'],
    ['檢索增強生成（RAG）', '檢索增強生成|RAG', '先從外部知識庫檢索相關內容再交給模型生成答案的架構，可降低幻覺、引入最新與私有資訊。'],
    ['微調（Fine-tuning）', '微調|Fine-tuning', '在預訓練模型上以特定領域或任務資料續訓，使其行為與知識更貼合需求。'],
    ['預訓練（Pre-training）', '預訓練|Pre-training', '先在大規模通用資料上訓練模型取得基礎能力，之後再微調或直接應用於下游任務。'],
    ['RLHF（人類回饋強化學習）', 'RLHF|人類回饋強化學習', '以人類偏好訓練獎勵模型、再據以強化學習調整語言模型，使輸出更符合人類期望與價值。'],
    ['監督式微調（SFT）', '監督式微調|SFT', '以人工整理的「指令—回應」範例對預訓練模型微調，使其學會遵循指令。'],
    ['Token', 'Token|token', '語言模型處理文字的最小單位（字、詞或子詞）；輸入輸出長度限制與計費多以 token 計。'],
    ['幻覺（Hallucination）', '幻覺|Hallucination', '生成式 AI 產出看似合理但與事實不符內容的現象；可透過 RAG、查證與要求引用來源緩解。'],
    ['多模態（Multimodal）', '多模態|Multimodal', '能同時處理或生成文字、影像、語音等多種型態資料的模型能力。'],
    ['嵌入向量（Embedding）', '嵌入向量|詞嵌入|Embedding', '將文字等資料轉為保留語意關係的數值向量；語意相近者，向量距離也相近。'],
    ['向量資料庫（Vector Database）', '向量資料庫|Vector Database', '儲存嵌入向量並支援高效相似度搜尋的資料庫，是 RAG 檢索環節的常用元件。'],
    ['AI 代理（AI Agent）', 'AI代理|AI 代理|AI Agent|智慧代理', '能感知環境、自主規劃並呼叫工具執行多步驟任務的 AI 系統。'],
    ['AIGC', 'AIGC', 'AI Generated Content：由 AI 生成之內容的總稱，涵蓋文字、圖像、音樂、影片等。'],
    ['溫度參數（Temperature）', '溫度參數|Temperature', '控制生成隨機性的參數：值越低輸出越穩定保守，越高越多樣、越有創意。'],
    ['深度偽造（Deepfake）', '深度偽造|深偽|Deepfake', '以深度學習合成擬真人臉、聲音的技術，帶來詐騙、假訊息與名譽侵害風險。'],

    // ―― 治理、法規與導入規劃 ――
    ['AI 治理', 'AI治理|AI 治理', '確保 AI 開發與應用符合透明、問責、公平、隱私與安全原則的制度與管理框架。'],
    ['演算法偏見（Algorithmic Bias）', '演算法偏見|AI偏見', '因訓練資料或設計不當，使 AI 對特定族群產生系統性不公平結果的現象。'],
    ['可解釋 AI（XAI）', '可解釋AI|可解釋 AI|XAI', '讓人類能理解模型決策依據的方法（如 LIME、SHAP），提升信任、除錯與問責能力。'],
    ['個人資料保護法（個資法）', '個人資料保護法|個資法', '臺灣規範個人資料蒐集、處理與利用的法律，要求明確告知目的並取得當事人同意。'],
    ['GDPR', 'GDPR', '歐盟《一般資料保護規則》，賦予當事人近用、更正、刪除（被遺忘權）與可攜等權利，違者重罰。'],
    ['差分隱私（Differential Privacy）', '差分隱私|Differential Privacy', '在統計結果中加入雜訊，使外界無法辨識任何個人是否在資料集中的隱私保護技術。'],
    ['聯邦學習（Federated Learning）', '聯邦學習|Federated Learning', '資料留在本地、只交換模型參數更新的分散式訓練方式，兼顧模型效能與資料隱私。'],
    ['去識別化', '去識別化|匿名化', '移除或轉換可識別個人身分的欄位，使資料無法連結到特定個人。'],
    ['概念驗證（PoC）', '概念驗證|PoC', '在小範圍快速驗證技術可行性與商業價值的前導專案，成功後再逐步擴大導入。'],
    ['MLOps', 'MLOps', '結合機器學習與 DevOps 的實務，涵蓋模型開發、部署、監控與再訓練的自動化生命週期管理。'],
    ['CRISP-DM', 'CRISP-DM', '跨產業資料探勘標準流程：商業理解→資料理解→資料準備→建模→評估→部署，六階段可反覆迭代。'],
    ['模型部署（Model Deployment）', '模型部署|Deployment', '將訓練完成的模型整合至正式環境提供服務，形式包含 API、批次排程或邊緣裝置。'],
    ['模型漂移（Model Drift）', '模型漂移|資料漂移|概念漂移', '上線後因資料分布隨時間改變導致模型效能衰退的現象，需持續監控並適時再訓練。'],
    ['邊緣運算（Edge Computing）', '邊緣運算|Edge Computing', '在靠近資料來源的裝置端就地運算，可降低延遲、節省頻寬並減少對雲端依賴。'],
    ['雲端運算（Cloud Computing）', '雲端運算|Cloud Computing', '透過網路隨需取用運算與儲存資源的服務模式，常見層級為 IaaS、PaaS、SaaS。'],
    ['API（應用程式介面）', 'API', '應用程式介面：系統間互相呼叫功能與交換資料的標準化介面。'],
    ['投資報酬率（ROI）', '投資報酬率|ROI', '評估專案效益的指標：（收益 − 成本）÷ 成本；AI 導入決策的重要依據。'],
    ['數位轉型（Digital Transformation）', '數位轉型|Digital Transformation', '運用數位科技全面改變企業營運模式、流程與顧客價值的過程；AI 導入常是關鍵環節。']
  ];

  /* ========== 建立比對索引 ========== */
  var aliasIndex = Object.create(null);
  var aliases = [];
  TERMS.forEach(function (t, i) {
    t[1].split('|').forEach(function (a) {
      a = a.trim();
      if (a && aliasIndex[a] === undefined) { aliasIndex[a] = i; aliases.push(a); }
    });
  });
  aliases.sort(function (a, b) { return b.length - a.length; }); // 長詞優先
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&'); }
  var termRe = new RegExp(aliases.map(escRe).join('|'), 'g');
  var ALNUM = /[A-Za-z0-9]/;

  /* ========== 掃描內文並包上 .gl ==========
   * 跳過：連結、程式碼、標題、表頭、導覽、頁首尾、題號/答案標籤與已定義的 .term 名詞。
   * 遇到 h2（分章標題）重設「本章已標示」集合。 */
  var SKIP_TAG = { A: 1, CODE: 1, PRE: 1, SCRIPT: 1, STYLE: 1, H1: 1, H2: 1, H3: 1, H4: 1, TH: 1, NAV: 1, HEADER: 1, FOOTER: 1, BUTTON: 1, INPUT: 1, SELECT: 1, TEXTAREA: 1 };
  var SKIP_CLS = ['tag', 'term', 'ans', 'qno', 'gl'];

  function collect(root) {
    var items = [];
    (function walk(node) {
      if (node.nodeType === 1) {
        if (node.tagName === 'H2') { items.push({ reset: true }); return; }
        if (SKIP_TAG[node.tagName]) return;
        for (var k = 0; k < SKIP_CLS.length; k++) {
          if (node.classList.contains(SKIP_CLS[k])) return;
        }
        for (var c = node.firstChild; c; c = c.nextSibling) walk(c);
      } else if (node.nodeType === 3 && node.nodeValue.trim()) {
        items.push({ node: node });
      }
    })(root);
    return items;
  }

  function annotate() {
    var main = document.querySelector('main') || document.body;
    var items = collect(main);
    var seen = Object.create(null); // 本章已標示的名詞
    items.forEach(function (it) {
      if (it.reset) { seen = Object.create(null); return; }
      var text = it.node.nodeValue;
      termRe.lastIndex = 0;
      var m, last = 0, frag = null;
      while ((m = termRe.exec(text))) {
        var term = m[0], s = m.index, e = s + term.length;
        // 英數字邊界檢查（避免 OpenAI 誤中 AI、ChatGPT 誤中 GPT）
        if (ALNUM.test(term.charAt(0)) && s > 0 && ALNUM.test(text.charAt(s - 1))) continue;
        if (ALNUM.test(term.charAt(term.length - 1)) && e < text.length && ALNUM.test(text.charAt(e))) continue;
        var idx = aliasIndex[term];
        if (idx === undefined || seen[idx]) continue;
        seen[idx] = true;
        if (!frag) frag = document.createDocumentFragment();
        if (s > last) frag.appendChild(document.createTextNode(text.slice(last, s)));
        var sp = document.createElement('span');
        sp.className = 'gl';
        sp.tabIndex = 0;
        sp.setAttribute('data-g', idx);
        sp.setAttribute('aria-label', TERMS[idx][0] + '：' + TERMS[idx][2]);
        sp.textContent = term;
        frag.appendChild(sp);
        last = e;
      }
      if (frag) {
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        it.node.parentNode.replaceChild(frag, it.node);
      }
    });
  }

  /* ========== 提示泡泡 ========== */
  var tip, cur = null, pinned = false;

  function buildTip() {
    tip = document.createElement('div');
    tip.className = 'gl-tip';
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);
  }

  function show(el) {
    var t = TERMS[+el.getAttribute('data-g')];
    if (!t) return;
    tip.innerHTML = '';
    var b = document.createElement('b');
    b.textContent = t[0];
    var d = document.createElement('div');
    d.textContent = t[2];
    tip.appendChild(b);
    tip.appendChild(d);
    tip.classList.add('show');
    cur = el;
    place(el);
  }

  function place(el) {
    var r = el.getBoundingClientRect();
    tip.style.left = '0px';
    tip.style.top = '0px';
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = r.left + r.width / 2 - tw / 2;
    x = Math.max(8, Math.min(x, window.innerWidth - tw - 8));
    var y = r.top - th - 10;
    if (y < 8) y = r.bottom + 10;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }

  function hide() {
    if (tip) tip.classList.remove('show');
    cur = null;
    pinned = false;
  }

  function bindEvents() {
    document.addEventListener('mouseover', function (e) {
      var el = e.target.closest && e.target.closest('.gl');
      if (el) { pinned = false; show(el); }
      else if (cur && !pinned) hide();
    });
    document.addEventListener('focusin', function (e) {
      var el = e.target.closest && e.target.closest('.gl');
      if (el) show(el);
    });
    document.addEventListener('focusout', function (e) {
      if (!pinned && e.target.closest && e.target.closest('.gl')) hide();
    });
    document.addEventListener('click', function (e) { // 觸控裝置：點按切換
      var el = e.target.closest && e.target.closest('.gl');
      if (el) {
        if (cur === el && pinned) { hide(); return; }
        show(el);
        pinned = true;
      } else if (pinned) hide();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hide();
    });
    window.addEventListener('scroll', function () { if (cur) place(cur); }, { passive: true });
    window.addEventListener('resize', function () { if (cur) place(cur); });
  }

  /* ========== 樣式（沿用各頁 --accent 主題色） ========== */
  function injectCss() {
    var css =
      '.gl{text-decoration:underline dotted;text-decoration-color:var(--accent,#0e7c66);text-decoration-thickness:1.5px;text-underline-offset:3px;cursor:help;border-radius:3px;}' +
      '.gl:hover,.gl:focus{background:var(--accent-soft,#e6f4f0);outline:none;}' +
      '.gl-tip{position:fixed;z-index:9999;max-width:340px;background:#243041;color:#f5f7fa;padding:11px 14px;border-radius:9px;font-size:13.5px;line-height:1.65;box-shadow:0 8px 28px rgba(15,23,42,.35);opacity:0;visibility:hidden;transition:opacity .12s ease;pointer-events:none;}' +
      '.gl-tip.show{opacity:1;visibility:visible;}' +
      '.gl-tip b{display:block;font-size:14px;margin-bottom:4px;color:#ffd166;}' +
      '@media print{.gl{text-decoration:none;}.gl-tip{display:none;}}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  function init() {
    injectCss();
    annotate();
    buildTip();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
