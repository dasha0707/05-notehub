import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { Toaster } from 'react-hot-toast';

import { fetchNotes } from '../../services/noteService';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value.trim());
  }, 400);

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    updateSearch(value);
  };

  const handleCreated = () => {
    setPage(1);
    setIsModalOpen(false);
  };

  const handleDeletedLast = () => {
    if (page > 1) {
      setPage((previousPage) => previousPage - 1);
    }
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
          <NoteList notes={data.notes} onDeletedLast={handleDeletedLast} />
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
            onCancel={() => setIsModalOpen(false)}
            onCreated={handleCreated}
          />
        </Modal>
      )}
      <Toaster position="top-right" />
    </div>
  );
}
