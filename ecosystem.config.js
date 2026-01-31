module.exports = {
  apps: [
    {
      name: "obsidian-plasma",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
