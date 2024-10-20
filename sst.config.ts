/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "robot-language",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.StaticSite("robot-language", {
      path: "frontend",
      build: {
        command: "npm run build",
        output: "dist",
      }
    });
  },
});