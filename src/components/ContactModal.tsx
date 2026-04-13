// src/components/ContactModal.tsx

import React from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  {
    key: "email",
    label: "Email",
    href: "mailto:mogiyoon@gmail.com",
    display: "mogiyoon@gmail.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/mogiyoon",
    display: "github.com/mogiyoon",
    external: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    key: "blog",
    label: "Blog",
    href: "https://velog.io/@mogiyoon/posts",
    display: "velog.io/@mogiyoon",
    external: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 19.5v-.75a7.5 7.5 0 0 0-7.5-7.5H4.5m0-6.75h.75c7.5 0 13.5 6 13.5 13.5v.75M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    ),
  },
];

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-sm rounded-modal shadow-2xl p-8 relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-content-muted hover:text-content-secondary transition-colors duration-200"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-1 text-content">Info</h2>
        <p className="text-sm text-content-muted mb-6">Giyoon Noh · Frontend Engineer</p>

        <div className="flex flex-col gap-2">
          {links.map((item) => (
            <a
              key={item.key}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center gap-4 p-4 rounded-modal border border-line hover:border-line-strong hover:bg-surface-subtle transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-card bg-surface-muted flex items-center justify-center text-content-meta group-hover:bg-surface group-hover:text-content transition-all duration-200 flex-shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-content-muted">{item.label}</p>
                <p className="text-sm font-semibold text-content-strong truncate">{item.display}</p>
              </div>
              <svg
                className="w-4 h-4 text-slate-300 group-hover:text-content-tertiary ml-auto flex-shrink-0 transition-colors duration-200"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>

        <footer className="text-center pt-6 text-slate-300 text-xs">
          © 2025 Giyoon Noh
        </footer>
      </div>
    </div>
  );
};

export default ContactModal;
