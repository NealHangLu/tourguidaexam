import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MOCK_REGIONS } from '@/data/mockData';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function InterviewScreen() {
  const params = useLocalSearchParams();
  const backgroundColor = useThemeColor({}, 'background');
  const [selectedRegion, setSelectedRegion] = useState(MOCK_REGIONS[0]); // 默认北京

  useEffect(() => {
    // 加载保存的地区信息
    const loadSelectedRegion = async () => {
      try {
        // 首先检查路由参数中是否有地区信息
        if (params.selectedRegionId && params.selectedRegionName) {
          const region = MOCK_REGIONS.find(r => r.id === params.selectedRegionId);
          if (region) {
            setSelectedRegion(region);
            return;
          }
        }
        
        // 然后从AsyncStorage读取保存的地区信息
        const savedRegionId = await AsyncStorage.getItem('selectedRegionId');
        const savedRegionName = await AsyncStorage.getItem('selectedRegionName');
        
        if (savedRegionId) {
          const region = MOCK_REGIONS.find(r => r.id === savedRegionId);
          if (region) {
            setSelectedRegion(region);
          }
        }
      } catch (error) {
        console.error('加载地区信息失败:', error);
      }
    };
    
    loadSelectedRegion();
  }, [params.selectedRegionId, params.selectedRegionName]);

  const handleRegionSelect = () => {
    router.push('/interview-region-selection');
  };

  const handlePracticeTypeSelect = (practiceType: string) => {
    router.push({
      pathname: '/interview-practice',
      params: { 
        regionId: selectedRegion.id,
        regionName: selectedRegion.name,
        practiceType
      }
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor}}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* 地区选择 */}
      <TouchableOpacity onPress={handleRegionSelect}>
        <LinearGradient
          colors={['#00C6FB', '#3A7BD5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.regionSelector}>
          <View style={styles.regionTextContainer}>
            <ThemedText style={styles.regionLabel}>当前面试地区</ThemedText>
          <ThemedText style={styles.regionName}>{selectedRegion.name}</ThemedText>
          </View>
          <View style={styles.switchContainer}>
            <ThemedText style={styles.switchText}>切换</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* 练习类型列表 */}
      <ThemedView style={styles.practiceTypesContainer}>
        {/* 地区导游词 */}
        <TouchableOpacity
          style={styles.practiceTypeItem}
          onPress={() => handlePracticeTypeSelect('regional_speech')}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
            <IconSymbol name="mic.fill" size={22} color="#4CAF50" />
          </View>
          <ThemedText style={styles.practiceTypeText}>地区导游词</ThemedText>
          <IconSymbol name="chevron.right" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        {/* 应变能力问答 */}
        <TouchableOpacity
          style={styles.practiceTypeItem}
          onPress={() => handlePracticeTypeSelect('contingency')}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
            <IconSymbol name="bolt.fill" size={22} color="#FF9800" />
          </View>
          <ThemedText style={styles.practiceTypeText}>应变能力问答</ThemedText>
          <IconSymbol name="chevron.right" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        {/* 综合知识问答 */}
        <TouchableOpacity
          style={styles.practiceTypeItem}
          onPress={() => handlePracticeTypeSelect('comprehensive')}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
            <IconSymbol name="book.fill" size={22} color="#2196F3" />
          </View>
          <ThemedText style={styles.practiceTypeText}>综合知识问答</ThemedText>
          <IconSymbol name="chevron.right" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        {/* 导游服务规范问答 */}
        <TouchableOpacity
          style={[styles.practiceTypeItem, { borderBottomWidth: 0 }]}
          onPress={() => handlePracticeTypeSelect('service_standards')}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
            <IconSymbol name="person.fill.badge.plus" size={22} color="#9C27B0" />
          </View>
          <ThemedText style={styles.practiceTypeText}>导游服务规范问答</ThemedText>
          <IconSymbol name="chevron.right" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  regionSelector: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  regionTextContainer: {
    flexDirection: 'column',
  },
  regionLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.9,
  },
  regionName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  switchText: {
    color: '#FFFFFF',
    marginRight: 4,
    fontWeight: '500',
  },
  practiceTypesContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  practiceTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  practiceTypeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
