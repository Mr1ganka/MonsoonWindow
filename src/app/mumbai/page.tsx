import MonsoonWindow from '@/components/scene/MonsoonWindow';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mumbai Monsoon Window | 24-Hour Atmospheric Radio',
  description:
    'Experience an authentic 24-hour Mumbai monsoon window. Listen to retro radio, classic Bollywood rain anthems, and ambient rainfall overlooking vibrant Mumbai city streets from Dawn to Deep Night.',
};

export default function MumbaiPage() {
  return <MonsoonWindow location="mumbai" />;
}
