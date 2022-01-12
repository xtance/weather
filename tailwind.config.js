module.exports = {
	future: {
		purgeLayersByDefault: true,
		removeDeprecatedGapUtilities: true,
	},
	mode: 'jit',
	content: [
		'./resources/**/*.{js,ts,svelte}',
	],
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
