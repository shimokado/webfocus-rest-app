# Header コンポーネント仕様書

## 概要

アプリケーションのヘッダー部分を担当するコンポーネントです。
アプリケーションロゴとユーザー情報を表示します。

## Props

```typescript
interface HeaderProps {
  userName: string | null;
  userDisplayName: string | null;
  userFullPath: string | null;
}
```

## レンダリング

```tsx
<header className={styles.header}>
  <div className={styles.logo}>WebFOCUS WebApp</div>
  <div className={styles.userInfo}>
    <div className={styles.userDetail}>
      <span className={styles.label}>ユーザーID:</span>
      <span className={styles.value}>{userName || '-'}</span>
    </div>
    <div className={styles.userDetail}>
      <span className={styles.label}>表示名:</span>
      <span className={styles.value}>{userDisplayName || '-'}</span>
    </div>
    <div className={styles.userDetail}>
      <span className={styles.label}>パス:</span>
      <span className={styles.value}>{userFullPath || '-'}</span>
    </div>
  </div>
</header>
```

## スタイリング

### CSSモジュール定義
```css
.header {
  background-color: #0066cc;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.userInfo {
  display: flex;
  gap: 1.5rem;
}

.userDetail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.value {
  font-weight: 500;
}
```

## レイアウト仕様

### ロゴエリア
- 左寄せ
- フォントサイズ: 1.5rem
- フォントウェイト: bold
- 色: 白

### ユーザー情報エリア
- 右寄せ
- 情報項目間隔: 1.5rem
- ラベル/値のペアを横並び
- ラベルは小さめ（0.8rem）で透明度80%

## アクセシビリティ

### ARIA属性
- role="banner"
- aria-label="アプリケーションヘッダー"

### セマンティックHTML
- header要素の使用
- 適切な見出しレベル
- コントラスト比の確保

## 責務

### 表示責務
- アプリケーション名の表示
- ユーザー情報の表示
- レイアウトの制御

### 将来の拡張
- ユーザーメニュー
- 通知領域
- 言語切り替え
- テーマ切り替え

## エラーハンドリング

### Null値の処理
- ユーザー情報がnullの場合のフォールバック
- 表示名未設定時の代替表示
- パス情報欠落時の処理

## パフォーマンス最適化

### レンダリング
- 不要な再レンダリングの防止
- メモ化の検討
- スタイル計算の最適化

### アニメーション
- GPUアクセラレーション
- スムーズな遷移効果
- レイアウトシフトの防止

## テスト要件

### ユニットテスト
- Props受け渡しの検証
- Null値のハンドリング
- スタイルの適用

### ビジュアルテスト
- レイアウトの一貫性
- レスポンシブ対応
- テーマ対応

## 依存関係

### インポート
```typescript
import styles from './Header.module.css';
```

## 制約事項

- 固定高さ（指定なし、コンテンツに依存）
- 最小幅（未定）
- 背景色（#0066cc）
- フォントカラー（白）