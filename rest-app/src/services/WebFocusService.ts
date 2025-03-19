/**
 * ログイン結果の型定義
 */
interface LoginResult {
  success: boolean;
  message: string;
  userDisplayName?: string | null;
  userFullPath?: string | null;
  csrfTokenName?: string | null;
  csrfTokenValue?: string | null;
}

/**
 * フォルダアイテムのインターフェース
 */
export interface FolderItem {
  name: string;
  description: string | null;
  fullPath: string;
  type: string;
  typeDescription: string;
  thumbPath: string;
  createdBy: string;
  lastModified: string;
  container: boolean;
  policy: string;  // policy属性を追加
}

/**
 * リソース取得結果の型定義
 */
export interface ResourceResult {
  success: boolean;
  message: string;
  items: FolderItem[];
}

/**
 * WebFOCUS IBFS サービスとの通信を管理するクラス
 */
export class WebFocusService {
  // 共通定数
  private static readonly SUCCESS_CODE = '10000';
  private static readonly IBIRS_SERVICE = 'ibfs';

  private readonly baseUrl: string;
  private userName: string | null = null;
  private userDisplayName: string | null = null;
  private userFullPath: string | null = null;
  private csrfTokenName: string | null = null;
  private csrfTokenValue: string | null = null;

  /**
   * @param {Object} config - 設定オブジェクト
   * @param {string} [config.baseUrl='/ibi_apps/rs'] - WebFOCUS REST APIのベースURL
   */
  constructor(config: { baseUrl?: string } = {}) {
    this.baseUrl = config.baseUrl ?? '/ibi_apps/rs';
  }

