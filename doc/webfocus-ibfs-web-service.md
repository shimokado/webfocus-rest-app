# WebFOCUS IBFS Service API仕様書

## 基本情報

- Base URL: `/ibi_apps/rs`
- Service Name: `ibfs`
- すべてのリクエストに `IBIRS_service=ibfs` パラメータが必要

## 共通パラメータ
- `IBIRS_random`: ランダム値（キャッシュ防止用）
- CSRFトークン名: XSRF対策トークン（POST要求時に必須）
- `IBIRS_path`: リソースパス（多くのエンドポイントで必要）

## レスポンス

### サインオンに成功した時のレスポンス
- "ibfsrpc"の"returncode"が"10000"ならリクエストが成功している。
- "ibfsrpc"の"returndesc"に成否を含むメッセージが返される
- サインオンに成功した場合、ibfsrpc > properties > entry[key=IBI_CSRF_Token_Name] の"value" に CSRFトークン名が返される
- サインオンに成功した場合、ibfsrpc > properties > entry[key=IBI_CSRF_Token_Value] の"value" に CSRFトークン名が返される
- サインオンに成功した場合、ibfsrpc > rootObject の"description"にユーザの表示名が返される
- サインオンに成功した場合、ibfsrpc > rootObject の"fullPath"にユーザのフルパスが返される


**ibfsrpcの属性に、リクエストの成否に関する情報、rootObjectには、IBIRS_actionに応じた結果が返される**

```xml
<ibfsrpc _jt="IBFSResponseObject" language="EN" name="signOn" returncode="10000" returndesc="SUCCESS" subreturncode="0" type="simple">
<ibfsparams size="0"/>
<properties size="2">
<entry key="IBI_CSRF_Token_Name" value="IBIwfXsrfToken"/>
<entry key="IBI_CSRF_Token_Value" value="71b4d7282a3fa2d0e5719584c40f57e2"/>
</properties>
<rootObject _jt="IBFSUserObject" description="管理者" dummy="false" email="" fullPath="IBFS:/SSYS/USERS/admin" handle="10001" isFavorite="false" lastSignin="1741932407386" length="0" name="admin" password="" type="User" userStatusDisplay="アクティブ">
<properties size="3">
<entry key="AuthNType" value="IntAuthN"/>
<entry key="SeatDate" value="20250106"/>
<entry key="SeatType" value="PU,IA"/>
</properties>
<status _jt="IBSSUserStatus" name="ACTIVE"/>
<groups _jt="ArrayList" size="0"/>
<pSetList _jt="ArrayList" size="0"/>
</rootObject>
</ibfsrpc>
```

### サインオンに失敗した時のレスポンス

```xml
<ibfsrpc _jt="IBFSResponseObject" language="EN" localizeddesc="Incorrect username or password" name="signOn" returncode="5003" returndesc="Incorrect username or password" subreturncode="0" type="simple">
<ibfsparams size="0"/>
</ibfsrpc>
```

### リソース取得に成功した時のレスポンス

