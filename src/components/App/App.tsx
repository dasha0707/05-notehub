import { useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast';

import { createNote, deleteNote, fetchNotes } from '../../services/noteService';
import type { NewNote } from '../../types/note';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';

const PER_PAGE = 12;

export default function App() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const updateSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value.trim());
  }, 400);

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      setPage(1);
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created!');
    },
    onError: () => toast.error('Could not create the note.'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      if (data?.notes.length === 1 && page > 1) {
        setPage(page - 1);
      }
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted!');
    },
    onError: () => toast.error('Could not delete the note.'),
    onSettled: () => setDeletingId(null),
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    updateSearch(value);
  };

  const handleCreateNote = async (values: NewNote) => {
    await createMutation.mutateAsync(values);
    setIsModalOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    setDeletingId(id);
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <button
          className={css.createButton}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main>
        {isPending && <p className={css.message}>Loading notes...</p>}
        {isError && (
          <p role="alert" className={css.error}>
            {error instanceof Error ? error.message : 'Failed to load notes.'}
            {!import.meta.env.VITE_NOTEHUB_TOKEN &&
              ' Add VITE_NOTEHUB_TOKEN to .env.local.'}
          </p>
        )}
        {data && data.notes.length > 0 && (
          <NoteList
            notes={data.notes}
            onDelete={handleDeleteNote}
            deletingId={deletingId}
          />
        )}
        {data && data.notes.length === 0 && (
          <p className={css.message}>No notes found.</p>
        )}
        {isFetching && !isPending && (
          <span className={css.updating} aria-live="polite">Updating...</span>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </Modal>
      )}
      <Toaster position="top-right" />
    </div>
  );
}
