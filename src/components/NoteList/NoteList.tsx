import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onDeletedLast?: () => void;
}

export default function NoteList({ notes, onDeletedLast }: NoteListProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      if (notes.length === 1) {
        onDeletedLast?.();
      }
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted!');
    },
    onError: () => {
      toast.error('Could not delete the note.');
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(note.id)}
            >
              {deleteMutation.isPending && deleteMutation.variables === note.id
                ? 'Deleting...'
                : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
