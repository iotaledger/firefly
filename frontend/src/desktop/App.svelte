<script>
  window.__WALLET__
    .sendMessage({
      cmd: "CreateAccount",
      payload: {
        clientOptions: {
          node: "https://nodes.devnet.iota.org:443"
        }
      }
    })
    .then(res => {
      alert(JSON.stringify(res));
    });
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
