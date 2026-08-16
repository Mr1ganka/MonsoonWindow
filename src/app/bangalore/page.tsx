import MonsoonWindow from '@/components/scene/MonsoonWindow';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bangalore Monsoon Window | 24-Hour Atmospheric Radio',
  description:
    'Experience an authentic 24-hour Bengaluru monsoon window. Listen to retro radio, lo-fi monsoon tunes, and ambient rainfall over lush green garden cityscapes from Dawn to Deep Night.',
};

export default function BangalorePage() {
  return <MonsoonWindow location="bangalore" />;
}
