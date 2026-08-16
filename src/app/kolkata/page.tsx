import MonsoonWindow from '@/components/scene/MonsoonWindow';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kolkata Monsoon Window | 24-Hour Atmospheric Radio',
  description:
    'Experience an authentic 24-hour Kolkata monsoon window. Listen to retro radio, Ghazals, and ambient rainfall over iconic Kolkata cityscapes from Dawn to Deep Night.',
};

export default function KolkataPage() {
  return <MonsoonWindow location="kolkata" />;
}
