/** @jest-config-loader ts-node */

module.exports= {
    "preset": "jest-expo",
    "setupFilesAfterEnv": [
      "<rootDir>/jest.setup.js",
      "@testing-library/jest-native/extend-expect"
    ],
    "transform": {
      "^.+\\.[tj]sx?$": "babel-jest"
    },
  //     preset: 'react-native',
  // transform: {
  //   '^.+\\.tsx?$': 'ts-jest',
  // },
  testEnvironment: 'node',
    "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"],
    "transformIgnorePatterns": [
      "node_modules/(?!(expo(nent)?|@expo(nent)?/.*|react-native|@react-native|react-native-paper|react-native-gesture-handler|react-native-reanimated|expo-modules-core|expo-document-picker|react-navigation|@react-navigation)/)"
    ],
     "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
  
  };