/// <reference types="astro/client" />

/** site.config.yaml is transformed into a module by the `yaml-config` Vite
 *  plugin in astro.config.mjs, so it can be imported like any other module and
 *  nothing has to read the filesystem at runtime. */
declare module '*.yaml' {
	const value: any;
	export default value;
}
declare module '*.yml' {
	const value: any;
	export default value;
}
