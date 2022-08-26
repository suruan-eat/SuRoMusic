<!-- 
    ???
    问题1：
        怎样让路由页面一被加载就执行getSearchList函数
    解决方案：
        vue的生命周期里created()
 -->
<template>
    <div class="search">
        <!-- SearchPage -->
        <!----------------------------- 搜素列表 --------------------------------->
        <p>搜索“{{$route.query.keyword}}”，共搜索到{{songCount}}个结果</p>
        <el-table
            v-loading="loading"
            :data="songs"
            :show-header="headerShow"
            stripe
            style="width: 100%;"
        >
        <!-- 播放图标 -->
            <el-table-column
                width="40"
            >
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="播放" placement="top">
                        <a href="javascript:;" @click="playSong({ id:scope.row.id,isADD:true,isPlay:true })">
                            <img src="../assets/image/icon_听音乐.png" alt="播放" width="16px">
                        </a>
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 歌名 -->
            <el-table-column
                prop="name"
                label="歌曲名称"
                width="300">
            </el-table-column>
            <!-- 歌手 -->
            <el-table-column
                prop="artists[0].name"
                label="歌手"
                width="200">
            </el-table-column>
            <!-- 专辑 -->
            <el-table-column
                prop="album.name"
                label="专辑"
                width="200">
            </el-table-column>
            <!-- 添加到播放列表 -->
            <el-table-column
                width="50"
            >
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="添加到播放列表" placement="top">
                        <a href="javascript:;" @click="addSong({ id: scope.row.id,isADD:true,isPlay:false })">
                            <img src="../assets/image/添加.png" alt="添加到播放列表" width="28px">
                        </a>
                    </el-tooltip>
                </template> 
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
    name: 'SearchPage',
    data() {
        return {
            songs: [],
            loading: true,
            // 展示table的thead
            headerShow:true,
            songCount:null,
        }
    },

    methods: {
        /* getSearchList() {
            axios.get("https://netease-cloud-music-36zzgmzqx-suruan-eat.vercel.app/search?keywords=" + this.$route.query.keyword).then(
                response => {
                    console.log('请求成功');
                    this.songs = response.data.result.songs
                },
                error => {
                    console.log('请求失败',error);
                }
            )
        }, */
        ...mapActions({playSong:'getSongUrl',addSong:'addSong'})
    },
    created() {
            this.loading = true
            axios.get("https://netease-cloud-music-36zzgmzqx-suruan-eat.vercel.app/search?keywords=" + this.$route.query.keyword).then(
                response => {
                    console.log('请求成功');
                    // console.log(response.data.result.songs);
                    this.songs = response.data.result.songs
                    this.songCount = response.data.result.songCount
                    this.loading = false
                },
                error => {
                    console.log('请求失败',error);
                }
            )
    },
    /* mounted() {
        console.log(this.$route.query);
    } */
}
</script>

<style lang="less" scoped>
    /deep/ .el-loading-mask {
        z-index: 1;
        // height: 1000px;
    }
    /deep/ .el-loading-spinner {
        top: 10%;
    }
    /deep/ .el-table {
        box-sizing: border-box;
        height: 100%;
        // padding-bottom: 70px;
    }
    /deep/ .el-table__body,
    /deep/ .el-table__header {
        margin: 0 auto;
    }
</style>
<!-- <style>
    /* .s_list {

    } */
    .s_item {
        margin-top: 2px;
        margin-bottom: 2px;
        height: 20px;
        width: 100%;
        background-color: #fff;
        border-radius: 5px;
    }
</style> -->