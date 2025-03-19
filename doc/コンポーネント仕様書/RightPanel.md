# RightPanel コンポーネント仕様書

## 概要

メインコンテンツ領域を担当するコンポーネントです。
パンくずリストによるナビゲーション、フォルダ内容の表示、ローディング状態やエラー表示を管理します。

## Props

```typescript
interface RightPanelProps {
  currentPath: string;
  items: FolderItem[];
  isLoading: boolean;
  errorMessage: string | null;
  onItemClick: (item: FolderItem) => void;
  onPathClick: (path: string) => void;
}
```

## レンダリング

```tsx
<div className={styles.rightPanel}>
  {/* パスバー */}
  {currentPath && (
    <div className={styles.pathBar}>
      <span className={styles.pathLabel}>現在のパス:</span>
      <div className={styles.pathParts}>
        {renderPathParts(currentPath)}
      </div>
    </div>
  )}
  
  {/* コンテンツ領域 */}
  <div className={styles.content}>
    {isLoading ? (
      <div className={styles.loading}>読み込み中...</div>
    ) : errorMessage ? (
      <div className={styles.error}>{errorMessage}</div>
    ) : (
      <FolderCardGrid items={items} onItemClick={onItemClick} />
    )}
  </div>
</div>
```

## パス解析とナビゲーション

### パス分解ロジック
```typescript
const renderPathParts = (path: string) => {
  if (!path) return null;

  // パスを'/'で分割
  const parts = path.split('/');
  
  return parts.map((part, index) => {
    // IBFSとWFCは非リンク
    if (index <= 1) {
      return <span key={index}>{part}{index < parts.length - 1 ? '/' : ''}</span>;
    }
    
    // 最後のパーツは非リンク
    if (index === parts.length - 1) {
      return <span key={index}>{part}</span>;
    }

    // 中間のパーツはクリック可能なリンク
    const currentPartPath = parts.slice(0, index + 1).join('/');
    return (
      <span key={index}>
        <button
          className={styles.pathLink}
          onClick={() => onPathClick(currentPartPath)}
        >
          {part}
        </button>
        /
      </span>
    );
  });
};
```

## スタイリング

### CSSモジュール定義
```css
.rightPanel {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.pathBar {
  background-color: white;
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pathParts {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  font-family: monospace;
}

.pathLink {
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
}

.content {
  flex: 1;
}
```

## 状態管理

### ローディング状態
- isLoadingプロパティによる制御
- ローディングインジケータの表示
- コンテンツの表示/非表示切り替え

### エラー状態
- errorMessageプロパティによる制御
- エラーメッセージの表示
- リカバリーオプションの提供

## パンくずナビゲーション

### 仕様
- パスの階層表示
- クリック可能な中間ノード
- 現在位置の表示
- パス区切り文字の適切な配置

### インタラクション
- パスセグメントのクリック
- ホバー効果
- フォーカス管理

## パフォーマンス考慮事項

### レンダリング最適化
- パスパーツの適切なキー設定
- 不要な再レンダリングの防止
- メモ化の活用

### スクロール管理
- 仮想スクロールの検討
- スクロール位置の保持
- スムーズスクロール

## アクセシビリティ

### キーボードナビゲーション
- フォーカス順序の適切な設定
- キーボードショートカット
- フォーカスインジケータ

### ARIA属性
- role="navigation"（パスバー）
- role="main"（コンテンツエリア）
- aria-current（現在位置）

## エラーハンドリング

### 表示パターン
- ローディングエラー
- パス解析エラー
- データなし状態

### ユーザーフィードバック
- エラーメッセージの表示
- リトライオプション
- 代替アクション

## テスト要件

### ユニットテスト
- パス解析ロジック
- コンポーネントのレンダリング
- イベントハンドリング

### インテグレーションテスト
- FolderCardGridとの連携
- ナビゲーション機能
- エラー表示

### E2Eテスト
- ユーザーフロー
- エラー状態
- パフォーマンス

## 依存関係

### インポート
```typescript
import { FolderItem } from '../../services/WebFocusService';
import FolderCardGrid from '../Card/FolderCardGrid';
import styles from './RightPanel.module.css';
```

### 子コンポーネント
- FolderCardGrid

## 拡張性

### 今後の機能追加
- ビュー切り替え（グリッド/リスト）
- 検索/フィルタ機能
- ソート機能
- コンテキストメニュー

### コードの拡張性
- コンポーネントの分割
- 共通ロジックの抽出
- インターフェースの整理