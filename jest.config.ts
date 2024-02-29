import type {Config} from 'jest';

const config:Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.css$': 'identity-obj-proxy',
    },
};

export default config;