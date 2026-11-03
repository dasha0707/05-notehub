import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

import { createNote } from '../../services/noteService';
import type { NewNote } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel: () => void;
  onCreated: () => void;
}

const initialValues: NewNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be 50 characters or fewer')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content must be 500 characters or fewer'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

export default function NoteForm({ onCancel, onCreated }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created!');
      onCreated();
    },
    onError: () => {
      toast.error('Could not create the note.');
    },
  });

  return (
    <Formik<NewNote>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, helpers) => {
        try {
          await createMutation.mutateAsync({ ...values, title: values.title.trim() });
          helpers.resetForm();
        } catch {
          // The mutation reports the error; leave values so the user can retry.
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={createMutation.isPending || isSubmitting}
            >
              {createMutation.isPending || isSubmitting ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
