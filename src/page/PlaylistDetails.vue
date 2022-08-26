<template>
    <div class="playlist">
        <header class="list_details">
            <div class="image">
                <img :src="listDetail.coverImgUrl" alt="歌单图片">
            </div>
            <div class="info">
                <p class="title">{{listDetail.name}}</p>
                <div class="create">
                    <!-- ???报错，但是图片能显示 -->
                    <!-- 给存储到data的creator里了，没报错了 -->
                    <span><img :src="creator.avatarUrl" alt="头像"></span>
                    <span><a href="javascript:;">创建者：{{creator.nickname}}</a></span>
                    <span>创建时间：{{createTime}}</span>
                </div>
                <div class="play_btn">
                    <button class="btn btn1">播放全部</button>
                    <button class="btn btn2 iconfont">&#xe63b;</button>
                </div>
                <p>介绍：{{listDetail.description}}</p>
            </div>
        </header>
        <div class="list_songs">
            <div class="list_title">
                <span>歌曲列表</span>
            </div>
            <el-table
                :data="listData"
                stripe
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="40">
                </el-table-column>
                <!-- 播放 -->
                <el-table-column
                    width="40">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="播放" placement="top">
                            <a href="javascript:;" @click="playSong({ id:scope.row.id,isADD:true,isPlay:true })">
                                <img src="../assets/image/icon_听音乐.png" alt="播放" width="16px">
                            </a>
                        </el-tooltip>
                </template>
                </el-table-column>
                <!-- 歌曲名 -->
                <el-table-column
                    prop="name"
                    label="歌曲名称">
                </el-table-column>
                <!-- 歌手 -->
                <el-table-column
                    prop="ar[0].name"
                    label="歌手"
                    width="200">
                </el-table-column>
                <!-- 专辑 -->
                <el-table-column
                    prop="al.name"
                    label="专辑"
                    width="200">
                </el-table-column>
                <!-- 添加 -->
                <el-table-column
                    width="50">
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
        <div class="list_comment">
            <div class="list_title">
                <span>评论</span>
            </div>
            <div class="comments">
                <ul>
                    <li v-for="(c,index) in comments" :key="index">
                        <img :src="c.user.avatarUrl" alt="">
                        <span class="c_info">
                            <p>
                                <a href="javascript:;">{{c.user.nickname}}</a>：
                                <span>{{c.content}}</span>
                            </p>
                            <div class="parent_commit" v-show="c.parentCommentId !== 0">
                            <!-- 烦死了，怎么把parentCommentId传递给axios，还能页面一加载就得到，还不用手动点击 -->
                                <!-- <a href="javascript:;">{{}}</a>：
                                <span>{{}}</span> -->
                            </div>
                            <span class="c_time">{{commitTime(c.time)}}</span>
                            
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {formatTime} from '../utils/index.js'
import axios from 'axios'
import { mapActions } from 'vuex';

export default {
    name:'PlaylistDetails',
    data() {
        return {
            listDetail: [],
            listData: [],
            creator: [],
            comments:[],
        }
    },
    computed: {
        createTime() {
            let createTime = this.listDetail.createTime;
            return formatTime(createTime)
        },
        commitTime() {
            return time => formatTime(time)
        },

    },
    methods: {
        ...mapActions({playSong:'getSongUrl',addSong:'addSong'})
    },
    created() {
        axios.get("https://netease-cloud-music-api-one-olive.vercel.app/playlist/detail?id=" + this.$route.query.id).then(
            response => {
                // console.log(response);
                this.listDetail = response.data.playlist
                this.creator = this.listDetail.creator
                console.log(this.listDetail.creator.avatarUrl);
            },
            error => {
                console.log(error);
            }
        )
        axios.get("https://netease-cloud-music-api-one-olive.vercel.app/playlist/track/all?id=" + this.$route.query.id + "&limit=10&offset=1").then(
            response => {
                // console.log(response);
                this.listData = response.data.songs
            },
            error => {
                console.log(error);
            }
        )
        axios.get("https://netease-cloud-music-api-one-olive.vercel.app/comment/playlist?id=" + this.$route.query.id).then(
            response => {
                // console.log(response);
                this.comments = response.data.comments
            },
            error => {
                console.log(error);
            }
        )


        /* axios.get("https://netease-cloud-music-api-one-olive.vercel.app/comment/floor?parentCommentId=" + parentCommentId + "&id=" + this.$route.query.id + "&type=0").then(
            response => {
                console.log(response);
                // let nickname = response.data.data.ownerComment.user.nickname
                // return nickname
            },
            error => {
                console.log(error);
            }
        ) */
    }
}
</script>

