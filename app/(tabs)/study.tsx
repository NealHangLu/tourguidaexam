import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

// 定义学习数据类型
interface StudyData {
  minutes: number;
  questions: number;
  accuracy: number;
}

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function StudyScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Array<{ date: Date; day: number; isToday: boolean }>>([]);
  const [studyData, setStudyData] = useState<StudyData>({
    minutes: 0,
    questions: 0,
    accuracy: 0
  });
  
  // 学习记录存储 - 在实际应用中应使用更持久的存储方式
  const [studyRecords, setStudyRecords] = useState<{[key: string]: StudyData}>({});
  
  // 获取日期的字符串表示，用于作为存储的键
  const getDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // 生成7天的日期数据并初始化存储
  useEffect(() => {
    const today = new Date();
    const days: Array<{ date: Date; day: number; isToday: boolean }> = [];
    const initialRecords: {[key: string]: StudyData} = {};
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = getDateKey(date);
      // 初始化每条记录都默认为0
      initialRecords[dateKey] = { minutes: 0, questions: 0, accuracy: 0 };
      days.push({
        date,
        day: date.getDate(),
        isToday: i === 0
      });
    }
    
    setWeekDays(days);
    setStudyRecords(initialRecords);
    // 默认选中今天
    setSelectedDate(today);
    
    // 初始化今天的数据为0
    setStudyData({ minutes: 0, questions: 0, accuracy: 0 });
  }, []);
  
  // 更新学习记录的函数 - 在实际应用中，应在用户完成学习活动时调用此函数
  const updateStudyRecord = (date: Date, minutes: number, questionsAnswered: number, correctAnswers: number) => {
    const dateKey = getDateKey(date);
    const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
    
    setStudyRecords(prev => ({
      ...prev,
      [dateKey]: {
        minutes,
        questions: questionsAnswered,
        accuracy
      }
    }));
    
    // 如果更新的是当前选中的日期，同步更新显示数据
    if (getDateKey(date) === getDateKey(selectedDate)) {
      setStudyData({ minutes, questions: questionsAnswered, accuracy });
    }
  };
  
  // 当日期改变时，获取对应的数据
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateKey = getDateKey(date);
    
    // 从记录中获取对应日期的数据，如果没有则默认为0
    const data = studyRecords[dateKey] || { minutes: 0, questions: 0, accuracy: 0 };
    setStudyData(data);
  };
  
  // 模拟添加学习记录的功能 - 在实际应用中，这些数据应该由用户的实际学习活动生成
  // 例如，可以在用户完成练习后调用此函数更新学习记录
  useEffect(() => {
    // 这里仅作示例，实际应用中应在适当的时机调用updateStudyRecord
    // 例如：当用户完成一次练习后，或者定时保存学习时长等
    
    // 模拟今天已经学习了一些内容的情况
    // 在实际应用中，这些数据应该从后端API或本地存储中获取
    // 为了演示，我们暂时注释掉这部分代码，确保所有数据默认为0
    
    // const today = new Date();
    // updateStudyRecord(today, 30, 20, 18); // 示例：今天学习了30分钟，回答了20题，18题正确
  }, []);
  
  // 获取星期几的中文表示
  const getWeekdayName = (date: Date) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return weekdays[date.getDay()];
  };
  
  // 获取月份的中文表示
  const getMonthName = (date: Date) => {
    return `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>学习中心</ThemedText>
      </ThemedView>
      
      {/* 日历部分 */}
      <ThemedView style={styles.calendarContainer}>
        <ThemedText style={styles.calendarTitle}>{getMonthName(selectedDate)}</ThemedText>
        <ThemedView style={styles.weekDaysContainer}>
          {weekDays.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                item.isToday && styles.todayDateItem,
                selectedDate.toDateString() === item.date.toDateString() && styles.selectedDateItem
              ]}
              onPress={() => handleDateSelect(item.date)}
            >
              <ThemedText style={styles.weekdayText}>{item.day === 1 ? '日' : getWeekdayName(item.date)}</ThemedText>
              <ThemedText 
                style={[
                  styles.dayText,
                  item.isToday && styles.todayDayText,
                  selectedDate.toDateString() === item.date.toDateString() && styles.selectedDayText
                ]}
              >
                {item.day}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>
      
      {/* 数据统计部分 */}
      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statItem}>
          <ThemedView style={styles.statIcon}>
            <ThemedText style={styles.statIconText}>L</ThemedText>
          </ThemedView>
          <ThemedText style={styles.statValue}>{studyData.minutes}</ThemedText>
          <ThemedText style={styles.statLabel}>学习分钟</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.statItem}>
          <ThemedView style={[styles.statIcon, styles.questionIcon]}>
            <ThemedText style={styles.questionIconText}>✏️</ThemedText>
          </ThemedView>
          <ThemedText style={styles.statValue}>{studyData.questions}</ThemedText>
          <ThemedText style={styles.statLabel}>累计答题</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.statItem}>
          <ThemedView style={[styles.statIcon, styles.accuracyIcon]}>
            <ThemedText style={styles.accuracyIconText}>✓</ThemedText>
          </ThemedView>
          <ThemedText style={styles.statValue}>{studyData.accuracy}%</ThemedText>
          <ThemedText style={styles.statLabel}>正确率</ThemedText>
        </ThemedView>
      </ThemedView>
      
      {/* 错题集部分 */}
      <TouchableOpacity style={styles.wrongQuestionsContainer}>
        <ThemedView style={styles.wrongQuestionsContent}>
          <ThemedView style={styles.wrongQuestionsIcon}>
            <ThemedText style={styles.wrongQuestionsIconText}>📝</ThemedText>
          </ThemedView>
          <ThemedView style={styles.wrongQuestionsInfo}>
            <ThemedText style={styles.wrongQuestionsTitle}>我的错题集</ThemedText>
            <ThemedText style={styles.wrongQuestionsSubtitle}>回顾和练习做错的题目</ThemedText>
          </ThemedView>
          <ThemedView style={styles.wrongQuestionsCount}>
            <ThemedText style={styles.wrongQuestionsCountText}>0题</ThemedText>
            <ThemedText style={styles.wrongQuestionsArrow}>›</ThemedText>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    //paddingHorizontal: 16,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingBottom: 16,
    width: '100%',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendarContainer: {
    backgroundColor: 'white',
    //borderRadius: 16,
    padding: 16,
    //marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  todayDateItem: {
    backgroundColor: '#E3F2FD',
  },
  selectedDateItem: {
    backgroundColor: '#BBDEFB',
  },
  weekdayText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dayText: {
    fontSize: 16,
    color: '#000',
  },
  todayDayText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  selectedDayText: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginBottom: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionIcon: {
    backgroundColor: '#E8F5E9',
  },
  accuracyIcon: {
    backgroundColor: '#FFF3E0',
  },
  statIconText: {
    fontSize: 18,
    color: '#2196F3',
  },
  questionIconText: {
    fontSize: 18,
    color: '#4CAF50',
  },
  accuracyIconText: {
    fontSize: 18,
    color: '#FF9800',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  wrongQuestionsContainer: {
    backgroundColor: 'white',
    //borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  wrongQuestionsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrongQuestionsIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  wrongQuestionsIconText: {
    fontSize: 24,
  },
  wrongQuestionsInfo: {
    flex: 1,
  },
  wrongQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  wrongQuestionsSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  wrongQuestionsCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrongQuestionsCountText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginRight: 4,
  },
  wrongQuestionsArrow: {
    fontSize: 16,
    color: '#999',
  },
});
