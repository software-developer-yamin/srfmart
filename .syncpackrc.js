// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
  versionGroups: [
    {
      packages: ["**"],
      dependencies: ["@types/node"],
      pinVersion: "^22.13.14",
      policy: "pin"
    },
    {
      dependencies: ["mongoose"],
      packages: ["@srfmart/db", "server"],
      pinVersion: "^8.24.0",
      policy: "pin",
    },
    {
      dependencies: ["react-day-picker"],
      packages: ["@srfmart/ui"],
      pinVersion: "^9.6.1",
      policy: "pin",
    },
    {
      // Pnpm exact matches and local spaces are ignored to prevent syncpack from demanding fixed version strings where special pnpm workspace linkings are needed.
      dependencies: ["@srfmart/*"],
      packages: ["**"],
      isIgnored: true
    },
    {
       // Ignore "catalog:" string properties so syncpack doesnt freak out over them
      dependencies: ["$CATALOGS"],
      packages: ["**"],
      isIgnored: true
    },
    {
      dependencies: ["**"],
      packages: ["**"],
      isIgnored: true, 
      dependencyTypes: ["!pnpmOverrides"]
    }
  ]
};

export default config;
