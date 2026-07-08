# iPAS AI 應用規劃師 學習網站

經濟部產業人才能力鑑定（iPAS）「AI 應用規劃師」初級／中級備考網站，以 GitHub Pages 提供靜態頁面。

**線上網址**：<https://alvinlin.github.io/iPAS-AIAP-Exam-Site/>

## 內容

| 目錄 | 內容 |
|---|---|
| `exam/` | 離線模擬考 SPA：600 題歷屆公告試題題庫，含全真模擬、歷屆原卷、快速練習、錯題本、成績紀錄、每題筆記（資料存 localStorage） |
| `materials/` | 依官方學習指引整理的 HTML 教材：初級 2 科＋中級 3 科，各含「完整教材」與「考前重點與試題解析」 |
| `index.html` | 首頁導覽 |

## 版權說明

本站僅收錄自製整理內容。官方學習指引、勘誤表、歷屆試題 PDF **未收錄**（版權屬原權利人），請至 [iPAS 官方學習資源頁面](https://ipd.nat.gov.tw/ipas/certification/AIAP/learning-resources)下載。試題之答案採 iPAS 公告試題，解析為學習整理、非官方標準解析，請以官方公告為準。

## 維護

內容源自私有學習工作區，異動後以工作區內 `tools\sync-public-site.ps1` 同步至本 repo（會自動改寫 `exam/index.html` 的教材路徑與 `materials/index.html` 的資源連結），再 commit、push 即自動部署。
