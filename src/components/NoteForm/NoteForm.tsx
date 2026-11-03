import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import type { NewNote } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onSubmit: (values: NewNote) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
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

export default function NoteForm({ onSubmit, onCancel, isSubmitting }: NoteFormProps) {
  return (
    <Formik<NewNote>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, helpers) => {
        try {
          await onSubmit({ ...values, title: values.title.trim() });
          helpers.resetForm();
        } catch {
          // The mutation displays a toast; allow the user to retry.
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting: isFormikSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              type="text"
              name="title"
              className={css.input}
            />
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
              disabled={isSubmitting || isFormikSubmitting}
            >
              {isSubmitting || isFormikSubmitting ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
