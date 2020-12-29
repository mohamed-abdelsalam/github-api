module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.redis-mock.js']
};
