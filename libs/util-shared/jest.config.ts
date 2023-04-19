/* eslint-disable */
export default {
	displayName: 'util-shared',
	preset: '../../jest.preset.js',
	transform: {
		'^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	coverageDirectory: '../../coverage/libs/util-shared'
};
