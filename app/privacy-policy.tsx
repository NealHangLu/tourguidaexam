import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PrivacyPolicyScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* 内容区域 */}
      <ScrollView style={styles.content}>
        {/* 移除隐私政策标题 */}
        <ThemedText style={styles.paragraph}>
          本隐私政策描述了导游证考试助手如何收集、使用、存储和保护您的个人信息。请您仔细阅读本政策，了解我们如何处理您的信息。
        </ThemedText>
        
        <ThemedText style={styles.subheading}>1. 信息收集</ThemedText>
        <ThemedText style={styles.paragraph}>
          我们可能收集以下类型的信息：
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          - 个人身份信息：如姓名、邮箱地址、电话号码等
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          - 使用信息：如应用使用记录、学习进度等
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          - 设备信息：如设备型号、操作系统版本等
        </ThemedText>

        <ThemedText style={styles.subheading}>2. 信息使用</ThemedText>
        <ThemedText style={styles.paragraph}>
          我们使用收集的信息来：
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          - 提供、维护和改进我们的服务
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          - 发送通知和更新
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          - 个性化您的用户体验
        </ThemedText>

        <ThemedText style={styles.subheading}>3. 信息保护</ThemedText>
        <ThemedText style={styles.paragraph}>
          我们采取合理的安全措施来保护您的个人信息，防止未经授权的访问、使用或泄露。
        </ThemedText>

        <ThemedText style={styles.subheading}>4. 政策更新</ThemedText>
        <ThemedText style={styles.paragraph}>
          我们可能会不时更新本隐私政策，并在应用内通知您重要的变更。
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          如有任何问题或疑虑，请随时联系我们。
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
});