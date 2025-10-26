import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { IconSymbol } from '../components/ui/icon-symbol';
import { MOCK_INTERVIEW_QUESTIONS } from '../data/mockData';
import { InterviewPracticeType } from '../types';

export default function InterviewPracticePage() {
  // 获取路由参数
  const params = useLocalSearchParams();
  const practiceType = params.practiceType as InterviewPracticeType;
  const regionId = params.regionId as string;
  const regionName = params.regionName as string;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userInput, setUserInput] = useState('');

  // 根据练习类型和地区筛选题目
  const questions = useMemo(() => {
    if (practiceType === 'regional_speech' && regionId) {
      return MOCK_INTERVIEW_QUESTIONS.filter(
        q => q.practiceType === practiceType && q.regionId === regionId
      );
    }
    return MOCK_INTERVIEW_QUESTIONS.filter(q => q.practiceType === practiceType && !q.regionId);
  }, [practiceType, regionId]);

  // 获取当前题目
  const currentQuestion = questions[currentIndex];

  // 处理下一题
  const handleNext = () => {
    setShowExplanation(false);
    setUserInput('');
    setCurrentIndex(prev => (prev + 1) % questions.length);
  };

  // 返回上一页
  const handleBack = () => {
    router.back();
  };

  // 设置动态标题
  const headerTitle = useMemo(() => {
    const practiceTypeName = getPracticeTypeName(practiceType);
    const regionText = regionName || '默认地区';
    return `${regionText} ${practiceTypeName}`;
  }, [practiceType, regionName]);

  // 如果没有题目
  if (questions.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyTitle}>暂无题目</ThemedText>
          <ThemedText style={styles.emptyMessage}>
            该地区或该分类下暂时没有面试题目。
          </ThemedText>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
          >
            <ThemedText style={styles.backButtonText}>返回</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 使用Expo Router的默认导航栏 */}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 题目区域 */}
        <ThemedView style={styles.questionCard}>
          <ThemedText style={styles.questionNumber}>题目 {currentIndex + 1}/{questions.length}</ThemedText>
          <ThemedText style={styles.questionContent}>
            {currentQuestion.content}
          </ThemedText>
        </ThemedView>

        {/* 答案输入区域 */}
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="请在此处输入您的答案..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
          />
        </ThemedView>

        {/* 答案解析区域 */}
        {showExplanation && (
          <ThemedView style={styles.explanationCard}>
            <ThemedText style={styles.explanationTitle}>答案详解</ThemedText>
            <ThemedText style={styles.explanationContent}>
              {currentQuestion.explanation}
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      {/* 底部操作按钮 */}
      <ThemedView style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.viewAnswerButton,
            showExplanation && styles.disabledButton
          ]}
          onPress={() => setShowExplanation(true)}
          disabled={showExplanation}
        >
          <ThemedText style={styles.buttonText}>查看解析</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.nextButton]}
          onPress={handleNext}
        >
          <ThemedText style={styles.buttonText}>下一题</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* 底部Tab导航 */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => router.push('/')}
        >
          <IconSymbol name="pencil.and.outline" size={24} color="#6C757D" />
          <ThemedText style={styles.tabText}>笔试</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => router.push('/interview')}
        >
          <IconSymbol name="person.2.fill" size={24} color="#007AFF" />
          <ThemedText style={styles.tabText}>面试</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => router.push('/study')}
        >
          <IconSymbol name="book.fill" size={24} color="#6C757D" />
          <ThemedText style={styles.tabText}>学习</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => router.push('/profile')}
        >
          <IconSymbol name="person.fill" size={24} color="#6C757D" />
          <ThemedText style={styles.tabText}>我的</ThemedText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// 根据练习类型获取中文名称
function getPracticeTypeName(type: InterviewPracticeType): string {
  const typeMap = {
    'contingency': '应变能力问答',
    'comprehensive': '综合知识问答',
    'service_standards': '导游服务规范问答',
    'regional_speech': '地区导游词'
  };
  return typeMap[type];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    // 确保内容不被系统状态栏遮挡
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    height: 60,
    zIndex: 1000,
    // 确保导航栏在顶部
    position: 'relative',
  },
  headerButton: {
    width: 60,
  },
  headerButtonText: {
    color: '#06B6D4',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 2,
    paddingBottom: 100,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  questionContent: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    lineHeight: 24,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    height: 160,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  explanationCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  explanationContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1E40AF',
  },
  footer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewAnswerButton: {
    backgroundColor: '#3B82F6',
  },
  nextButton: {
    backgroundColor: '#10B981',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.05,
    elevation: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#06B6D4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});