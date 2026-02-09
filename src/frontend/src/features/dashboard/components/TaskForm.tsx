import { useState } from 'react';
import { useTasker } from '../../../state/TaskerProvider';
import { Subject, TaskType, Priority, CHAPTERS } from '../../../state/taskerTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  dayIndex: number;
}

const TASK_TYPES: TaskType[] = [
  'Revision',
  'PYQs',
  'Notes',
  'Sample Paper',
  'Test Prep',
  'Concept Building',
  'Theory Revision',
  'Numerical Practice',
  'Case Study Practice',
  'Assertion Reason',
  'PYQ Intensive',
  'Sample Paper Drill',
  'Weak Area Fix',
  'Rapid Revision',
  'Exam Focus',
  'Full Syllabus Revision'
];

export function TaskForm({ dayIndex }: TaskFormProps) {
  const { addTask } = useTasker();
  const [subject, setSubject] = useState<Subject | ''>('');
  const [chapter, setChapter] = useState('');
  const [type, setType] = useState<TaskType>('Revision');
  const [priority, setPriority] = useState<Priority>('High');
  const [reward, setReward] = useState('');
  const [xp, setXp] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!subject) return;
    
    // Normalize and sanitize all fields before submission
    const normalizedTask = {
      subject,
      chapter: chapter.trim(),
      type,
      priority,
      reward: reward.trim(),
      xp: xp.trim(),
      notes: notes.trim() || undefined
    };
    
    addTask(dayIndex, normalizedTask);

    // Reset form to initial state
    setSubject('');
    setChapter('');
    setType('Revision');
    setPriority('High');
    setReward('');
    setXp('');
    setNotes('');
  };

  const chapters = subject ? CHAPTERS[subject] : [];

  return (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2">
        <Select value={subject} onValueChange={(v) => { setSubject(v as Subject); setChapter(''); }}>
          <SelectTrigger>
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Hindi">Hindi</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Social Science">Social Science</SelectItem>
            <SelectItem value="AI">AI</SelectItem>
          </SelectContent>
        </Select>

        <Select value={chapter} onValueChange={setChapter} disabled={!subject || chapters.length === 0}>
          <SelectTrigger className="min-w-0 md:col-span-2">
            <SelectValue placeholder="Chapter" className="truncate" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {chapters.map(ch => (
              <SelectItem key={ch} value={ch}>{ch}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {TASK_TYPES.map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Reward"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
        />

        <Input
          placeholder="XP"
          value={xp}
          onChange={(e) => setXp(e.target.value)}
        />

        <Button onClick={handleSubmit} disabled={!subject} className="gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>
      
      <Textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="resize-none"
        rows={2}
      />
    </div>
  );
}
