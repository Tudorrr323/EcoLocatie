import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../shared/components/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="encyclopedia" />
      <Tabs.Screen name="add-sighting" />
      <Tabs.Screen name="my-plants" />
      <Tabs.Screen name="account" />
      <Tabs.Screen name="admin" options={{ href: null }} />
    </Tabs>
  );
}
