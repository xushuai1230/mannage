<template>
  <el-table
    :data="data"
    border
    class="table"
    style="width: 100%"
    height="100%"
    empty-text="  "
    :row-style="showTr">
    <el-table-column prop="Index" align="center" label='序号' width="55" fixed> </el-table-column>
    <el-table-column type="selection" align="center" width="55"  fixed> </el-table-column>
    <el-table-column v-for="(column, index) in columns" :key="column.prop" :width="column.width"
      :label="column.label">
      <template slot-scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <span class="button is-outlined is-primary is-mini" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus" aria-hidden="true"></i>
          <i v-if="scope.row._expanded" class="el-icon-minus" aria-hidden="true"></i>
        </span>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        {{scope.row[column.prop]}}
      </template>
    </el-table-column>
    <!--region 按钮操作组-->
    <el-table-column label="操作" min-width="260" v-if="operates.length > 0">
      <template slot-scope="scope">
        <div class="operate-group">
          <template v-for="(btn, key) in operates">
            <div class="item" v-if="btn.show" :key='btn.label'>
              <span @click="btn.method(key,scope.row)">
                <i :class="btn.icon"></i>
              </span>
            </div>
          </template>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import Utils from './dataTranslate.js'
//  import Vue from 'vue'
  export default {
    name: 'tree-grid',
    components: {
      Utils
    },
    props: {
      operates: {
        type: Array,
        default: function () {
          return  []
        }
      },
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
// 这是相应的字段展示
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这是数据源
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
// 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
// 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data () {
      return {}
    },
    computed: {
    // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = Utils.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
          return data
        }
        return me.dataSource
      }
    },
    methods: {
    // 显示行
      showTr: function (data, index) {
        let show = (data.row._parent ? (data.row._parent._expanded && data.row._parent._show) : true)
        data.row._show = show
        return show ? '' : 'display:none;'
      },
    // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
    // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
    // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        let me = this
        if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      },
      handleDelete () {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>
<style scoped lang=scss>
  .table{
    .ms-tree-space{position: relative;
      top: 1px;
      display: inline-block;
      font-family: 'Glyphicons Halflings';
      font-style: normal;
      font-weight: 400;
      line-height: 1;
      width: 18px;
      height: 14px;}
    .ms-tree-space::before{content: ""}
    table td{
      line-height: 26px;
    }
  }
</style>
