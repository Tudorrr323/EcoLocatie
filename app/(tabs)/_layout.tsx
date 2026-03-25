// (tabs)/_layout — layout-ul navigarii prin tab-uri al aplicatiei.
// Inregistreaza toate tab-urile vizibile si ascunde tab-ul admin din bara de navigare (href: null).
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
      <Tabs.Screen name="settings" />
      <Tabs.Screen name="account" options={{ href: null }} />
      <Tabs.Screen name="admin" options={{ href: null }} />
    </Tabs>
  );
}
