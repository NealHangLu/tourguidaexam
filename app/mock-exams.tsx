import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { IconSymbol } from '../components/ui/icon-symbol';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, View } from 'react-native';

// 模拟考试卷数据
interface ExamPaper {
  id: number;
  title: string;
  subject: string;
  questionCount: number;
  duration: number; // 分钟
  description: string;
}

// 10套全真模拟考试卷数据
const MOCK_EXAM_PAPERS: ExamPaper[] = [
  {
    id: 1,
    title: '全真模拟考卷一',
    subject: '综合知识',
    questionCount: 165,
    duration: 120,
    description: '四科综合测试，接近真实考试难度',
  },
  {
    id: 2,
    title: '全真模拟考卷二',
    subject: '综合知识',
    questionCount: 165,
    duration: 120,
    description: '历年真题精选与预测题目组合',
  },
  {
    id: 3,
    title: '全真模拟考卷三',
    subject: '综合知识',
    questionCount: 165,
    duration: 120,
    description: '重点难点突破训练',
  },
  {
    id: 4,
    title: '全真模拟考卷四',
    subject: '综合知识',
    questionCount: 165,
    duration: 120,
    description: '高频考点强化练习',
  },
  {
    id: 5,
    title: '全真模拟考卷五',
    subject: '综合知识',
    questionCount: 165,
    duration: 120,
    description: '易错题目专项训练',
  },
  {
    id: 6,
    title: '全真模拟考卷六',
    subject: '综合知识',
    questionCount: 165,
    duration: 120,
    description: '冲刺备考综合测试',
  },
  {
    id: 7,
    title: '全真模拟考卷七',
    subject: '综合知识',
    questionCount: 165,
    duration: 120,
    description: '最新考试大纲题型',
  },
  {
    id: 8,
    title: '全真模拟考卷八',
    subject: '综合知识',
    questionCount: 165,
    duration: 120,
    description: '综合能力提升训练',
  },
  {
    id: 9,
    title: '全真模拟考卷九',
    subject: '综合知识',
    questionCount: 165,
    duration: 120,
    description: '考试技巧实战演练',
  },
  {
    id: 10,
    title: '全真模拟考卷十',
    subject: '综合知识',
    questionCount: 165,
    duration: 120,
    description: '最终冲刺模拟测试',
  },
];

const MockExamListScreen = () => {
  const handleStartExam = useCallback((exam: ExamPaper) => {
    // 导航到考试页面并传递试卷ID
    router.push({
      pathname: '/exam',
      params: { paperId: exam.id.toString(), title: exam.title }
    });
  }, []);

  const renderExamPaper = ({ item }: { item: ExamPaper }) => (
    <TouchableOpacity 
      style={styles.examCard}
      onPress={() => handleStartExam(item)}
    >
      <View style={styles.examHeader}>
        <ThemedText style={styles.examTitle}>{item.title}</ThemedText>
        <View style={styles.examBadge}>
          <ThemedText style={styles.examBadgeText}>{item.subject}</ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.examDescription}>{item.description}</ThemedText>
      
      <View style={styles.examFooter}>
        <View style={styles.examInfo}>
          <IconSymbol name="doc.text.fill" size={16} color="#6C757D" />
          <ThemedText style={styles.examInfoText}>{item.questionCount}题</ThemedText>
        </View>
        <View style={styles.examInfo}>
          <IconSymbol name="timer" size={16} color="#6C757D" />
          <ThemedText style={styles.examInfoText}>{item.duration}分钟</ThemedText>
        </View>
        <TouchableOpacity style={styles.startButton}>
          <ThemedText style={styles.startButtonText}>开始</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* 使用Expo Router的默认导航栏 */}

      {/* 考试列表 */}
      <FlatList
        data={MOCK_EXAM_PAPERS}
        renderItem={renderExamPaper}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    // 确保header在最顶部
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerRight: {
    width: 40,
  },
  listContent: {
        padding: 2,
  },
  examCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
  },
  examBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  examBadgeText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
  examDescription: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 16,
    lineHeight: 20,
  },
  examFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  examInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  examInfoText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 4,
  },
  startButton: {
    marginLeft: 'auto',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MockExamListScreen;