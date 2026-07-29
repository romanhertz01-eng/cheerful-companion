import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { buildAuthHref } from "@/lib/authRedirect";

interface AuthCTALinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/** Link that redirects to /auth for guests, or to `to` for authed users */
export function AuthCTALink({ to, children, className, style, onClick }: AuthCTALinkProps) {
  const { isAuthed } = useAuth();
  const guestHref =
    typeof window !== "undefined"
      ? buildAuthHref(window.location.pathname + window.location.search)
      : "/auth";
  return (
    <Link to={isAuthed ? to : guestHref} className={className} style={style} onClick={onClick}>
      {children}
    </Link>
  );
}
