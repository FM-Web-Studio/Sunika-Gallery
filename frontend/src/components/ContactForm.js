import { useEffect, useState } from 'react';
import { FiSend, FiCheck } from 'react-icons/fi';
import { submitMessage } from '../firebase/messages';
import { cooldownLeft, markSent } from '../lib/storage';
import { useToast } from './Toast';
import styles from './ContactForm.module.css';

const COOLDOWN = 60 * 1000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: '', email: '', message: '', website: '' };

const validate = ({ name, email, message }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Add your name so I know who to reply to.';
  else if (name.length > 200) errors.name = 'Keep your name under 200 characters.';
  if (!EMAIL.test(email.trim())) errors.email = 'Add an email address I can reply to.';
  if (!message.trim()) errors.message = 'Write a message before sending.';
  else if (message.length > 5000) errors.message = 'Keep the message under 5000 characters.';
  return errors;
};

const ContactForm = ({ initialMessage = '', sentText }) => {
  const { notify } = useToast();
  const [form, setForm] = useState({ ...EMPTY, message: initialMessage });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle');

  useEffect(() => {
    if (initialMessage) setForm((f) => (f.message ? f : { ...f, message: initialMessage }));
  }, [initialMessage]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    if (form.website) {
      setState('sent');
      return;
    }

    const wait = cooldownLeft('contact', COOLDOWN);
    if (wait > 0) {
      notify('info', `You just sent a message. You can send another in ${Math.ceil(wait / 1000)} seconds.`);
      return;
    }

    setState('sending');
    try {
      await submitMessage(form);
      markSent('contact');
      setForm(EMPTY);
      setState('sent');
    } catch {
      setState('idle');
      notify('error', 'Your message did not send. Check your connection and try again.');
    }
  };

  if (state === 'sent') {
    return (
      <div className={styles.sent} role="status">
        <span className={styles.sentIcon}><FiCheck aria-hidden="true" /></span>
        <p>{sentText}</p>
        <button type="button" className="btn btn-quiet" onClick={() => setState('idle')}>Write another message</button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.pair}>
        <label className="field">
          <span>Your name</span>
          <input className="input" value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />
          {errors.name && <em className={styles.error}>{errors.name}</em>}
        </label>
        <label className="field">
          <span>Your email</span>
          <input className="input" type="email" value={form.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} />
          {errors.email && <em className={styles.error}>{errors.email}</em>}
        </label>
      </div>

      <label className="field">
        <span>Message</span>
        <textarea className="input" rows={6} value={form.message} onChange={set('message')} aria-invalid={!!errors.message} />
        {errors.message && <em className={styles.error}>{errors.message}</em>}
      </label>

      <label className={styles.trap} aria-hidden="true">
        Leave this empty
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
      </label>

      <button type="submit" className={`btn btn-candy ${styles.submit}`} disabled={state === 'sending'}>
        <FiSend aria-hidden="true" />
        {state === 'sending' ? 'Sending' : 'Send message'}
      </button>
    </form>
  );
};

export default ContactForm;
