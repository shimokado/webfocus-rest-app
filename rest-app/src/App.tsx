import { useState } from 'react';
import { Login } from './components/Login/Login';
import { WebFocusService, FolderItem } from './services/WebFocusService';
import MainLayout from './components/Layout/MainLayout';
import FolderCardGrid from './components/Card/FolderCardGrid';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userFullPath, setUserFullPath] = useState<string | null>(null);
  const [csrfTokenName, setCsrfTokenName] = useState<string | null>(null);
  const [csrfTokenValue, setCsrfTokenValue] = useState<string | null>(null);
  
  // ワークスペース表示用の状態
  const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
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
        
        console.log('保存した状態変数:', {
          userName: username,
          userDisplayName: loginResult.userDisplayName,
          csrfTokenName: loginResult.csrfTokenName,
          csrfTokenValue: loginResult.csrfTokenValue,
          userFullPath: loginResult.userFullPath
        });
        
        return;
      }
      
      throw new Error(loginResult.message);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleWorkspaceClick = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const result = await webfocusService.getResourceItems('IBFS:/WFC/Repository');
      
      if (result.success) {
        setFolderItems(result.items);
      } else {
        setErrorMessage(result.message);
        setFolderItems([]);
      }
    } catch (error) {
      console.error('Error loading workspace:', error);
      setErrorMessage('ワークスペースの読み込み中にエラーが発生しました');
      setFolderItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderItemClick = (item: FolderItem) => {
    console.log('Folder item clicked:', item);
    // ここに項目クリック時の処理を実装
  };

  // 右パネルに表示するコンテンツを決定
  const renderRightPanelContent = () => {
    if (isLoading) {
      return <div className="loading">読み込み中...</div>;
    }

    if (errorMessage) {
      return <div className="error">{errorMessage}</div>;
    }

    if (folderItems.length > 0) {
      return <FolderCardGrid items={folderItems} onItemClick={handleFolderItemClick} />;
    }

    return null;
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
          rightPanelContent={renderRightPanelContent()}
        />
      )}
    </div>
  );
}

export default App;