import { useState } from 'react';
import { Login } from './components/Login/Login';
import { WebFocusService, FolderItem } from './services/WebFocusService';
import MainLayout from './components/Layout/MainLayout';
import RightPanel from './components/Panel/RightPanel';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userFullPath, setUserFullPath] = useState<string | null>(null);
  const [csrfTokenName, setCsrfTokenName] = useState<string | null>(null);
  const [csrfTokenValue, setCsrfTokenValue] = useState<string | null>(null);
  
  // フォルダ表示用の状態
  const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const webfocusService = new WebFocusService();

  const handleLogin = async (username: string, password: string) => {
    try {
      const loginResult = await webfocusService.login(username, password);
      
      if (loginResult.success) {
        setUserName(username);
        setIsAuthenticated(true);
        setUserDisplayName(loginResult.userDisplayName || null);
        setCsrfTokenName(loginResult.csrfTokenName || null);
        setCsrfTokenValue(loginResult.csrfTokenValue || null);
        setUserFullPath(loginResult.userFullPath || null);
        return;
      }
      
      throw new Error(loginResult.message);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // フォルダの内容を取得する共通関数
  const loadFolderContents = async (path: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const result = await webfocusService.getResourceItems(path);
      
      if (result.success) {
        setFolderItems(result.items);
        setCurrentPath(path);
      } else {
        setErrorMessage(result.message);
        setFolderItems([]);
      }
    } catch (error) {
      console.error('Error loading folder contents:', error);
      setErrorMessage('フォルダの読み込み中にエラーが発生しました');
      setFolderItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // メインワークスペースを表示
  const handleWorkspaceClick = () => {
    loadFolderContents('IBFS:/WFC/Repository');
  };

  // フォルダアイテムがクリックされたときの処理
  const handleFolderItemClick = async (item: FolderItem) => {
    if (item.container) {
      // フォルダの場合は内容を表示
      loadFolderContents(item.fullPath);
    } else if (item.type === "FexFile") {
      // FexFileの場合は新しいタブでレポートを開く
      const reportUrl = webfocusService.getReportUrl(item.fullPath);
      window.open(reportUrl, '_blank');
    } else if (item.type === "URLFile") {
      try {
        // URLFileの場合はコンテンツを取得してURLとして開く
        const url = await webfocusService.getContent(item.fullPath);
        if (url && url.trim()) {
          window.open(url.trim(), '_blank');
        } else {
          console.error('Empty URL content received');
        }
      } catch (error) {
        console.error('Error opening URL file:', error);
      }
    }
  };

  // パスをクリックしたときの処理を追加
  const handlePathClick = (path: string) => {
    loadFolderContents(path);
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
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
      )}
    </div>
  );
}

export default App;