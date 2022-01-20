<script lang="ts">
  export let title = ''
</script>

<style>
  header {
    height: 46px;
    min-height: 46px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 13px;
  }
  h2 {
    color: var(--title);
    font-size: 13px;
  }
  .logo {
    background: url("img/icon-light.svg");
    height: 28px;
    width: 28px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-top: 1px;
  }
</style>

<header>
  <div style="width:28px;"></div>
  <h2>{title}</h2>
  <div class="logo" />
</header>
