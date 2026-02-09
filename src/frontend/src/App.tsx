import { TaskerProvider } from './state/TaskerProvider';
import { AppLayout } from './components/layout/AppLayout';

export default function App() {
  return (
    <TaskerProvider>
      <AppLayout />
    </TaskerProvider>
  );
}
