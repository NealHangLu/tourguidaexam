import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// 模拟获取用户ID的函数（实际应用中应从登录状态或存储中获取）
const getUserId = (): string => {
  // 在实际应用中，这里应该从用户登录状态或本地存储中获取真实的用户ID
  // 这里返回一个模拟的用户ID
  return 'user_123456';
};

// 模拟发送反馈到后台的函数
const sendFeedbackToBackend = async (userId: string, feedback: string): Promise<boolean> => {
  try {
    // 在实际应用中，这里应该是一个真实的API请求
    // 例如：await fetch('https://api.example.com/feedback', { method: 'POST', ... });
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟成功响应
    console.log('发送反馈到后台:', { userId, feedback });
    return true;
  } catch (error) {
    console.error('发送反馈失败:', error);
    return false;
  }
};

export default function ContactSupportScreen() {
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userId = getUserId();

  const handleSendFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('提示', '请输入反馈内容');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await sendFeedbackToBackend(userId, feedback);
      
      if (success) {
        Alert.alert('成功', '您的反馈已发送，感谢您的支持！', [
          {
            text: '确定',
            onPress: () => {
              // 清空输入框
              setFeedback('');
            }
          }
        ]);
      } else {
        Alert.alert('发送失败', '请稍后再试');
      }
    } catch (error) {
      Alert.alert('错误', '发送过程中出现错误，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.description}>
          请输入您的问题或建议，我们会尽快处理并回复您。
        </ThemedText>
        
        <TextInput
          style={styles.textInput}
          placeholder="请输入您的问题或建议..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={feedback}
          onChangeText={setFeedback}
          editable={!isLoading}
        />
        
        <ThemedText style={styles.charCount}>
          {feedback.length} / 500
        </ThemedText>
        
        <TouchableOpacity 
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
          onPress={handleSendFeedback}
          disabled={isLoading}
        >
          <ThemedText style={styles.sendButtonText}>
            {isLoading ? '发送中...' : '发送'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    marginBottom: 20,
    lineHeight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    fontSize: 16,
    color: '#000',
  },
  charCount: {
    alignSelf: 'flex-end',
    marginTop: 8,
    fontSize: 12,
    color: '#999',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});