import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 用户信息接口定义
interface User {
  email: string;
  username: string;
}

// 认证上下文接口定义
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化时检查存储的认证信息
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userInfo');
        const expiryTime = await AsyncStorage.getItem('tokenExpiry');

        // 检查token是否过期
        if (storedToken && storedUser && expiryTime) {
          const now = new Date().getTime();
          if (now < parseInt(expiryTime)) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // token过期，清除存储
            await AsyncStorage.multiRemove(['userToken', 'userInfo', 'tokenExpiry']);
          }
        }
      } catch (error) {
        console.error('加载用户认证信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // 登录方法
  const login = async (email: string, token: string) => {
    try {
      // 简化用户信息，不进行邮箱格式转换
      const userInfo = { email, username: email };
      
      // 设置token过期时间（假设24小时后过期）
      const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;

      // 存储认证信息
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      await AsyncStorage.setItem('tokenExpiry', expiryTime.toString());

      // 更新状态
      setToken(token);
      setUser(userInfo);
    } catch (error) {
      console.error('保存用户认证信息失败:', error);
      throw error;
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      // 清除存储的认证信息
      await AsyncStorage.multiRemove(['userToken', 'userInfo', 'tokenExpiry']);

      // 重置状态
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('清除用户认证信息失败:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，用于访问认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};