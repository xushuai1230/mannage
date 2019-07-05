<template>
  <div class="listTable">
    <el-dialog
      v-dialogDrag
      title="搜索"
      top="0"
      :visible.sync="dialogVisible"
      class="medium_dialog"
      :before-close="cancel"
    >
      <div class="searchTable">
        <el-form :inline="true">
          <el-row>
            <el-col :span="9">
              <el-form-item label="编号">
                <el-input v-model="form.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" @click="search">查询</el-button>
                <el-button size="mini" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="table">
            <el-table
              border
              stripe
              highlight-current-row
              v-loading="loading"
              ref="multipleTable"
              height="100%"
              :data="tableData"
              empty-text="暂无数据"
              @row-click="toggleSelection"
              @select="handleSelectionChange"
            >
              <el-table-column
                type="index"
                :index="calculationIndex"
                align="center"
                label="序号"
                width="55"
                fixed
              ></el-table-column>
              <el-table-column type="selection" align="center" width="55" fixed></el-table-column>
              <el-table-column
                v-for="col in cols"
                v-if="col.IsDisplayList==1"
                :prop="col.Code"
                :label="col.CnName"
                :key="col.Code"
                :show-overflow-tooltip="true"
                sortable
              ></el-table-column>
            </el-table>
            <div class="pages">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItems"
              ></el-pagination>
            </div>
          </div>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from "@/assets/public/js/eventBus";
import qs from "qs";
import { mapGetters } from "vuex";
export default {
  props: ["searchTableVisible", "SearchKey", "SearchTable", "SearchDisplay"],
  data() {
    return {
      dialogVisible: this.searchTableVisible,
      selectRow: null,
      tableData: [],
      form: {
        code: "",
        name: ""
      },
      cols: [],           // 列信息
      codeFields: [],
      loading: false,
      filter: "",         // 查询条件
      currentPage: 1,     // 初始页数
      index: 1,           // 序号
      pageSize: 10,       // 初始化页码
      totalItems: 0
    };
  },
  mounted() {
    this.getColumns();
  },
  computed: {
    ...mapGetters(["token"])
  },
  methods: {
    // 获取字段信息
    getColumns() {
      var colsData = { name: "DBField", TblName: this.SearchTable };
      var reqInfoColsData = JSON.stringify(colsData);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: "Tenant",
            operation: "GetJsonData",
            token: this.token,
            reqInfo: reqInfoColsData
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.body;
          if (result.code == 0) {
            let columns = result.data;
            let fields = new Array(); //获取字段模型
            for (let p in columns) {
              fields[p] = columns[p].PropertyValueMap;
            }
            this.cols = fields;
            for (let i in fields) {
              if (fields[i].DisplayPosition != -1) {
                this.codeFields.push(fields[i].Code);
              }
            }
            this.getTableData();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取表格数据
    getTableData() {
      var data = {
        Name: this.SearchTable,
        DefaultVal: "SearchPage",
        CurrentPage: this.currentPage,
        PageSize: this.pageSize,
        Properties: this.codeFields,
        Filter: this.filter
      };
      var reqInfoData = JSON.stringify(data);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: "Tenant",
            operation: "GetJsonData",
            token: this.token,
            reqInfo: reqInfoData
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.body;
          this.loading = false;
          if (result.code == 0) {
            var columnsData = result.data;
            var getJsonDatafields = new Array();
            for (var p in columnsData) {
              getJsonDatafields[p] = columnsData[p].PropertyValueMap;
            }
            this.emptyText = "暂无数据";
            this.tableData = getJsonDatafields;
            this.totalItems = result.TotalRow;
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    save() {
      if (this.selectRow === null) {
        this.$message({
          type: "warning",
          message: "请选择选项"
        });
      } else {
        this.dialogVisible = false;
        this.$emit(
          "searchReceiveValue",
          this.SearchKey,
          this.selectRow
        );
        this.$emit("dialogVisible", false);
      }
    },
    search() {
      this.filter = '';
      if(this.form.code!==''){
        this.filter += "Code,%," + this.form.code + ",And;";
      }
      if(this.form.name!==''){
        this.filter += "Name,%," + this.form.name + ",And;";
      }
      this.getTableData();
    },
    reset(){
      this.form.code = '';
      this.form.name = '';
    },
    handleSelectionChange(val,row) {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row);
      this.selectRow = row;
    },
    cancel() {
      this.dialogVisible = false;
      this.$emit("dialogVisible", false);
    },
    // 点击行checkbox
    toggleSelection(row) {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row);
      this.selectRow = row;
    },
    // 页大小改变默认第一页
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.index = val;
      this.getTableData();
    },
    // 计算分页
    calculationIndex(index) {
      return index + (this.index - 1) * this.pageSize + 1;
    }
  }
};
</script>
