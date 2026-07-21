<template>
  <main class="forbidden" role="alert">
    <p class="forbidden__code">403</p>
    <h1>没有访问权限</h1>
    <p>当前账号不能访问此页面。</p>
    <RouterLink to="/">返回我的首页</RouterLink>
  </main>
</template>

<style scoped>
.forbidden {
  display: grid;
  min-height: 100vh;
  place-content: center;
  gap: var(--space-3);
  padding: var(--space-6);
  text-align: center;
}
.forbidden__code {
  margin: 0;
  color: var(--color-error);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
}
.forbidden h1,
.forbidden p {
  margin: 0;
}
</style>
