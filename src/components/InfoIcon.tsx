import { useEffect } from 'react';
import { activeKey, type ContactHoverKey } from "../types";
import { capitalizeFirst } from '../utils/converter';

interface InfoIconProps {
  link: string;
  activeKeyType: ContactHoverKey;
  active: ContactHoverKey | null;
  setActive: React.Dispatch<React.SetStateAction<ContactHoverKey | null>>;
  setLink: React.Dispatch<React.SetStateAction<string | undefined>>;
  children: React.ReactNode;
}

export const InfoIcon: React.FC<InfoIconProps> = ({
  link,
  activeKeyType,
  active,
  setActive,
  setLink,
  children
}) => {
  useEffect(() => {
    if (active === activeKeyType) {
      setLink(link);
    }
  }, [active])

  return (
    <a
      href={`mailto:${link}`}
      onMouseEnter={() => setActive(activeKeyType)}
      onMouseLeave={() => setActive(null)}
      {...(activeKeyType === activeKey.email
        ? {}
        : {
            target: "_blank",
            rel: "noopener noreferrer",
          })}
      className="flex items-center p-4 rounded-lg hover:bg-slate-100 transition-colors duration-300"
    >
      <div className="w-8 h-8 mr-4 flex-shrink-0">
        {children}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-slate-800">{capitalizeFirst(activeKeyType)}</p>
      </div>
    </a>
  );
};
