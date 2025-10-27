import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Share, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ProfileScreen() {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailContent, setEmailContent] = useState('');

  const handleContactSupport = () => {
    setShowEmailForm(true);
  };

  const handleSendEmail = () => {
    if (!emailContent.trim()) {
      Alert.alert('提示', '请输入反馈内容');
      return;
    }
    // 这里模拟发送邮件
    Alert.alert('成功', '您的反馈已发送，感谢您的支持！');
    setEmailContent('');
    setShowEmailForm(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: '推荐给你一个很好用的导游考试学习App！',
        title: '导游考试助手',
      });
    } catch (error) {
      Alert.alert('分享失败', '请稍后再试');
    }
  };

  const handleNavigation = (route: string) => {
    // 这里可以根据不同的路由进行导航
    Alert.alert('提示', `即将跳转到${route}页面`);
  };

  return (
    <View style={styles.container}>
      {/* 顶部彩色背景 */}
      <View style={styles.headerBackground} />
      
      {/* 登录/注册区域 */}
      <TouchableOpacity 
        style={styles.loginContainer}
        onPress={() => handleNavigation('登录/注册')}
      >
        <IconSymbol 
          name="person.fill" 
          size={60} 
          color="#808080" 
        />
        <ThemedText style={styles.loginText}>登录 / 注册</ThemedText>
        <IconSymbol 
          name="chevron.forward" 
          size={20} 
          color="#808080" 
        />
      </TouchableOpacity>

      {/* 开通会员横幅 */}
      <TouchableOpacity 
        style={styles.memberBanner}
        onPress={() => handleNavigation('开通会员')}
      >
        <View style={styles.memberBannerContent}>
          <ThemedText style={styles.memberTitle}>开通题库会员</ThemedText>
          <ThemedText style={styles.memberSubtitle}>解锁全部功能，备考更高效</ThemedText>
        </View>
        <View style={styles.memberButton}>
          <ThemedText style={styles.memberButtonText}>立即开通</ThemedText>
        </View>
      </TouchableOpacity>

      {/* 功能按钮区域 */}
      <ThemedView style={styles.featuresContainer}>
        <TouchableOpacity 
          style={styles.featureButton}
          onPress={() => handleNavigation('我的订单')}
        >
          <IconSymbol name="bag.fill" size={30} color="#808080" />
          <ThemedText style={styles.featureText}>我的订单</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureButton}
          onPress={() => handleNavigation('错题集')}
        >
          <IconSymbol name="bookmark.fill" size={30} color="#808080" />
          <ThemedText style={styles.featureText}>错题集</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureButton}
          onPress={handleContactSupport}
        >
          <IconSymbol name="envelope.fill" size={30} color="#808080" />
          <ThemedText style={styles.featureText}>联系客服</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureButton}
          onPress={handleShare}
        >
          <IconSymbol name="square.and.arrow.up.fill" size={30} color="#808080" />
          <ThemedText style={styles.featureText}>分享</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* 底部列表项 */}
      <ThemedView style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('品牌介绍')}
        >
          <IconSymbol name="building.2.fill" size={20} color="#808080" />
          <ThemedText style={styles.menuText}>品牌介绍</ThemedText>
          <IconSymbol name="chevron.forward" size={16} color="#808080" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('隐私协议')}
        >
          <IconSymbol name="shield.fill" size={20} color="#808080" />
          <ThemedText style={styles.menuText}>隐私协议</ThemedText>
          <IconSymbol name="chevron.forward" size={16} color="#808080" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('意见反馈')}
        >
          <IconSymbol name="slider.horizontal.3" size={20} color="#808080" />
          <ThemedText style={styles.menuText}>意见反馈</ThemedText>
          <IconSymbol name="chevron.forward" size={16} color="#808080" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('版本')}
        >
          <IconSymbol name="info.circle.fill" size={20} color="#808080" />
          <ThemedText style={styles.menuText}>版本</ThemedText>
          <ThemedText style={styles.versionText}>v1.0.0</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('帮助')}
        >
          <IconSymbol name="questionmark.circle.fill" size={20} color="#808080" />
          <ThemedText style={styles.menuText}>帮助</ThemedText>
          <IconSymbol name="chevron.forward" size={16} color="#808080" />
        </TouchableOpacity>
      </ThemedView>

      {/* 联系客服邮件表单 */}
      {showEmailForm && (
        <View style={styles.emailFormContainer}>
          <ThemedText style={styles.emailFormTitle}>联系客服</ThemedText>
          <TextInput
            style={styles.emailInput}
            placeholder="请输入您的问题或建议..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={emailContent}
            onChangeText={setEmailContent}
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendEmail}
          >
            <ThemedText style={styles.sendButtonText}>发送</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowEmailForm(false)}
          >
            <ThemedText style={styles.cancelButtonText}>取消</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180, // 增加高度，确保覆盖登录区域
    backgroundColor: '#fff', // 彩色背景
    zIndex: -1,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // 登录区域也使用相同的彩色背景
    paddingTop: 70, // 调整顶部padding，确保在彩色背景内部显示
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 15,
  },
  memberBanner: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ff8c00',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberBannerContent: {
    flex: 1,
  },
  memberTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  memberSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  memberButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  memberButtonText: {
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  featureButton: {
    alignItems: 'center',
  },
  featureText: {
    marginTop: 10,
    fontSize: 14,
  },
  menuContainer: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  emailFormContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -100 }],
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emailFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#999',
  },
});
