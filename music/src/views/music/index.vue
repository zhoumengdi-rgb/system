<template>
  <el-container class="el">
    <el-header>
      <div class="m-header">
        <span>欢迎:{{name}}</span>
        <el-button size="mini" type="primary" @click="eqit">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>

        <!-- 点击添加弹出框 -->
        <el-button @click="open">添加</el-button>
        <!-- 添加弹窗开始 -->
        <el-dialog title="提示" 
          :visible.sync="dialogVisible" 
          width="30%">
          <el-form
            :model="music"
            ref="ruleForm"
            size="mini"
            label-width="100px"
            class="demo-ruleForm m-form"
          >
            <el-form-item label="歌名" prop="music_name">
              <el-input type="text" v-model="music.music_name"></el-input>
            </el-form-item>
            <el-form-item label="歌手" prop="singer_name">
              <el-input type="text" v-model="music.singer_name"></el-input>
            </el-form-item>
            <el-form-item label="上传图片">
              <input type="file" @change="upLoad" ref="file">
              <img :src="music.pic" alt="" class="imgss">
            </el-form-item>
            <el-form-item label="是否上架">
                <el-radio-group v-model="music.isup">
                  <el-radio :label="0">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group> 
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="operate">{{editId ? '修改':'添加'}}</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <!-- 音乐列表表格 -->
        <el-table :data="musicList" style="width: 100%">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="歌名" prop="music_name"></el-table-column>
          <el-table-column label="图片">
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <img :src="scope.row.pic" alt class="imgss" />
            </template>
          </el-table-column>
          <el-table-column label="歌手" prop="singer_name"></el-table-column>
          <el-table-column label="是否上架" prop="isup">
            <template slot-scope="scope">
              <span>{{scope.row.isup ? '是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name"></el-table-column>

          <el-table-column align="right">
            <template slot="header" slot-scope="scope"></template>
            <template slot-scope="scope" class="btn">
              <el-button size="mini" @click="edit(scope.row.id)">
                修改
              </el-button>
              <el-button size="mini" type="danger" @click="del(scope.row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="limit"
          @current-change="handleSizeChange"
          >
        </el-pagination>

      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { get, post } from "../../utils/request";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      musicList: [], //音乐列表数据
      dialogVisible: false, //控制弹窗的显示隐藏
      radio: 1,
      pagenum:1, //当前页数
      limit:3, //每页展示的个数
      total:0,
      music:{
        music_name:'',
        singer_name:'',
        pic:'',
        isup:1 
      },
      editId:'' //修改对象所用的id
    };
  },
  created(){
    //获取用户信息
    get("/api/userinfo").then(res => {
      this.setName(res.data.username);
    });
    this.getMusicList();
  },
  methods: {
    ...mapMutations(["setName"]),
    //打开弹窗
    open(){
        this.reset(); //清空
        this.dialogVisible = true;
        if(this.$refs.file && this.$refs.file.files.length){
           this.$refs.file.value = '';
        }
    },
    //封装获取音乐列表
    getMusicList(){
      get(`/api/querymusic?pagenum=${this.pagenum}&limit=${this.limit}`).then(res => {
        this.musicList = res.data;
        this.total = res.total; //页数=返回的total
      });
    },
    eqit() {
      this.$confirm("确认退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //确定退出 删除token 返回登陆页
          localStorage.removeItem("token");
          this.$router.replace("/login");
        })
        .catch(() => {
          // this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          // });
        });
    },
    //上传图片
    upLoad(e){
        // 在事件源中取出文件域
      let file = e.target.files[0];
      // 创建实例
      let formdata = new FormData();
      // 添加参数
      formdata.append("file", file);
        post('/api/upload',formdata).then(res =>{
          // console.log(res)
          if(res.code === 1){
            this.music.pic = "http://localhost:3000"+res.url;
          }
        })
    },
    //添加 修改
    operate(){
        if(this.editId){
            this.editMusic();
            this.dialogVisible=false;
            this.getMusicList();
        }else{
          this.addMusic();
          this.getMusicList();
        }
    },
    //添加音乐接口
    addMusic(){
        post('/api/addmusic',this.music).then(res =>{
           if(res.code === 1){ //添加成功
                this.dialogVisible=false; //隐藏弹窗
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
           }
        })
    },
     //修改音乐事件
    editMusic(){
       post('/api/updatemusic',{
         music_name:this.music.music_name,
         singer_name:this.music.singer_name,
         isup:this.music.isup,
         pic:this.music.pic,
         id:this.editId
       }).then(res =>{
         console.log(res)
       })
    },
    //改变当前页数触发事件
    handleSizeChange(val){
        this.pagenum = val;
        this.getMusicList();
    },
    //删除事件
    del(id){
      get(`/api/deletemusic?id=${id}`).then(res =>{
          if(res.code === 1){
            this.$message({
                message: '删除成功',
                type: 'success'
            });
            //pagenum ===1 不的话--
            //当前数据长度大于1吗 是的话当前页数 否则 --当前页数回到上一页
            this.musicList.length > 1 ? this.pagenum : --this.pagenum;
            this.getMusicList();
          }
      })
    },
    //重置清空方法
    reset(){
        this.music.music_name = '';
        this.music.singer_name = '';
        this.music.isup = '1';
        this.music.pic = '';
        this.editId = '';
    },
    //修改事件
    edit(id){
        this.dialogVisible = true;
        this.editId = id; //点击的id赋值给全局的
        //获取数据 查找 用当前项的id 来对比
        let editObj = this.musicList.find(item => item.id === id);
        //查找的对象值重新赋值
        this.music.music_name = editObj.music_name; 
        this.music.singer_name = editObj.singer_name; 
        this.music.isup = editObj.isup;
        this.music.pic = editObj.pic;
    }
  },
  computed: {
    ...mapState(["name"])
  }
};
</script>
<style>
.m-header {
  text-align: right;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}
.imgss {
  width: 80px;
  height: 80px;
}
</style>