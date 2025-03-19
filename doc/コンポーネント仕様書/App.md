# App コンポーネント仕様書

## 概要

アプリケーションのルートコンポーネントとして機能し、認証状態とユーザー情報の管理、リソース表示の制御を行います。

## 責務

- ユーザーの認証状態管理
- WebFOCUSサービスとの通信
- ユーザー情報の保持
- フォルダ/リソース表示の状態管理
- エラーハンドリング

## 状態管理

### 認証関連
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userName, setUserName] = useState<string | null>(null);
const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
const [userFullPath, setUserFullPath] = useState<string | null>(null);
const [csrfTokenName, setCsrfTokenName] = useState<string | null>(null);
const [csrfTokenValue, setCsrfTokenValue] = useState<string | null>(null);
```

### フォルダ表示関連
```typescript
const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
const [currentPath, setCurrentPath] = useState<string>('');
const [isLoading, setIsLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState<string | null>(null);
```

## メソッド

### handleLogin
```typescript
const handleLogin = async (username: string, password: string) => {
  // ログイン処理とユーザー情報の保存
}
```

### loadFolderContents
```typescript
const loadFolderContents = async (path: string) => {
  // フォルダ内容の読み込みと状態更新
}
```

### handleWorkspaceClick
```typescript
const handleWorkspaceClick = () => {
  // ワークスペースのルートフォルダ表示
}
```

### handleFolderItemClick
```typescript
const handleFolderItemClick = async (item: FolderItem) => {
  // フォルダ/ファイルクリック時の処理
}
```

### handlePathClick
```typescript
const handlePathClick = (path: string) => {
  // パンくずリストでのパスクリック処理
}
```

## イベントハンドリング

- ログインフォームからのログインイベント
- ワークスペースボタンクリック
- フォルダ/ファイルアイテムクリック
- パンくずリストでのパスクリック

## レンダリング

### 未認証時
```tsx
<Login onLogin={handleLogin} />
```

### 認証済み時
```tsx
<MainLayout
  userName={userName}
  userDisplayName={userDisplayName}
  userFullPath={userFullPath}
  onWorkspaceClick={handleWorkspaceClick}
  rightPanelContent={
    <RightPanel
      currentPath={currentPath}
      items={folderItems}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onItemClick={handleFolderItemClick}
      onPathClick={handlePathClick}
    />
  }
/>
```

## エラーハンドリング

- ログイン失敗時のエラー表示
- フォルダ読み込み失敗時のエラー表示
- レポート/URLファイル処理時のエラー処理

## 依存関係

### インポート
```typescript
import { useState } from 'react';
import { Login } from './components/Login/Login';
import { WebFocusService, FolderItem } from './services/WebFocusService';
import MainLayout from './components/Layout/MainLayout';
import RightPanel from './components/Panel/RightPanel';
```

### 外部サービス
- WebFocusService: WebFOCUS REST APIとの通信

## スタイリング
- App.cssでのグローバルスタイル定義
- CSSモジュールによるコンポーネント固有のスタイル