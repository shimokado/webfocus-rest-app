# WebFocusService仕様書

# WebFocusService クラス

WebFOCUS IBFS サービスとの通信を管理するTypeScriptクラス

## 概要

このクラスは、WebFOCUS RESTful サービスとの通信を抽象化し、認証やリソース取得などの操作を提供します。

## クラス定義

```typescript
export class WebFocusService
```

## 定数

| 名前 | 型 | 説明 |
|------|------|------|
| `SUCCESS_CODE` | `string` | レスポンスが成功したことを示すコード "10000" |
| `IBIRS_SERVICE` | `string` | WebFOCUS IBFSサービス名 "ibfs" |

## プロパティ

| 名前 | 型 | アクセス | 説明 |
|------|------|----------|------|
| `baseUrl` | `string` | private readonly | REST APIのベースURL |
| `userName` | `string \| null` | private | 現在のユーザー名 |
| `userDisplayName` | `string \| null` | private | ユーザーの表示名 |
| `userFullPath` | `string \| null` | private | ユーザーのフルパス |
| `csrfTokenName` | `string \| null` | private | CSRFトークン名 |
| `csrfTokenValue` | `string \| null` | private | CSRFトークン値 |

## コンストラクタ

```typescript
constructor(config: { baseUrl?: string } = {})
```

### パラメータ

| 名前 | 型 | 必須 | 説明 |
|------|------|------|------|
| `config` | `object` | いいえ | 設定オブジェクト |
| `config.baseUrl` | `string` | いいえ | WebFOCUS REST APIのベースURL（デフォルト: '/ibi_apps/rs'） |

## メソッド

### login

ユーザー認証を行い、ユーザー情報とCSRFトークンを取得します。

```typescript
public async login(username: string, password: string): Promise<LoginResult>
```

#### パラメータ

| 名前 | 型 | 必須 | 説明 |
|------|------|------|------|
| `username` | `string` | はい | ユーザー名 |
| `password` | `string` | はい | パスワード |

#### 戻り値

`Promise<LoginResult>`: ログイン結果を含むオブジェクト

### getResourceItems

指定されたパスのリソースとその子アイテムを取得します。

```typescript
public async getResourceItems(path: string): Promise<ResourceResult>
```

#### パラメータ

| 名前 | 型 | 必須 | 説明 |
|------|------|------|------|
| `path` | `string` | はい | リソースパス（例: "IBFS:/WFC/Repository"） |

#### 戻り値

`Promise<ResourceResult>`: リソース取得結果を含むオブジェクト

### getContent

指定されたリソースのコンテンツを取得します。

```typescript
public async getContent(path: string): Promise<string>
```

#### パラメータ

| 名前 | 型 | 必須 | 説明 |
|------|------|------|------|
| `path` | `string` | はい | リソースパス |

#### 戻り値

`Promise<string>`: リソースのコンテンツ（テキスト形式）

### getReportUrl

レポートの実行URLを生成します。

```typescript
getReportUrl(path: string): string
```

#### パラメータ

| 名前 | 型 | 必須 | 説明 |
|------|------|------|------|
| `path` | `string` | はい | レポートのパス |

#### 戻り値

`string`: レポート実行用のURL

## プライベートメソッド

### fetchAndParseXml

REST APIにリクエストを送信し、XMLレスポンスを解析します。

```typescript
private async fetchAndParseXml(
  action: string,
  method: 'GET' | 'POST' = 'GET',
  params: Record<string, string> = {},
  body?: URLSearchParams
): Promise<{ xmlDoc: Document, returnCode: string, returnDesc: string }>
```

### isSuccessResponse

レスポンスが成功かどうかを判定します。

```typescript
private isSuccessResponse(returnCode: string): boolean
```

### extractUserInfoAndTokens

XMLドキュメントからユーザー情報とCSRFトークンを抽出します。

```typescript
private extractUserInfoAndTokens(xmlDoc: Document): void
```

### extractFolderItems

XMLドキュメントからフォルダアイテムを抽出します。

```typescript
private extractFolderItems(xmlDoc: Document): FolderItem[]
```

## インターフェース

### LoginResult

```typescript
interface LoginResult {
  success: boolean;
  message: string;
  userDisplayName?: string | null;
  userFullPath?: string | null;
  csrfTokenName?: string | null;
  csrfTokenValue?: string | null;
}
```

### FolderItem

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
}
```

### ResourceResult

```typescript
interface ResourceResult {
  success: boolean;
  message: string;
  items: FolderItem[];
}
```

## エラーハンドリング

- 各メソッドは非同期処理中のエラーをtry-catchで捕捉
- エラー発生時は適切なエラーメッセージを含むレスポンスを返却
- ネットワークエラーやパース失敗時は、コンソールにエラー詳細をログ出力

## 使用例

```typescript
// インスタンス作成
const webfocusService = new WebFocusService();

// ログイン
const loginResult = await webfocusService.login('username', 'password');
if (loginResult.success) {
  // リソース取得
  const resourceResult = await webfocusService.getResourceItems('IBFS:/WFC/Repository');
  if (resourceResult.success) {
    // リソースの処理
    const items = resourceResult.items;
    // ...
  }
}
```