<style lang="less" scoped>
    /deep/ .el-table .el-table__cell {
        padding: 8px 0;
    }
</style>

<style lang="less" scoped>
    @listWidth:800px;
    .playlist {
        margin: 0 auto;
        background-color: #fff;
        width: @listWidth;
        height: 1000px;
    }
    .list_details {
        margin-top: 10px;
        width: @listWidth;
        height: 300px;
        background-color: skyblue;
        display: flex;
        .image {
            width: 200px;
            height: 200px;
            img {
                width: 100%;
                padding: 10px;
            }
        }
        .info {
            flex: 1;
            padding-top: 10px;
            .title {
                font-size: 20px;
                font-weight: bold;
            }
            .create {
                height: 40px;
                line-height: 40px;
                span {
                    padding-right: 10px;
                }
                span:nth-child(1) {

                    img {
                        height: 80%;
                        border-radius: 2px;
                    }
                }
            }
            p {
                overflow: hidden;
                text-overflow:ellipsis;//溢出用省略号...显示
                display:-webkit-box;//将对象作为弹性伸缩盒子模型显示。
                -webkit-box-orient:vertical;//从上到下垂直 排列子元素（设置伸缩盒子的子元素排列方式）
                -webkit-line-clamp:3; //表示显示的行数合上面两个属性，表示显示的行数
            }
        }
        .play_btn {
            margin: 10px 0;
            .btn1 {
                margin-right: 2px;
                padding: 0;
                width: 100px;
                height: 30px;
                background-color: rgb(212, 41, 41);
                color: white;
                font-size: 14px;
                border-radius: 5px;
                border: 1px solid rgb(240, 48, 48);
                &:focus {
                    outline: none;
                }
            }
            .btn2 {
                padding: 0;
                width: 30px;
                height: 30px;
                border-radius: 5px;
                color: white;
                font-size: 14px;
                background-color: rgb(212, 41, 41);
                border: 1px solid rgb(240, 48, 48);
                &:focus {
                    outline: none;
                }
            }
        }
    }
    .list_title {
        font-size: 20px;
        width: @listWidth;
        height: 40px;
        line-height: 40px;
        border-bottom: 2px solid #000;
    }
    .list_songs {
        width: @listWidth;
        background-color: yellow;
        
    }
    .list_comment {
        width: @listWidth;
        background-color: cadetblue;
        padding-bottom: 70px;
        .comments {
            width: 100%;
            li {
                width: 100%;
                // height: 80px;
                background-color: #fff;
                border-bottom: 1px solid #000;
                display: flex;
                justify-content: center;
                img {
                    margin: 5px 10px;
                    width: 60px;
                    height: 60px;
                    float: left;
                    border-radius: 5px;
                }
                .c_info {
                   flex: 1;
                   padding: 10px 20px 10px 0;
                   p {
                    padding: 0 0 20px 0;
                    }
                   .c_time {
                    width: 100%;
                    margin: 10px 10px 10px 0;
                    color: #ccc;
                    }
                    .parent_commit {
                        padding: 10px 20px;
                        background-color: rgb(231, 231, 231);
                        border-radius: 5px;
                    }
                }
                
            }
        }
    }
</style>