```xml
<ibfsrpc _jt="IBFSResponseObject" language="ja_JP" name="get" returncode="10000" returndesc="SUCCESS" subreturncode="0" type="simple">
<ibfsparams size="2">
<entry key="IBIRS_args" value="__null"/>
<entry key="IBIRS_path" value="IBFS:/WFC/Repository"/>
</ibfsparams>
<rootObject _jt="IBFSMRObject" binary="false" container="true" createdBy="WebFOCUS" createdOn="1736153999711" defaultLng="en_US" description="ワークスペース" dummy="false" effectiveRSName="EDASERVE" expireDate="1736153999712" externalId="" fullPath="IBFS:/WFC/Repository" handle="000000000001" isFavorite="false" lastModified="1736153999712" lastaccessBy="WebFOCUS" lastaccessOn="1736153999712" lastmodBy="WebFOCUS" length="0" name="Repository" policy="//P2v3/Dn///8+BPr///9v9/3///////gAAAAA==" returnedLng="en_US" rsPath="/ibi_apps/rs/ibfs/WFC/Repository" summary="ワークスペース" thumbPath="/ibi_apps/ibi_html/ibi_images/file_type/file.svg" type="MRRepository" typeDescription="コンテンツ">
<children _jt="ArrayList" size="4">
<item _jt="IBFSMRObject" binary="false" container="true" createdBy="admin" createdOn="1741633066720" defaultLng="ja_JP" description="QS" dummy="false" effectiveRSName="EDASERVE" fullPath="IBFS:/WFC/Repository/QS" handle="51f6a2a3_aa0e_4f88_b60b_49803dd661d1__1680652515" index="0" isFavorite="false" lastModified="1741633066720" lastaccessBy="admin" lastaccessOn="1741633066720" lastmodBy="admin" length="0" name="QS" parent="Repository" policy="//P+v3/Dn///8+j/////9v//3///////gAAAAA==" returnedLng="ja_JP" rsPath="/ibi_apps/rs/ibfs/WFC/Repository/QS" thumbPath="/ibi_apps/ibi_html/ibi_images/file_type/file.svg" type="MRFolder" typeDescription="フォルダ">
<properties size="0"/>
</item>
<item _jt="IBFSMRObject" appName="myhome getting_started" binary="false" container="true" createdBy="admin" createdOn="1736154048395" defaultLng="en_US" description="マイワークスペース" dummy="false" effectiveAppName="myhome getting_started" effectiveRSName="EDASERVE" fullPath="IBFS:/WFC/Repository/My_Workspace" handle="76660ba4_0be6_4d7e_a55d_51e344f87456__679100163" index="1" isFavorite="false" lastModified="1736154048395" lastaccessBy="admin" lastaccessOn="1736154048395" lastmodBy="admin" length="0" name="My_Workspace" parent="Repository" policy="//P+v3/Dn///8Oj/////9v//////////gAAAAA==" rawDescription="${My_Workspace}" returnedLng="en_US" rsPath="/ibi_apps/rs/ibfs/WFC/Repository/My_Workspace" srtorder="-1000" thumbPath="/ibi_apps/ibi_html/ibi_images/file_type/file.svg" type="MRFolder" typeDescription="フォルダ">
<properties size="4">
<entry key="Cascade" value="/SSYS/GROUPS/My_Workspace"/>
<entry key="GeneralAccessGroup" value="/SSYS/GROUPS/My_Workspace/BasicUsers"/>
<entry key="MyDomain" value="on"/>
<entry key="autogenmyreports" value="on"/>
</properties>
</item>
<item _jt="IBFSMRObject" binary="false" container="true" createdBy="admin" createdOn="1741629408976" defaultLng="ja_JP" description="QS" dummy="false" effectiveRSName="EDASERVE" fullPath="IBFS:/WFC/Repository/qs" handle="afe7a11f_690c_4fa9_97d1_32f112df666a__1680651491" index="2" isFavorite="false" lastModified="1741629408976" lastaccessBy="admin" lastaccessOn="1741629408976" lastmodBy="admin" length="0" name="qs" ownerId="10001" ownerName="admin" ownerPath="IBFS:/SSYS/USERS/admin" ownerType="U" parent="Repository" policy="//P2v3/Dn///8+j/////9v//3///////gAAAAA==" returnedLng="ja_JP" rsPath="/ibi_apps/rs/ibfs/WFC/Repository/qs" thumbPath="/ibi_apps/ibi_html/ibi_images/file_type/file.svg" type="MRFolder" typeDescription="フォルダ">
<properties size="0"/>
</item>
<item _jt="IBFSMRObject" appName="新規ワークスペース" binary="false" container="true" createdBy="admin" createdOn="1736184965485" defaultLng="en_US" description="新規ワークスペース" dummy="false" effectiveAppName="新規ワークスペース" effectiveRSName="EDASERVE" expireDate="0" fullPath="IBFS:/WFC/Repository/新規ワークスペース" handle="f3d4ec70_259d_4aec_9591_1a54353de327_22649222" index="3" isFavorite="false" lastModified="1737112971476" lastaccessBy="admin" lastaccessOn="1741832357840" lastmodBy="admin" length="0" name="新規ワークスペース" parent="Repository" policy="//P+v3/Dn///8+j/////9v//////////gAAAAA==" returnedLng="en_US" rsPath="/ibi_apps/rs/ibfs/WFC/Repository/新規ワークスペース" thumbPath="/ibi_apps/ibi_html/ibi_images/file_type/file.svg" type="MRFolder" typeDescription="フォルダ">
<properties size="4">
<entry key="Cascade" value="/SSYS/GROUPS/新規ワークスペース,/EDA/EDASERVE/新規ワークスペース"/>
<entry key="GeneralAccessGroup" value="/SSYS/GROUPS/新規ワークスペース/BasicUsers"/>
<entry key="ScmApp" value="on"/>
<entry key="autogenmyreports" value="on"/>
</properties>
</item>
</children>
<properties size="0"/>
<nlsValues _jt="HashMap">
<entry>
<key _jt="string" value="en_US"/>
<value _jt="ArrayList" size="2">
<item _jt="string" index="0" value="Content"/>
<item _jt="string" index="1" value="ワークスペース"/>
</value>
</entry>
</nlsValues>
</rootObject>
</ibfsrpc>
```


