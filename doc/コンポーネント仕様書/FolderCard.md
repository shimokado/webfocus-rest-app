# FolderCard コンポーネント仕様書

## 概要

WebFOCUSのリソースアイテム（フォルダ、レポート、URLファイルなど）を単一のカードとして表示するコンポーネントです。
アイコン、タイトル、説明、メタ情報などを統一されたデザインで表示します。

## Props

```typescript
interface FolderCardProps {
  item: FolderItem;
  onClick?: (item: FolderItem) => void;
}
```

## インターフェース

```typescript
interface FolderItem {
  name: string;
  description: string | null;
  fullPath: string;
  type: string;
  typeDescription: string;
  thumbPath: string;
  createdBy: string;
  lastModified: string;
  container: boolean;
  policy: string;
}
```

## レンダリング

```tsx
<div className={styles.card} onClick={handleClick}>
  <div className={styles.cardHeader}>
    <img 
      src={item.thumbPath || '/folder-icon.svg'} 
      alt={item.typeDescription} 
      className={styles.icon} 
    />
    <h3 className={styles.title}>{item.name}</h3>
  </div>
  
  <div className={styles.cardBody}>
    <p className={styles.description}>
      {item.description || item.name}
    </p>
    <div className={styles.details}>
      {/* メタ情報の表示 */}
    </div>
  </div>
</div>
```

## スタイリング

### CSSモジュール定義
```css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cardHeader {
  padding: 1rem;
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-bottom: 1px solid #eaeef3;
}

.icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  object-fit: contain;
}

.title {
  margin: 0;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cardBody {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.description {
  color: #596880;
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  flex: 1;
}

.details {
  font-size: 0.8rem;
  color: #7f8c9f;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
```

## メタ情報表示

### 表示項目
- タイプ（typeDescription）
- 作成者（createdBy）
- パス（fullPath）
- ポリシー（policy）
- 更新日時（lastModified）

### 日時フォーマット
```typescript
const formatDate = (timestamp: string) => {
  try {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  } catch {
    return 'N/A';
  }
};
```

## インタラクション

### クリック時の動作
- コンテナの場合: フォルダ内容の表示
- レポートの場合: 新規タブでレポート表示
- URLファイルの場合: リンク先を新規タブで表示

### ホバー効果
- カードの浮き上がり（transform: translateY）
- シャドウの強調

## アクセシビリティ

### ARIA属性
- role="article"
- aria-labelledby: タイトル
- aria-description: 説明文

### キーボードアクセス
- フォーカス可能
- Enterキーでクリック
- フォーカス時の視覚的フィードバック

## パフォーマンス最適化

### イメージ最適化
- アイコンのキャッシュ
- 適切なサイズ指定
- 代替アイコンの即時表示

### インタラクション最適化
- クリックハンドラのメモ化
- アニメーションのGPU活用

## エラー処理

### エッジケース
- 説明文が空の場合
- タイムスタンプ不正の場合
- アイコンロード失敗時

### フォールバック
- デフォルトアイコン
- 名前を説明文として使用
- 日付表示の代替テキスト

## メンテナンス性

### 型の厳密性
- 必須プロパティの保証
- オプショナルプロパティの適切な処理
- 共通インターフェースの使用

### コンポーネントの分割
- ヘッダー部分の分離検討
- メタ情報表示の分離検討

## テスト要件

### ユニットテスト
- Props受け渡しの検証
- イベントハンドリング
- フォーマット処理
- エラーケース

### インテグレーションテスト
- グリッド内での表示
- クリックイベントの伝播
- スタイルの適用

### ビジュアルテスト
- ホバー状態
- 長文対応
- レスポンシブ動作

## 依存関係

### インポート
```typescript
import { FolderItem } from '../../services/WebFocusService';
import styles from './FolderCard.module.css';
```

## 制約事項

- カードの最大幅: 親グリッドに依存
- アイコンサイズ: 24x24px
- タイトルの最大長: 1行（省略表示）