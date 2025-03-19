# Login コンポーネント仕様書

## 概要

WebFOCUSへのユーザー認証を行うログインフォームを提供するコンポーネントです。
ユーザー名とパスワードの入力フォーム、バリデーション、エラー表示、ローディング状態の管理を行います。

## Props

```typescript
interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
}
```

## 状態管理

```typescript
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);
```

## メソッド

### handleSubmit
```typescript
const handleSubmit = async (e: FormEvent) => {
  // フォーム送信とバリデーション処理
  // - 入力値の検証
  // - ローディング状態の管理
  // - エラーハンドリング
}
```

## バリデーション

- ユーザー名が空でないこと
- パスワードが空でないこと
- 送信中の重複送信防止

## イベントハンドリング

- フォーム送信イベント
- ユーザー名入力変更
- パスワード入力変更

## レンダリング

```tsx
<div className={styles.loginContainer}>
  <div className={styles.loginBox}>
    <h1 className={styles.title}>WebFOCUS WebApp</h1>
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* ユーザー名入力フィールド */}
      {/* パスワード入力フィールド */}
      {/* エラーメッセージ */}
      {/* 送信ボタン */}
    </form>
  </div>
</div>
```

## スタイリング

### CSSモジュール定義
```css
/* Login.module.css */
.loginContainer {
  // コンテナスタイル
}

.loginBox {
  // フォームボックススタイル
}

.title {
  // タイトルスタイル
}

.form {
  // フォームスタイル
}

.inputGroup {
  // 入力フィールドグループスタイル
}

.button {
  // ボタンスタイル
}

.error {
  // エラーメッセージスタイル
}
```

## ユーザーインターフェース仕様

### 入力フィールド
- ユーザー名フィールド
  - プレースホルダー: なし
  - ラベル: "ユーザー名"
  - type: "text"
- パスワードフィールド
  - プレースホルダー: なし
  - ラベル: "パスワード"
  - type: "password"

### ボタン
- テキスト: "ログイン" / "ログイン中..."
- 状態: 
  - 通常時: 有効
  - 送信中: 無効
  - 入力値が空の場合: 有効（バリデーションはsubmit時）

### エラー表示
- 表示位置: フォームフィールドの下
- 色: #dc3545（赤）
- フォントサイズ: 0.9rem

## アクセシビリティ

- フォームフィールドへのラベル付与
- エラーメッセージのARIAサポート
- キーボード操作のサポート
- タブ順序の適切な設定

## エラーハンドリング

### 表示エラー
- "ユーザー名とパスワードを入力してください"
- "ログインに失敗しました"
- APIからのエラーメッセージ

### エラー状態の管理
- 入力値検証エラー
- API通信エラー
- 認証失敗エラー

## パフォーマンス考慮事項

- 不要な再レンダリングの防止
- 入力値のバウンス処理
- アニメーションの最適化（CSS transitions）

## テスト要件

### ユニットテスト
- 入力値バリデーション
- フォーム送信処理
- エラー表示
- ローディング状態

### インテグレーションテスト
- API通信
- エラーハンドリング
- 状態管理

### E2Eテスト
- ログインフロー
- エラー表示
- UI操作

## 依存関係

### インポート
```typescript
import { useState, FormEvent } from 'react';
import styles from './Login.module.css';
```

### 外部依存
- なし（単独で動作可能）