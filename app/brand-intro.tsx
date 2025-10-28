import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BrandIntroScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* 内容区域 */}
      <ThemedView style={styles.content}>
        {/* 移除导游证考试助手标题 */}
        <ThemedText style={styles.paragraph}>
          导游证考试助手是一款专为备考导游资格证的考生打造的学习应用。我们致力于提供高质量的学习资源和便捷的学习工具，帮助考生高效备考，顺利通过考试。
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          我们的团队由资深导游和教育专家组成，深入研究考试大纲和命题规律，为考生提供精准的复习资料和模拟试题。无论您是零基础的初学者，还是有一定经验的备考者，我们都能满足您的学习需求。
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          感谢您选择导游证考试助手，祝您考试顺利！
        </ThemedText>
      </ThemedView>
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
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
});