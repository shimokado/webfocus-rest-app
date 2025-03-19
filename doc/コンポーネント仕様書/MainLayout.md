# MainLayout コンポーネント仕様書

## 概要

認証後のメイン画面のレイアウトを管理するコンポーネントです。
ヘッダー、フッター、左側のナビゲーションパネル、右側のコンテンツ領域を統合的に管理します。

## Props

```typescript
interface MainLayoutProps {
  userName: string | null;
  userDisplayName: string | null;
  userFullPath: string | null;
  onWorkspaceClick?: () => void;
  rightPanelContent?: ReactNode;
}
```

## コンポーネント構成

```
MainLayout
├── Header
│   ├── ロゴ
│   └── ユーザー情報表示
├── Content
│   ├── LeftPanel（ナビゲーション）
│   └── RightPanel（コンテンツ領域）
└── Footer
```

## レンダリング

```tsx
<div className={styles.container}>
  <Header 
    userName={userName}
    userDisplayName={userDisplayName}
    userFullPath={userFullPath}
  />
  
  <div className={styles.content}>
    <LeftPanel onWorkspaceClick={onWorkspaceClick} />
    {rightPanelContent}
  </div>
  
  <Footer />
</div>
```

## スタイリング

### CSSモジュール定義
```css
/* MainLayout.module.css */
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  display: flex;
  flex: 1;
}
```

## サブコンポーネント仕様

### Header
- アプリケーションロゴの表示
- ユーザー情報の表示（ユーザーID、表示名、パス）
- 将来的な機能拡張のためのメニューエリア

### LeftPanel
- ナビゲーションメニューの表示
- ワークスペースへのクイックアクセス
- 将来的な機能メニューの配置

### Footer
- アプリケーション情報の表示
- コピーライト情報

## レイアウト仕様

### コンテナ
- 最小高さ: 100vh
- フレックスボックスレイアウト
- 縦方向の配置

### コンテンツエリア
- 左右分割レイアウト
- 左パネル: 固定幅（250px）
- 右パネル: 可変幅（flex-grow）

## レスポンシブ対応

### 現在の実装
- デスクトップ優先のレイアウト
- 固定幅のサイドパネル

### 将来の拡張
- ブレイクポイントの設定
- モバイル対応レイアウト
- サイドパネルの折りたたみ機能

## アクセシビリティ

- 適切な見出しレベルの使用
- キーボードナビゲーションのサポート
- ランドマークの適切な設定
- コントラスト比の確保

## パフォーマンス考慮事項

- 子コンポーネントの最適な分割
- メモ化による再レンダリングの最適化
- レイアウトシフトの防止

## メンテナンス性

### コンポーネント分割の基準
- 単一責任の原則に基づく分割
- 再利用可能なコンポーネントの抽出
- 適切な粒度での状態管理

### 拡張性への配慮
- 新規機能追加を考慮したレイアウト設計
- コンポーネントの疎結合化
- 共通インターフェースの定義

## 依存関係

### インポート
```typescript
import { ReactNode } from 'react';
import styles from './MainLayout.module.css';
import Header from './Header';
import Footer from './Footer';
import LeftPanel from '../Panel/LeftPanel';
```

### 子コンポーネント
- Header
- LeftPanel
- Footer

## テスト要件

### ユニットテスト
- Props受け渡しの検証
- サブコンポーネントの正常表示
- イベントハンドリング

### インテグレーションテスト
- レイアウト構造の検証
- コンポーネント間の連携
- レスポンシブ動作

### ビジュアルリグレッションテスト
- レイアウトの一貫性
- スタイルの適用
- レスポンシブ対応