## エンドポイント一覧

### 認証関連

#### サインオン (POST /signOn)
ユーザー認証を行います。
- パラメータ:
  - `IBIRS_userName`: ユーザー名（必須）
  - `IBIRS_password`: パスワード（必須）

#### サインオフ (GET /signOff)
セッションを終了します。
- パラメータ: 不要

### リソース操作

#### リソース取得 (GET /get)
指定されたパスのリソースを取得します。
- パラメータ:
  - `IBIRS_path`: リソースパス
  - `IBIRS_args`: 追加引数（オプション）

#### リソース一覧 (GET /list)
指定されたパスのリソース一覧を取得します。
- パラメータ:
  - `IBIRS_path`: リソースパス
  - `IBIRS_options`: リスト取得オプション

#### コンテンツ取得 (GET /getContent)
指定されたリソースのコンテンツを取得します。
- パラメータ:
  - `IBIRS_path`: リソースパス
  - `IBIRS_args`: 追加引数（オプション）

#### リソース作成/更新 (POST /put)
リソースを作成または更新します。
- パラメータ:
  - `IBIRS_path`: リソースパス
  - `IBIRS_object`: リソースの内容
  - `IBIRS_private`: プライベートフラグ（true/false/__null）
  - `IBIRS_replace`: 上書きフラグ（true/false）
  - `IBIRS_args`: 追加引数（オプション）
  - CSRFトークン名: CSRFトークン

#### リソース削除 (POST /delete)
指定されたリソースを削除します。
- パラメータ:
  - `IBIRS_path`: リソースパス
  - `IBIRS_args`: 追加引数（オプション）
  - CSRFトークン名: CSRFトークン

### ファイル操作

#### コピー (POST /copy)
リソースをコピーします。
- パラメータ:
  - `IBIRS_path`: ソースパス
  - `IBIRS_destination`: コピー先パス
  - `IBIRS_replace`: 上書きフラグ（true/false）
  - `IBIRS_args`: 追加引数（オプション）
  - CSRFトークン名: CSRFトークン

#### 移動 (POST /move)
リソースを移動します。
- パラメータ:
  - `IBIRS_path`: ソースパス
  - `IBIRS_destination`: 移動先パス
  - `IBIRS_replace`: 上書きフラグ（true/false）
  - `IBIRS_args`: 追加引数（オプション）
  - CSRFトークン名: CSRFトークン

#### 名前変更 (POST /rename)
リソースの名前を変更します。
- パラメータ:
  - `IBIRS_path`: リソースパス
  - `IBIRS_newName`: 新しい名前
  - `IBIRS_args`: 追加引数（オプション）
  - CSRFトークン名: CSRFトークン

### アクセス制御

#### ルール追加 (POST /addRule)
アクセス制御ルールを追加します。
- パラメータ:
  - `IBIRS_path`: リソースパス
  - `IBIRS_subjectPath`: 対象パス
  - `IBIRS_verb`: 権限種別（PERMIT/DENY/等）
  - `IBIRS_role`: ロール名
  - `IBIRS_applyTo`: 適用範囲（FOLDER_AND_CHILDREN/FOLDER_ONLY/CHILDREN_ONLY）
  - CSRFトークン名: CSRFトークン

#### ルール削除 (POST /removeRule)
アクセス制御ルールを削除します。
- パラメータ:
  - `IBIRS_path`: リソースパス
  - `IBIRS_subjectPath`: 対象パス
  - `IBIRS_role`: ロール名
  - CSRFトークン名: CSRFトークン

### 実行関連

#### 実行 (GET /run)
リソースを実行します。
- パラメータ:
  - `IBIRS_path`: リソースパス
  - `IBIRS_clientPath`: クライアントパス（オプション）
  - `IBIRS_htmlPath`: HTMLパス（オプション）
  - `IBIRS_userName`: ユーザー名（オプション）
  - `IBIRS_password`: パスワード（オプション）
  - `IBIRS_args`: 追加引数（オプション）

#### 遅延実行 (GET /runDeferred)
リソースを遅延実行します。
- パラメータ:
  - `IBIRS_path`: リソースパス
  - `IBIRS_tDesc`: 実行説明
  - `IBIRS_parameters`: パラメータ（オプション）
  - `IBIRS_args`: 追加引数（オプション）

### その他

#### 言語設定 (GET /setLanguage)
インターフェース言語を設定します。
- パラメータ:
  - `IBIRS_language`: 言語コード

#### プロパティ取得 (GET /properties)
リソースのプロパティを取得します。
- パラメータ:
  - `IBIRS_path`: リソースパス
  - `IBIRS_args`: 追加引数（オプション）