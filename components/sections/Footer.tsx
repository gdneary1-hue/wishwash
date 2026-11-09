import { siteConfig } from "@/site.config";
import { InstagramIcon, TikTokIcon } from "../icons";
import { Logo } from "../Logo";

export function Footer() {
  const { footer, contactEmail, social, copyrightYear, name } = siteConfig;
  return (
    <footer className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <Logo size={siteConfig.logoSrc ? "lg" : "md"} />
          <p className="mt-3 text-sm text-muted">{footer.tagline}</p>
        </div>
        <div className="flex flex-col gap-4 sm:items-end">
          <a href={`mailto:${contactEmail}`} className="font-medium text-navy underline-offset-4 hover:underline">
            {contactEmail}
          </a>
          <div className="flex gap-2">
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on Instagram`}
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-navy transition hover:border-navy hover:bg-navy hover:text-cream"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on TikTok`}
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-navy transition hover:border-navy hover:bg-navy hover:text-cream"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <p className="mt-10 border-t border-line pt-6 text-sm text-muted">
        © {copyrightYear} {name}
      </p>
    </footer>
  );
}
