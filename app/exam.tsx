import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { IconSymbol } from '../components/ui/icon-symbol';

// 题目类型枚举
enum QuestionType {
  SINGLE = 'single',
  MULTI = 'multi',
  JUDGEMENT = 'judgement'
}

// 题目接口
interface Question {
  id: number;
  subjectId: string;
  type: QuestionType;
  content: string;
  options?: { key: string; value: string }[];
  answer: string[];
  explanation: string;
  regionId?: number;
}

// 考试会话接口
interface ExamSession {
  questions: Question[];
  currentIndex: number;
  userAnswers: { [key: number]: string[] };
  subjectId: string;
  startTime: Date;
}

// 模拟数据
const MOCK_QUESTIONS: Question[] = [
  // 法规 (fagui)
  { 
    id: 101, 
    subjectId: 'fagui', 
    type: QuestionType.SINGLE, 
    content: '《旅游法》规定，导游人员进行导游活动时，( )佩戴导游证。', 
    options: [
      {key: 'A', value: '必须'}, 
      {key: 'B', value: '不必'}, 
      {key: 'C', value: '酌情'}, 
      {key: 'D', value: '建议'}
    ], 
    answer: ['A'], 
    explanation: '根据《旅游法》第三十八条规定，导游人员进行导游活动时，必须佩戴导游证。这是法定要求，便于身份识别和行业监管。' 
  },
  { 
    id: 102, 
    subjectId: 'fagui', 
    type: QuestionType.SINGLE, 
    content: '旅行社安排旅游者到指定具体购物场所购物的，应当( )。', 
    options: [
      {key: 'A', value: '口头征得旅游者同意'}, 
      {key: 'B', value: '在包价旅游合同中载明'}, 
      {key: 'C', value: '事先通知即可'}, 
      {key: 'D', value: '由导游决定'}
    ], 
    answer: ['B'], 
    explanation: '根据《旅游法》第三十五条，旅行社组织、接待旅游者，不得指定具体购物场所。经双方协商一致或者旅游者要求，且不影响其他旅游者行程安排的除外。此种情况必须在合同中明确约定。' 
  },
  { 
    id: 103, 
    subjectId: 'fagui', 
    type: QuestionType.JUDGEMENT, 
    content: '导游可以向游客索取小费。', 
    answer: ['F'], 
    explanation: '《导游人员管理条例》明确规定，导游人员不得向旅游者索取小费。这是严重违反职业道德和法律法规的行为。' 
  },
  { 
    id: 104, 
    subjectId: 'fagui', 
    type: QuestionType.MULTI, 
    content: '以下哪些属于导游的法定职责？', 
    options: [
      {key: 'A', value: '讲解'}, 
      {key: 'B', value: '引导'}, 
      {key: 'C', value: '保护旅游者人身财产安全'}, 
      {key: 'D', value: '垫付旅游费用'}
    ], 
    answer: ['A', 'B', 'C'], 
    explanation: '导游的法定职责主要包括引导旅游者、讲解文化内涵、提供相关服务，并有责任提醒和保护旅游者的人身、财物安全。垫付费用不是法定职责。' 
  },
  { 
    id: 105, 
    subjectId: 'fagui', 
    type: QuestionType.SINGLE, 
    content: '旅游合同的签订主体是？', 
    options: [
      {key: 'A', value: '导游和游客'}, 
      {key: 'B', value: '旅行社和游客'}, 
      {key: 'C', value: '景区和游客'}, 
      {key: 'D', value: '酒店和游客'}
    ], 
    answer: ['B'], 
    explanation: '旅游合同是约定旅行社与旅游者权利义务的协议。因此，签订主体是提供旅游服务的旅行社和接受服务的旅游者。' 
  },

  // 全国导游基础 (quandao)
  { 
    id: 201, 
    subjectId: 'quandao', 
    type: QuestionType.SINGLE, 
    content: '中国的"瓷都"是指哪个城市？', 
    options: [
      {key: 'A', value: '景德镇'}, 
      {key: 'B', value: '德化'}, 
      {key: 'C', value: '醴陵'}, 
      {key: 'D', value: '宜兴'}
    ], 
    answer: ['A'], 
    explanation: '江西省景德镇市以其悠久的制瓷历史和精美的瓷器产品而闻名于世，被誉为中国的"瓷都"。' 
  },
  { 
    id: 202, 
    subjectId: 'quandao', 
    type: QuestionType.SINGLE, 
    content: '中国四大发明不包括哪一项？', 
    options: [
      {key: 'A', value: '造纸术'}, 
      {key: 'B', value: '印刷术'}, 
      {key: 'C', value: '地动仪'}, 
      {key: 'D', value: '指南针'}
    ], 
    answer: ['C'], 
    explanation: '中国的四大发明是造纸术、印刷术、指南针和火药。地动仪是东汉科学家张衡发明的杰出地震探测仪器，但不属于四大发明。' 
  },
  { 
    id: 203, 
    subjectId: 'quandao', 
    type: QuestionType.JUDGEMENT, 
    content: '长城是世界上最长的人造建筑。', 
    answer: ['T'], 
    explanation: '长城横跨中国北方，总长度超过2万公里，是世界上规模最宏大、长度最长的人造建筑工程。' 
  },
  { 
    id: 204, 
    subjectId: 'quandao', 
    type: QuestionType.MULTI, 
    content: '以下哪些是中国的五大淡水湖？', 
    options: [
      {key: 'A', value: '鄱阳湖'}, 
      {key: 'B', value: '洞庭湖'}, 
      {key: 'C', value: '太湖'}, 
      {key: 'D', value: '青海湖'}
    ], 
    answer: ['A', 'B', 'C'], 
    explanation: '中国五大淡水湖是鄱阳湖、洞庭湖、太湖、洪泽湖和巢湖。青海湖是中国最大的湖泊，但是咸水湖。' 
  },

  // 导游业务 (yewu)
  { 
    id: 301, 
    subjectId: 'yewu', 
    type: QuestionType.SINGLE, 
    content: '导游服务的首要原则是？', 
    options: [
      {key: 'A', value: '游客至上'}, 
      {key: 'B', value: '安全第一'}, 
      {key: 'C', value: '公司利益'}, 
      {key: 'D', value: '效率优先'}
    ], 
    answer: ['A'], 
    explanation: '导游服务工作的基本原则是"游客至上，服务第一"。安全虽然至关重要，但是服务的核理念是以游客为中心。' 
  },
  { 
    id: 302, 
    subjectId: 'yewu', 
    type: QuestionType.SINGLE, 
    content: '在讲解中，导游应该注视着？', 
    options: [
      {key: 'A', value: '个别游客'}, 
      {key: 'B', value: '领队'}, 
      {key: 'C', value: '大多数游客'}, 
      {key: 'D', value: '前方景物'}
    ], 
    answer: ['C'], 
    explanation: '导游在讲解时，目光应平视并缓慢扫视大多数游客，与游客进行目光交流，这样可以吸引游客的注意力，并观察他们的反应。' 
  },
  { 
    id: 303, 
    subjectId: 'yewu', 
    type: QuestionType.JUDGEMENT, 
    content: '导游可以随意增减旅游项目。', 
    answer: ['F'], 
    explanation: '导游必须严格按照旅游合同和行程计划安排活动，不能随意增减旅游项目。任何变更都需要与旅行社沟通并征得游客同意。' 
  },

  // 地方导游基础 (didao)
  { 
    id: 401, 
    subjectId: 'didao', 
    type: QuestionType.SINGLE, 
    content: '北京故宫又称为什么？', 
    options: [
      {key: 'A', value: '紫禁城'}, 
      {key: 'B', value: '颐和园'}, 
      {key: 'C', value: '圆明园'}, 
      {key: 'D', value: '天坛'}
    ], 
    answer: ['A'], 
    explanation: '北京故宫是中国明清两代的皇家宫殿，旧称为紫禁城，是世界上现存规模最大、保存最为完整的木质结构古建筑之一。' 
  },
  { 
    id: 402, 
    subjectId: 'didao', 
    type: QuestionType.JUDGEMENT, 
    content: '天安门广场是世界上最大的城市广场。', 
    answer: ['T'], 
    explanation: '天安门广场位于北京市中心，南北长880米，东西宽500米，面积达44万平方米，可容纳100万人举行盛大集会，是当今世界上最大的城市广场。' 
  },
  { 
    id: 403, 
    subjectId: 'didao', 
    type: QuestionType.SINGLE, 
    content: '北京的市花是？', 
    options: [
      {key: 'A', value: '牡丹'}, 
      {key: 'B', value: '月季'}, 
      {key: 'C', value: '菊花'}, 
      {key: 'D', value: '兰花'}
    ], 
    answer: ['B'], 
    explanation: '北京市的市花是月季和菊花。题目为单选，通常情况下会考月季。月季象征着"热情、和平、活力"。' 
  }
];

