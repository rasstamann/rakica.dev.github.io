import { ContactForm } from '../components/ContactForm';

export function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-16">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-semibold text-stone-800">Contact</h1>
        <ContactForm />
      </div>
    </main>
  );
}
