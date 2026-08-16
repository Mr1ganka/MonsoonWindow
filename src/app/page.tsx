import MonsoonWindow from '@/components/scene/MonsoonWindow';
import GeoLandingRedirect from '@/components/ui/GeoLandingRedirect';

export default function HomePage() {
  return (
    <>
      <GeoLandingRedirect />
      <MonsoonWindow location="generic" />
    </>
  );
}
