import type { ComponentType } from 'react';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import css from './Pagination.module.css';

// Vite 8 needs the CommonJS default export unwrapped explicitly.
type ModuleWithDefault<T> = { default: T };

const ReactPaginate =
  (
    ReactPaginateModule as unknown as
      ModuleWithDefault<ComponentType<ReactPaginateProps>>
  ).default ?? (ReactPaginateModule as unknown as ComponentType<ReactPaginateProps>);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      previousLabel="‹"
      nextLabel="›"
      breakLabel="…"
      containerClassName={css.pagination}
      pageClassName={css.page}
      pageLinkClassName={css.pageLink}
      activeClassName={css.active}
      previousClassName={css.page}
      nextClassName={css.page}
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
      breakClassName={css.page}
      breakLinkClassName={css.pageLink}
      disabledClassName={css.disabled}
      renderOnZeroPageCount={null}
    />
  );
}
