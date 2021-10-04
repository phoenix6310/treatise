<template>
  <div class="ocw-sidebar-item">
    <div class="ocw-item-wrap">
      <span slot="title" class="item-title">{{meta.title}}</span>
    </div>
  </div>
</template>


<script>
export default {
  name: "MenuItem",
  props: {
    meta: {
      type: Object,
      default: () => {
        return {
          title: "",
          icon: ""
        };
      }
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  }
};
</script>
<style lang="scss">
@import "src/styles/mixin.scss";
.ocw-sidebar-item {
  // background-color: skyblue;
  .ocw-item-wrap {
    text-align: left;
    // background-color: orange;
    display: inline-block;
    width: 100px;
    .item-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      background-repeat: no-repeat;
      background-size: 16px;
    }
  }
  
  &.ocw-hide-sidebar {
    .ocw-item-wrap {
      position: relative;
      left: 8px;
      text-align: center;
      .item-icon {
        display: block;
        position: relative;
        left: 44px;
        top: 14px;
      }
      .item-title {
        display: block;
      }
    }
  }
}
.el-menu-item,
.el-submenu {
  text-align: center;
  position: relative;
  left: -10px;
}
.el-submenu {
  .el-menu-item {
    left: 4px;
  }
}

</style>