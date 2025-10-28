import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background,
          },
          headerTintColor: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTransparent: false,  // 确保header背景不透明
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="exam" options={({ navigation }) => ({
          title: '面试练习',
          headerBackTitle: '返回',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 4, padding: 0, backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background, borderRadius: 0 }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text }}>返回</Text>
            </TouchableOpacity>
          )
        })} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="mock-exams" options={({ navigation }) => ({
          title: '模拟考试',
          headerBackTitle: '返回',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 4, padding: 0, backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background, borderRadius: 0 }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text }}>返回</Text>
            </TouchableOpacity>
          )
        })} />
        <Stack.Screen name="interview-region-selection" options={({ navigation }) => ({
          title: '选择面试地区',
          headerBackTitle: '返回',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 4, padding: 0, backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background, borderRadius: 0 }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text }}>返回</Text>
            </TouchableOpacity>
          )
        })} />
        <Stack.Screen name="interview-practice" options={({ route, navigation }) => {
              const params = route.params as any;
              // 只有地区导游词类型需要根据地区显示动态标题
              if (params?.practiceType === 'regional_speech' && params?.regionName) {
                return {
                  title: `${params.regionName} 地区导游词`,
                  headerBackTitle: '返回',
                  headerBackVisible: false,  // 禁用默认返回按钮样式
                  // 确保返回按钮正常工作
                  headerLeft: () => (
                    <TouchableOpacity 
                      onPress={() => navigation.goBack()}
                      style={{ marginLeft: 4, padding: 0, backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background, borderRadius: 0 }}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text }}>返回</Text>
                    </TouchableOpacity>
                  )
                };
              }
              // 其他类型使用固定标题
              return {
                title: '面试练习',
                headerBackTitle: '返回',
                headerBackVisible: false,  // 禁用默认返回按钮样式
                // 确保返回按钮正常工作
                headerLeft: () => (
                    <TouchableOpacity 
                      onPress={() => navigation.goBack()}
                      style={{ marginLeft: 4, padding: 0, backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background, borderRadius: 0 }}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text }}>返回</Text>
                    </TouchableOpacity>
                  )
              };
            }} />
        {/* 品牌介绍页面 */}
        <Stack.Screen name="brand-intro" options={({ navigation }) => ({
          title: '品牌介绍',
          headerBackTitle: '返回',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 4, padding: 0, backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background, borderRadius: 0 }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text }}>返回</Text>
            </TouchableOpacity>
          )
        })} />
        {/* 隐私协议页面 */}
      <Stack.Screen name="privacy-policy" options={({ navigation }) => ({
          title: '隐私协议',
          headerBackTitle: '返回',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 4, padding: 0, backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background, borderRadius: 0 }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text }}>返回</Text>
            </TouchableOpacity>
          )
        })} />
      {/* 帮助页面 */}
      <Stack.Screen name="help" options={({ navigation }) => ({
          title: '帮助',
          headerBackTitle: '返回',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 4, padding: 0, backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background, borderRadius: 0 }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text }}>返回</Text>
            </TouchableOpacity>
          )
        })} />
      {/* 联系客服页面 */}
      <Stack.Screen name="contact-support" options={({ navigation }) => ({
          title: '联系客服',
          headerBackTitle: '返回',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 4, padding: 0, backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background, borderRadius: 0 }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text }}>返回</Text>
            </TouchableOpacity>
          )
        })} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
