import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HelpScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.paragraph}>
            欢迎使用导游证考试助手！本帮助页面将为您提供使用指南，解决您在使用过程中可能遇到的问题。
          </ThemedText>
          
          <ThemedText style={styles.subheading}>1. 注册与登录</ThemedText>
          <ThemedText style={styles.paragraph}>
            - 点击"我的"页面中的"登录/注册"按钮
            - 选择手机号注册或第三方账号登录
            - 按照提示完成验证即可使用全部功能
          </ThemedText>
          
          <ThemedText style={styles.subheading}>2. 题库使用</ThemedText>
          <ThemedText style={styles.paragraph}>
            - 在"首页"浏览推荐题目和热门练习
            - 在"学习"页面选择分类进行专项练习
            - 完成题目后可查看详细解析
            - 错题会自动收录到"错题集"中
          </ThemedText>
          
          <ThemedText style={styles.subheading}>3. 模拟考试</ThemedText>
          <ThemedText style={styles.paragraph}>
            - 在"首页"或"学习"页面进入模拟考试
            - 选择考试类型和题目数量
            - 完成考试后可查看得分和错题分析
          </ThemedText>
          
          <ThemedText style={styles.subheading}>4. 面试练习</ThemedText>
          <ThemedText style={styles.paragraph}>
            - 在"面试"页面选择面试区域
            - 浏览景点介绍和面试要点
            - 进行模拟面试练习
          </ThemedText>
          
          <ThemedText style={styles.subheading}>5. 常见问题</ThemedText>
          <ThemedText style={styles.paragraph}>
            - Q: 如何修改个人信息？
            - A: 登录后在"我的"页面点击头像进入个人信息设置
            
            - Q: 如何清除缓存？
            - A: 在"我的"页面选择"设置"，然后点击"清除缓存"
            
            - Q: 遇到技术问题怎么办？
            - A: 请通过"联系客服"功能反馈您的问题
          </ThemedText>
          
          <ThemedText style={styles.subheading}>6. 联系我们</ThemedText>
          <ThemedText style={styles.paragraph}>
            - 客服邮箱: support@tourguideexam.com
            - 工作时间: 周一至周五 9:00-18:00
            - 官方微信: TourGuideExam
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  paragraph: {
    marginBottom: 20,
    lineHeight: 24,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 24,
  },
});