module.exports = {
  apps: [
    {
      name: "alyoum-plus",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3005",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
