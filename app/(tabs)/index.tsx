import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '../../components/themed-text';
import { IconSymbol } from '../../components/ui/icon-symbol';

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const screenWidth = Dimensions.get('window').width;

  const banners = [
    { 
      title: "1000+套精选模拟试题",
      subtitle: "紧跟考纲，直击考点",
      icon: "doc.text" as any,
      bg: "#007AFF"
    },
    { 
      title: "四大考试科目全覆盖",
      subtitle: "知识点梳理，系统学习",
      icon: "book.fill",
      bg: "#34C759"
    },
    { 
      title: "大数据助你高效提分",
      subtitle: "智能分析，精准预测",
      icon: "chart.line.uptrend.xyaxis" as any,
      bg: "#AF52DE"
    },
  ];

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(
      () =>
        setActiveIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        ),
      4000
    );
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeIndex, banners.length]);

  return (
    <View style={styles.container}>
      {/* 固定顶部标题 */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>导游证考试助手</ThemedText>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 轮播图 */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            contentOffset={{ x: activeIndex * (screenWidth - 32), y: 0 }}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / (screenWidth - 32));
              setActiveIndex(index);
            }}
          >
            {banners.map((banner, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.banner, { backgroundColor: banner.bg, width: screenWidth - 32 }]}
                onPress={() => Alert.alert('轮播图点击', `点击了第${index + 1}个轮播图`)}
              >
                <View style={styles.bannerContent}>
                  <View style={styles.bannerText}>
                    <ThemedText style={styles.bannerTitle}>{banner.title}</ThemedText>
                    <ThemedText style={styles.bannerSubtitle}>{banner.subtitle}</ThemedText>
                  </View>
                  <IconSymbol name={banner.icon} size={40} color="white" />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* 轮播图指示器 */}
        <View style={styles.indicatorContainer}>
          {banners.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                activeIndex === index ? styles.activeIndicator : styles.inactiveIndicator
              ]}
              onPress={() => setActiveIndex(index)}
            />
          ))}
        </View>

        {/* 功能按钮网格 */}
        <View style={styles.featureGrid}>
          <View style={styles.gridContainer}>
            {[
              { id: 'knowledge', label: '知识点练习', icon: 'lightbulb.fill', color: '#007AFF' },
              { id: 'mock', label: '模拟考试', icon: 'clock.fill', color: '#34C759' },
              { id: 'sprint', label: '考前冲刺卷', icon: 'paperplane.fill', color: '#FF3B30' },
              { id: 'past_papers', label: '历年真题', icon: 'archivebox.fill', color: '#FF9500' },
              { id: 'hot_points', label: '高频考点', icon: 'flame.fill', color: '#FF9500' },
              { id: 'interview', label: '面试技巧', icon: 'person.2.fill', color: '#5AC8FA' },
              { id: 'regs', label: '法规速记', icon: 'bolt.fill', color: '#5856D6' },
              { id: 'speeches', label: '导游词库', icon: 'speaker.wave.2.fill' as any, color: '#00C7BE' },
              { id: 'wrong_set', label: '错题本', icon: 'book.closed.fill', color: '#FF2D92' },
              { id: 'plan', label: '学习计划', icon: 'pencil.and.outline', color: '#AF52DE' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featureButton}
                onPress={() => Alert.alert('功能点击', `点击了${item.label}`)}
              >
                <View style={[styles.featureIcon, { backgroundColor: item.color + '20' }]}>
                  <IconSymbol name={item.icon} size={24} color={item.color} />
                </View>
                <ThemedText style={styles.featureLabel}>{item.label}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 科目专项练习 */}
        <View style={styles.subjectSection}>
          <ThemedText style={styles.sectionTitle}>科目专项练习</ThemedText>
          {[
            { id: 'fagui', name: '政策与法律法规', icon: 'scale.3d' as any, progress: '已刷 120 题，正确率 85%' },
            { id: 'quandao', name: '全国导游基础知识', icon: 'building.2.fill', progress: '已刷 95 题，正确率 78%' },
            { id: 'yewu', name: '导游业务', icon: 'briefcase.fill', progress: '已刷 80 题，正确率 82%' },
            { id: 'didao', name: '地方导游基础知识', icon: 'globe', progress: '已刷 65 题，正确率 75%' },
          ].map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={styles.subjectCard}
              onPress={() => router.push(`/exam?subjectId=${subject.id}`)}
            >
              <View style={styles.subjectIcon}>
                <IconSymbol name={subject.icon} size={24} color="#666" />
              </View>
              <View style={styles.subjectInfo}>
                <ThemedText style={styles.subjectName}>{subject.name}</ThemedText>
                <ThemedText style={styles.subjectProgress}>{subject.progress}</ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* 模拟考试 */}
        <View style={styles.mockExamSection}>
          <ThemedText style={styles.sectionTitle}>模拟考试</ThemedText>
          {[
            { id: 1, title: '模拟考试卷一', subtitle: '综合模拟测试' },
            { id: 2, title: '模拟考试卷二', subtitle: '综合模拟测试' },
            { id: 3, title: '模拟考试卷三', subtitle: '综合模拟测试' },
          ].map((exam) => (
            <TouchableOpacity
              key={exam.id}
              style={styles.examCard}
              onPress={() => Alert.alert('考试点击', `点击了${exam.title}`)}
            >
              <View style={styles.examIcon}>
                <IconSymbol name="clock.fill" size={24} color="#666" />
              </View>
              <View style={styles.examInfo}>
                <ThemedText style={styles.examTitle}>{exam.title}</ThemedText>
                <ThemedText style={styles.examSubtitle}>{exam.subtitle}</ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#999" />
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => router.push('/mock-exams')}
          >
            <ThemedText style={styles.moreButtonText}>查看更多考卷</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
    marginTop: 110,
  },
  carouselContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 0,
    height: 120,
  },
  carousel: {
    height: 120,
  },
  banner: {
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
  },
  inactiveIndicator: {
    backgroundColor: '#C7C7CC',
  },
  featureGrid: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureButton: {
    width: '18%',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  subjectSection: {
    margin: 16,
  },
  subjectCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
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
  subjectIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subjectProgress: {
    fontSize: 12,
    color: '#666',
  },
  mockExamSection: {
    margin: 16,
    marginBottom: 32,
  },
  examCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
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
  examIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  examInfo: {
    flex: 1,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  examSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  moreButton: {
    backgroundColor: 'rgba(255, 182, 193, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 16,
  },
  moreButtonText: {
    color: '#FF69B4',
    fontSize: 12,
    fontWeight: '500',
  },
});
