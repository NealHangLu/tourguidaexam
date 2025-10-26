import React from 'react';
import { View } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

interface IconProps {
  className?: string;
  color?: string;
  size?: number;
}

export const MapPinIcon: React.FC<IconProps> = ({ className, color = '#10B981', size = 24 }) => (
  <IconSymbol name="mappin" size={size} color={color} />
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className, color = '#6B7280', size = 24 }) => (
  <IconSymbol name="chevron.right" size={size} color={color} />
);

export const LightBulbIcon: React.FC<IconProps> = ({ className, color = '#F59E0B', size = 24 }) => (
  <IconSymbol name="lightbulb.fill" size={size} color={color} />
);

export const ScaleIcon: React.FC<IconProps> = ({ className, color = '#6366F1', size = 24 }) => (
  <IconSymbol name="scalemass.fill" size={size} color={color} />
);

export const ClipboardDocumentListIcon: React.FC<IconProps> = ({ className, color = '#3B82F6', size = 24 }) => (
  <IconSymbol name="doc.on.doc.fill" size={size} color={color} />
);