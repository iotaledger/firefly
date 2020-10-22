<script>
  import {
    init,
    onMessage,
    createAccount,
    setStrongholdPassword,
    backup,
    restoreBackup
  } from "./lib/api";
  import { Plugins, FilesystemDirectory } from "@capacitor/core";
  const { Filesystem } = Plugins;

  init();
  onMessage(message => console.log("got message: ", message));

  async function test() {
    await setStrongholdPassword("password");
    await createAccount({
      clientOptions: {
        node: "https://nodes.devnet.iota.org:443"
      }
    });
    await backup("/data/data/com.iota.wallet/cache/backup");
    await Filesystem.deleteFile({
      path: "./database/snapshot",
      directory: FilesystemDirectory.Cache
    });
    await setStrongholdPassword("password"); // since we removed the snapshot, reload stronghold
    await restoreBackup("/data/data/com.iota.wallet/cache/backup");
    return "ok";
  }
  test()
    .then(console.log)
    .catch(console.error);
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #000000;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Mobile wallet!</h1>
</main>
