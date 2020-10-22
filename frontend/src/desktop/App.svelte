<script>
  const {
    onMessage,
    createAccount,
    setStrongholdPassword,
    backup,
    restoreBackup
  } = window.__WALLET__;

  async function test() {
    onMessage(console.log);
    await setStrongholdPassword("password");
    await createAccount({
      clientOptions: {
        node: "https://nodes.devnet.iota.org:443"
      }
    });
    await backup("./backup");
    window.__deleteStrongholdSnapshot();
    await setStrongholdPassword("password"); // since we removed the snapshot, reload stronghold
    await restoreBackup("./backup");
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
  <h1>Desktop wallet!</h1>
</main>
