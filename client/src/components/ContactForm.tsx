import { useState } from 'react';
import type { FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderEmail, subject, message }),
      });

      if (!res.ok) throw new Error(res.statusText || 'Request failed');

      setStatus('success');
      setSenderEmail('');
      setSubject('');
      setMessage('');
    } catch (err: unknown) {
      console.error('Failed to send contact message:', err);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <p className="text-sm text-stone-600">Message sent. Thanks for reaching out.</p>;
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="senderEmail" className="text-sm font-medium text-stone-600">
          Your email
        </label>
        <input
          id="senderEmail"
          type="email"
          required
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#16a34a]"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="subject" className="text-sm font-medium text-stone-600">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          required
          maxLength={200}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#16a34a]"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium text-stone-600">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#16a34a]"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded bg-[#16a34a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#15803d] disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
