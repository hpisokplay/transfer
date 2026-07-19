# 資料傳輸(公司電腦 ↔ 手機)

一個**純網頁 / PWA**的檔案中轉工具。把 Word / PPT / PDF / Excel / 圖片(建議單檔 < 25MB)在公司電腦和手機之間快速傳輸,全程**端對端加密**,GitHub 上只看得到亂碼。

不需要 LINE / IG / TG,也不需要 GitHub Desktop——只要能開網頁、能連 `api.github.com` 就能用。

---

## 運作原理

```
電腦端:選檔 →(瀏覽器內 AES-256 加密)→ 上傳到 GitHub 私人庫
手機端:抓下亂碼 →(瀏覽器內解密)→ 存進手機/相簿
```

- **App 程式碼** 放在公開的 GitHub Pages(就是這幾個檔案)。
- **檔案資料** 放在另一個**私人**儲存庫,經 GitHub API + 個人金鑰(PAT)存取。
- 加密密碼**永遠不離開你的裝置**,連 GitHub 都解不開。

---

## 一次性設定(約 10 分鐘)

### 1. 建立兩個儲存庫

| 儲存庫 | 型態 | 用途 | 建議名稱 |
|--------|------|------|----------|
| App | **Public 公開** | 放本專案檔案、開 Pages | `transfer` |
| 資料 | **Private 私人** | 存加密後的檔案 | `file-transfer-data` |

> 資料庫一定要選 **Private**,不然檔案(雖然是亂碼)會被公開。

### 2. 部署 App 到 GitHub Pages

把本資料夾所有檔案(`index.html`、`manifest.webmanifest`、`sw.js`、`icons/`)上傳到 **App 公開庫**,然後:

`該庫 → Settings → Pages → Source 選 main / (root) → Save`

稍等一兩分鐘,會得到網址,例如:
`https://<你的帳號>.github.io/transfer/`

### 3. 建立 GitHub 金鑰(PAT)

`GitHub → 右上頭像 → Settings → Developer settings → Personal access tokens`

兩種擇一:

- **Fine-grained token(建議)**:Repository access 只選你的**資料私人庫**;Permissions → Repository permissions → **Contents** 設為 **Read and write**。
- **Classic token**:勾選 **repo** 權限即可。

建立後把那串 `github_pat_...` / `ghp_...` 複製起來(只會顯示一次)。

### 4. 在裝置上填設定

用瀏覽器開上面的 Pages 網址,點右上角 **⚙️ 齒輪**,填入:

- **GitHub 帳號**:你的使用者名稱
- **私人儲存庫名稱**:例如 `file-transfer-data`
- **GitHub 存取金鑰**:剛剛的 PAT
- **加密密碼**:自訂一組(**電腦和手機要一模一樣**)

按「**測試連線**」確認成功,再「儲存設定」。

**手機**同樣開這個網址、填**相同的**帳號/庫/金鑰/密碼即可。iPhone 用 Safari「分享 → 加入主畫面」,Android 用 Chrome「加到主畫面」,就變成獨立 App。

---

## 日常使用

- **傳出(電腦→手機)**:電腦上拖曳或點選檔案 → 自動加密上傳 → 手機開 App 按🔄重新整理 → 點 ⬇️ 下載(自動解密)。
- **傳回(手機→電腦)**:手機上傳,電腦重新整理後下載。
- **分類**:底部 6 個頁籤(最近 / 圖片 / Word / PPT / PDF / Excel)依副檔名自動歸位。
- **刪除**:每個檔案有 🗑️;設定裡可開「下載後自動刪除」。

---

## 注意事項

- **加密密碼請自己記牢**。忘記的話,雲端上的舊檔就解不開了(重設密碼、重新傳一次即可)。
- 檔案建議 < 25MB;過大可能上傳失敗。
- git 會保留歷史,長期下來私人庫會慢慢變大。若過大,直接刪掉整個資料私人庫、重建一個同名的即可(App 設定不用改)。
- ⚠️ **請自行確認**把公司/客戶檔案傳到 GitHub 是否符合公司資安規定——「網路沒擋」不代表「政策允許」。加密已大幅降低外洩風險,但決定權在你。

---

## 檔案結構

```
index.html              整個 App(介面 + 加密 + GitHub API)
manifest.webmanifest    PWA 設定
sw.js                   Service Worker(離線外殼、可安裝)
icons/                  App 圖示
docs/specs/             設計規格文件
```