  /**
   * WebFOCUSにログインする
   *
   * @param {string} username - ユーザ名
   * @param {string} password - パスワード
   * @returns {Promise<LoginResult>} ログイン結果
   */
  public async login(username: string, password: string): Promise<LoginResult> {
    try {
      const body = new URLSearchParams({
        IBIRS_action: 'signOn',
        IBIRS_service: WebFocusService.IBIRS_SERVICE,
        IBIRS_userName: username,
        IBIRS_password: password,
      });

      const { xmlDoc, returnCode, returnDesc } = await this.fetchAndParseXml('signOn', 'POST', {}, body);

      if (this.isSuccessResponse(returnCode)) {
        // ユーザー情報とCSRFトークンを抽出
        this.extractUserInfoAndTokens(xmlDoc);

        return {
          success: true,
          message: returnDesc || 'Login successful',
          userDisplayName: this.userDisplayName,
          userFullPath: this.userFullPath,
          csrfTokenName: this.csrfTokenName,
          csrfTokenValue: this.csrfTokenValue
        };
      } else {
        // ログイン失敗
        return {
          success: false,
          message: returnDesc || 'Authentication failed'
        };
      }
    } catch (error) {
      console.error('Login error details:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * 指定されたパスのリソースを取得する
   * 
   * @param {string} path - リソースパス (例: "IBFS:/WFC/Repository")
   * @returns {Promise<ResourceResult>} リソース取得結果
   */
  public async getResourceItems(path: string): Promise<ResourceResult> {
    try {
      const params = {
        IBIRS_path: path,
        IBIRS_args: '__null'
      };

      const { xmlDoc, returnCode, returnDesc } = await this.fetchAndParseXml('get', 'GET', params);

      if (this.isSuccessResponse(returnCode)) {
        // フォルダアイテムを抽出
        const items = this.extractFolderItems(xmlDoc);

        return {
          success: true,
          message: returnDesc || 'Success',
          items
        };
      } else {
        return {
          success: false,
          message: returnDesc || 'Failed to get resource',
          items: []
        };
      }
    } catch (error) {
      console.error('Resource fetch error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        items: []
      };
    }
  }

  /**
   * リソースのコンテンツを取得する
   * @param path リソースパス
   * @returns テキストコンテンツ
   */
  public async getContent(path: string): Promise<string> {
    try {
      // URLパラメータの構築
      const params = new URLSearchParams({
        IBIRS_action: 'getContent',
        IBIRS_service: WebFocusService.IBIRS_SERVICE,
        IBIRS_path: path,
        IBIRS_args: '__null'
      });

      // URLの構築
      const url = `${this.baseUrl}?${params.toString()}`;

      // リクエストの実行
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Content fetch failed with status: ${response.status} ${response.statusText}`);
      }

      // テキストとして直接返す（XMLではない）
      return await response.text();
    } catch (error) {
      console.error('Content fetch error:', error);
      throw error;
    }
  }

  /**
   * 共通のfetchとXML解析処理
   * 
   * @param action - 実行するアクション
   * @param method - HTTPメソッド
   * @param params - リクエストパラメータ
   * @param body - POSTリクエスト用のボディ
   * @returns 解析されたXMLドキュメントとステータス
   */
  private async fetchAndParseXml(
    action: string,
    method: 'GET' | 'POST' = 'GET',
    params: Record<string, string> = {},
    body?: URLSearchParams
  ): Promise<{ xmlDoc: Document, returnCode: string, returnDesc: string }> {
    // リクエストパラメータの構築
    const requestParams = new URLSearchParams({
      IBIRS_action: action,
      IBIRS_service: WebFocusService.IBIRS_SERVICE,
      ...params
    });

    // URLとリクエストオプションの構築
    const url = method === 'GET' ? `${this.baseUrl}?${requestParams.toString()}` : this.baseUrl;
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };

    // POSTリクエストの場合はボディとCSRFトークンを追加
    if (method === 'POST') {
      requestOptions.body = body || requestParams;
      
      // CSRFトークンがある場合はヘッダーに追加
      if (this.csrfTokenName && this.csrfTokenValue) {
        requestOptions.headers = {
          ...requestOptions.headers,
          [this.csrfTokenName]: this.csrfTokenValue
        };
        console.log(`Adding CSRF token to headers: ${this.csrfTokenName}=${this.csrfTokenValue}`);
      }
    }

    // リクエスト実行
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status} ${response.statusText}`);
    }

    // XMLレスポンスの解析
    const xmlText = await response.text();
    console.log(`XML Response for ${action}:`, xmlText); // デバッグ用ログ
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // 戻りコードと説明の抽出
    const ibfsrpc = xmlDoc.querySelector('ibfsrpc');
    const returnCode = ibfsrpc?.getAttribute('returncode') || '';
    const returnDesc = ibfsrpc?.getAttribute('returndesc') || '';
    
    return { xmlDoc, returnCode, returnDesc };
  }

  /**
   * レスポンスが成功かどうか確認
   */
  private isSuccessResponse(returnCode: string): boolean {
    return returnCode === WebFocusService.SUCCESS_CODE;
  }

  /**
   * XMLからユーザー情報とCSRFトークンを抽出
   */
  private extractUserInfoAndTokens(xmlDoc: Document): void {
    // CSRFトークンの抽出
    const properties = xmlDoc.querySelector('properties');
    if (properties) {
      const entries = properties.querySelectorAll('entry');
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const key = entry.getAttribute('key');
        const value = entry.getAttribute('value');
        
        if (key === 'IBI_CSRF_Token_Name') {
          this.csrfTokenName = value;
        } else if (key === 'IBI_CSRF_Token_Value') {
          this.csrfTokenValue = value;
        }
      }
    }
    
    // ユーザー情報の抽出
    const rootObject = xmlDoc.querySelector('rootObject');
    if (rootObject) {
      this.userDisplayName = rootObject.getAttribute('description') || null;
      this.userFullPath = rootObject.getAttribute('fullPath') || null;
      this.userName = rootObject.getAttribute('name') || null;
      
      // 表示名が空の場合はname属性を使用
      if (!this.userDisplayName || this.userDisplayName.trim() === '') {
        this.userDisplayName = rootObject.getAttribute('name') || null;
      }
    }

    console.log('Extracted data:', {
      csrfTokenName: this.csrfTokenName,
      csrfTokenValue: this.csrfTokenValue,
      userDisplayName: this.userDisplayName,
      userFullPath: this.userFullPath
    });
  }

  /**
   * XMLからフォルダアイテムを抽出
   */
  private extractFolderItems(xmlDoc: Document): FolderItem[] {
    const items: FolderItem[] = [];
    const itemElements = xmlDoc.querySelectorAll('rootObject > children > item');
    
    itemElements.forEach(item => {
      // 属性の抽出
      const name = item.getAttribute('name') || '';
      const description = item.getAttribute('description');
      const fullPath = item.getAttribute('fullPath') || '';
      const type = item.getAttribute('type') || '';
      const typeDescription = item.getAttribute('typeDescription') || '';
      const thumbPath = item.getAttribute('thumbPath') || '';
      const createdBy = item.getAttribute('createdBy') || '';
      const lastModified = item.getAttribute('lastModified') || '';
      const container = item.getAttribute('container') === 'true';
      
      items.push({
        name,
        description,
        fullPath,
        type,
        typeDescription,
        thumbPath,
        createdBy,
        lastModified,
        container,
        policy: item.getAttribute('policy') || ''  // policy属性を追加
      });
    });

    return items;
  }

  /**
   * レポートを実行してURLを取得する
   * @param path レポートのパス
   * @returns レポート実行用のURL
   */
  getReportUrl(path: string): string {
    // クエリパラメータを構築
    const params = new URLSearchParams({
      IBIRS_action: 'run',
      IBIRS_service: 'ibfs',
      IBIRS_path: path,
      IBIRS_args: '__null'
    });

    // ベースURLにパラメータを追加
    return `${this.baseUrl}?${params.toString()}`;
  }

  /**
   * ユーザー名を取得
   */
  get currentUserName(): string | null {
    return this.userName;
  }

  /**
   * ユーザーの表示名を取得
   */
  get currentUserDisplayName(): string | null {
    return this.userDisplayName;
  }

  /**
   * ユーザーのフルパスを取得
   */
  get currentUserFullPath(): string | null {
    return this.userFullPath;
  }

  /**
   * CSRFトークン名を取得
   */
  // get currentCsrfTokenName(): string | null {
  //   return this.csrfTokenName;
  // }

  /**
   * CSRFトークン値を取得
   */
  // get currentCsrfTokenValue(): string | null {
  //   return this.csrfTokenValue;
  // }
}
