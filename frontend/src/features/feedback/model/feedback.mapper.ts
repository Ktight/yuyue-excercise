import type { FeedbackFeeling } from './feedback.types';

export const feedbackFeelingOptions: ReadonlyArray<{
  value: FeedbackFeeling;
  label: string;
  tone: string;
}> = [
  { value: 'easy', label: '轻松', tone: 'positive' },
  { value: 'moderate', label: '适中', tone: 'brand' },
  { value: 'hard', label: '吃力', tone: 'warning' },
];

export function feedbackFeelingLabel(value: FeedbackFeeling): string {
  return feedbackFeelingOptions.find((option) => option.value === value)?.label ?? value;
}
