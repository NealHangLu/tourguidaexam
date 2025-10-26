import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { MOCK_REGIONS } from '../data/mockData';
import { Region } from '../types';

export default function InterviewRegionSelectionPage() {
  // 获取所有地区（包括全国）
  const interviewRegions = MOCK_REGIONS;

  const handleSelectRegion = async (region: Region) => {
    try {
      // 将选择的地区信息保存到AsyncStorage
      await AsyncStorage.setItem('selectedRegionId', region.id);
      await AsyncStorage.setItem('selectedRegionName', region.name);
    } catch (error) {
      console.error('保存地区信息失败:', error);
    }
    
    // 将选择的地区信息存储到路由状态中
    router.push({
      pathname: '/(tabs)/interview',
      params: { selectedRegionId: region.id, selectedRegionName: region.name }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      {/* 顶部导航栏已移除 */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.regionList}>
            {interviewRegions.map((region, index) => (
              <TouchableOpacity
                key={region.id}
                style={[
                  styles.regionItem,
                  index < interviewRegions.length - 1 && styles.borderBottom
                ]}
                onPress={() => handleSelectRegion(region)}
              >
                <ThemedText style={styles.regionName}>{region.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
  content: {
    padding: 2,
    marginTop: 2,
  },
  regionList: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  regionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  regionName: {
    fontSize: 16,
    color: '#374151',
  },
});