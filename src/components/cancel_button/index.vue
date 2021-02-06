<template>
  <el-button @click="$router.go(-1)">
    <slot>{{ $t('cancel') }}</slot>
  </el-button>
</template>