export default function ExamPage() {
    const { subjectId: paramSubjectId, paperId, title } = useLocalSearchParams<{ subjectId: string; paperId: string; title: string }>();
    const subjectId = paramSubjectId || 'fagui';
    const paperTitle = title || '导游考试';
  const [session, setSession] = useState<ExamSession>({
    questions: [],
    currentIndex: 0,
    userAnswers: {},
    subjectId: subjectId || '',
    startTime: new Date()
  });
  
  const [currentSelection, setCurrentSelection] = useState<string[]>([]);
  const [answerStatus, setAnswerStatus] = useState<'unanswered' | 'correct' | 'incorrect'>('unanswered');
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);

  // 根据科目筛选题目
  useEffect(() => {
    const filteredQuestions = MOCK_QUESTIONS.filter(q => q.subjectId === subjectId);
    setSession(prev => ({
      ...prev,
      questions: filteredQuestions
    }));
  }, [subjectId]);

  const currentQuestion = useMemo(() => session.questions[session.currentIndex], [session.questions, session.currentIndex]);

  useEffect(() => {
    setCurrentSelection([]);
    setAnswerStatus('unanswered');
  }, [session.currentIndex]);

  const handleSubmit = useCallback(() => {
    if (!currentQuestion || currentSelection.length === 0) return;
    
    const sortedSelection = [...currentSelection].sort();
    const sortedAnswer = [...currentQuestion.answer].sort();

    const isCorrect = sortedSelection.length === sortedAnswer.length && 
                     sortedSelection.every((val, index) => val === sortedAnswer[index]);

    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    
    // 如果答错了，加入错题集
    if (!isCorrect) {
      setWrongQuestions(prev => [...prev, currentQuestion]);
    }
    
    const newAnswers = { ...session.userAnswers, [currentQuestion.id]: currentSelection };
    setSession(prev => ({ ...prev, userAnswers: newAnswers }));
  }, [currentQuestion, currentSelection, session.userAnswers]);

  const handleNextQuestion = useCallback(() => {
    if (session.currentIndex < session.questions.length - 1) {
      setSession(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    } else {
      finishExam();
    }
  }, [session.currentIndex, session.questions.length]);

  const handleOptionClick = (optionKey: string) => {
    if (!currentQuestion || answerStatus !== 'unanswered') return;

    if (currentQuestion.type === QuestionType.SINGLE || currentQuestion.type === QuestionType.JUDGEMENT) {
      setCurrentSelection([optionKey]);
    } else if (currentQuestion.type === QuestionType.MULTI) {
      setCurrentSelection(prev =>
        prev.includes(optionKey) ? prev.filter(k => k !== optionKey) : [...prev, optionKey]
      );
    }
  };

  const finishExam = () => {
    const correctCount = Object.keys(session.userAnswers).filter(questionId => {
      const question = session.questions.find(q => q.id === parseInt(questionId));
      if (!question) return false;
      const userAnswer = session.userAnswers[parseInt(questionId)];
      const sortedUserAnswer = [...userAnswer].sort();
      const sortedCorrectAnswer = [...question.answer].sort();
      return sortedUserAnswer.length === sortedCorrectAnswer.length && 
             sortedUserAnswer.every((val, index) => val === sortedCorrectAnswer[index]);
    }).length;

    const score = Math.round((correctCount / session.questions.length) * 100);
    
    Alert.alert(
      '考试完成',
      `您的得分：${score}分\n正确题数：${correctCount}/${session.questions.length}\n错题数：${wrongQuestions.length}`,
      [
        { text: '查看错题', onPress: () => console.log('查看错题') },
        { text: '返回首页', onPress: () => router.back() }
      ]
    );
  };

  const getOptionStyle = (optionKey: string) => {
    if (answerStatus === 'unanswered') {
      return currentSelection.includes(optionKey) 
        ? styles.selectedOption
        : styles.option;
    } else {
      const isCorrectAnswer = currentQuestion.answer.includes(optionKey);
      const isSelected = currentSelection.includes(optionKey);

      if (isCorrectAnswer) {
        return styles.correctOption;
      }
      if (isSelected && !isCorrectAnswer) {
        return styles.incorrectOption;
      }
      return styles.disabledOption;
    }
  };

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText style={styles.loadingText}>加载中...</ThemedText>
      </View>
    );
  }

  const progress = ((session.currentIndex + 1) / session.questions.length) * 100;
  const subjectNames = {
    'fagui': '政策与法律法规',
    'quandao': '全国导游基础知识', 
    'yewu': '导游业务',
    'didao': '地方导游基础知识'
  };

  return (
    <View style={styles.container}>
      {/* 使用Expo Router的默认导航栏 */}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 题目类型标签 */}
          <View style={styles.questionTypeContainer}>
            <View style={[
              styles.questionTypeTag,
              currentQuestion.type === QuestionType.SINGLE ? styles.singleSelectTag : styles.otherTypeTag
            ]}>
              <IconSymbol 
                name={currentQuestion.type === QuestionType.SINGLE ? '1.circle.fill' : 
                      currentQuestion.type === QuestionType.MULTI ? 'checkmark.circle.fill' : 'questionmark.circle.fill'} 
                size={12} 
                color={currentQuestion.type === QuestionType.SINGLE ? '#007AFF' : 'white'} 
              />
              <ThemedText style={[
                  styles.questionTypeText,
                  currentQuestion.type === QuestionType.SINGLE && styles.singleSelectText
                ]}>
                {currentQuestion.type === QuestionType.SINGLE ? '单选' : 
                 currentQuestion.type === QuestionType.MULTI ? '多选' : '判断'}
              </ThemedText>
            </View>
            <ThemedText style={styles.questionProgress}>
              {session.currentIndex + 1} / {session.questions.length}
            </ThemedText>
          </View>

        {/* 题目内容 */}
        <ThemedText style={styles.questionContent}>{currentQuestion.content}</ThemedText>
        
        {/* 选项 */}
        <View style={styles.optionsContainer}>
          {currentQuestion.type === QuestionType.JUDGEMENT ? (
            <>
              <TouchableOpacity 
                onPress={() => handleOptionClick('T')} 
                disabled={answerStatus !== 'unanswered'}
                style={getOptionStyle('T')}
              >
                <ThemedText style={styles.optionText}>A. 正确</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleOptionClick('F')} 
                disabled={answerStatus !== 'unanswered'}
                style={getOptionStyle('F')}
              >
                <ThemedText style={styles.optionText}>B. 错误</ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            currentQuestion.options?.map(option => (
              <TouchableOpacity
                key={option.key}
                onPress={() => handleOptionClick(option.key)}
                disabled={answerStatus !== 'unanswered'}
                style={getOptionStyle(option.key)}
              >
                <ThemedText style={styles.optionText}>
                  {option.key}. {option.value}
                </ThemedText>
              </TouchableOpacity>
            ))
          )}
        </View>

          {/* 答案解析 */}
          {answerStatus !== 'unanswered' && (
            <View style={styles.explanationContainer}>
              <View style={styles.explanationHeader}>
                <View style={styles.resultContainer}>
                  <IconSymbol 
                    name={answerStatus === 'correct' ? 'checkmark.circle.fill' : 'xmark.circle.fill'} 
                    size={24} 
                    color={answerStatus === 'correct' ? '#34C759' : '#FF3B30'} 
                  />
                  <ThemedText style={[
                    styles.resultText,
                    { color: answerStatus === 'correct' ? '#34C759' : '#FF3B30' }
                  ]}>
                    {answerStatus === 'correct' ? '回答正确' : '回答错误'}
                  </ThemedText>
                </View>
                <View style={styles.correctAnswerContainer}>
                  <IconSymbol name="lightbulb.fill" size={16} color="#FF9500" />
                  <ThemedText style={styles.correctAnswerText}>
                    正确答案: {currentQuestion.answer.join(', ')}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.explanationTitleContainer}>
                <IconSymbol name="doc.text.fill" size={18} color="#007AFF" />
                <ThemedText style={styles.explanationTitle}>答案解析</ThemedText>
              </View>
              <ThemedText style={styles.explanationText}>{currentQuestion.explanation}</ThemedText>
            </View>
          )}
      </ScrollView>
      
      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={currentSelection.length === 0 || answerStatus !== 'unanswered'}
          style={[
            styles.submitButton,
            (currentSelection.length === 0 || answerStatus !== 'unanswered') && styles.disabledButton
          ]}
        >
          <ThemedText style={styles.buttonText}>提交</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextQuestion}
          disabled={answerStatus === 'unanswered'}
          style={[
            styles.nextButton,
            answerStatus === 'unanswered' && styles.disabledButton
          ]}
        >
          <ThemedText style={styles.buttonText}>
            {session.currentIndex < session.questions.length - 1 ? '下一题' : '完成考试'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 18,
    color: '#6C757D',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  headerRight: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  content: {
      flex: 1,
      padding: 2,
      paddingBottom: 20
    },
  questionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  questionTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  singleSelectTag: {
      backgroundColor: '#E3F2FD',
      shadowColor: '#007AFF',
    },
    singleSelectText: {
      color: '#007AFF',
    },
    otherTypeTag: {
      backgroundColor: '#34C759',
      shadowColor: '#34C759',
    },
  questionProgress: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '600',
  },
  questionTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  questionContent: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 28,
    marginBottom: 32,
    textAlign: 'left',
  },
  optionsContainer: {
    marginBottom: 32,
  },
  option: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  correctOption: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#34C759',
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  incorrectOption: {
    backgroundColor: '#FEF2F2',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledOption: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 17,
    color: '#1A1A1A',
    fontWeight: '500',
    lineHeight: 24,
  },
  explanationContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  explanationHeader: {
    marginBottom: 16,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  correctAnswerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  correctAnswerText: {
    fontSize: 15,
    color: '#6C757D',
    fontWeight: '500',
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginBottom: 16,
  },
  explanationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F8F9FA',
    gap: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#CED4DA',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  
});
