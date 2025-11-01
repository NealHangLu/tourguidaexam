import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// 设置屏幕选项
export const options = {
  title: '欢迎来到考试助手',
  headerBackTitle: '', // 去掉返回按钮旁边的文本
};

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // true为登录，false为注册
  
  // 登录表单状态
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // 注册表单状态
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerVerificationCode, setRegisterVerificationCode] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [verificationId, setVerificationId] = useState(''); // 存储验证码ID
  
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // 环境ID
  const envId = 'cloud1-0gnawc56024b4227';

  // 处理登录
  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert('提示', '请输入邮箱和密码');
      return;
    }
    
    // 简单的邮箱格式验证
    if (!isValidEmail(loginEmail)) {
      Alert.alert('提示', '请输入有效的邮箱地址');
      return;
    }
    
    // 获取转换后的用户名用于登录
    const username = convertEmailToUsername(loginEmail);
    console.log('登录使用的用户名:', username);
    
    // 模拟登录成功
    Alert.alert('成功', '登录成功', [
      { text: '确定', onPress: () => router.back() }
    ]);
  };

  // 处理注册
  const handleRegister = async () => {
    if (!registerEmail || !registerVerificationCode || !registerPassword || !registerConfirmPassword) {
      Alert.alert('提示', '请填写所有必填信息');
      return;
    }
    
    // 简单的邮箱格式验证
    if (!isValidEmail(registerEmail)) {
      Alert.alert('提示', '请输入有效的邮箱地址');
      return;
    }
    
    // 验证密码格式
    if (!isValidPassword(registerPassword)) {
      Alert.alert('提示', '密码必须包含数字且长度至少8个字符');
      return;
    }
    
    // 验证两次密码是否一致
    if (registerPassword !== registerConfirmPassword) {
      Alert.alert('提示', '两次输入的密码不一致');
      return;
    }
    
    try {
      console.log('开始注册流程');
      console.log('邮箱:', registerEmail);
      console.log('验证码:', registerVerificationCode);
      console.log('验证码ID:', verificationId);
      
      // 先验证验证码
      console.log('开始验证验证码');
      const verifyResponse = await fetch(`https://${envId}.api.tcloudbasegateway.com/auth/v1/verification/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          verification_id: verificationId,
          verification_code: registerVerificationCode
        })
      });
      
      console.log('验证码验证响应状态:', verifyResponse.status);
      const verifyData = await verifyResponse.json();
      console.log('验证码验证响应数据:', verifyData);
      
      if (verifyResponse.ok) {
        // 验证码验证成功，进行注册
        console.log('验证码验证成功，开始注册');
        const registerResponse = await fetch(`https://${envId}.api.tcloudbasegateway.com/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-device-id': 'device_id_' + Math.random().toString(36).substr(2, 9) // 生成随机设备ID
          },
          body: JSON.stringify({
            email: registerEmail,
            username: convertEmailToUsername(registerEmail), // 将邮箱转换为特殊格式的用户名
            verification_token: verifyData.verification_token,
            password: registerPassword
          })
        });
        
        console.log('注册响应状态:', registerResponse.status);
        const registerData = await registerResponse.json();
        console.log('注册响应数据:', registerData);
        
        if (registerResponse.ok) {
          // 注册成功
          Alert.alert('成功', '注册成功', [
            { text: '确定', onPress: () => {
              // 注册成功后显示登录成功，并返回
              Alert.alert('成功', '登录成功', [
                { text: '确定', onPress: () => router.back() }
              ]);
              // 清空表单
              setIsLogin(true);
              setRegisterEmail('');
              setRegisterVerificationCode('');
              setRegisterPassword('');
              setRegisterConfirmPassword('');
              setVerificationId('');
            }}
          ]);
        } else {
        console.error('注册失败:', registerData);
        // 显示更详细的错误信息
        const errorDetails = Object.keys(registerData).length > 0 
          ? `详细信息: ${JSON.stringify(registerData)}` 
          : '无详细错误信息';
        Alert.alert('注册失败', `${registerData.message || '请稍后重试'}\n错误码: ${registerResponse.status}\n${errorDetails}`);
      }
    } else {
      console.error('验证码验证失败:', verifyData);
      const errorDetails = Object.keys(verifyData).length > 0 
        ? `详细信息: ${JSON.stringify(verifyData)}` 
        : '无详细错误信息';
      Alert.alert('验证码错误', `${verifyData.message || '请输入正确的验证码'}\n错误码: ${verifyResponse.status}\n${errorDetails}`);
    }
  } catch (error: any) {
    console.error('注册过程异常:', error);
    Alert.alert('操作失败', `网络错误: ${error.message || String(error)}\n错误类型: ${error.name || 'Unknown'}`);
  }
  };

  // 发送邮箱验证码
  const handleSendVerificationCode = async () => {
    setIsSendingCode(true);
    
    // 确保邮箱格式正确
    if (!isValidEmail(registerEmail)) {
      setIsSendingCode(false);
      Alert.alert('提示', '请输入有效的邮箱地址');
      return;
    }
    
    try {
      console.log('开始发送验证码，邮箱:', registerEmail);
      console.log('环境ID:', envId);
      console.log('API URL:', `https://${envId}.api.tcloudbasegateway.com/auth/v1/verification`);
      
      // 构造请求数据，根据API文档要求
      const requestData = {
        email: registerEmail,
        target: 'ANY' // 根据API文档要求，target应为ANY
      };
      
      console.log('请求数据:', JSON.stringify(requestData));
      
      // 添加超时处理
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const response = await fetch(`https://${envId}.api.tcloudbasegateway.com/auth/v1/verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('验证码请求响应状态:', response.status);
      console.log('响应头:', Object.fromEntries(response.headers));
      
      // 尝试解析响应数据
      let data;
      try {
        data = await response.json();
        console.log('验证码请求响应数据:', data);
      } catch (jsonError: any) {
        console.error('JSON解析错误:', jsonError);
        setIsSendingCode(false);
        Alert.alert('发送失败', '服务器返回格式错误，请稍后重试');
        return;
      }
      
      if (response.ok) {
        // 保存验证码ID
        setVerificationId(data.verification_id || '');
        setIsSendingCode(false);
        setCountdown(60);
        startCountdown();
        Alert.alert('提示', '发送成功');
        
        // 检查用户是否已存在
        if (data.is_user) {
          Alert.alert('提示', '该邮箱已注册，请直接登录');
        }
      } else {
        setIsSendingCode(false);
        console.error('发送验证码失败:', data);
        Alert.alert('发送失败', `错误码: ${response.status}\n${data.message || '请稍后重试'}`);
      }
    } catch (error: any) {
      setIsSendingCode(false);
      console.error('发送验证码异常:', error);
      
      // 处理特定错误类型
      if (error.name === 'AbortError') {
        Alert.alert('发送失败', '请求超时，请检查网络连接后重试');
      } else if (error.message?.includes('Network')) {
        Alert.alert('发送失败', '网络连接失败，请检查网络设置');
      } else {
        Alert.alert('发送失败', `错误: ${error.message || String(error)}`);
      }
    }
  };

  // 开始倒计时
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  // 验证邮箱格式
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // 将邮箱转换为特殊格式的用户名：@替换为at，.替换为dot
  const convertEmailToUsername = (email: string) => {
    return email.replace(/@/g, 'at').replace(/\./g, 'dot');
  };
  
  // 验证密码格式：长度≥8且包含数字
  const isValidPassword = (password: string) => {
    return password.length >= 8 && /\d/.test(password);
  };
  
  // 检查注册按钮是否可点击
  const canRegister = () => {
    return registerEmail && 
           registerVerificationCode && 
           registerPassword && 
           registerConfirmPassword &&
           isValidPassword(registerPassword) &&
           registerPassword === registerConfirmPassword;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 调整顶部间距 */}
        <View style={{ marginTop: 20 }} />

        {/* 登录/注册切换 */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isLogin && styles.toggleButtonActive
            ]}
            onPress={() => setIsLogin(true)}
          >
            <ThemedText 
              style={[
                styles.toggleText,
                isLogin && styles.toggleTextActive
              ]}
            >
              登录
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !isLogin && styles.toggleButtonActive
            ]}
            onPress={() => setIsLogin(false)}
          >
            <ThemedText 
              style={[
                styles.toggleText,
                !isLogin && styles.toggleTextActive
              ]}
            >
              注册
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* 表单区域 */}
        <ThemedView style={styles.formContainer}>
          {isLogin ? (
            // 登录表单
            <>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>邮箱</ThemedText>
                <View style={styles.inputWrapper}>
                  <IconSymbol name="envelope" size={20} color="#808080" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="请输入邮箱地址"
                    placeholderTextColor="#808080"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>密码</ThemedText>
                <View style={styles.inputWrapper}>
                  <IconSymbol name="lock" size={20} color="#808080" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="请输入密码"
                    placeholderTextColor="#808080"
                    secureTextEntry
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <ThemedText style={styles.forgotPasswordText}>忘记密码？</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleLogin}
              >
                <ThemedText style={styles.submitButtonText}>登录</ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            // 注册表单
            <>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>邮箱</ThemedText>
                <View style={styles.inputWrapper}>
                  <IconSymbol name="envelope" size={20} color="#808080" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="请输入邮箱地址"
                    placeholderTextColor="#808080"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={registerEmail}
                    onChangeText={setRegisterEmail}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>验证码</ThemedText>
                <View style={styles.verificationCodeContainer}>
                  <View style={[styles.inputWrapper, styles.verificationCodeInput]}>
                    <IconSymbol name="key" size={20} color="#808080" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="请输入验证码"
                      placeholderTextColor="#808080"
                      keyboardType="number-pad"
                      value={registerVerificationCode}
                      onChangeText={setRegisterVerificationCode}
                    />
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.sendCodeButton,
                      ((isSendingCode || countdown > 0) || !isValidEmail(registerEmail)) && styles.sendCodeButtonDisabled
                    ]}
                    onPress={handleSendVerificationCode}
                    disabled={isSendingCode || countdown > 0 || !isValidEmail(registerEmail)}
                  >
                    <ThemedText style={styles.sendCodeButtonText}>
                      {isSendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '发送验证码'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>密码</ThemedText>
                <View style={styles.inputWrapper}>
                  <IconSymbol name="lock" size={20} color="#808080" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="请设置密码（至少8位且包含数字）"
                    placeholderTextColor="#808080"
                    secureTextEntry
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
                    // 禁用自动填充和自动完成
                    autoComplete="off"
                    autoCorrect={false}
                    contextMenuHidden={true}
                    // 移除可能触发自动填充的属性
                    // 不设置textContentType以避免系统识别为密码字段
                    // 清除按钮
                    clearButtonMode="while-editing"
                    // 添加额外的禁用自动填充属性
                    autoCapitalize="none"
                    keyboardType="default"
                    // 确保输入框焦点行为正常
                    blurOnSubmit={false}
                  />
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>确认密码</ThemedText>
                <View style={styles.inputWrapper}>
                  <IconSymbol name="lock" size={20} color="#808080" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="请再次输入密码"
                    placeholderTextColor="#808080"
                    secureTextEntry
                    value={registerConfirmPassword}
                    onChangeText={setRegisterConfirmPassword}
                    // 禁用自动填充和自动完成
                    autoComplete="off"
                    autoCorrect={false}
                    contextMenuHidden={true}
                    // 移除可能触发自动填充的属性
                    // 不设置textContentType以避免系统识别为密码字段
                    // 清除按钮
                    clearButtonMode="while-editing"
                    // 添加额外的禁用自动填充属性
                    autoCapitalize="none"
                    keyboardType="default"
                    // 确保输入框焦点行为正常
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  !canRegister() && styles.sendCodeButtonDisabled
                ]}
                onPress={handleRegister}
                disabled={!canRegister()}
              >
                <ThemedText style={styles.submitButtonText}>注册</ThemedText>
              </TouchableOpacity>
            </>
          )}
        </ThemedView>

        {/* 其他登录方式 */}
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 20,
    padding: 10,
    alignSelf: 'flex-start',
  },
  headerContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  toggleTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  verificationCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verificationCodeInput: {
    flex: 1,
  },
  sendCodeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  sendCodeButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  sendCodeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#007AFF',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  otherLoginContainer: {
    marginTop: 'auto',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#999',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
