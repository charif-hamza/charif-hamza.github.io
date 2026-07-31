/**
 * Site configuration loader — SPEC §9.3.
 *
 * One file holds every string that appears on the site. Components read from
 * here; they never inline copy. That is what makes the FR/EN toggle of §10.3
 * a configuration change rather than a refactor, and what keeps the §10.4 copy
 * inventory a real inventory.
 *
 * French strings pass through the typography corrector on the way out (§10.2),
 * so authors write ordinary spaces and the build sets them properly.
 */
import raw from '../../site.config.yaml';
import { frDeep } from './typo.ts';

export interface CvFile {
	href: string;
	latest: string;
	size: string;
	updated: string;
}

export interface SiteConfig {
	/** Open decisions, printed after every build. See docs/TODO.md. */
	pending: string[];
	name: string;
	surname: string;
	givenName: string;
	url: string;
	email: string;
	lang: string;
	docLang: string;
	tagline: { fr: string; en: string };
	social: { github: string; linkedin: string; orcid: string; repo: string };
	cv: { available: boolean; fr: CvFile; en: CvFile };
	fonts: { installed: boolean };
	features: {
		showWriting: boolean;
		showProjectsIndex: boolean;
		showAbout: boolean;
		reduceMotionByDefault: boolean;
	};
	og: { format: 'svg' | 'png'; width: number; height: number };
	person: { jobTitle: string; alumniOf: string[]; knowsAbout: string[] };
	analytics: { provider: string; domain: string; src: string };
	strings: {
		fr: Record<string, any>;
		en: Record<string, any>;
	};
}

const config = raw as SiteConfig;

/* Only the French half is corrected. Layer 2 is English and must not have
   narrow spaces injected into its punctuation. */
export const site: SiteConfig = {
	...config,
	tagline: { ...config.tagline, fr: frDeep(config.tagline.fr) },
	strings: { ...config.strings, fr: frDeep(config.strings.fr) },
};

export const t = site.strings.fr;
export const en = site.strings.en;

/** Absolute URL for canonical links, OG tags, RSS and structured data. */
export function abs(path: string): string {
	return new URL(path, site.url).href;
}

/* The open-decision audit lives in the `pending-decisions` integration in
   astro.config.mjs, so it runs exactly once per build rather than once per
   page render. docs/TODO.md is the full register. */
