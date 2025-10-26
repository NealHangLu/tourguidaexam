// 页面状态类型
export interface PageState {
  name: 'interview' | 'interviewRegionSelection' | 'interviewPractice';
}

// 地区类型
export interface Region {
  id: string;
  name: string;
}

// 面试练习类型
export type InterviewPracticeType = 'regional_speech' | 'contingency' | 'comprehensive' | 'service_standards';

// 面试题目类型
export interface InterviewQuestion {
  id: string;
  content: string;
  explanation: string;
  practiceType: InterviewPracticeType;
  regionId?: string;
}