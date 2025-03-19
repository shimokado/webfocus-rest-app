# WebFocusService 技術仕様書

## 概要

WebFOCUS IBFS サービスとの通信を担当する中核サービスクラスです。
認証、リソース管理、コンテンツ取得などのAPI通信を抽象化し、統一的なインターフェースを提供します。

## クラス定義

```typescript
export class WebFocusService
```

## 定数

```typescript
private static readonly SUCCESS_CODE = '10000';
private static readonly IBIRS_SERVICE = 'ibfs';
```

## プロパティ

```typescript
private readonly baseUrl: string;
private userName: string | null = null;
private userDisplayName: string | null = null;
private userFullPath: string | null = null;
private csrfTokenName: string | null = null;
private csrfTokenValue: string | null = null;
```

## コンストラクタ

```typescript
constructor(config: { baseUrl?: string } = {}) {
  this.baseUrl = config.baseUrl ?? '/ibi_apps/rs';
}
```

## パブリックAPI

### ログイン処理
```typescript
public async login(username: string, password: string): Promise<LoginResult>
```
- ユーザー認証を実行
- CSRFトークンを取得・保存
- ユーザー情報を取得・保存

### リソース取得
```typescript
public async getResourceItems(path: string): Promise<ResourceResult>
```
- 指定パスのリソース一覧を取得
- エラーハンドリング
- 結果の整形

### コンテンツ取得
```typescript
public async getContent(path: string): Promise<string>
```
- URLファイルなどのコンテンツを取得
- テキストとして返却

### レポートURL生成
```typescript
public getReportUrl(path: string): string
```
- レポート実行用のURLを生成

### ユーザー情報アクセサ
```typescript
get currentUserName(): string | null
get currentUserDisplayName(): string | null
get currentUserFullPath(): string | null
```

## プライベートメソッド

### XMLリクエスト処理
```typescript
private async fetchAndParseXml(
  action: string,
  method: 'GET' | 'POST' = 'GET',
  params: Record<string, string> = {},
  body?: URLSearchParams
): Promise<{ xmlDoc: Document, returnCode: string, returnDesc: string }>
```
- REST APIリクエストの実行
- XMLレスポンスのパース
- エラー処理

### レスポンス判定
```typescript
private isSuccessResponse(returnCode: string): boolean
```
- レスポンスコードの検証

### データ抽出
```typescript
private extractUserInfoAndTokens(xmlDoc: Document): void
private extractFolderItems(xmlDoc: Document): FolderItem[]
```
- XMLからのデータ抽出処理
- 型に合わせたデータ整形

## データ型定義

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
  policy: string;
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

### 通信エラー
- ネットワークエラー
- タイムアウト
- CORS制約違反

### レスポンスエラー
- XMLパースエラー
- 認証エラー
- リソースアクセスエラー

### エラーメッセージ
- ユーザーフレンドリーなメッセージ
- デバッグ情報のログ出力
- スタックトレース保持

## セキュリティ対策

### CSRF保護
- トークンの取得と保存
- POSTリクエストへの付与
- トークンの検証

### 認証情報
- 安全な保存
- セッション管理
- タイムアウト処理

## パフォーマンス最適化

### キャッシュ戦略
- リソース情報のキャッシュ
- アイコンのキャッシュ
- トークンの再利用

### 通信最適化
- 不要なリクエストの防止
- バッチ処理の検討
- エラー時のリトライ

## 拡張性

### 今後の拡張予定
- レポートパラメータ処理
- バッチ処理対応
- ファイル操作機能
- アクセス制御機能

### インターフェース設計
- 柔軟なAPI設計
- 型の拡張性
- モジュール分割の考慮

## メンテナンス性

### デバッグサポート
- 詳細なログ出力
- エラートレース
- 状態監視

### コード品質
- 型安全性の確保
- テスタビリティ
- ドキュメント整備

## テスト要件

### ユニットテスト
- API通信のモック
- エラーケース
- データ変換処理

### インテグレーションテスト
- 実サーバーとの通信
- エラー発生時の動作
- 認証フロー

### エンドツーエンドテスト
- 実環境での動作確認
- パフォーマンス計測
- セキュリティテスト