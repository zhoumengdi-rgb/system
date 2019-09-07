<template>
    <div>
        <Cha>
             <template slot-scope="{sc}">
                 <span>图标</span>
                 <!-- 为代办项自定义一个模板 -->
                 <!-- 通过slotProps定制每个代办项目 -->
                {{ sc }}
            </template>
        </Cha>


      
        <el-table
            :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
            style="width: 100%">
            <el-table-column
            label="Date"
            prop="date">
            </el-table-column>
            <el-table-column
            label="Name"
            prop="name">
            </el-table-column>
            <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
                <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
            </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import Cha from "./Cha"
export default {
    data(){
        return{

        }
    },
    components:{
        Cha
    },
    // created(){
    //     this.axios.user.login({username:'pp',password:'12345'}).then(res =>{
    //         console.log(res)
    //     })
    // }
}
</script>