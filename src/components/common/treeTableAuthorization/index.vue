<template>
  <el-table
    :data="formatData"
    :row-style="showRow"
    empty-text="  "
    v-bind="$attrs"
    height="100%"
    style="width: 100%"
  >
    <el-table-column v-if="columns.length===0" width="150">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        {{scope.$index}}
      </template>
    </el-table-column>
    <el-table-column
      v-else
      v-for="(column, index) in columns"
      :key="column.value"
      :label="column.text"
      :width="column.width"
    >
      <template slot-scope="scope">
        <span
          v-if="index === 0"
          v-for="space in scope.row._level"
          class="ms-tree-space"
          :key="space"
        ></span>
        <span
          class="tree-ctrl"
          v-if="iconShow(index,scope.row)"
          @click="toggleExpanded(scope.$index)"
        >
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        <el-checkbox-group
          v-if="Array.isArray(scope.row[column.value])"
          v-model="scope.row.selectchecked"
          @change="handleSonChecked(scope.$index, scope.row,scope.row[column.option])"
        >
          <el-checkbox
            v-for="(interset) in scope.row[column.value]"
            :label="interset.id"
            :key="interset.id"
          >{{interset.description}}</el-checkbox>
        </el-checkbox-group>
        <el-checkbox
          v-else-if="scope.row.type===1"
          :indeterminate="scope.row.isIndeterminate"
          v-model="scope.row.checkAll"
          @change="handleSonCheckAll(scope.$index, scope.row,scope.row[column.option])"
        >{{scope.row[column.value]}}</el-checkbox>
        <span v-else>{{scope.row[column.value]}}</span>
        <el-checkbox
          v-if="scope.row[column.act]"
          :indeterminate="scope.row.isIndeterminate"
          v-model="scope.row.checkAll"
          @change="handleCheckAll(scope.$index, scope.row,column.option)"
        >{{scope.row[column.act]}}</el-checkbox>
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</template>
<script>
import treeToArray from "./eval";
export default {
  name: "treeTable",
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      arrLength: []
    };
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp;
      if (!Array.isArray(this.data)) {
        tmp = [this.data];
      } else {
        tmp = this.data;
      }
      const func = this.evalFunc || treeToArray;
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll];
      return func.apply(null, args);
    }
  },
  created() {
    this.defaultSelcet();
  },
  methods: {
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;";
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex];
      if(record.children[0].sonData.length>0){
        if(record._expanded == false) {
           this.arrLength.push(record)
        } else {
           if(this.arrLength.length>0) {
             for(var i=0;i<this.arrLength.length;i++) {
               if(this.arrLength[i].id == record.id) {
                 this.arrLength.splice(i,1)
               }
             }
           }
        }
        var maxAry = [];
        if(this.arrLength !=null && this.arrLength.length>0){
          for(var i=0;i<this.arrLength.length;i++) {
            if(this.arrLength[i].children!=null && this.arrLength[i].children.length>0){
              for(var j=0;j<this.arrLength[i].children.length;j++) {
                if(this.arrLength[i].children[j].sonData!=null && this.arrLength[i].children[j].sonData.length>0){
                  var num = this.arrLength[i].children[j].sonData.length;
                  var textLength = 0;
                  this.arrLength[i].children[j].sonData.forEach(m => {
                    textLength += m.description == null ? 1 : m.description.length;
                  });
                  var tempWidth = (14 * textLength) + (54 * num);
                  maxAry.push(tempWidth);
                }
              }
            }
          }
        }
        var defWidth = (document.body.scrollWidth - 220) * 0.795 - this.columns[0].width; 
        var nowWidth = Math.max.apply(null, maxAry);
        nowWidth = nowWidth < defWidth ? defWidth : nowWidth;
        this.columns[1].width = nowWidth;
      }
      record._expanded = !record._expanded;
    },
    // 图标显示
    iconShow(index, record) {
      return index === 0 && record.children && record.children.length > 0;
    },
    handleSonCheckAll(index, row, opt) {
      this.cc();
      if (opt.length > 0) {
        if (row.selectchecked.length !== opt.length) {
          let arr = [];
          opt.forEach(element => {
            arr.push(element.id);
          });
          row.selectchecked = arr;
          row.checkAll = true;
          row.isIndeterminate = false;
        } else {
          row.selectchecked = [];
          row.checkAll = false;
          row.isIndeterminate = false;
        }
      }
      this.refreshCheck(row);
    },
    handleSonChecked(index, row, opt) {
      row.checkAll = row.selectchecked.length === opt.length;
      row.isIndeterminate =
        row.selectchecked.length > 0 && row.selectchecked.length < opt.length;
      this.refreshCheck(row);
      this.cc();
    },
    handleCheckAll(index, row, opt) {
      if (row.children != null) {
        row.children.forEach(val => {
          // 第一层
          let arr = [];
          if (row.checkAll) {
            val[opt].forEach(n => {
              arr.push(n.id);
            });
            val.selectchecked = arr;
            val.checkAll = true;
            val.isIndeterminate = false;
          } else {
            val.selectchecked = [];
            val.checkAll = false;
            val.isIndeterminate = false;
          }
          // 第二层
          if (val.children != null) {
            val.children.forEach(model => {
              let ary = [];
              if (row.checkAll) {
                model[opt].forEach(m => {
                  ary.push(m.id);
                });
                model.selectchecked = ary;
                model.checkAll = true;
                model.isIndeterminate = false;
              } else {
                model.selectchecked = [];
                model.checkAll = false;
                model.isIndeterminate = false;
              }
            });
          }
        });
      }
      if (row.checkAll) {
        row.isIndeterminate = false;
      }
      this.cc();
    },
    defaultSelcet() {
      this.data.forEach(val => {
        if (val.children) {
          val.children.forEach(el => {
            if (
              el.selectchecked.length &&
              el.selectchecked.length !== el[this.columns[0].option].length
            ) {
              el.isIndeterminate = true;
              el.checkAll = false;
            } else if (
              el.selectchecked.length &&
              el.selectchecked.length === el[this.columns[0].option].length
            ) {
              el.isIndeterminate = false;
              el.checkAll = true;
            } else {
              el.isIndeterminate = false;
              el.checkAll = false;
            }
          });
          this.cc();
        }
      });
    },
    cc() {
      this.data.forEach(val => {
        let checkAllArr = [];
        let isIndeterminateArr = [];
        if (val.children) {
          val.children.forEach(el => {
            checkAllArr.push(el.checkAll);
            isIndeterminateArr.push(el.isIndeterminate);
          });
        }
        if (new Set(checkAllArr).size === 1) {
          // && new Set(isIndeterminateArr).size !== 1
          if (checkAllArr[0] && isIndeterminateArr[0] === false) {
            val.isIndeterminate = false;
            val.checkAll = true;
          } else if (checkAllArr[0] && new Set(isIndeterminateArr).size !== 1) {
            val.isIndeterminate = false;
            val.checkAll = true;
          } else if (
            !checkAllArr[0] &&
            new Set(isIndeterminateArr).size !== 1
          ) {
            val.isIndeterminate = true;
            val.checkAll = false;
          } else if (
            !checkAllArr[0] &&
            new Set(isIndeterminateArr).size === 1
          ) {
            if (!isIndeterminateArr[0]) {
              val.isIndeterminate = false;
              val.checkAll = false;
            } else {
              val.isIndeterminate = true;
              val.checkAll = false;
            }
          } else {
            val.isIndeterminate = false;
            val.checkAll = false;
          }
        } else {
          val.isIndeterminate = true;
          val.checkAll = false;
        }
      });
    },
    getAuth() {
      this.$emit("getAuth", this.data);
    },
    refreshCheck(row) {
      // 上一层
      if (row.parent != null) {
        var checkParentF = true;
        var isIndeterminateParentF = false;
        row.parent.children.forEach(model => {
          if (model.checkAll) {
            isIndeterminateParentF = true;
          } else {
            checkParentF = false;
          }
          if (model.isIndeterminate) {
            isIndeterminateParentF = true;
          }
        });
        if (checkParentF) {
          isIndeterminateParentF = false;
        }
        row.parent.checkAll = checkParentF;
        row.parent.isIndeterminate = isIndeterminateParentF;
        // 上二层
        if (row.parent.parent != null) {
          var checkParentS = true;
          var isIndeterminateParentS = false;
          row.parent.parent.children.forEach(model => {
            if (model.checkAll) {
              isIndeterminateParentS = true;
            } else {
              checkParentS = false;
            }
            if (model.isIndeterminate) {
              isIndeterminateParentS = true;
            }
          });
          if (checkParentS) {
            isIndeterminateParentS = false;
          }
          row.parent.parent.checkAll = checkParentS;
          row.parent.parent.isIndeterminate = isIndeterminateParentS;
        }
      }
    }
  }
};
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.el-table__body {
  text-align: left;
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: "";
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
</style>
