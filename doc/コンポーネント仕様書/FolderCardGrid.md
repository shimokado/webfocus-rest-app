# FolderCardGrid コンポーネント仕様書

## 概要

WebFOCUSのリソースアイテム（フォルダ、レポート、URLファイルなど）をグリッドレイアウトで表示するコンポーネントです。
各アイテムはFolderCardコンポーネントとしてレンダリングされます。

## Props

```typescript
interface FolderCardGridProps {
  items: FolderItem[];
  onItemClick?: (item: FolderItem) => void;
}
```

## レンダリング

### グリッドレイアウト
```tsx
<div className={styles.grid}>
  {items.map((item, index) => (
    <div className={styles.gridItem} key={item.fullPath || index}>
      <FolderCard item={item} onClick={onItemClick} />
    </div>
  ))}
</div>
```

### 空の状態
```tsx
{!items.length && (
  <div className={styles.empty}>アイテムはありません</div>
)}
```

## スタイリング

### CSSモジュール定義
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.gridItem {
  min-height: 200px;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #7f8c9f;
  font-style: italic;
}
```

## グリッドレイアウト仕様

### グリッド設定
- カラム幅: 最小250px
- 自動配置: auto-fill
- ギャップ: 20px
- アイテム高さ: 最小200px

### レスポンシブ動作
- ブレークポイントなし（自動調整）
- 画面幅に応じて列数が自動調整
- カード幅は250px〜1fr

## パフォーマンス最適化

### レンダリング最適化
- キーの適切な設定（fullPathまたはindex）
- 仮想化の検討（大量データ時）
- メモ化による再レンダリング防止

### データ処理
- 適切なページサイズ
- 遅延読み込みの実装（予定）
- ソート・フィルタ機能（予定）

## アクセシビリティ

### ARIA属性
- role="grid"の設定
- aria-label による説明
- フォーカス管理

### キーボードナビゲーション
- 矢印キーによる移動
- Enterキーでの選択
- タブ移動のサポート

## エラー処理

### エッジケース
- items が undefined の場合
- onItemClick が undefined の場合
- アイテムデータの不足

### エラー表示
- 空の状態メッセージ
- データ読み込みエラー（予定）
- ネットワークエラー（予定）

## 将来の拡張性

### 追加予定機能
- ドラッグ&ドロップ
- 複数選択
- グリッド/リスト表示切替
- ソート機能
- フィルタ機能

### コンポーネントの拡張性
- 表示モードの切り替え
- カスタムカードコンポーネント
- アクションメニュー

## メンテナンス性

### コード品質
- TypeScript型の厳密な使用
- コンポーネントの単一責任
- テスタビリティの確保

### デバッグ性
- 適切なコメント
- エラーログ
- パフォーマンスモニタリング

## テスト要件

### ユニットテスト
- アイテムの正常表示
- クリックイベントの発火
- 空の状態の表示

### インテグレーションテスト
- FolderCardとの連携
- グリッドレイアウトの動作
- イベントハンドリング

### E2Eテスト
- ユーザー操作シナリオ
- レスポンシブ動作
- パフォーマンス計測

## 依存関係

### インポート
```typescript
import { FolderItem } from '../../services/WebFocusService';
import FolderCard from './FolderCard';
import styles from './FolderCardGrid.module.css';
```

### 子コンポーネント
- FolderCard

## 制約事項

- グリッドアイテムの最小幅（250px）
- パフォーマンス上限（未定）
- ブラウザサポート要件