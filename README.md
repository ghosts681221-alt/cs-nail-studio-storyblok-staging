# CS Nail Studio Storyblok Static Staging

這是與正式 Manus 全端專案分離的靜態驗收前台。它不包含登入、CMS 管理介面、預約連結或任何管理權杖。靜態頁面只能在建置期間透過 Storyblok Delivery API 讀取 `home` 的 **已發布**內容，因此 Draft 不會被帶到 GitHub Pages。

## 本機檢查

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

預設範例會產生不含未發布內容的空狀態頁。要改為最新已發布內容，需先以環境變數提供 Storyblok 的 **Delivery token**，再執行：

```bash
STORYBLOK_DELIVERY_TOKEN="…" pnpm fetch:storyblok
pnpm build
```

> 請只使用 Delivery token。不得將 Storyblok Management token、GitHub 個人權杖或其他秘密寫入程式碼、JSON 或瀏覽器端檔案。

## GitHub Pages 手動驗收

在 repository 的 **Settings → Pages** 選擇 **GitHub Actions**，再於 **Settings → Secrets and variables → Actions** 新增 `STORYBLOK_DELIVERY_TOKEN`。首次驗收時，從 **Actions → Deploy Storyblok static staging to GitHub Pages → Run workflow** 手動勾選 `fetch_storyblok`。工作流程僅在此選項為 `true` 時抓取 `version=published`；它不會讀取或發布 Draft。

私人 repository 是否能啟用 GitHub Pages 取決於帳號方案。若帳號不支援私人 repository 的 Pages，可保留原始碼為私有並改由具權限的帳號方案部署，或另行確認是否要建立不含秘密的公開 staging repository。
